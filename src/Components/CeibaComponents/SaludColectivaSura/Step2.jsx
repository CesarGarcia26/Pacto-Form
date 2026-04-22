import React, { useState, useEffect } from "react";
import styles from './StepsCSS.module.css';
import { useMemo } from "react";

const CAMPOS_PRINCIPAL = [
  "tipoIdentificacionPrincipal",
  "numeroIdentificacionPrincipal",
  "nombresApellidosPrincipal",
  "parentescoPrincipal",
  "fechaNacimientoPrincipal",
  "sexoPrincipal",
  "estadoCivilPrincipal",
  "pesoKgPrincipal",
  "estaturaCmPrincipal",
  "ocupacionPrincipal",
  "nombreEpsPrincipal",
  "tipoSolicitantePrincipal",
  "valorAseguradoPrincipal",
  "rentaIdealPrincipal",
  "emergenciaEmiPrincipal"
];

const Step2 = ({ onNext, onPrevious, initialData = {}, step1Data }) => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState(() => ({
    solicitantePrincipalSeAgrega: initialData?.solicitantePrincipalSeAgrega || '',
    tipoIdentificacionPrincipal: initialData?.tipoIdentificacionPrincipal || '',
    numeroIdentificacionPrincipal: initialData?.numeroIdentificacionPrincipal || step1Data?.numeroIdentificacion || '',
    nombresApellidosPrincipal: initialData?.nombresApellidosPrincipal || step1Data?.nombreCompleto || '',
    parentescoPrincipal: initialData?.parentescoPrincipal || (step1Data ? "Asegurado principal" : ''),
    fechaNacimientoPrincipal: initialData?.fechaNacimientoPrincipal || step1Data?.fechaNacimiento || '',
    sexoPrincipal: initialData?.sexoPrincipal || '',
    estadoCivilPrincipal: initialData?.estadoCivilPrincipal || step1Data?.estadoCivil || '',
    pesoKgPrincipal: initialData?.pesoKgPrincipal || '',
    estaturaCmPrincipal: initialData?.estaturaCmPrincipal || '',
    ocupacionPrincipal: initialData?.ocupacionPrincipal || '',
    nombreEpsPrincipal: initialData?.nombreEpsPrincipal || '',
    tipoSolicitantePrincipal: initialData?.tipoSolicitantePrincipal || '',
    valorAseguradoPrincipal: initialData?.valorAseguradoPrincipal || '',
    rentaIdealPrincipal: initialData?.rentaIdealPrincipal || '',
    emergenciaEmiPrincipal: initialData?.emergenciaEmiPrincipal || '',
    cantidadPersonasAdicionales: initialData?.cantidadPersonasAdicionales || '',
  }));

  const [error, setError] = useState("");

  const [personasAdicionales, setPersonasAdicionales] = useState(() => {
    if (initialData?.personasAdicionales?.length > 0) {
      return initialData.personasAdicionales;
    }
    if (formData.cantidadPersonasAdicionales) {
      const cantidad = parseInt(formData.cantidadPersonasAdicionales);
      return Array.from({ length: cantidad }, (_, index) => ({
        id: index + 1,
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        nombresApellidos: '',
        parentesco: '',
        fechaNacimiento: '',
        sexo: '',
        estadoCivil: '',
        pesoKg: '',
        estaturaCm: '',
        ocupacion: '',
        nombreEps: '',
        tipoSolicitante: '',
        valorAsegurado: '',
        rentaIdeal: '',
        emergenciaEmi: ''
      }));
    }

    return [];
  });

  useEffect(() => {
    if (
      formData.solicitantePrincipalSeAgrega === 'Sí' &&
      step1Data &&
      Object.keys(step1Data).length > 0
    ) {
      setFormData(prev => ({
        ...prev,
        tipoIdentificacionPrincipal: step1Data.tipoIdentificacion || prev.tipoIdentificacionPrincipal,
        numeroIdentificacionPrincipal: step1Data.numeroIdentificacion || prev.numeroIdentificacionPrincipal,
        nombresApellidosPrincipal: step1Data.nombreCompleto || prev.nombresApellidosPrincipal,
        parentescoPrincipal: "Asegurado principal",
        fechaNacimientoPrincipal: step1Data.fechaNacimiento || prev.fechaNacimientoPrincipal,
        sexoPrincipal: step1Data.genero || prev.sexoPrincipal,
        estadoCivilPrincipal: step1Data.estadoCivil || prev.estadoCivilPrincipal,
      }));
    }
  }, [formData.solicitantePrincipalSeAgrega, step1Data]);

  useEffect(() => {
    if (formData.solicitantePrincipalSeAgrega === "No") {
      setFormData(prev => {
        const limpio = { ...prev };
        CAMPOS_PRINCIPAL.forEach(campo => {
          limpio[campo] = '';
        });
        return limpio;
      });
    }
  }, [formData.solicitantePrincipalSeAgrega]);

  // Efecto para hacer scroll automático cuando se generan formularios
  useEffect(() => {
    if (personasAdicionales.length > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [personasAdicionales.length]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 4000); // ⏱️ 4 segundos (ajusta si quieres)

    return () => clearTimeout(timer); // 🧹 limpieza
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia la cantidad de personas adicionales, generar los formularios
    if (name === 'cantidadPersonasAdicionales') {
      const cantidad = parseInt(value) || 0;
      const nuevasPersonas = Array.from({ length: cantidad }, (_, index) => ({
        id: index + 1,
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        nombresApellidos: '',
        parentesco: '',
        fechaNacimiento: '',
        sexo: '',
        estadoCivil: '',
        pesoKg: '',
        estaturaCm: '',
        ocupacion: '',
        nombreEps: '',
        tipoSolicitante: '', // CAMPO CORREGIDO
        valorAsegurado: '',
        rentaIdeal: '',
        emergenciaEmi: '' // CAMPO CORREGIDO
      }));
      setPersonasAdicionales(nuevasPersonas);
    }
  };

  const solicitantesResumen = useMemo(() => {
    const lista = [];

    if (formData.solicitantePrincipalSeAgrega === "Sí") {
      lista.push({
        numero: 1,
        nombre: formData.nombresApellidosPrincipal || "Asegurado principal",
        genero: formData.sexoPrincipal
      });
    }

    personasAdicionales.forEach((persona, index) => {
      lista.push({
        numero: lista.length + 1,
        nombre: persona.nombresApellidos || `Persona ${index + 1}`,
        genero: persona.sexo
      });
    });

    return lista;
  }, [
    formData.solicitantePrincipalSeAgrega,
    formData.nombresApellidosPrincipal,
    formData.sexoPrincipal,
    personasAdicionales
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const hayPrincipal = formData.solicitantePrincipalSeAgrega === "Sí";
    const hayAdicionales = personasAdicionales.length > 0;

    // 🔴 VALIDACIÓN CLAVE
    if (!hayPrincipal && !hayAdicionales) {
      setError(
        "Debe agregar al menos una persona para continuar."
      );
      return; // ⛔ no avanza
    }

    let dataToSend = {
      solicitantePrincipalSeAgrega: formData.solicitantePrincipalSeAgrega,
      cantidadPersonasAdicionales: formData.cantidadPersonasAdicionales,
      personasAdicionales,
      solicitantesResumen
    };

    if (hayPrincipal) {
      CAMPOS_PRINCIPAL.forEach(campo => {
        dataToSend[campo] = formData[campo];
      });
    }

    onNext(dataToSend);
  };

  const handlePrevious = (e) => {
    e.preventDefault();

    let dataToSend = {
      solicitantePrincipalSeAgrega: formData.solicitantePrincipalSeAgrega,
      cantidadPersonasAdicionales: formData.cantidadPersonasAdicionales,
      personasAdicionales
    };

    if (formData.solicitantePrincipalSeAgrega === "Sí") {
      CAMPOS_PRINCIPAL.forEach(campo => {
        dataToSend[campo] = formData[campo];
      });
    }

    onPrevious(dataToSend);
  };


  const handlePersonaAdicionalChange = (personaId, field, value) => {

    if (field === "parentesco") {

      const relacionesUnicas = ["Madre", "Padre", "Cónyuge"];

      if (relacionesUnicas.includes(value)) {

        const yaExiste = personasAdicionales.some(
          persona =>
            persona.id !== personaId &&
            persona.parentesco === value
        );

        if (yaExiste) {
          setError(`Solo se permite registrar un(a) ${value}.`);
          return; // ⛔ bloquea el cambio
        }
      }
    }

    setPersonasAdicionales(prev =>
      prev.map(persona =>
        persona.id === personaId
          ? { ...persona, [field]: value }
          : persona
      )
    );
  };

  const RELACIONES_UNICAS = ["Madre", "Padre", "Cónyuge"];

  const parentescoDeshabilitado = (personaId, opcion) => {

    if (!RELACIONES_UNICAS.includes(opcion)) return false;

    return personasAdicionales.some(
      persona =>
        persona.id !== personaId &&
        persona.parentesco === opcion
    );
  };


  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>INFORMACIÓN DEL ASEGURADO PRINCIPAL Y SOLICITANTES</h3>

      <p className={styles.sectionSubtitle}>(Si el empleado desea asegurarse debe relacionarse en el cuadro que aparece a continuación)</p>

      <form className={styles.formGrid} onSubmit={handleSubmit}>
        {/* Pregunta si el solicitante principal desea agregarse */}
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          <label>¿El solicitante principal desea agregarse al plan?</label>
          <div>
            <label>
              <input
                type="radio"
                name="solicitantePrincipalSeAgrega"
                value="Sí"
                checked={formData.solicitantePrincipalSeAgrega === 'Sí'}
                onChange={handleInputChange}
                required
              /> Sí
            </label>
            <label>
              <input
                type="radio"
                name="solicitantePrincipalSeAgrega"
                value="No"
                checked={formData.solicitantePrincipalSeAgrega === 'No'}
                onChange={handleInputChange}
              /> No
            </label>
          </div>
        </div>

        {formData.solicitantePrincipalSeAgrega === 'Sí' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="tipoIdentificacionPrincipal">Tipo de identificación</label>
              <select
                className={styles.select}
                id="tipoIdentificacionPrincipal"
                name="tipoIdentificacionPrincipal"
                value={formData.tipoIdentificacionPrincipal}
                onChange={handleInputChange}
                onFocus={() => setActiveField("tipoIdentificacionPrincipal")}
                required
              >
                <option value="">Seleccione...</option>
                <option value="T.I">T.I</option>
                <option value="C.C">C.C</option>
                <option value="C.E">C.E</option>
                <option value="P.A">P.A</option>
                <option value="P.P">P.P</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="numeroIdentificacionPrincipal">Número de identificación</label>
              <input
                type="text"
                id="numeroIdentificacionPrincipal"
                name="numeroIdentificacionPrincipal"
                value={formData.numeroIdentificacionPrincipal}
                onChange={handleInputChange}
                placeholder="Identificación"
                maxLength={15}
                minLength={5}
                className={styles.input}
                required

              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombresApellidosPrincipal">Nombres y Apellidos</label>
              <input
                type="text"
                id="nombresApellidosPrincipal"
                name="nombresApellidosPrincipal"
                value={formData.nombresApellidosPrincipal}
                onChange={handleInputChange}
                placeholder="Nombres y apellidos"
                minLength={3}
                className={styles.input}
                required

              />
            </div>



            <div className={styles.formGroup}>
              <label htmlFor="fechaNacimientoPrincipal">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimientoPrincipal"
                name="fechaNacimientoPrincipal"
                value={formData.fechaNacimientoPrincipal}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split("T")[0]}
                className={styles.input}
                required

              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sexoPrincipal">Sexo</label>
              <select
                id="sexoPrincipal"
                className={styles.select}
                name="sexoPrincipal"
                value={formData.sexoPrincipal}
                required
                onChange={handleInputChange}
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estadoCivilPrincipal">Estado Civil</label>
              <select
                id="estadoCivilPrincipal"
                className={styles.select}
                name="estadoCivilPrincipal"
                value={formData.estadoCivilPrincipal}
                onChange={handleInputChange}
                required

              >
                <option value="">Seleccione...</option>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viudo">Viudo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pesoKgPrincipal">Peso en kg</label>
              <input
                type="number"
                id="pesoKgPrincipal"
                name="pesoKgPrincipal"
                value={formData.pesoKgPrincipal}
                onChange={handleInputChange}
                placeholder="Peso en kg"
                min={1}
                max={500}
                className={styles.input}
                required

              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estaturaCmPrincipal">Estatura en cms</label>
              <input
                type="number"
                id="estaturaCmPrincipal"
                name="estaturaCmPrincipal"
                value={formData.estaturaCmPrincipal}
                onChange={handleInputChange}
                placeholder="Estatura en cms"
                min={30}
                max={250}
                className={styles.input}
                required

              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ocupacionPrincipal">Ocupación</label>
              <input
                type="text"
                id="ocupacionPrincipal"
                name="ocupacionPrincipal"
                value={formData.ocupacionPrincipal}
                onChange={handleInputChange}
                placeholder="Ocupación"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombreEpsPrincipal">Nombre de la EPS a la que está afiliado</label>
              <input
                type="text"
                id="nombreEpsPrincipal"
                name="nombreEpsPrincipal"
                value={formData.nombreEpsPrincipal}
                onChange={handleInputChange}
                placeholder="Nombre EPS"
                required
                className={styles.input}
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="cantidadPersonasAdicionales">¿Cuántas personas desea asegurar?</label>
          <select
            id="cantidadPersonasAdicionales"
            name="cantidadPersonasAdicionales"
            value={formData.cantidadPersonasAdicionales}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">0 personas</option>
            <option value="1">1 persona</option>
            <option value="2">2 personas</option>
            <option value="3">3 personas</option>
            <option value="4">4 personas</option>
            <option value="5">5 personas</option>

          </select>
        </div>

        {formData.cantidadPersonasAdicionales && (
          <>
            <div className={styles.sectionTitle} style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
              Información de las personas a asegurar
            </div>
            {personasAdicionales.map((persona, index) => (
              <div key={persona.id} className={styles.personaAdicional}>
                <h4 className={styles.personaTitle}>Solicitud numero {index + 2}</h4>
                <p>Numero de solicitante: {index + 2} </p>

                <div className={styles.personaGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`tipoIdentificacion-${persona.id}`}>Tipo de identificación</label>
                    <select
                      className={styles.select}
                      id={`tipoIdentificacion-${persona.id}`}
                      value={persona.tipoIdentificacion}
                      required
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'tipoIdentificacion', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="T.I">T.I</option>
                      <option value="C.C">C.C</option>
                      <option value="C.E">C.E</option>
                      <option value="P.A">P.A</option>
                      <option value="P.P">P.P</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`numeroIdentificacion-${persona.id}`}>Número de identificación</label>
                    <input
                      type="text"
                      id={`numeroIdentificacion-${persona.id}`}
                      value={persona.numeroIdentificacion}
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'numeroIdentificacion', e.target.value)}
                      placeholder="Identificación"
                      maxLength={15}
                      minLength={5}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.span2}`}>
                    <label htmlFor={`nombresApellidos-${persona.id}`}>Nombres y Apellidos</label>
                    <input
                      type="text"
                      id={`nombresApellidos-${persona.id}`}
                      value={persona.nombresApellidos}
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'nombresApellidos', e.target.value)}
                      placeholder="Nombres y apellidos"
                      minLength={3}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`parentesco-${persona.id}`}>Parentesco con el afiliado</label>
                    <select
                      id={`parentesco-${persona.id}`}
                      value={persona.parentesco}
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'parentesco', e.target.value)}
                      className={styles.select}
                      required
                    >
                      <option value="">Seleccione...</option>

                      <option
                        value="Cónyuge"
                        disabled={parentescoDeshabilitado(persona.id, "Cónyuge")}
                      >
                        Cónyuge
                      </option>

                      <option value="Hijo(a)">
                        Hijo(a)
                      </option>

                      <option
                        value="Padre"
                        disabled={parentescoDeshabilitado(persona.id, "Padre")}
                      >
                        Padre
                      </option>

                      <option
                        value="Madre"
                        disabled={parentescoDeshabilitado(persona.id, "Madre")}
                      >
                        Madre
                      </option>

                      <option value="Hermano(a)">
                        Hermano(a)
                      </option>

                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`fechaNacimiento-${persona.id}`}>Fecha de Nacimiento</label>
                    <input type="date" id={`fechaNacimiento-${persona.id}`} value={persona.fechaNacimiento}
                      min={new Date(new Date().setFullYear(new Date().getFullYear() - 119))
                        .toISOString()
                        .split("T")[0]}  // Fecha mínima: hoy - 119 años
                      max={new Date().toISOString().split("T")[0]} // Fecha máxima: hoy
                      onChange={(e) =>
                        handlePersonaAdicionalChange(
                          persona.id,
                          "fechaNacimiento",
                          e.target.value
                        )
                      }
                      className={styles.input}
                      required
                    />

                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`sexo-${persona.id}`}>Sexo</label>
                    <select
                      className={styles.select}
                      id={`sexo-${persona.id}`}
                      value={persona.sexo}
                      required
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'sexo', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`estadoCivil-${persona.id}`}>Estado Civil</label>
                    <select
                      className={styles.select}
                      id={`estadoCivil-${persona.id}`}
                      value={persona.estadoCivil}
                      required
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'estadoCivil', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Soltero">Soltero</option>
                      <option value="Casado">Casado</option>
                      <option value="Divorciado">Divorciado</option>
                      <option value="Viudo">Viudo</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`pesoKg-${persona.id}`}>Peso en kg</label>
                    <input
                      type="number"
                      id={`pesoKg-${persona.id}`}
                      value={persona.pesoKg}
                      required
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'pesoKg', e.target.value)}
                      placeholder="Peso en kg"
                      min={1}
                      max={500}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`estaturaCm-${persona.id}`}>Estatura en cms</label>
                    <input
                      type="number"
                      id={`estaturaCm-${persona.id}`}
                      value={persona.estaturaCm}
                      required
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'estaturaCm', e.target.value)}
                      placeholder="Estatura en cms"
                      min={30}
                      max={250}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`ocupacion-${persona.id}`}>Ocupación</label>
                    <input
                      type="text"
                      required
                      id={`ocupacion-${persona.id}`}
                      value={persona.ocupacion}
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'ocupacion', e.target.value)}
                      placeholder="Ocupación"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`nombreEps-${persona.id}`}>Nombre de la EPS a la que está afiliado</label>
                    <input
                      type="text"
                      required
                      id={`nombreEps-${persona.id}`}
                      value={persona.nombreEps}
                      onChange={(e) => handlePersonaAdicionalChange(persona.id, 'nombreEps', e.target.value)}
                      placeholder="Nombre EPS"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.submitButton} onClick={handlePrevious}>
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

export default Step2;