import React, { useState } from "react";
import styles from './StepsCSS.module.css';
import ShowMessage from "../../../Config/ShowMessage";

const Step3 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen }) => {
  const [formData, setFormData] = useState(() => ({
    solicitaContinuidad: initialData?.solicitaContinuidad || "",
    tieneExclusion: initialData?.tieneExclusion || "",
    especificacion: initialData?.especificacion || "",
    enfermedadesCardiacas:
      initialData?.enfermedadesCardiacas?.length > 0
        ? initialData.enfermedadesCardiacas
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],
    enfermedadesPulmonares:
      initialData?.enfermedadesPulmonares?.length > 0
        ? initialData.enfermedadesPulmonares
        : [{ numeroSolicitante: "", doctor: "", fecha: "", na: false }],
  }));

  // 🔑 AQUÍ está la clave
  const solicitantesOptions = Array.isArray(solicitantesResumen)
    ? solicitantesResumen
    : [];


  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const totalPersonas = (solicitantePrincipalSeAgrega === "Sí" ? 1 : 0) + Number(cantidadPersonasAdicionales);

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

  const handleRemove = (section, index) => {
    if (formData[section].length > 1) {
      const updated = formData[section].filter((_, i) => i !== index);
      setFormData({ ...formData, [section]: updated });
    }
  };
