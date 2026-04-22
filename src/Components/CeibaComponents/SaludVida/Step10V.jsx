import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

const Step10V = ({
  onNext,
  onPrevious,
  initialData = {},
  step1Data = {},
  step4Data = {},
  step5Data = {},
  step6Data = {},
  step7Data = {},
  step8Data = {},
  step9Data = {},
}) => {

  /* =============================
     ENFERMEDADES STEP 10
  ============================= */
  const enfermedadesBase = [
    { id: "hipertiroidismo", nombre: "Hipertiroidismo" },
    { id: "paralisis", nombre: "Parálisis diferente o facial" },
    { id: "deformidades", nombre: "Deformidades corporales" },
    { id: "ceguera", nombre: "Ceguera total o parcial" },
    { id: "sordera", nombre: "Sordera total o parcial" },
    { id: "hernia", nombre: "Hernia de columna" },
    { id: "perdida_funcional", nombre: "Pérdida funcional o anatómica" },
  ];

  const [formData, setFormData] = useState({ enfermedades: [] });
  const [enfermedadErrors, setEnfermedadErrors] = useState({});

  /* =============================
     ASEGURADOS
  ============================= */
  const asegurados = [];
  if (step1Data?.nombreCompleto) {
    asegurados.push({ aseguradoIndex: 1, nombreCompleto: step1Data.nombreCompleto, esPrincipal: true });
  }
  (step4Data?.asegurados || []).forEach(a => asegurados.push({ ...a, aseguradoIndex: asegurados.length + 1, esPrincipal: false }));

  const opcionesAsegurados = asegurados.map(a => ({
    value: a.aseguradoIndex,
    label: a.esPrincipal ? `1 - ${a.nombreCompleto}` : `${a.aseguradoIndex} - ${a.nombreCompleto}`
  }));

  /* =============================
     BLOQUEO ENTRE STEPS
  ============================= */
  const getAseguradosUsadosEnOtrosSteps = () => {
    return [
      ...(step5Data?.enfermedades || []),
      ...(step6Data?.enfermedades || []),
      ...(step7Data?.enfermedades || []),
      ...(step8Data?.enfermedadesStep8 || []),
      ...(step9Data?.enfermedadesStep9 || []),
    ]
      .filter(e => e.checked)
      .flatMap(e => e.asegurados)
      .map(a => String(a.asegurado))
      .filter(Boolean);
  };

  const getAseguradosUsadosEnOtrasEnfermedades = (idActual) => {
    const usadosEsteStep = formData.enfermedades
      .filter(e => e.id !== idActual && e.checked)
      .flatMap(e => e.asegurados)
      .map(a => String(a.asegurado))
      .filter(Boolean);

    return [...new Set([...usadosEsteStep, ...getAseguradosUsadosEnOtrosSteps()])];
  };

  /* =============================
     CARGA INICIAL
  ============================= */
  useEffect(() => {
    const prevData = initialData?.enfermedadesStep10 || [];
    const nuevas = enfermedadesBase.map(e => {
      const guardada = prevData.find(p => p.id === e.id);
      if (guardada) {
        return {
          ...e,
          checked: guardada.checked,
          asegurados: guardada.asegurados?.length > 0
            ? guardada.asegurados
            : [{ asegurado: "", medico: "", institucion: "", eps: "" }]
        };
      }
      return { ...e, checked: false, asegurados: [{ asegurado: "", medico: "", institucion: "", eps: "" }] };
    });
    setFormData({ enfermedades: nuevas });
  }, [initialData]);

  /* =============================
     HANDLERS
  ============================= */
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

  const handleFieldChange = (id, index, field, value) => {
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

        const incompleto = e.asegurados.some(a => !a.asegurado || !a.medico || !a.institucion || !a.eps);
        if (incompleto) {
          ShowMessage("alerta", "Debe completar todos los campos antes de agregar otro asegurado");
          return e;
        }

        const seleccionados = e.asegurados.map(a => a.asegurado).filter(Boolean);
        if (new Set(seleccionados).size !== seleccionados.length) {
          ShowMessage("alerta", "No puede seleccionar el mismo asegurado más de una vez en la misma enfermedad");
          return e;
        }

        return { ...e, asegurados: [...e.asegurados, { asegurado: "", medico: "", institucion: "", eps: "" }] };
      })
    }));
  };

  const handleRemoveInput = (id, index) => {
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.map(e => e.id === id
        ? { ...e, asegurados: e.asegurados.filter((_, i) => i !== index) }
        : e
      )
    }));
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    formData.enfermedades.forEach(enf => {
      if (!enf.checked) return;

      if (enf.asegurados.some(a => !a.asegurado || !a.medico || !a.institucion || !a.eps)) {
        errors[enf.id] = true;
        ShowMessage("alerta", `Complete todos los campos de "${enf.nombre}"`);
      }

      const seleccionados = enf.asegurados.map(a => a.asegurado).filter(Boolean);
      if (new Set(seleccionados).size !== seleccionados.length) {
        errors[enf.id] = true;
        ShowMessage("alerta", `No puede seleccionar el mismo asegurado más de una vez en "${enf.nombre}"`);
      }
    });

    if (Object.keys(errors).length > 0) {
      setEnfermedadErrors(errors);
      return;
    }

    setEnfermedadErrors({});
    onNext({ enfermedadesStep10: formData.enfermedades });
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious({ enfermedadesStep10: formData.enfermedades });
  };

  /* =============================
     RENDER
  ============================= */
  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>Antecedentes de Enfermedades del Grupo Familiar</h3>
      <h2 className={styles.sectionTitle}>
        5. Usted o alguien de su grupo familiar sufre o ha sido tratado por:
        <small className={styles.helperText}>De no ser así, pase a la siguiente pregunta.</small>
      </h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.coberturasLabel}>
          Seleccione el asegurado que padece cada enfermedad e indique los datos médicos
        </label>

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
                      <select className={styles.input} value={item.asegurado} required
                        onChange={e => handleFieldChange(enf.id, idx, "asegurado", e.target.value)}
                      >
                        <option value="">Seleccione asegurado</option>
                        {opcionesAsegurados.map(opt => {
                          const bloqueado = getAseguradosUsadosEnOtrasEnfermedades(enf.id)
                            .includes(String(opt.value)) ||
                            enf.asegurados.some((a, i) => a.asegurado === String(opt.value) && i !== idx);
                          return <option key={opt.value} value={String(opt.value)} disabled={bloqueado}>
                            {opt.label}{bloqueado ? " (ya asignado)" : ""}
                          </option>;
                        })}
                      </select>

                      <input className={styles.input} placeholder="Médico tratante" value={item.medico} required
                        onChange={e => handleFieldChange(enf.id, idx, "medico", e.target.value)} />
                      <input className={styles.input} placeholder="Institución médica" value={item.institucion} required
                        onChange={e => handleFieldChange(enf.id, idx, "institucion", e.target.value)} />
                      <input className={styles.input} placeholder="EPS" value={item.eps} required
                        onChange={e => handleFieldChange(enf.id, idx, "eps", e.target.value)} />

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

export default Step10V;
