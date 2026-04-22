import React, { useState } from "react";
import styles from './StepsCSS.module.css';

const Step5 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen }) => {
  const [formData, setFormData] = useState(() => ({
    enfermedadesNeurologicas:
      initialData?.enfermedadesNeurologicas?.length > 0
        ? initialData.enfermedadesNeurologicas
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],

    enfermedadesOseas:
      initialData?.enfermedadesOseas?.length > 0
        ? initialData.enfermedadesOseas
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],

    enfermedadesOjosPiel:
      initialData?.enfermedadesOjosPiel?.length > 0
        ? initialData.enfermedadesOjosPiel
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],
  }));

  const solicitantesOptions = Array.isArray(solicitantesResumen)
    ? solicitantesResumen
    : [];

  const totalPersonas = Number(cantidadPersonasAdicionales) + (solicitantePrincipalSeAgrega === 'Sí' ? 1 : 0);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    const updated = [...formData[section]];
    updated[index][name] = value;
    setFormData({ ...formData, [section]: updated });
  };

  // Toggle N/A
  const handleToggleNA = (section) => {
    const updated = [...formData[section]];
    const item = updated[0];
    updated[0] = item.na
      ? { numeroSolicitante: "", doctor: "", fecha: "", na: false }
      : { numeroSolicitante: "N/A", doctor: "N/A", fecha: "", na: true };
    setFormData({ ...formData, [section]: updated });
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  // Agregar nuevo formulario
  const handleAdd = (section) => {
    if (formData[section].length < totalPersonas) {
      setFormData({
        ...formData,
        [section]: [
          ...formData[section],
          { numeroSolicitante: "", doctor: "", fecha: "", na: false },
        ],
      });
    }
  };

  // Eliminar formulario
  const handleRemove = (section, index) => {
    if (formData[section].length > 1) {
      const updated = formData[section].filter((_, i) => i !== index);
      setFormData({ ...formData, [section]: updated });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const getSelectedSolicitantes = (section, currentIndex) => {
    return formData[section]
      .filter((_, i) => i !== currentIndex)
      .map((item) => item.numeroSolicitante)
      .filter(Boolean);
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      {/* F. Enfermedades neurológicas */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          F. Enfermedades neurológicas, Derrame cerebral, Esclerosis Múltiple, Convulsiones, Meningitis,
          Trauma craneano, Enfermedad o retardo mental
        </h4>
        {formData.enfermedadesNeurologicas.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesNeurologicas", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante afectado</option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesNeurologicas",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}

              </select>

              {index === 0 && !item.na && (
                <div className={styles.tooltipContainer}>
                  <div className={styles.tooltipText}>
                    Seleccione el número del solicitante registrado en la pregunta 2
                  </div>
                </div>
              )}
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) => handleChange(e, "enfermedadesNeurologicas", index)}
              required={!item.na}
              disabled={item.na}
            />
            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={item.fecha}
              onChange={(e) => handleChange(e, "enfermedadesNeurologicas", index)}
              required={!item.na}
              readOnly={item.na}
              max={new Date().toISOString().split("T")[0]}
            />
            {formData.enfermedadesNeurologicas.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove("enfermedadesNeurologicas", index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <div className={styles.inputRow}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("enfermedadesNeurologicas")}
            disabled={formData.enfermedadesNeurologicas.length >= Number(totalPersonas)
              || formData.enfermedadesNeurologicas[0].na
            }
          >
            ＋ Agregar solicitante
          </button>
          {formData.enfermedadesNeurologicas.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesNeurologicas")}
            >
              {formData.enfermedadesNeurologicas[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      {/* G. Enfermedades óseas */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          G. Enfermedades óseas, Musculares, Articulares, Artritis, Gota,
          Afecciones de la columna, Juanetes, Fracturas
        </h4>

        {formData.enfermedadesOseas.map((item, index) => (
          <div key={index} className={styles.inputRow}>

            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesOseas", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">
                  Seleccione número del solicitante afectado
                </option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesOseas",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}

              </select>

              {index === 0 && !item.na && (
                <div className={styles.tooltipContainer}>
                  <div className={styles.tooltipText}>
                    Seleccione el número del solicitante registrado en la pregunta 2
                  </div>
                </div>
              )}
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) =>
                handleChange(e, "enfermedadesOseas", index)
              }
              required={!item.na}
              disabled={item.na}
            />

            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={item.fecha}
              onChange={(e) =>
                handleChange(e, "enfermedadesOseas", index)
              }
              required={!item.na}
              readOnly={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesOseas.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove("enfermedadesOseas", index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div className={styles.inputRow}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("enfermedadesOseas")}
            disabled={
              formData.enfermedadesOseas.length >= Number(totalPersonas) ||
              formData.enfermedadesOseas[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesOseas.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesOseas")}
            >
              {formData.enfermedadesOseas[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      {/* H. Otras enfermedades */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          H. Otitis o Amigdalitis frecuentes, Rinitis, Sinusitis,
          Enfermedades de los ojos, de la piel, de los senos
        </h4>

        {formData.enfermedadesOjosPiel.map((item, index) => (
          <div key={index} className={styles.inputRow}>

            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesOjosPiel", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">
                  Seleccione número del solicitante afectado
                </option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesOjosPiel",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}

              </select>

              {index === 0 && !item.na && (
                <div className={styles.tooltipContainer}>
                  <div className={styles.tooltipText}>
                    Seleccione el número del solicitante registrado en la pregunta 2
                  </div>
                </div>
              )}
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) =>
                handleChange(e, "enfermedadesOjosPiel", index)
              }
              required={!item.na}
              disabled={item.na}
            />

            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={item.fecha}
              onChange={(e) =>
                handleChange(e, "enfermedadesOjosPiel", index)
              }
              required={!item.na}
              readOnly={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesOjosPiel.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  handleRemove("enfermedadesOjosPiel", index)
                }
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div className={styles.inputRow}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("enfermedadesOjosPiel")}
            disabled={
              formData.enfermedadesOjosPiel.length >= Number(totalPersonas) ||
              formData.enfermedadesOjosPiel[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesOjosPiel.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesOjosPiel")}
            >
              {formData.enfermedadesOjosPiel[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" className={styles.submitButton} onClick={handlePrevious}>
          ← Preguntas anteriores
        </button>
        <button type="submit" className={styles.submitButton}>
          Siguientes preguntas →
        </button>
      </div>
    </form>
  );
};

export default Step5;