const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.solicitaContinuidad !== "Si") {
    setShowValidationErrors(true);
    return;
  }

  if (hasDuplicates(formData.enfermedadesCardiacas)) {
    ShowMessage(
      "alerta",
      "No puede repetir el mismo solicitante en enfermedades cardíacas."
    );
    return;
  }

  if (hasDuplicates(formData.enfermedadesPulmonares)) {
    ShowMessage(
      "alerta",
      "No puede repetir el mismo solicitante en enfermedades pulmonares."
    );
    return;
  }

  const allValid = (items) =>
    items.every(
      (item) =>
        item.na ||
        (
          item.numeroSolicitante.trim() !== "" &&
          item.doctor.trim() !== "" &&
          item.fecha.trim() !== ""
        )
    );

  if (!allValid(formData.enfermedadesCardiacas)) {
    ShowMessage("alerta", "Complete los campos en enfermedades cardíacas.");
    return;
  }

  if (!allValid(formData.enfermedadesPulmonares)) {
    ShowMessage("alerta", "Complete los campos en enfermedades pulmonares.");
    return;
  }

  onNext(formData);
};


  const handleToggleNA = (section) => {
    const updated = [...formData[section]];
    updated[0] = updated[0].na
      ? { numeroSolicitante: "", doctor: "", fecha: "", na: false }
      : { numeroSolicitante: "N/A", doctor: "N/A", fecha: "", na: true };
    setFormData({ ...formData, [section]: updated });
  };

  const getSelectedSolicitantes = (section, currentIndex) => {
    return formData[section]
      .filter((_, i) => i !== currentIndex)
      .map((item) => item.numeroSolicitante)
      .filter(Boolean);
  };

  const hasDuplicates = (items) => {
    const nums = items
      .filter((i) => !i.na)
      .map((i) => i.numeroSolicitante);
    return new Set(nums).size !== nums.length;
  };


  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <p className={styles.notice}>
        Seguros de VIDA SURAMERICANA S.A Advierte que el asegurado debe cumplir
        lo dispuesto por el artículo 14, numeral 12 del decreto 1485 de 1994
      </p>

      <div className={`${styles.radioGroupHorizontal} ${styles.span1} ${showValidationErrors && formData.solicitaContinuidad !== "Si" ? styles.radioGroupError : ""}`}>
        <label className={styles.label}>Solicita Continuidad:</label>
        <div className={styles.radioOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="solicitaContinuidad"
              value="Si"
              checked={formData.solicitaContinuidad === "Si"}
              onChange={(e) => {
                setFormData({ ...formData, solicitaContinuidad: e.target.value });
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              required
            />
            Sí
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="solicitaContinuidad"
              value="No"
              checked={formData.solicitaContinuidad === "No"}
              onChange={(e) => {
                setFormData({ ...formData, solicitaContinuidad: e.target.value });
                if (showValidationErrors) setShowValidationErrors(false);
              }}
              className={showValidationErrors && formData.solicitaContinuidad === "No" ? styles.radioError : ""}
            />
            No
          </label>
        </div>
        {showValidationErrors && formData.solicitaContinuidad !== "Si" && (
          <span className={styles.errorMessage}>
            {!formData.solicitaContinuidad ? "Debe seleccionar una respuesta" : 'Debe seleccionar "Si" para continuar'}
          </span>
        )}
      </div>

      <div className={`${styles.radioGroupHorizontal} ${styles.span1}`}>
        <label className={styles.labelWithInfo}>
          ¿Alguno de los solicitantes tiene exclusión o extraprima en su contrato
          de Medicina Prepagada o Póliza de Salud?
        </label>

        <div className={styles.radioOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="tieneExclusion"
              value="Si"
              checked={formData.tieneExclusion === "Si"}
              onChange={(e) =>
                setFormData({ ...formData, tieneExclusion: e.target.value })
              }
              required
            />
            Sí
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="tieneExclusion"
              value="No"
              checked={formData.tieneExclusion === "No"}
              onChange={() =>
                setFormData({
                  ...formData,
                  tieneExclusion: "No",
                  especificacion: "", // 🔥 LIMPIA el input
                })
              }
            />
            No
          </label>

          {formData.tieneExclusion === "Si" && (
            <>
              <label htmlFor="especificacion">Especifique</label>
              <input
                id="especificacion"
                name="especificacion"
                type="text"
                value={formData.especificacion}
                onChange={(e) =>
                  setFormData({ ...formData, especificacion: e.target.value })
                }
                placeholder="Ej: Solicitante 2 con exclusión por enfermedad respiratoria"
                minLength={10}
                required
              />
            </>
          )}
        </div>
      </div>

      <hr className={styles.separator} />

      <div className={styles.section}>
        <h3>DECLARACIÓN DE A SEGURABILIDAD</h3>
        <h5>1.Si alguno de los solicitantes ha tenido alguno de los siguientes síntomas y/o le han diagnosticado y/o padecido alguna enfermedad,
          dirigase al padecimiento y seleccione el número del solicitante afectado, nombre del médico tratante y la fecha,(si hay mas de un solicitante con dichos padecimientos presionar el boton Agregar,
          de no haber solicitantes con dichos padecimientos presionar el boton N/A)</h5>
        <h4 className={styles.sectionTitle}>
          A. Enfermedad o insuficiencia del corazón, presión arterial alta o
          baja, trombosis arterial o venosa, aneurismas, várices,
          arteriosclerosis
        </h4>

        {formData.enfermedadesCardiacas.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) => handleChange(e, "enfermedadesCardiacas", index)}
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante Afectado</option>

                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes("enfermedadesCardiacas", index)
                    .includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}


              </select>

              {index === 0 && !item.na && (
                <div className={styles.tooltipContainer}>
                  {/*<span className={styles.infoIcon}>ℹ️</span>*/}
                  <div className={styles.tooltipText}>
                    Debes ingresar el numero de solicitud que se registro en la pagina anterior(2)
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
              onChange={(e) => handleChange(e, "enfermedadesCardiacas", index)}
              required={!item.na}
              disabled={item.na}
            />
            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={item.fecha}
              onChange={(e) => handleChange(e, "enfermedadesCardiacas", index)}
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />
            {formData.enfermedadesCardiacas.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove("enfermedadesCardiacas", index)}
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
            onClick={() => handleAdd("enfermedadesCardiacas")}
            disabled={
              formData.enfermedadesCardiacas.length >= Number(totalPersonas) ||
              formData.enfermedadesCardiacas[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesCardiacas.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesCardiacas")}
            >
              {formData.enfermedadesCardiacas[0].na ? "Quitar N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          B. Enfermedades de los pulmones, enfisema, neumonía, asma, tuberculosis,
          tos crónica, gripas frecuentes
        </h4>

        {formData.enfermedadesPulmonares.map((item, index) => (
          <div key={index} className={styles.inputRow}>
            <div className={styles.inputWithTooltip}>
              <select
                className={styles.select}
                name="numeroSolicitante"
                value={item.numeroSolicitante}
                onChange={(e) => handleChange(e, "enfermedadesPulmonares", index)}
                required={!item.na}
                disabled={item.na}
              >
                <option value="">Seleccione número del solicitante Afectado</option>

                {solicitantesOptions.map((s) => {
                  const used = getSelectedSolicitantes("enfermedadesPulmonares", index)
                    .includes(String(s.numero));

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
                    Debes ingresar el número de solicitante registrado en la página anterior (2)
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
              onChange={(e) => handleChange(e, "enfermedadesPulmonares", index)}
              required={!item.na}
              disabled={item.na}
            />

            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={item.fecha}
              onChange={(e) => handleChange(e, "enfermedadesPulmonares", index)}
              required={!item.na}
              disabled={item.na}
              max={new Date().toISOString().split("T")[0]}
            />

            {formData.enfermedadesPulmonares.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove("enfermedadesPulmonares", index)}
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
            onClick={() => handleAdd("enfermedadesPulmonares")}
            disabled={
              formData.enfermedadesPulmonares.length >= Number(totalPersonas) ||
              formData.enfermedadesPulmonares[0].na
            }
          >
            ＋ Agregar solicitante
          </button>

          {formData.enfermedadesPulmonares.length === 1 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleToggleNA("enfermedadesPulmonares")}
            >
              {formData.enfermedadesPulmonares[0].na ? "Quitar N/A" : "N/A"}
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

export default Step3;
