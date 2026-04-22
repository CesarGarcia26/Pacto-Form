import React, { useState, useEffect } from "react";
import styles from "./StepsVCSS.module.css";
import ShowMessage from "../../../Config/ShowMessage";

const Step3V = ({
  onNext,
  onPrevious,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    cantidadBeneficiarios: 0,
    beneficiarios: [],
    acrecimiento: initialData.acrecimiento || "",
  });

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Manejar la cantidad de beneficiarios
  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => {
      let updatedBeneficiarios = [...prev.beneficiarios];
      if (value > prev.beneficiarios.length) {
        for (let i = prev.beneficiarios.length; i < value; i++) {
          updatedBeneficiarios.push({
            tipoIdentificacion: "",
            numeroIdentificacion: "",
            nombreCompleto: "",
            porcentaje: "",
          });
        }
      } else {
        updatedBeneficiarios.length = value;
      }
      return {
        ...prev,
        cantidadBeneficiarios: value,
        beneficiarios: updatedBeneficiarios,
      };
    });
  };

  // Calcular máximo permitido para cada beneficiario
  const calcularMaxPorcentaje = (index) => {
    const sumaOtros = formData.beneficiarios.reduce(
      (acc, b, i) => (i === index ? acc : acc + Number(b.porcentaje || 0)),
      0
    );
    return Math.max(0, 100 - sumaOtros);
  };

  // Manejar cambios de cada beneficiario con validación
  const handleBeneficiarioChange = (index, field, value) => {
    setFormData((prev) => {
      let nuevoValor = value;
      if (field === "porcentaje") {
        const maxPermitido = calcularMaxPorcentaje(index);
        if (Number(value) > maxPermitido) {
          nuevoValor = maxPermitido;
        }
      }
      const updated = prev.beneficiarios.map((b, i) =>
        i === index ? { ...b, [field]: nuevoValor } : b
      );
      return { ...prev, beneficiarios: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que los porcentajes sumen 100%
    const totalPorcentaje = formData.beneficiarios.reduce(
      (acc, b) => acc + Number(b.porcentaje || 0),
      0
    );

    if (formData.cantidadBeneficiarios > 0 && totalPorcentaje !== 100) {
      ShowMessage("alerta", "Los porcentajes de los beneficiarios deben sumar 100%");
      return;
    }

    onNext(formData);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>
        Información de los Beneficiarios del Afiliado Principal
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Cantidad y acrecimiento en la misma fila */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>¿Cuántas personas desea agregar?</label>
            <select
              className={styles.input}
              value={formData.cantidadBeneficiarios}
              onChange={handleCantidadChange}
              required
            >
              <option value="0">Seleccione...</option>
              {[...Array(6)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

          </div>

          <div className={styles.formGroup}>
            <label className={styles.labelWithTooltip}>
              <span>¿Con derecho a acrecimiento?</span>
            </label>

            <div className={styles.radioOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="acrecimiento"
                  value="Si"
                  checked={formData.acrecimiento === "Si"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, acrecimiento: e.target.value }))
                  }
                  required
                />
                Sí
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="acrecimiento"
                  value="No"
                  checked={formData.acrecimiento === "No"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, acrecimiento: e.target.value }))
                  }
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Formulario dinámico */}
        {formData.beneficiarios.map((b, i) => (
          <div key={i} className={styles.personaAdicional}>
            <h4 className={styles.personaTitle}>Beneficiario {i + 1}</h4>
            <div className={styles.personaGrid}>
              <div className={styles.formGroup}>
                <label>Tipo de identificación</label>
                <select
                  className={styles.input}
                  value={b.tipoIdentificacion}
                  onChange={(e) =>
                    handleBeneficiarioChange(
                      i,
                      "tipoIdentificacion",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="T.I">T.I</option>
                  <option value="C.C">C.C</option>
                  <option value="C.E">C.E</option>
                  <option value="P.A">P.A</option>
                  <option value="P.T">P.P.T</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Número de identificación</label>
                <input
                  type="text"
                  className={styles.input}
                  value={b.numeroIdentificacion}
                  onChange={(e) =>
                    handleBeneficiarioChange(
                      i,
                      "numeroIdentificacion",
                      e.target.value
                    )
                  }
                  placeholder="Identificación"
                  maxLength={15}
                  minLength={5}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.span2}`}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={b.nombreCompleto}
                  onChange={(e) =>
                    handleBeneficiarioChange(i, "nombreCompleto", e.target.value)
                  }
                  placeholder="Nombre"
                  minLength={3}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Porcentaje % (Restante: {calcularMaxPorcentaje(i)}%)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={b.porcentaje}
                  onChange={(e) =>
                    handleBeneficiarioChange(i, "porcentaje", e.target.value)
                  }
                  min="0"
                  max={calcularMaxPorcentaje(i)}
                  placeholder="%"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Mostrar suma total de porcentajes */}
        {formData.cantidadBeneficiarios > 0 && (
          <div className={styles.formGroup}>
            <p>
              <strong>
                Total porcentajes: {' '}
                {formData.beneficiarios.reduce(
                  (acc, b) => acc + Number(b.porcentaje || 0),
                  0
                )}%
              </strong>
              {formData.beneficiarios.reduce(
                (acc, b) => acc + Number(b.porcentaje || 0),
                0
              ) !== 100 && (
                  <span style={{ color: 'red' }}> - Debe sumar 100%</span>
                )}
            </p>
          </div>
        )}

        {/* Botones */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handlePrevious}
          >
            ← Preguntas anteriores
          </button>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Siguientes preguntas →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3V;