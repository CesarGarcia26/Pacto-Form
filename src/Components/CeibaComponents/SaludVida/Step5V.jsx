import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

const Step5V = ({
  onNext,
  onPrevious,
  initialData = {},
  step1Data = {},   // 👈 AÑADIDO
  step4Data = {},
  step2Data = {}
}) => {

  const [formData, setFormData] = useState({
    valoresAsegurados: [],
    enfermedades: []
  });
  const [enfermedadErrors, setEnfermedadErrors] = useState({});

  const enfermedadesBase = [
    { id: "cardio", nombre: "Enfermedades cardiovasculares" },
    { id: "infarto", nombre: "Infarto al corazón" },
    { id: "arritmia", nombre: "Arritmias" }
  ];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      valoresAsegurados: step4Data?.asegurados?.length
        ? step4Data.asegurados.map((a, index) => ({
          aseguradoIndex: a.aseguradoIndex ?? index,
          valorAsegurado: prev.valoresAsegurados[index]?.valorAsegurado || "",
        }))
        : [],
      enfermedades: enfermedadesBase.map((e) => {
        // Si ya existían enfermedades previas, mantenlas
        const prevEnf = prev.enfermedades.find((pe) => pe.id === e.id);
        return prevEnf || {
          ...e,
          checked: false,
          asegurados: step4Data?.asegurados?.length
            ? step4Data.asegurados.map(() => ({
              asegurado: "",
              medico: "",
              institucion: "",
              eps: "",
            }))
            : [], // si no hay asegurados, array vacío
        };
      }),
    }));
  }, [step4Data, initialData]);

  const handleValorChange = (index, valor) => {
    const numericValue = Number(valor.replace(/\D/g, ""));
    if (numericValue > 1000000000) return;

    setFormData((prev) => {
      const nuevosValores = [...prev.valoresAsegurados];
      nuevosValores[index] = {
        ...nuevosValores[index],
        valorAsegurado: valor
      };

      return {
        ...prev,
        valoresAsegurados: nuevosValores
      };
    });
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: prev.enfermedades.map((e) =>
        e.id === id
          ? {
            ...e,
            checked: !e.checked,
            asegurados: !e.checked
              ? [{
                asegurado: "",
                medico: "",
                institucion: "",
                eps: ""
              }]
              : []
          }
          : e
      )
    }));
  };

  const handleAseguradoFieldChange = (id, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: prev.enfermedades.map((e) =>
        e.id === id
          ? {
            ...e,
            asegurados: e.asegurados.map((a, i) =>
              i === index ? { ...a, [field]: value } : a
            )
          }
          : e
      )
    }));
  };

  const handleInputChange = (id, index, value) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: prev.enfermedades.map((e) =>
        e.id === id
          ? {
            ...e,
            asegurados: e.asegurados.map((a, i) =>
              i === index ? value : a
            )
          }
          : e
      )
    }));
  };

  const handleAddInput = (id) => {
    setFormData((prev) => {
      return {
        ...prev,
        enfermedades: prev.enfermedades.map((e) => {
          if (e.id !== id) return e;

          const tieneCamposVacios = e.asegurados.some(
            (a) =>
              !a.asegurado ||
              !a.medico ||
              !a.institucion ||
              !a.eps
          );

          if (tieneCamposVacios) {
            ShowMessage(
              "alerta",
              "Debe completar todos los campos antes de agregar otro asegurado"
            );
            return e;
          }

          return {
            ...e,
            asegurados: [
              ...e.asegurados,
              {
                asegurado: "",
                medico: "",
                institucion: "",
                eps: ""
              }
            ]
          };
        })
      };
    });
  };

  const handleRemoveInput = (id, index) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: prev.enfermedades.map((e) =>
        e.id === id
          ? {
            ...e,
            asegurados: e.asegurados.filter((_, i) => i !== index)
          }
          : e
      )
    }));
  };

  const aseguradosFamiliares = step4Data?.asegurados || [];

  const asegurados = [
    step1Data?.nombreCompleto && {
      numero: 1,
      nombreCompleto: step1Data.nombreCompleto,
      esPrincipal: true
    },
    ...(step4Data?.asegurados || []).map((a, idx) => ({
      ...a,
      numero: idx + 2,
    }))
  ].filter(Boolean);


  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    // 🔒 Validar enfermedades marcadas
    formData.enfermedades.forEach((enfermedad) => {
      if (enfermedad.checked) {
        const hayCamposVacios = enfermedad.asegurados.some(
          (a) =>
            !a.asegurado ||
            !a.medico ||
            !a.institucion ||
            !a.eps
        );

        if (hayCamposVacios) {
          errors[enfermedad.id] = true;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setEnfermedadErrors(errors);
      ShowMessage(
        "alerta",
        "Debe completar toda la información médica antes de continuar"
      );
      return;
    }

    // ✅ Limpiar errores
    setEnfermedadErrors({});

    // 🔐 Validar valores asegurados vs principal
    const valorAseguradoPrincipal =
      step2Data?.valorFinal_CyP ||
      step2Data?.ValorFinal_CyP ||
      0;

    const cleanValorPrincipal =
      typeof valorAseguradoPrincipal === "string"
        ? Number(valorAseguradoPrincipal.replace(/\D/g, ""))
        : Number(valorAseguradoPrincipal);

    if (cleanValorPrincipal > 0) {
      for (let i = 0; i < formData.valoresAsegurados.length; i++) {
        const valorStr = formData.valoresAsegurados[i]?.valorAsegurado || "";

        if (valorStr.trim() !== "") {
          const valorFamiliar = Number(valorStr.replace(/\D/g, ""));

          if (valorFamiliar > cleanValorPrincipal) {
            ShowMessage(
              "alerta",
              `El valor asegurado del ${asegurados[i]?.nombreCompleto || `Asegurado ${i + 1}`
              } no puede ser superior al valor asegurado del Asegurado Principal ($${new Intl.NumberFormat(
                "es-CO"
              ).format(cleanValorPrincipal)})`
            );
            return;
          }
        }
      }
    }

    // 🚀 Todo OK
    onNext(formData);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  const formatNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? new Intl.NumberFormat("es-CO").format(Number(numericValue))
      : "";
  };

  const cantidadAsegurados = step4Data?.cantidadAsegurados || 0;

  // Usar solo el valor de la cobertura de vida
  const valorAseguradoPrincipal = step2Data?.valorFinal_CyP || step2Data?.ValorFinal_CyP || 0;
  const cleanValorPrincipal = typeof valorAseguradoPrincipal === 'string'
    ? Number(valorAseguradoPrincipal.replace(/\D/g, ""))
    : Number(valorAseguradoPrincipal);

  const opcionesAsegurados = asegurados.map((a) => ({
    value: String(a.numero),          // 🔥 siempre string
    label: `${a.numero} - ${a.nombreCompleto}`,
  }));

  const getAseguradosSeleccionados = (enfermedad) =>
    enfermedad.asegurados
      .map((a) => a.asegurado)
      .filter((a) => a !== "");

  const getAseguradosUsadosEnOtrasEnfermedades = (enfermedadIdActual) => {
    return formData.enfermedades
      .filter((e) => e.id !== enfermedadIdActual && e.checked)
      .flatMap((e) =>
        e.asegurados
          .map((a) => a.asegurado)
          .filter((a) => a !== "")
      );
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>
        INFORMACIÓN DEL SEGURO (GRUPO FAMILIAR)
      </h3>
      {cleanValorPrincipal > 0 && (
        <p className={styles.sectionSubtitle} style={{ marginBottom: '15px', color: '#1976d2' }}>
          Valor asegurado del Asegurado Principal: ${new Intl.NumberFormat("es-CO").format(cleanValorPrincipal)}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {cantidadAsegurados > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.insuranceTable}>
              <thead>
                <tr>
                  <th>Asegurado</th>
                  <th>Nombre</th>
                  <th>Valor Asegurado</th>
                </tr>
              </thead>

              <tbody>
                {asegurados.map((aseg, index) => (
                  <tr key={aseg.numero}>
                    <td className={styles.aseguradoNumber}>
                      {aseg.numero}
                    </td>

                    <td className={styles.aseguradoName}>
                      {aseg.nombreCompleto}
                    </td>

                    <td className={styles.valorInput}>
                      {aseg.esPrincipal ? (
                        <input
                          type="text"
                          className={styles.input}
                          value={new Intl.NumberFormat("es-CO").format(cleanValorPrincipal)}
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.valoresAsegurados[index - 1]?.valorAsegurado || ""}
                          onChange={(e) =>
                            handleValorChange(index - 1, formatNumber(e.target.value))
                          }
                          placeholder="$ 0"
                          required
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>



            </table>
          </div>
        ) : (
          <div className={styles.noData}>
            <p>No hay asegurados adicionales registrados.</p>
          </div>
        )}

        <h3 className={styles.sectionTitle}>DECLARACIÓN DE ASEGURABILIDAD</h3>
        <h2 className={styles.sectionTitle}>
          1. Usted o alguien de su grupo familiar, sufre, ha sido tratado o está
          siendo tratado por alguna de las siguientes enfermedades:

          <small className={styles.helperText}>
            De no ser asi pase a la siguente pregunta.
          </small>
        </h2>

        <label className={styles.coberturasLabel}>
          Presione el checkbox y luego ingrese el número de asegurado que padece la enfermedad
        </label>

        <div className={styles.coberturas}>
          {formData.enfermedades.map((enf) => (
            <div key={enf.id} className={styles.coberturaItem}>

              {/* Header */}
              <div className={styles.coberturaHeader}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={enf.checked}
                  onChange={() => handleCheckboxChange(enf.id)}
                />
                <span className={styles.checkboxLabel}>{enf.nombre}</span>
              </div>

              {/* Select debajo */}
              {enf.checked && (
                <div className={styles.dynamicSection}>
                  {enf.asegurados.map((item, idx) => (
                    <div key={idx} className={styles.inputRowGrid}>

                      {/* Asegurado */}
                      <select
                        className={styles.input}
                        value={item.asegurado}
                        required
                        onChange={(e) =>
                          handleAseguradoFieldChange(
                            enf.id,
                            idx,
                            "asegurado",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Seleccione asegurado</option>

                        {opcionesAsegurados.map((opt) => {
                          const usadosEnOtras = getAseguradosUsadosEnOtrasEnfermedades(enf.id);
                          const usadoEnEsta =
                            enf.asegurados
                              .map((a) => a.asegurado)
                              .includes(opt.value) &&
                            opt.value !== item.asegurado;

                          const deshabilitar = usadosEnOtras.includes(opt.value) || usadoEnEsta;

                          return (
                            <option
                              key={opt.value}
                              value={opt.value}
                              disabled={deshabilitar}
                            >
                              {opt.label}
                              {usadosEnOtras.includes(opt.value) ? " (ya asignado)" : ""}
                            </option>
                          );
                        })}
                      </select>

                      <input
                        className={styles.input}
                        placeholder="Nombre del médico tratante"
                        value={item.medico}
                        required
                        onChange={(e) =>
                          handleAseguradoFieldChange(enf.id, idx, "medico", e.target.value)
                        }
                      />

                      <input
                        className={styles.input}
                        placeholder="Institución médica"
                        value={item.institucion}
                        required
                        onChange={(e) =>
                          handleAseguradoFieldChange(enf.id, idx, "institucion", e.target.value)
                        }
                      />

                      <input
                        className={styles.input}
                        placeholder="EPS"
                        value={item.eps}
                        required
                        onChange={(e) =>
                          handleAseguradoFieldChange(enf.id, idx, "eps", e.target.value)
                        }
                      />

                      {idx > 0 && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => handleRemoveInput(enf.id, idx)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {enf.asegurados.length < asegurados.length && (
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => handleAddInput(enf.id)}
                    >
                      + Agregar
                    </button>
                  )}

                  {enfermedadErrors[enf.id] && (
                    <div className={styles.errorBox}>
                      ⚠️ Complete todos los campos de la enfermedad
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
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
    </div>
  );
};

export default Step5V;
