import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

const Step11V = ({
  onNext,
  onPrevious,
  initialData = {},
  step1Data = {},
  step4Data = {},
}) => {

  /* =============================
     ASEGURADOS
  ============================= */
  const asegurados = [];
  if (step1Data?.nombreCompleto) {
    asegurados.push({ aseguradoIndex: 1, nombreCompleto: step1Data.nombreCompleto });
  }
  (step4Data?.asegurados || []).forEach(a =>
    asegurados.push({
      aseguradoIndex: asegurados.length + 1,
      nombreCompleto: a.nombreCompleto,
    })
  );

  /* =============================
     STATE
  ============================= */
  const [formData, setFormData] = useState({
    alcoholismoUltimosCinco: "",
    detalleAlcoholismoUltimosCinco: [],

    alcoholismoActual: "",
    detalleAlcoholismoActual: [],

    consumeDrogas: "",
    otrasEnfermedades: "",
    detalleOtrasEnfermedades: [],
  });

  /* =============================
     CARGA INICIAL
  ============================= */
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  /* =============================
     HANDLERS GENERALES
  ============================= */

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const opcionesAlcoholismoUltimosCinco = [
    "Alcoholismo hace 5 años",
    "Drogadicción hace 5 años",
  ];

  const opcionesAlcoholismoActual = [
    "Alcoholismo actual",
    "Drogadicción actual",
  ];

  const handleDynamicRadioChange = (field, detalleKey, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      [detalleKey]: value === "si"
        ? [
          {
            asegurado: "",
            medico: "",
            institucion: "",
            eps: "",
            observacion: "", // vacío, el usuario llenará
          }
        ] // Solo una fila inicial
        : [], // si es "no", limpiar el array
    }));
  };

  const handleDynamicFieldChange = (detalleKey, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [detalleKey]: prev[detalleKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddDynamic = (detalleKey, includeObservacion = false) => {
    const incompleto = formData[detalleKey].some(d =>
      includeObservacion
        ? !d.asegurado || !d.eps || !d.medico || !d.institucion || !d.observacion
        : !d.asegurado || !d.eps || !d.medico || !d.institucion || !d.observacion
    );

    if (incompleto) {
      ShowMessage("alerta", "Debe completar todos los campos");
      return;
    }

    if (formData[detalleKey].length >= asegurados.length) {
      ShowMessage("alerta", "No puede agregar más asegurados");
      return;
    }

    const nuevoDetalle = includeObservacion
      ? { asegurado: "", eps: "", medico: "", institucion: "", observacion: "" }
      : { asegurado: "", eps: "", medico: "", institucion: "", observacion: "" };

    setFormData(prev => ({
      ...prev,
      [detalleKey]: [...prev[detalleKey], nuevoDetalle],
    }));
  };

  const handleRemoveDynamic = (detalleKey, index) => {
    setFormData(prev => ({
      ...prev,
      [detalleKey]: prev[detalleKey].filter((_, i) => i !== index),
    }));
  };

  /* =============================
     RENDER DINÁMICO
  ============================= */

  const renderDynamicSection = (detalleKey, includeObservacion = false, opcionesSelect = []) => (
    <div className={styles.dynamicSection}>
      {formData[detalleKey].map((d, idx) => {
        const aseguradosSeleccionados = formData[detalleKey]
          .map(item => item.asegurado)
          .filter((_, i) => i !== idx);

        return (
          <div key={idx} className={styles.inputRowGrid}>
            <select
              className={styles.input}
              value={d.asegurado}
              onChange={e =>
                handleDynamicFieldChange(detalleKey, idx, "asegurado", e.target.value)
              }
              required
            >
              <option value="">Seleccione asegurado</option>
              {asegurados.map(a => {
                const yaAsignado = aseguradosSeleccionados.includes(
                  a.aseguradoIndex.toString()
                );
                return (
                  <option
                    key={a.aseguradoIndex}
                    value={a.aseguradoIndex}
                    disabled={yaAsignado}
                  >
                    {a.aseguradoIndex} - {a.nombreCompleto}
                  </option>
                );
              })}
            </select>

            <input
              className={styles.input}
              placeholder="Médico tratante"
              value={d.medico}
              onChange={e =>
                handleDynamicFieldChange(detalleKey, idx, "medico", e.target.value)
              }
              required
            />

            <input
              className={styles.input}
              placeholder="Institución médica"
              value={d.institucion}
              onChange={e =>
                handleDynamicFieldChange(detalleKey, idx, "institucion", e.target.value)
              }
              required
            />

            <input
              className={styles.input}
              placeholder="EPS"
              value={d.eps}
              onChange={e =>
                handleDynamicFieldChange(detalleKey, idx, "eps", e.target.value)
              }
              required
            />

            {includeObservacion && (
              detalleKey === "detalleOtrasEnfermedades" ? (
                <input
                  className={styles.input}
                  placeholder="Enfermedad"
                  value={d.observacion}
                  onChange={e =>
                    handleDynamicFieldChange(detalleKey, idx, "observacion", e.target.value)
                  }
                  required
                />
              ) : (
                <select
                  className={styles.input}
                  value={d.observacion}
                  onChange={e =>
                    handleDynamicFieldChange(detalleKey, idx, "observacion", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione tratamiento</option>
                  {opcionesSelect.map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              )
            )}

            {idx > 0 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveDynamic(detalleKey, idx)}
              >
                ✕
              </button>
            )}
          </div>
        );
      })}

      {formData[detalleKey].length < asegurados.length && (
        <button
          type="button"
          className={styles.addButton}
          onClick={() => handleAddDynamic(detalleKey, includeObservacion)}
        >
          + Agregar
        </button>
      )}
    </div>
  );

  /* =============================
     SUBMIT
  ============================= */

  const handleSubmit = e => {
    e.preventDefault();

    console.log("FORM DATA STEP 11 👉", formData); // <--- 👈

    if (
      !formData.alcoholismoUltimosCinco ||
      !formData.alcoholismoActual ||
      !formData.consumeDrogas ||
      !formData.otrasEnfermedades
    ) {
      ShowMessage("alerta", "Debe responder todas las preguntas");
      return;
    }

    onNext(formData);
  };


  /* =============================
     RENDER
  ============================= */

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>Declaración de Asegurabilidad</h3>

      <form onSubmit={handleSubmit}>

        {/* ALCOHOLISMO ÚLTIMOS 5 AÑOS */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ¿Ha recibido tratamiento por alcoholismo o drogadicción en los últimos cinco años?
          </label>

          <div className={styles.radioOptions}>
            {["si", "no"].map(op => (
              <label key={op} className={styles.radioOption}>
                <input
                  type="radio"
                  name="alcoholismoUltimosCinco"
                  checked={formData.alcoholismoUltimosCinco === op}
                  onChange={() =>
                    handleDynamicRadioChange(
                      "alcoholismoUltimosCinco",
                      "detalleAlcoholismoUltimosCinco",
                      op
                    )
                  }
                  required
                />
                {op === "si" ? "Sí" : "No"}
              </label>
            ))}
          </div>

          {formData.alcoholismoUltimosCinco === "si" &&
            renderDynamicSection(
              "detalleAlcoholismoUltimosCinco",
              true,
              opcionesAlcoholismoUltimosCinco
            )}
        </div>

        {/* ALCOHOLISMO ACTUAL */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ¿Recibe actualmente tratamiento por alcoholismo o drogadicción?
          </label>

          <div className={styles.radioOptions}>
            {["si", "no"].map(op => (
              <label key={op} className={styles.radioOption}>
                <input
                  type="radio"
                  name="alcoholismoActual"
                  checked={formData.alcoholismoActual === op}
                  onChange={() =>
                    handleDynamicRadioChange(
                      "alcoholismoActual",
                      "detalleAlcoholismoActual",
                      op
                    )
                  }
                  required
                />
                {op === "si" ? "Sí" : "No"}
              </label>
            ))}
          </div>

          {formData.alcoholismoActual === "si" &&
            renderDynamicSection(
              "detalleAlcoholismoActual",
              true,
              opcionesAlcoholismoActual
            )}
        </div>


        {/* CONSUME DROGAS */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ¿Consume drogas estimulantes o adictivas?
          </label>

          <div className={styles.radioOptions}>
            {["si", "no"].map(op => (
              <label key={op} className={styles.radioOption}>
                <input
                  type="radio"
                  name="consumeDrogas"
                  checked={formData.consumeDrogas === op}
                  onChange={() => handleRadioChange("consumeDrogas", op)}
                  required
                />
                {op === "si" ? "Sí" : "No"}
              </label>
            ))}
          </div>
        </div>


        {/* OTRAS ENFERMEDADES */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            ¿Ha tenido enfermedades diferentes a las enunciadas, accidentes u otra condición médica?
          </label>

          <div className={styles.radioOptions}>
            {["si", "no"].map(op => (
              <label key={op} className={styles.radioOption}>
                <input
                  type="radio"
                  name="otrasEnfermedades"
                  checked={formData.otrasEnfermedades === op}
                  onChange={() =>
                    handleDynamicRadioChange(
                      "otrasEnfermedades",
                      "detalleOtrasEnfermedades",
                      op
                    )
                  }
                  required
                />
                {op === "si" ? "Sí" : "No"}
              </label>
            ))}
          </div>

          {formData.otrasEnfermedades === "si" &&
            renderDynamicSection("detalleOtrasEnfermedades", true)}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.submitButton} onClick={onPrevious}>
            ← Anterior
          </button>
          <button type="submit" className={styles.submitButton}>
            Siguiente →
          </button>
        </div>

      </form>
    </div>
  );
};

export default Step11V;
