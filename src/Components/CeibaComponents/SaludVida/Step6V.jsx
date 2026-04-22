import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

const Step6V = ({ onNext, onPrevious, initialData = {}, step4Data = {}, step1Data = {}, step5Data = {} }) => {

  const enfermedadesBase = [
    { id: "hipertension", nombre: "Hipertensión arterial" },
    { id: "colesterol", nombre: "Colesterol alto" },
    { id: "trigliceridos", nombre: "Triglicéridos altos" },
    { id: "lupus", nombre: "Lupus" },
    { id: "isquemia", nombre: "Isquemia o trombosis cerebral" },
    { id: "epilepsia", nombre: "Epilepsia" },
  ];

  const [formData, setFormData] = useState({ enfermedades: [] });
  const [enfermedadErrors, setEnfermedadErrors] = useState({});

  useEffect(() => {
    if (initialData?.enfermedades?.length > 0) {
      setFormData({
        enfermedades: initialData.enfermedades.map(e => ({
          ...e,
          checked: e.checked || false,
          asegurados: e.asegurados?.length > 0
            ? e.asegurados
            : [{ asegurado: "", medico: "", institucion: "", eps: "" }],
        })),
      });
    } else {
      setFormData({
        enfermedades: enfermedadesBase.map(e => ({
          ...e,
          checked: false,
          asegurados: [{ asegurado: "", medico: "", institucion: "", eps: "" }],
        })),
      });
    }
  }, [initialData]);

  // 🔹 Construir lista de asegurados disponibles
  const asegurados = [];
  if (step1Data?.nombreCompleto) asegurados.push({ aseguradoIndex: 1, nombreCompleto: step1Data.nombreCompleto, esPrincipal: true });
  (step4Data?.asegurados || []).forEach(a => asegurados.push({ ...a, aseguradoIndex: asegurados.length + 1, esPrincipal: false }));

  const opcionesAsegurados = asegurados.map(a => ({
    value: String(a.aseguradoIndex),
    label: a.esPrincipal ? `1 - ${a.nombreCompleto}` : `${a.aseguradoIndex} - ${a.nombreCompleto}`
  }));

  const getAseguradosUsadosEnStep5 = () => {
    if (!step5Data?.enfermedades) return [];
    return step5Data.enfermedades
      .filter(e => e.checked)
      .flatMap(e => e.asegurados)
      .map(a => String(a.asegurado))
      .filter(Boolean);
  };

  const getAseguradosUsadosEnOtrasEnfermedades = (idActual) => {
    const usadosEnEsteStep = formData.enfermedades
      .filter(e => e.id !== idActual && e.checked)
      .flatMap(e => e.asegurados)
      .map(a => String(a.asegurado))
      .filter(Boolean);

    return [...new Set([...usadosEnEsteStep, ...getAseguradosUsadosEnStep5()])];
  };

  // 🔹 Handlers
  const handleCheckboxChange = (id) => {
    setEnfermedadErrors(prev => { const nuevo = { ...prev }; delete nuevo[id]; return nuevo; });
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.map(e => e.id === id
        ? { ...e, checked: !e.checked, asegurados: !e.checked ? e.asegurados : [{ asegurado: "", medico: "", institucion: "", eps: "" }] }
        : e
      )
    }));
  };

  const handleAseguradoFieldChange = (id, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.map(e => e.id === id
        ? { ...e, asegurados: e.asegurados.map((a, i) => i === index ? { ...a, [field]: value } : a) }
        : e
      )
    }));
  };

  const handleAddInput = (id) => {
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.map(e => {
        if (e.id !== id) return e;

        const tieneCamposVacios = e.asegurados.some(a => !a.asegurado || !a.medico || !a.institucion || !a.eps);
        if (tieneCamposVacios) {
          ShowMessage("alerta", "Debe completar todos los campos antes de agregar otro asegurado");
          return e;
        }

        const aseguradosSeleccionados = e.asegurados.map(a => a.asegurado).filter(Boolean);
        const tieneDuplicados = new Set(aseguradosSeleccionados).size !== aseguradosSeleccionados.length;
        if (tieneDuplicados) {
          ShowMessage("alerta", "No puede seleccionar el mismo asegurado más de una vez en la misma enfermedad");
          return e;
        }

        return {
          ...e,
          checked: true,
          asegurados: [...(e.asegurados || []), { asegurado: "", medico: "", institucion: "", eps: "" }]
        };
      })
    }));
  };

  const handleRemoveInput = (id, index) => {
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.map(e => e.id === id ? { ...e, asegurados: e.asegurados.filter((_, i) => i !== index) } : e)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    formData.enfermedades.forEach(enf => {
      if (enf.checked) {
        // Campos incompletos
        if (enf.asegurados.some(a => !a.asegurado || !a.medico || !a.institucion || !a.eps)) {
          errors[enf.id] = true;
          return;
        }

        // Duplicados en la misma enfermedad
        const aseguradosSeleccionados = enf.asegurados.map(a => a.asegurado).filter(Boolean);
        if (new Set(aseguradosSeleccionados).size !== aseguradosSeleccionados.length) {
          errors[enf.id] = true;
          ShowMessage("alerta", `No puede seleccionar el mismo asegurado más de una vez en "${enf.nombre}"`);
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setEnfermedadErrors(errors);
      return;
    }

    setEnfermedadErrors({});
    onNext(formData);
  };

  const handlePrevious = (e) => { e.preventDefault(); onPrevious(formData); };

  // 🔹 Render
  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>DECLARACIÓN DE ASEGURABILIDAD</h3>
      <h2 className={styles.sectionTitle}>
        2. Usted o alguien de su grupo familiar, sufre o ha sido tratado por:
        <small className={styles.helperText}>De no ser así, pase a la siguiente pregunta.</small>
      </h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.coberturasLabel}>Seleccione el asegurado que padece cada enfermedad</label>

        <div className={styles.coberturas}>
          {formData.enfermedades.map(enf => (
            <div key={enf.id} className={styles.coberturaItem}>
              <div className={styles.coberturaHeader}>
                <input type="checkbox" className={styles.checkbox} checked={enf.checked} onChange={() => handleCheckboxChange(enf.id)} />
                <span className={styles.checkboxLabel}>{enf.nombre}</span>
              </div>

              {enf.checked && (
                <div className={styles.dynamicSection}>
                  {enf.asegurados.map((item, idx) => (
                    <div key={idx} className={styles.inputRowGrid}>
                      <select
                        className={styles.input}
                        value={item.asegurado}
                        required
                        onChange={e => handleAseguradoFieldChange(enf.id, idx, "asegurado", e.target.value)}
                      >
                        <option value="">Seleccione asegurado</option>
                        {opcionesAsegurados.map(opt => {
                          const usadosEnOtras = getAseguradosUsadosEnOtrasEnfermedades(enf.id);
                          const usadoEnEsta = enf.asegurados
                            .map(a => a.asegurado)
                            .includes(opt.value) && opt.value !== item.asegurado;

                          const deshabilitar = usadosEnOtras.includes(opt.value) || usadoEnEsta;

                          return (
                            <option key={opt.value} value={opt.value} disabled={deshabilitar}>
                              {opt.label}{deshabilitar ? " (ya asignado)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <input className={styles.input} placeholder="Nombre del médico tratante" value={item.medico} required onChange={e => handleAseguradoFieldChange(enf.id, idx, "medico", e.target.value)} />
                      <input className={styles.input} placeholder="Institución médica" value={item.institucion} required onChange={e => handleAseguradoFieldChange(enf.id, idx, "institucion", e.target.value)} />
                      <input className={styles.input} placeholder="EPS" value={item.eps} required onChange={e => handleAseguradoFieldChange(enf.id, idx, "eps", e.target.value)} />
                      {idx > 0 && <button type="button" className={styles.removeButton} onClick={() => handleRemoveInput(enf.id, idx)}>✕</button>}
                    </div>
                  ))}
                  {enf.asegurados.length < asegurados.length && <button type="button" className={styles.addButton} onClick={() => handleAddInput(enf.id)}>+ Agregar</button>}
                  {enfermedadErrors[enf.id] && <div className={styles.errorBox}>⚠️ Complete todos los campos de la enfermedad</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.submitButton} onClick={handlePrevious}>← Preguntas anteriores</button>
          <button type="submit" className={styles.submitButton}>Siguientes preguntas →</button>
        </div>
      </form>
    </div>
  );
};

export default Step6V;
