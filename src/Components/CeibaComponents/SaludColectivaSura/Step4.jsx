import React, { useState } from "react";
import styles from './StepsCSS.module.css';

const Step4 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen }) => {
  const [formData, setFormData] = useState(() => ({
    enfermedadesGastrointestinales:
      initialData?.enfermedadesGastrointestinales?.length > 0
        ? initialData.enfermedadesGastrointestinales
        : [{ numeroSolicitante: "", doctor: "", fecha: "" }],

    enfermedadesGenitourinarias:
      initialData?.enfermedadesGenitourinarias?.length > 0
        ? initialData.enfermedadesGenitourinarias
        : [{ numeroSolicitante: "", doctor: "", fecha: "" }],

    enfermedadesDiabetes:
      initialData?.enfermedadesDiabetes?.length > 0
        ? initialData.enfermedadesDiabetes
        : [{ numeroSolicitante: "", doctor: "", fecha: "" }],
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

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };
  const handleToggleNA = (section) => {
    const updated = [...formData[section]];
    updated[0] = updated[0].na
      ? { numeroSolicitante: "", doctor: "", fecha: "", na: false }
      : { numeroSolicitante: "N/A", doctor: "N/A", fecha: "", na: true };
    setFormData({ ...formData, [section]: updated });
  };

  // Agregar nuevo formulario
  const handleAdd = (section) => {
    if (formData[section].length < totalPersonas) {
      setFormData({
        ...formData,
        [section]: [
          ...formData[section],
          { numeroSolicitante: "", doctor: "", fecha: "" },
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

  // Validación antes de avanzar
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que TODOS los registros tengan los 3 campos llenos
    const isValid = Object.keys(formData).every(section =>
      formData[section].every(item =>
        item.numeroSolicitante.trim() !== "" &&
        item.doctor.trim() !== "" &&
        item.fecha.trim() !== ""
      )
    );
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
      {/* C. Enfermedades gastrointestinales */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          C. Enfermedades gastrointestinales, Reflujo gastroesofágico, Esófago,
          Gastritis, Úlcera péptica, Enfermedades del colon, Duodeno, Recto, Hemorroides, Hígado, Vesícula o Páncreas
        </h4>
        {formData.enfermedadesGastrointestinales.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesGastrointestinales", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante Afectado</option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesGastrointestinales",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) =>
                handleChange(e, "enfermedadesGastrointestinales", index)
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
                handleChange(e, "enfermedadesGastrointestinales", index)
              }
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesGastrointestinales.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  handleRemove("enfermedadesGastrointestinales", index)
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
            onClick={() => handleAdd("enfermedadesGastrointestinales")}
            disabled={formData.enfermedadesGastrointestinales.length >= Number(totalPersonas)
              || formData.enfermedadesGastrointestinales[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesGastrointestinales.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesGastrointestinales")}
            >
              {formData.enfermedadesGastrointestinales[0].na
                ? "Quitar N/A"
                : "N/A"}
            </button>
          )}
        </div>
      </div>

      {/* D. Enfermedades genitourinarias */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          D. Enfermedades genitourinarias, de la vejiga, Riñones, Uréteres, Próstata,
          Testículos, Útero, Ovarios, Cálculos, Infecciones, Albúmina o Sangre en orina, Incontinencia urinaria, Quistes
        </h4>

        {formData.enfermedadesGenitourinarias.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesGenitourinarias", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante Afectado</option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesGenitourinarias",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) =>
                handleChange(e, "enfermedadesGenitourinarias", index)
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
                handleChange(e, "enfermedadesGenitourinarias", index)
              }
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesGenitourinarias.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  handleRemove("enfermedadesGenitourinarias", index)
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
            onClick={() => handleAdd("enfermedadesGenitourinarias")}
            disabled={formData.enfermedadesGenitourinarias.length >= Number(totalPersonas)
              || formData.enfermedadesGenitourinarias[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesGenitourinarias.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesGenitourinarias")}
            >
              {formData.enfermedadesGenitourinarias[0].na
                ? "Quitar N/A"
                : "N/A"}
            </button>
          )}
        </div>
      </div>

      {/* E. Diabetes y otras */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          E. Diabetes, Enfermedades de la Tiroides, Cáncer, Linfoma, Leucemia, SIDA, Inmunodeficiencia o cualquier enfermedad de la sangre
        </h4>
        {formData.enfermedadesDiabetes.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "enfermedadesDiabetes", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante Afectado</option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "enfermedadesDiabetes",
                    index
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <input
              className={styles.input}
              type="text"
              name="doctor"
              placeholder="Nombre del doctor tratante"
              value={item.doctor}
              onChange={(e) =>
                handleChange(e, "enfermedadesDiabetes", index)
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
                handleChange(e, "enfermedadesDiabetes", index)
              }
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesDiabetes.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove("enfermedadesDiabetes", index)}
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
            onClick={() => handleAdd("enfermedadesDiabetes")}
            disabled={formData.enfermedadesDiabetes.length >= Number(totalPersonas)
              || formData.enfermedadesDiabetes[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesDiabetes.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesDiabetes")}
            >
              {formData.enfermedadesDiabetes[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.submitButton}
          onClick={handlePrevious}
        >
          ← Preguntas anteriores
        </button>
        <button type="submit" className={styles.submitButton}>
          Siguientes preguntas →
        </button>
      </div>
    </form>
  );

};

export default Step4;
