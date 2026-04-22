import React, { useState } from "react";
import styles from './StepsCSS.module.css';

const Step6 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen }) => {
  const [formData, setFormData] = useState(() => ({
    solicitaContinuidad: initialData?.solicitaContinuidad || "",
    tieneExclusion: initialData?.tieneExclusion || "",
    practicaDeportes: initialData?.practicaDeportes || "",
    otrasEnfermedades:
      initialData?.otrasEnfermedades?.length > 0
        ? initialData.otrasEnfermedades
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],
    deportesRiesgo:
      initialData?.deportesRiesgo?.length > 0
        ? initialData.deportesRiesgo
        : [{ numeroSolicitante: "", deporte: "", frecuencia: "" }],
  }));

  const solicitantesOptions = Array.isArray(solicitantesResumen)
    ? solicitantesResumen
    : [];

  const totalPersonas = Number(cantidadPersonasAdicionales) + (solicitantePrincipalSeAgrega === 'Sí' ? 1 : 0);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section) {
      const updated = [...formData[section]];
      updated[index][name] = value;
      setFormData({ ...formData, [section]: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  const handleToggleNA = (section) => {
    const updated = [...formData[section]];
    updated[0] = updated[0].na
      ? { numeroSolicitante: "", doctor: "", fecha: "", na: false }
      : { numeroSolicitante: "N/A", doctor: "N/A", fecha: "N/A", na: true };

    setFormData({ ...formData, [section]: updated });
  };

  const handleAdd = (section) => {
    if (formData[section].length < totalPersonas) {
      setFormData({
        ...formData,
        [section]: [
          ...formData[section],
          section === "deportesRiesgo"
            ? { numeroSolicitante: "", deporte: "", frecuencia: "" }
            : { numeroSolicitante: "", doctor: "", fecha: "" },
        ],
      });
    }
  };

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
      {/* PRIMERA SECCIÓN - OTRAS ENFERMEDADES */}
      {/* I. Otras enfermedades */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          I. Cualquier otra enfermedad, síntoma o padecimiento
          diferente a los anteriormente definidos
        </h4>

        {formData.otrasEnfermedades.map((item, index) => (
          <div key={index} className={styles.inputRow}>

            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) =>
                  handleChange(e, "otrasEnfermedades", index)
                }
                required={!item.na}
                disabled={item.na}
              >
                <option value="">
                  Seleccione número del solicitante afectado
                </option>
                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes(
                    "otrasEnfermedades",
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
                handleChange(e, "otrasEnfermedades", index)
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
                handleChange(e, "otrasEnfermedades", index)
              }
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.otrasEnfermedades.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  handleRemove("otrasEnfermedades", index)
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
            onClick={() => handleAdd("otrasEnfermedades")}
            disabled={
              formData.otrasEnfermedades.length >= Number(totalPersonas) ||
              formData.otrasEnfermedades[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.otrasEnfermedades.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("otrasEnfermedades")}
            >
              {formData.otrasEnfermedades[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      <hr className={styles.separator} />

      {/* PREGUNTA DEPORTES */}
      <div className={`${styles.radioGroup} ${styles.span1}`}>
        <h4 className={styles.sectionTitle}>
          ¿Alguno de los solicitantes practica como aficionado o profesional, ocasional o regularmente alguno de estos deportes:
          toreo, automovilismo, motociclismo, vuelo en cometa, paracaidismo, boxeo, montañismo, vuelo en ultralivianos, planeadores, cometas y/o similares,
          bungee jumping, puenting, rafting, downhill, buceo o deportes de alto riesgo y/o extremos? En caso afirmativo detalle:
        </h4>
        <div className={styles.radioOptions}>
          <label>
            <input
              type="radio"
              name="practicaDeportes"
              value="si"
              checked={formData.practicaDeportes === "si"}
              onChange={(e) =>
                setFormData({ ...formData, practicaDeportes: e.target.value })
              }
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="practicaDeportes"
              value="no"
              checked={formData.practicaDeportes === "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  practicaDeportes: e.target.value,
                  deportesRiesgo: [
                    { numeroSolicitante: "", deporte: "", frecuencia: "" },
                  ],
                })
              }
            />
            No
          </label>
        </div>
      </div>

      {/* SOLO SE MUESTRA SI RESPONDE "SÍ" */}
      {formData.practicaDeportes === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.deportesRiesgo.map((item, index) => (
            <div key={index} className={styles.inputRow}>

              {/* QUIÉN */}
              <div className={styles.inputWithTooltip}>
                <select
                  className={styles.select}
                  name="numeroSolicitante"
                  value={item.numeroSolicitante}
                  onChange={(e) => handleChange(e, "deportesRiesgo", index)}
                  required
                >
                  <option value="">Seleccione solicitante</option>

                  {solicitantesOptions.map((s) => {
                    const used = getSelectedSolicitantes(
                      "deportesRiesgo",
                      index
                    ).includes(String(s.numero));

                    return (
                      <option key={s.numero} value={s.numero} disabled={used}>
                        {s.numero} - {s.nombre}
                      </option>
                    );
                  })}
                </select>

                {index === 0 && (
                  <div className={styles.tooltipContainer}>
                    <div className={styles.tooltipText}>
                      Seleccione el número del solicitante registrado en la pregunta 2
                    </div>
                  </div>
                )}
              </div>

              {/* DEPORTE */}
              <input
                className={styles.input}
                type="text"
                name="deporte"
                placeholder="Deporte"
                value={item.deporte}
                onChange={(e) => handleChange(e, "deportesRiesgo", index)}
                required
              />

              {/* FRECUENCIA */}
              <select
                className={styles.input}
                name="frecuencia"
                value={item.frecuencia}
                onChange={(e) => handleChange(e, "deportesRiesgo", index)}
                required
              >
                <option value="">Seleccione frecuencia</option>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="ocasional">Ocasional</option>
              </select>

              {/* BOTÓN ELIMINAR */}
              {formData.deportesRiesgo.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove("deportesRiesgo", index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* BOTÓN AGREGAR */}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("deportesRiesgo")}
            disabled={formData.deportesRiesgo.length >= Number(totalPersonas)}
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}


      {/* BOTONES */}
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

export default Step6;