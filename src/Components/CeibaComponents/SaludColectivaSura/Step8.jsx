import React, { useState, useEffect, useRef } from "react";
import styles from "./StepsCSS.module.css";
import { obtenerEnfermedades } from "../../../Services/ComboxService";
import Choices from "choices.js";

const Step8 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen, step2Data, }) => {
  const [formData, setFormData] = useState(() => ({
    mujeres: initialData?.mujeres || "nodvb",
    mujeresInfo:
      initialData?.mujeresInfo?.length > 0 ? initialData.mujeresInfo : [],
    historial: initialData?.historial || "no",
    historialFamilia:
      initialData?.historialFamilia?.length > 0
        ? initialData.historialFamilia
        : [],
  }));
  const [showGenderWarning, setShowGenderWarning] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [enfermedades, setEnfermedades] = useState([]);
  const enfermedadRefs = useRef([]);

  const totalPersonas = (solicitantePrincipalSeAgrega === "Sí" ? 1 : 0) + Number(cantidadPersonasAdicionales);

  useEffect(() => {
    enfermedadRefs.current.forEach((ref) => {
      if (!ref) return;

      // 🔥 Evitar duplicar instancias
      if (ref.choicesInstance) {
        ref.choicesInstance.destroy();
      }

      ref.choicesInstance = new Choices(ref, {
        searchEnabled: true,
        shouldSort: false,
        itemSelectText: "",
        position: "bottom",
        searchResultLimit: 20,

        // ✅ Texto en español
        noResultsText: "No se encontraron resultados",
        noChoicesText: "No hay opciones disponibles",
        loadingText: "Cargando enfermedades...",
      });
    });

    // 🧹 Cleanup al desmontar
    return () => {
      enfermedadRefs.current.forEach((ref) => {
        if (ref?.choicesInstance) {
          ref.choicesInstance.destroy();
          ref.choicesInstance = null;
        }
      });
    };
  }, [enfermedades, formData.historialFamilia.length]);


  // 👉 Obtener enfermedades
  useEffect(() => {
    const fetchEnfermedades = async () => {
      try {
        const data = await obtenerEnfermedades();
        setEnfermedades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener enfermedades", error);
      }
    };

    fetchEnfermedades();
  }, []);


  // Verificar si hay mujeres registradas en Step2
  const hayMujeresRegistradas = () => {
    const sexos = [];

    // Agregar sexo del principal si se agregó
    if (solicitantePrincipalSeAgrega === "Sí" && step2Data?.sexoPrincipal) {
      sexos.push(step2Data.sexoPrincipal);
    }

    // Agregar sexos de personas adicionales
    if (step2Data?.personasAdicionales?.length > 0) {
      step2Data.personasAdicionales.forEach(persona => {
        if (persona.sexo) {
          sexos.push(persona.sexo);
        }
      });
    }

    // Verificar si hay al menos una mujer
    return sexos.some(sexo => sexo === "Femenino");
  };

  useEffect(() => {
    const hayMujeres = hayMujeresRegistradas();

    if (!hayMujeres) {
      // 🔒 Si no hay mujeres, forzamos NO y mostramos alerta
      setFormData((prev) => ({
        ...prev,
        mujeres: "no",
        mujeresInfo: [],
      }));
      setShowGenderWarning(true);
    } else {
      // 👌 Hay mujeres → no tocar la selección del usuario
      setShowGenderWarning(false);
    }
  }, [step2Data, solicitantePrincipalSeAgrega]);

  const solicitantes = Array.isArray(solicitantesResumen)
    ? solicitantesResumen
    : [];

  const mujeresSolicitantes = (() => {
    const lista = [];

    // Principal
    if (
      solicitantePrincipalSeAgrega === "Sí" &&
      step2Data?.sexoPrincipal === "Femenino"
    ) {
      lista.push({
        id: "principal",
        nombre: step2Data?.nombresApellidosPrincipal || "",
      });
    }

    // Adicionales
    if (step2Data?.personasAdicionales?.length > 0) {
      step2Data.personasAdicionales.forEach((p, i) => {
        if (p.sexo === "Femenino") {
          lista.push({
            id: `adicional-${i}`,
            nombre: p.nombresApellidos || "",
          });
        }
      });
    }

    return lista;
  })();

  const getMujeresSeleccionadas = (currentIndex) => {
    return formData.mujeresInfo
      .filter((_, i) => i !== currentIndex)
      .map((m) => m.nombreSolicitantem)
      .filter(Boolean);
  };


  // 👉 Manejo general de inputs simples
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mujeres" && value === "no") {
      setFormData((prev) => ({
        ...prev,
        mujeres: "no",
        mujeresInfo: [],
      }));
      return;
    }

    // Si selecciona "si" en mujeres, verificar que haya mujeres registradas
    if (name === "mujeres" && value === "si") {
      if (!hayMujeresRegistradas()) {
        setShowGenderWarning(true);
        setFormData((prev) => ({ ...prev, [name]: "no" }));
        return;
      } else {
        setShowGenderWarning(false);
      }
    }

    if (name === "historial" && value === "no") {
      setFormData((prev) => ({
        ...prev,
        historial: "no",
        historialFamilia: [],
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 Manejo de cantidad de mujeres
  const handleCantidadMujeres = (e) => {
    const cantidad = parseInt(e.target.value);

    setFormData((prev) => ({
      ...prev,
      mujeresInfo: Array(cantidad)
        .fill(null)
        .map(
          (_, i) =>
            prev.mujeresInfo[i] || {
              nombreSolicitantem: "",
              citologia: "no",
              fecha: "",
              medicoTratante: "",
              resultados: "",
              centroMedico: "",
            }
        ),
    }));

    // 🧹 Limpiar error cuando el usuario corrige
    if (validationErrors.mujeresCantidad) {
      const newErrors = { ...validationErrors };
      delete newErrors.mujeresCantidad;
      setValidationErrors(newErrors);
    }
  };

  // 👉 Manejo de inputs de cada mujer
  const handleMujerInfoChange = (i, field, value) => {
    const newInfo = [...formData.mujeresInfo];

    // Si selecciona "NO" en citología → limpiar campos dependientes
    if (field === "citologia" && value === "no") {
      newInfo[i] = {
        ...newInfo[i],
        citologia: "no",
        fecha: "",
        medicoTratante: "",
        centroMedico: "",
        resultados: "",
      };
    } else {
      newInfo[i] = {
        ...newInfo[i],
        [field]: value,
      };
    }

    setFormData((prev) => ({
      ...prev,
      mujeresInfo: newInfo,
    }));
  };

  const aseguradosOptions = Array.isArray(solicitantesResumen)
    ? solicitantesResumen.map((s, index) => ({
      value: index + 1, // número del asegurado
      label: `${index + 1} - ${s.nombre || s.nombresApellidos || ""}`,
    }))
    : [];

  // 👉 Manejo de enfermedades
  const handleEnfermedadChange = (index, enfermedadId) => {
    const idNumerico = Number(enfermedadId);

    const selectedEnf = enfermedades.find(
      (e) => e.id === idNumerico
    );

    setFormData((prev) => {
      const newHistorial = [...prev.historialFamilia];

      newHistorial[index] = {
        ...newHistorial[index],
        enfermedadId: idNumerico,     // ✅ número
        enfermedad: selectedEnf?.nombre || "", // ✅ nombre correcto
      };

      return {
        ...prev,
        historialFamilia: newHistorial,
      };
    });
  };


  // 👉 Manejo de cantidad historial familiar
  const handleCantidadHistorial = (e) => {
    const cantidad = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      historialFamilia: Array(cantidad)
        .fill(null)
        .map(
          (_, i) =>
            prev.historialFamilia[i] || {
              parentesco: "",
              numero: "",
              enfermedadId: null,
              enfermedad: "",
              edadDiagnostico: "",
              causaMuerte: "",
              edadMuerte: "",
            }
        ),
    }));
  };

  // 👉 Manejo de inputs de cada persona en historial
  const handleHistorialChange = (i, field, value) => {
    const newInfo = [...formData.historialFamilia];
    newInfo[i] = { ...newInfo[i], [field]: value };
    setFormData((prev) => ({ ...prev, historialFamilia: newInfo }));

    // Limpiar errores relacionados con este campo cuando el usuario empiece a editar
    if (validationErrors[`${i}-${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`${i}-${field}`];
      setValidationErrors(newErrors);
    }
  };

  // 👉 Validación del grupo familiar
  const validateFamilyHistory = () => {
    if (formData.historial === "no") {
      setValidationErrors({});
      return true;
    }

    const errors = {};

    for (let i = 0; i < formData.historialFamilia.length; i++) {
      const persona = formData.historialFamilia[i];

      // Validar que siempre exista enfermedad seleccionada
      if (!persona.enfermedadId) {
        errors[`${i}-enfermedad`] = "Debe seleccionar una enfermedad obligatoriamente";
      }

      // Validar que la edad de muerte no sea menor que la edad de diagnóstico
      if (persona.edadMuerte && persona.edadDiagnostico) {
        const edadMuerte = parseInt(persona.edadMuerte);
        const edadDiagnostico = parseInt(persona.edadDiagnostico);

        if (edadMuerte < edadDiagnostico) {
          errors[`${i}-edadMuerte`] = `La edad de muerte (${edadMuerte}) no puede ser menor que la edad de diagnóstico (${edadDiagnostico})`;
        }
      }

      // Validar que si se llena uno de los campos de muerte, se llene el otro
      const tieneCausaMuerte = persona.causaMuerte && persona.causaMuerte.trim() !== "";
      const tieneEdadMuerte = persona.edadMuerte && persona.edadMuerte !== "";

      if (tieneCausaMuerte && !tieneEdadMuerte) {
        errors[`${i}-edadMuerte`] = "Si indica la causa de muerte, debe especificar también la edad de muerte";
      }

      if (tieneEdadMuerte && !tieneCausaMuerte) {
        errors[`${i}-causaMuerte`] = "Si indica la edad de muerte, debe especificar también la causa de muerte";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    // ✅ Validar cantidad de mujeres
    if (formData.mujeres === "si" && formData.mujeresInfo.length === 0) {
      errors.mujeresCantidad = "Debe seleccionar cuántas mujeres hay";
    }

    // 🔴 Validar cantidad de personas en historial familiar
    if (formData.historial === "si" && formData.historialFamilia.length === 0) {
      errors.historialCantidad =
        "Debes seleccionar la cantidad de personas";
    }

    // 🔴 Validar enfermedad obligatoria
    if (formData.historial === "si") {
      formData.historialFamilia.forEach((persona, i) => {
        if (!persona.enfermedadId) {
          errors[`${i}-enfermedad`] = true;
        }
      });
    }

    // ❌ Si hay errores → mostrar y limpiar luego
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      // ⏱️ Quitar borde rojo después de 3 segundos
      setTimeout(() => {
        setValidationErrors({});
      }, 3000);

      return;
    }

    // 👉 Validaciones existentes
    if (!validateFamilyHistory()) return;

    setValidationErrors({});
    onNext(formData);
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.twoColumnSections}>
        {/* Sección mujeres */}
        <div className={styles.sectionBox}>
          <h4 className="sectionTitle">
            Mujeres solicitantes mayores de 18 años
          </h4>

          {/* Pregunta: existen mujeres */}
          <div className="formGrid">
            <div className={`${styles.radioGroup} ${styles.span2}`}>
              <label>¿Existen mujeres mayores de edad entre los solicitantes?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="mujeres"
                    value="si"
                    checked={formData.mujeres === "si"}
                    onChange={handleChange}
                    disabled={!hayMujeresRegistradas()}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="mujeres"
                    value="no"
                    checked={formData.mujeres === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              {showGenderWarning && (
                <p className={styles.warningMessage}>
                  ⚠️ Ninguno de los solicitantes agregados es mujer. Segun la información diligenciada en la página 2.
                </p>
              )}
            </div>
          </div>

          {/* Si hay mujeres → cantidad */}
          {formData.mujeres === "si" && (
            <div className="inputRow">
              <div className={styles.formGroup}>
                <label>¿Cuántas mujeres mayores de edad?</label>
                <select
                  value={formData.mujeresInfo.length}
                  onChange={handleCantidadMujeres}
                  className={styles.input}
                >
                  <option value="0">Seleccione</option>
                  {[...Array(Math.min(mujeresSolicitantes.length, 2))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {validationErrors.mujeresCantidad && (
                  <p className={styles.errorMessage}>
                    ⚠️ {validationErrors.mujeresCantidad}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Fila por cada mujer */}

          {formData.mujeres === "si" &&
            formData.mujeresInfo.map((mujer, index) => (
              <div key={index} className={styles.mujerCard}>
                <h5 className={styles.mujerTitle}>
                  Mujer {index + 1}
                </h5>

                <div className={styles.mujerGrid}>
                  {/* Nombre */}
                  <div className={styles.formGroup}>
                    <label>Solicitante</label>
                    <select
                      className={styles.input}
                      value={mujer.nombreSolicitantem}
                      onChange={(e) =>
                        handleMujerInfoChange(
                          index,
                          "nombreSolicitantem",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Seleccione solicitante</option>
                      {mujeresSolicitantes.map((m) => {
                        const yaUsada = getMujeresSeleccionadas(index).includes(m.nombre);

                        return (
                          <option
                            key={m.id}
                            value={m.nombre}
                            disabled={yaUsada}
                          >
                            {m.nombre}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Citología */}
                  <div className={styles.formGroup}>
                    <label>¿Citología en el último año?</label>
                    <div className={styles.radioInline}>
                      <label>
                        <input
                          type="radio"
                          name={`citologia-${index}`}
                          value="si"
                          checked={mujer.citologia === "si"}
                          onChange={() =>
                            handleMujerInfoChange(index, "citologia", "si")
                          }
                        />
                        Sí
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`citologia-${index}`}
                          value="no"
                          checked={mujer.citologia === "no"}
                          onChange={() =>
                            handleMujerInfoChange(index, "citologia", "no")
                          }
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {/* Fecha */}
                  {mujer.citologia === "si" && (
                    <>
                      {/* Fecha citología */}
                      <div className={`${styles.formGroup} ${styles.span2}`}>
                        <label>Fecha Última Citología</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={mujer.fecha}
                          onChange={(e) =>
                            handleMujerInfoChange(index, "fecha", e.target.value)
                          }
                          required
                        />
                      </div>

                      {/* Médico tratante */}
                      <div className={styles.formGroup}>
                        <label>Nombre Médico Tratante</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={mujer.medicoTratante}
                          onChange={(e) =>
                            handleMujerInfoChange(index, "medicoTratante", e.target.value)
                          }
                          required
                        />
                      </div>

                      {/* Centro médico */}
                      <div className={styles.formGroup}>
                        <label>Centro Médico de Citología</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={mujer.centroMedico}
                          onChange={(e) =>
                            handleMujerInfoChange(index, "centroMedico", e.target.value)
                          }
                          required
                        />
                      </div>

                      {/* Resultados */}
                      <div className={`${styles.formGroup} ${styles.span2}`}>
                        <label>Explique Resultados Citología o Padecimiento</label>
                        <textarea
                          className={styles.textarea}
                          rows="3"
                          value={mujer.resultados}
                          onChange={(e) =>
                            handleMujerInfoChange(index, "resultados", e.target.value)
                          }
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Sección historial familiar */}
        <div className="formGrid">
          <div className={`${styles.radioGroup} ${styles.span2}`}>
            <h3 className="sectionTitle">Antecedentes de historia familiar</h3>
            <label>
              Alguno de sus hermanos(as), padre o madre sufre o ha sufrido alguno
              de los siguientes padecimientos: Enfermedades del corazón,
              hipertensión, enfermedad cerebrovascular, cáncer, enfermedades
              renales, hiperlipidemias, diabetes o cualquier enfermedad hereditaria?
              En caso afirmativo favor diligenciar el siguiente espacio:
            </label>
            <br />
            <div>
              <label>
                <input
                  type="radio"
                  name="historial"
                  value="si"
                  checked={formData.historial === "si"}
                  onChange={handleChange}
                />
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="historial"
                  value="no"
                  checked={formData.historial === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {/* Si hay historial familiar → select */}
          {formData.historial === "si" && (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.span2}`}>
                <label>¿Cuántas personas?</label>
                <select
                  className={styles.selectLarge}
                  value={formData.historialFamilia.length}
                  onChange={handleCantidadHistorial}
                >
                  <option value="0">Seleccione la cantidad de personas</option>
                  {[...Array(4)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {validationErrors.historialCantidad && (
                  <p className={styles.errorMessage}>
                    ⚠️ {validationErrors.historialCantidad}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Formularios por cada persona historial */}
          {formData.historial === "si" &&
            formData.historialFamilia.map((persona, i) => (
              <div key={i} className={styles.personaAdicional}>
                <h4 className={styles.personaTitle}>Persona {i + 1}</h4>
                <div className={styles.personaGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`parentesco-${i}`}>Parentesco con el afiliado</label>
                    <select
                      id={`parentesco-${i}`}
                      value={persona.parentesco}
                      onChange={(e) => handleHistorialChange(i, "parentesco", e.target.value)}
                      className={styles.input}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Cónyuge">Cónyuge</option>
                      <option value="Hijo(a)">Hijo(a)</option>
                      <option value="Padre">Padre</option>
                      <option value="Madre">Madre</option>
                      <option value="Hermano(a)">Hermano(a)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Número del asegurado</label>
                    <select
                      className={styles.input}
                      value={persona.numero}
                      onChange={(e) =>
                        handleHistorialChange(i, "numero", e.target.value)
                      }
                      required
                    >
                      <option value="">Seleccione asegurado</option>

                      {aseguradosOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`enfermedad-${i}`}>Enfermedad</label>

                    <select
                      id={`enfermedad-${i}`}
                      ref={(el) => (enfermedadRefs.current[i] = el)}
                      className={`${styles.input} ${validationErrors[`${i}-enfermedad`] ? styles.inputError : ""
                        }`}
                      value={persona.enfermedadId || ""}
                      onChange={(e) => handleEnfermedadChange(i, e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      {enfermedades.map((enf) => (
                        <option key={enf.id} value={enf.id}>
                          {enf.nombre}
                        </option>
                      ))}
                    </select>

                    {validationErrors[`${i}-enfermedad`] && (
                      <p className={styles.errorMessage}>
                        ⚠️ Debe seleccionar una enfermedad
                      </p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Edad al diagnóstico</label>
                    <input
                      type="number"
                      value={persona.edadDiagnostico}
                      className={styles.input}
                      onChange={(e) =>
                        handleHistorialChange(i, "edadDiagnostico", e.target.value)
                      }
                      placeholder="Edad del diagnóstico"
                      min={0}
                      max={120}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Causa de muerte (si aplica)</label>
                    <input
                      type="text"
                      value={persona.causaMuerte}
                      onChange={(e) =>
                        handleHistorialChange(i, "causaMuerte", e.target.value)
                      }
                      placeholder="Causa de muerte"
                      className={styles.input}
                    />
                    {validationErrors[`${i}-causaMuerte`] && (
                      <p className={styles.errorMessage}>
                        ⚠️ {validationErrors[`${i}-causaMuerte`]}
                      </p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Edad de muerte (si aplica)</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={persona.edadMuerte}
                      onChange={(e) =>
                        handleHistorialChange(i, "edadMuerte", e.target.value)
                      }
                      placeholder="Edad de muerte"
                      min={0}
                      max={120}
                    />
                    {validationErrors[`${i}-edadMuerte`] && (
                      <p className={styles.errorMessage}>
                        ⚠️ {validationErrors[`${i}-edadMuerte`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Botones navegación */}
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

export default Step8;