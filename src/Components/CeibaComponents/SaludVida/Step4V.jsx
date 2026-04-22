import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

/* ===== Utilidad mayoría de edad ===== */
const esMayorDeEdad = (fecha) => {
  if (!fecha) return false;

  const hoy = new Date();
  const nacimiento = new Date(fecha);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 18;
};

const Step4V = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState({
    cantidadAsegurados: 0,
    asegurados: [],
  });

  /* ===== Alertas (como Step 10) ===== */
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
  };

  /* ===== Cargar datos previos ===== */
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  /* ===== Cantidad asegurados ===== */
  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);

    setFormData((prev) => {
      let updated = [...prev.asegurados];

      if (value > updated.length) {
        for (let i = updated.length; i < value; i++) {
          updated.push({
            aseguradoIndex: i,
            tipoIdentificacion: "",
            numeroIdentificacion: "",
            nombreCompleto: "",
            correo: "",
            telefono: "",
            parentesco: "",
            fechaNacimiento: "",
            sexo: "",
            peso: "",
            estatura: "",
          });
        }
      } else {
        updated = updated.slice(0, value);
      }

      return {
        ...prev,
        cantidadAsegurados: value,
        asegurados: updated,
      };
    });
  };

  /* ===== Cambios asegurado ===== */
  const handleAseguradoChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      asegurados: prev.asegurados.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  };

  const parentescoOcupado = (parentesco, currentIndex) => {
    return formData.asegurados.some(
      (a, i) => i !== currentIndex && a.parentesco === parentesco
    );
  };

  /* ===== Submit ===== */
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>
        Información de otros Asegurados (Grupo Familiar)
      </h3>

      {/* ===== ALERTA ===== */}
      {showAlert && (
        <div className={styles.alertWarning}>
          {alertMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Cantidad */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>¿Cuántas personas desea agregar?</label>
            <select
              className={styles.input}
              value={formData.cantidadAsegurados}
              onChange={handleCantidadChange}
            >
              <option value="0">Seleccione...</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Asegurados */}
        {formData.asegurados.map((a, i) => (
          <div key={i} className={styles.personaAdicional}>
            <h4 className={styles.personaTitle}>Asegurado {i + 2}</h4>

            <div className={styles.personaGrid}>
              {/* Tipo ID */}
              <div className={styles.formGroup}>
                <label>Tipo identificación</label>
                <select
                  className={styles.input}
                  value={a.tipoIdentificacion}
                  onChange={(e) =>
                    handleAseguradoChange(i, "tipoIdentificacion", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="C.C">C.C</option>
                  <option value="C.E">C.E</option>
                  <option value="P.A">P.A</option>
                </select>
              </div>

              {/* Número ID */}
              <div className={styles.formGroup}>
                <label>Número identificación</label>
                <input
                  type="text"
                  className={styles.input}
                  value={a.numeroIdentificacion}
                  onChange={(e) =>
                    handleAseguradoChange(
                      i,
                      "numeroIdentificacion",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  minLength={6}
                  maxLength={15}
                  required
                />
              </div>

              {/* Nombre */}
              <div className={`${styles.formGroup} ${styles.span2}`}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={a.nombreCompleto}
                  onChange={(e) =>
                    handleAseguradoChange(i, "nombreCompleto", e.target.value)
                  }
                  required
                />
              </div>

              {/* Correo */}
              <div className={styles.formGroup}>
                <label>Correo electrónico</label>
                <input
                  type="email"
                  className={styles.input}
                  value={a.correo}
                  onChange={(e) =>
                    handleAseguradoChange(i, "correo", e.target.value)
                  }
                  required
                />
              </div>

              {/* Teléfono */}
              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={a.telefono}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 10) {
                      handleAseguradoChange(i, "telefono", v);
                    }
                  }}
                  required
                />
              </div>

              {/* Parentesco */}
              <div className={styles.formGroup}>
                <label>Parentesco</label>
                <select
                  className={styles.input}
                  value={a.parentesco}
                  onChange={(e) =>
                    handleAseguradoChange(i, "parentesco", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione...</option>

                  <option
                    value="Cónyuge"
                    disabled={parentescoOcupado("Cónyuge", i)}
                  >
                    Cónyuge
                  </option>

                  <option value="Hijo(a)">
                    Hijo(a)
                  </option>

                  <option
                    value="Padre"
                    disabled={parentescoOcupado("Padre", i)}
                  >
                    Padre
                  </option>

                  <option
                    value="Madre"
                    disabled={parentescoOcupado("Madre", i)}
                  >
                    Madre
                  </option>

                  <option value="Hermano(a)">
                    Hermano(a)
                  </option>
                </select>

              </div>

              {/* Fecha nacimiento */}
              <div className={styles.formGroup}>
                <label>Fecha nacimiento</label>
                <input
                  type="date"
                  className={styles.input}
                  value={a.fechaNacimiento}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    handleAseguradoChange(i, "fechaNacimiento", e.target.value)
                  }
                  onBlur={() => {
                    handleAseguradoChange(i, "fechaTouched", true);

                    if (a.fechaNacimiento && !esMayorDeEdad(a.fechaNacimiento)) {
                      triggerAlert(
                        "El asegurado debe ser mayor de edad (18 años o más)."
                      );
                    }
                  }}
                  required
                />
              </div>

              {/* Sexo */}
              <div className={styles.formGroup}>
                <label>Sexo</label>
                <select
                  className={styles.input}
                  value={a.sexo}
                  onChange={(e) =>
                    handleAseguradoChange(i, "sexo", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>

              {/* Peso */}
              <div className={styles.formGroup}>
                <label>Peso (kg)</label>
                <input
                  type="number"
                  min="2"
                  max="300"
                  step="0.1"
                  className={styles.input}
                  value={a.peso}
                  onChange={(e) =>
                    handleAseguradoChange(i, "peso", e.target.value)
                  }
                  required
                />
              </div>

              {/* Estatura */}
              <div className={styles.formGroup}>
                <label>Estatura (cm)</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  className={styles.input}
                  value={a.estatura}
                  onChange={(e) =>
                    handleAseguradoChange(i, "estatura", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Botones */}
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

export default Step4V;
