import React, { useState, useEffect } from "react";
import styles from './StepsCSS.module.css';
import { obtenerDepartamentos, obtenerCiudadesPorDepartamento } from "../../../Services/ComboxService";
import { useChoices } from "../../../hooks/useChoices";

const Step1 = ({ onNext, initialData = {} }) => {
  const [formData, setFormData] = useState({
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    nombreCompleto: '',
    genero: '',
    estadoCivil: '',
    cantidadHijos: '',
    departamento: '',
    departamentoId: '',
    ciudadCorrespondencia: '',
    ciudadId: '',
    telefono: '',
    direccion: '',
    tipoDireccion: '',
    fechaNacimiento: '',
    plan: '',
    urgencias: '',
    consulta: ''
  });

  const [activeField, setActiveField] = useState(null);

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Inicializar Choices.js para los selects
  const { selectRef: departamentoSelectRef } = useChoices(departamentos.length);
  const { selectRef: ciudadSelectRef } = useChoices(ciudades.length);
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await obtenerDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error al obtener departamentos");
      }
    };
    fetchDepartamentos();
  }, []);

  // Cargar ciudades cuando cambia el departamentoId
  useEffect(() => {
    if (formData.departamentoId) {
      const fetchCiudades = async () => {
        try {
          const data = await obtenerCiudadesPorDepartamento(formData.departamentoId);
          setCiudades(data);
        } catch (error) {
          console.error("Error al obtener ciudades");
        }
      };
      fetchCiudades();
    } else {
      setCiudades([]);
    }
  }, [formData.departamentoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores de validación cuando el usuario interactúa
    if (showValidationErrors) {
      setShowValidationErrors(false);
    }
  };

  const handleDepartamentoChange = (e) => {
    const id = e.target.value;
    const selectedDep = departamentos.find(dep => dep.id.toString() === id);

    setFormData(prev => ({
      ...prev,
      departamento: selectedDep ? selectedDep.nombre : "",
      departamentoId: id,
      ciudadCorrespondencia: "",
      ciudadId: ""
    }));
  };

  const handleCiudadChange = (e) => {
    const id = e.target.value;
    const selectedCity = ciudades.find(c => c.id.toString() === id);

    setFormData(prev => ({
      ...prev,
      ciudadCorrespondencia: selectedCity ? selectedCity.nombre : "",
      ciudadId: id
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: ambas respuestas deben ser "Sí"
    if (formData.urgencias !== "Sí" || formData.consulta !== "Sí") {
      setShowValidationErrors(true);
      return;
    }

    onNext(formData);
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>Datos Personales</h3>

      <form className={styles.formGrid} onSubmit={handleSubmit}>

        <div className={`${styles.formGroup} ${styles.span1}`}>
          <label htmlFor="tipoIdentificacion">Tipo de identificación</label>
          <select
            className={styles.select}
            id="tipoIdentificacion"
            name="tipoIdentificacion"
            value={formData.tipoIdentificacion}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="T.I">T.I</option>
            <option value="C.C">C.C</option>
            <option value="C.E">C.E</option>
            <option value="P.A">P.A</option>
            <option value="P.P">P.P</option>
            <option value="PPT">P.P.T</option>
          </select>
        </div>

        <div className={`${styles.formGroup} ${styles.span1}`}>
          <label htmlFor="numeroIdentificacion">Número de identificación</label>
          <input
            type="text"
            id="numeroIdentificacion"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleInputChange}
            //onFocus={() => setActiveField("numeroIdentificacion")}
            maxLength={15}
            minLength={5}
            placeholder="Identificación"
            className={styles.input}
            required
          />
        </div>

        <div className={`${styles.formGroup} ${styles.span2}`}>
          <label htmlFor="nombreCompleto">Nombre Completo</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            placeholder="Nombre y Apellido"
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+"
            minLength={3}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="genero">Género</label>
          <select
            id="genero"
            className={styles.select}
            name="genero"
            value={formData.genero}
            required
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="estadoCivil">Estado civil</label>
          <select
            id="estadoCivil"
            className={styles.select}
            name="estadoCivil"
            value={formData.estadoCivil}
            required
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Separado">Separado</option>
            <option value="UnionLibre">Union Libre</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cantidadHijos">Cantidad de Hijos</label>
          <input
            type="number"
            id="cantidadHijos"
            name="cantidadHijos"
            value={formData.cantidadHijos}
            onChange={handleInputChange}
            min={0}
            max={20}
            placeholder="Hijos"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="departamento">Departamento</label>
          <select
            ref={departamentoSelectRef}
            id="departamento"
            name="departamentoId"
            value={formData.departamentoId}
            onChange={handleDepartamentoChange}
            required
            className={styles.select}
          >
            <option value="">Seleccione...</option>
            {departamentos.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ciudadCorrespondencia">Ciudad Correspondencia</label>
          <select
            ref={ciudadSelectRef}
            id="ciudadCorrespondencia"
            name="ciudadId"
            value={formData.ciudadId}
            onChange={handleCiudadChange}
            required
            className={styles.select}
          >
            <option value="">Seleccione...</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="Teléfono"
            //onFocus={() => setActiveField("telefono")}
            minLength={7}
            maxLength={10}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
            placeholder="Dirección"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tipoDireccion">Tipo de dirección</label>
          <select
            id="tipoDireccion"
            className={styles.select}
            name="tipoDireccion"
            required
            value={formData.tipoDireccion}
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            <option value="residencia">Residencia</option>
            <option value="trabajo">Trabajo</option>
            <option value="Otra">Otra</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fechaNacimiento">Fecha de Ingreso a la Empresa</label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            required
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split("T")[0]}
            className={styles.input}
          />
        </div>

        <div className={`${styles.radioGroup} ${styles.span2} ${showValidationErrors && formData.urgencias !== 'Sí' ? styles.radioGroupError : ''}`}>
          <label>Urgencias por enfermedad</label>
          <div>
            <label>
              <input
                type="radio"
                name="urgencias"
                value="Sí"
                checked={formData.urgencias === 'Sí'}
                onChange={handleInputChange}
                required
              /> Sí
            </label>
            <label>
              <input
                type="radio"
                name="urgencias"
                value="No"
                checked={formData.urgencias === 'No'}
                onChange={handleInputChange}
                className={showValidationErrors && formData.urgencias === 'No' ? styles.radioError : ''}
              /> No
            </label>
          </div>
          {showValidationErrors && formData.urgencias !== 'Sí' && (
            <span className={styles.errorMessage}>
              {!formData.urgencias ? 'Debe seleccionar una respuesta' : 'Debe seleccionar "Sí" para continuar'}
            </span>
          )}
        </div>

        <div className={`${styles.radioGroup} ${showValidationErrors && formData.consulta !== 'Sí' ? styles.radioGroupError : ''}`}>
          <label>Consulta externa</label>
          <div>
            <label>
              <input
                type="radio"
                name="consulta"
                value="Sí"
                checked={formData.consulta === 'Sí'}
                onChange={handleInputChange}
                required
              /> Sí
            </label>
            <label>
              <input
                type="radio"
                name="consulta"
                value="No"
                checked={formData.consulta === 'No'}
                onChange={handleInputChange}
                className={showValidationErrors && formData.consulta === 'No' ? styles.radioError : ''}
              /> No
            </label>
          </div>
          {showValidationErrors && formData.consulta !== 'Sí' && (
            <span className={styles.errorMessage}>
              {!formData.consulta ? 'Debe seleccionar una respuesta' : 'Debe seleccionar "Sí" para continuar'}
            </span>
          )}
        </div>

        <div>
          <button type="submit" className={styles.submitButton}>
            Siguientes preguntas →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;