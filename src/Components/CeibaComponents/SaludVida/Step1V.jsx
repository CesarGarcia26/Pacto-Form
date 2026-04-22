import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import { obtenerDepartamentos, obtenerCiudadesPorDepartamento } from "../../../Services/ComboxService";
import { useChoices } from "../../../hooks/useChoices";

const Step1V = ({ onNext, initialData = {} }) => {
  const [formData, setFormData] = useState({
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    nombreCompleto: "",
    sexo: "",
    fechaNacimiento: "",
    peso: "",
    estatura: "",
    departamento: '',
    departamentoId: '',
    ciudadCorrespondencia: '',
    ciudadId: '',
    telefono: "",
    celular: "",
    direccion: "",
    correo: "",
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  
  // Inicializar Choices.js para los selects
  const { selectRef: departamentoSelectRef } = useChoices(departamentos.length);
  const { selectRef: ciudadSelectRef } = useChoices(ciudades.length);
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

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>Datos Personales</h3>
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        {/* Tipo de identificación */}
        <div className={styles.formGroup}>
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
            <option value="C.C">C.C</option>
            <option value="C.E">C.E</option>
            <option value="P.A">P.A</option>
          </select>
        </div>

        {/* Número de identificación */}
        <div className={styles.formGroup}>
          <label htmlFor="numeroIdentificacion">Número de identificación</label>
          <input
            type="text"
            id="numeroIdentificacion"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleInputChange}
            maxLength={15}
            minLength={5}
            placeholder="Identificación"
            className={styles.input}
            required
          />
        </div>

        {/* Nombre completo */}
        <div className={`${styles.formGroup} ${styles.span2}`}>
          <label htmlFor="nombreCompleto">Nombre Completo</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
            placeholder="Nombre"
            pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+"
            minLength={3}
            className={styles.input}
            required
          />
        </div>

        {/* Sexo */}
        <div className={styles.formGroup}>
          <label htmlFor="sexo">Sexo</label>
          <select
            id="sexo"
            className={styles.select}
            name="sexo"
            value={formData.sexo}
            required
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        {/* Fecha de nacimiento */}
        <div className={styles.formGroup}>
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            required
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          max={maxBirthDate}
          min={minBirthDate}
            className={styles.input}
          />
        </div>

        {/* Peso */}
        <div className={styles.formGroup}>
          <label htmlFor="peso">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            min={1}
            max={500}
            placeholder="Kg"
            className={styles.input}
            required
          />
        </div>

        {/* Estatura */}
        <div className={styles.formGroup}>
          <label htmlFor="estatura">Estatura (cms)</label>
          <input
            type="number"
            id="estatura"
            name="estatura"
            value={formData.estatura}
            onChange={handleInputChange}
            min={30}
            max={250}
            placeholder="Cms"
            className={styles.input}
            required
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

        {/* Teléfono */}
        <div className={styles.formGroup}>
          <label htmlFor="telefono">Teléfono (sin indicativos)</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="Teléfono"
            minLength={7}
            maxLength={10}
            className={styles.input}
            required
          />
        </div>

        {/* Celular */}
        <div className={styles.formGroup}>
          <label htmlFor="celular">Celular</label>
          <input
            type="text"
            id="celular"
            name="celular"
            value={formData.celular}
            onChange={handleInputChange}
            placeholder="Celular"
            minLength={10}
            maxLength={10}
            className={styles.input}
            required
          />
        </div>

        {/* Dirección */}
        <div className={`${styles.formGroup} ${styles.span2}`}>
          <label htmlFor="direccion">Dirección de Correspondencia</label>
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

        {/* Correo */}
        <div className={`${styles.formGroup} ${styles.span2}`}>
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            placeholder="correo@ejemplo.com"
            className={styles.input}
          />
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

export default Step1V;
