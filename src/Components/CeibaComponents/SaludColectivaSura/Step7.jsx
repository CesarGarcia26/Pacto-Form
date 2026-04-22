import React, { useState, useEffect } from "react";
import styles from './StepsCSS.module.css';
import ShowMessage from "../../../Config/ShowMessage";


const Step7 = ({ onNext, onPrevious, initialData, cantidadPersonasAdicionales, solicitantePrincipalSeAgrega, solicitantesResumen }) => {
  const [formData, setFormData] = useState(() => ({
    practicaDeportes: initialData?.practicaDeportes || "",

    deportes: initialData?.deportes?.length > 0
      ? initialData.deportes
      : [{ quien: "", deporte: "", frecuencia: "" }],

    consumeDrogas: initialData?.consumeDrogas || "",
    personasDrogas: initialData?.personasDrogas?.length > 0
      ? initialData.personasDrogas
      : [{ nombre: "" }],

    embarazo: initialData?.embarazo || "",
    personasEmbarazo: initialData?.personasEmbarazo?.length > 0
      ? initialData.personasEmbarazo
      : [{ nombre: "", numero: "" }],

    covid: initialData?.covid || "",
    personasCovid: initialData?.personasCovid?.length > 0
      ? initialData.personasCovid
      : [{ requerioUCI: "" }],

    // NUEVA SECCIÓN: Fumador y/o bebidas embriagantes
    fumadorBebidas: initialData?.fumadorBebidas || "",
    personasFumadorBebidas: initialData?.personasFumadorBebidas?.length > 0
      ? initialData.personasFumadorBebidas
      : [{ nombre: "", cantidad: "", frecuencia: "" }],
  }));


  const solicitantes = Array.isArray(solicitantesResumen)
    ? solicitantesResumen
    : [];

  const totalPersonas =
    Number(cantidadPersonasAdicionales) +
    (solicitantePrincipalSeAgrega === "Sí" ? 1 : 0);

  const solicitantesMujeres = solicitantes.filter(
    s => String(s.genero).toLowerCase() === "femenino");

  useEffect(() => {
    if (solicitantesMujeres.length === 0 && formData.embarazo === "si") {
      setFormData(prev => ({
        ...prev,
        embarazo: "no",
        personasEmbarazo: [{ nombre: "", numero: "" }],
      }));
    }
  }, [solicitantesMujeres.length, formData.embarazo]);

  const handleEmbarazoChange = (value) => {
    const hayMujeres = solicitantesMujeres.length > 0;

    if (value === "si" && !hayMujeres) {
      ShowMessage(
        "alerta",
        "No existen solicitantes de sexo femenino, por lo tanto no es posible marcar embarazo."
      );

      setFormData(prev => ({
        ...prev,
        embarazo: "no",
        personasEmbarazo: [{ nombre: "", numero: "" }],
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      embarazo: value,
      personasEmbarazo:
        value === "no"
          ? [{ nombre: "", numero: "" }]
          : prev.personasEmbarazo,
    }));
  };

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    const updated = [...formData[section]];
    updated[index][name] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const handleAdd = (section, newItem) => {
    if (formData[section].length < totalPersonas) {
      setFormData(prevData => ({
        ...prevData,
        [section]: [...prevData[section], newItem],
      }));
    }
  };

  const handleRemove = (section, index) => {
    if (formData[section].length > 1) {
      const updated = formData[section].filter((_, i) => i !== index);
      setFormData({ ...formData, [section]: updated });
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onNext(formData);
  };

  const getSelectedSolicitantes = (section, currentIndex, field = "numero") => {
    return formData[section]
      .filter((_, i) => i !== currentIndex)
      .map(item => String(item[field]))
      .filter(Boolean);
  };


  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>

      {formData.practicaDeportes === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.deportes.map((item, index) => (
            <div key={index} className={styles.inputRow}>
              <input
                className={styles.input}
                type="text"
                name="quien"
                placeholder="Nombre"
                value={item.quien}
                onChange={(e) => handleChange(e, "deportes", index)}
                required
              />
              <input
                className={styles.input}
                type="text"
                name="deporte"
                placeholder="Deporte"
                value={item.deporte}
                onChange={(e) => handleChange(e, "deportes", index)}
                required
              />
              <input
                className={styles.input}
                type="text"
                name="frecuencia"
                placeholder="Frecuencia"
                value={item.frecuencia}
                onChange={(e) => handleChange(e, "deportes", index)}
                required
              />
              {formData.deportes.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove("deportes", index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("deportes", { quien: "", deporte: "", frecuencia: "" })}
            disabled={formData.deportes.length >= Number(totalPersonas)}
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}

      {/* Pregunta 2 - Consumo de drogas */}
      <div className={`${styles.radioGroup} ${styles.span1}`}>
        <h4 className={styles.sectionTitle}>
          ¿Alguno de los solicitantes ha consumido o consume marihuana, cocaína u otra droga narcótica?
        </h4>
        <div className={styles.radioOptions}>
          <label>
            <input
              type="radio"
              name="consumeDrogas"
              value="si"
              checked={formData.consumeDrogas === "si"}
              onChange={(e) => setFormData({ ...formData, consumeDrogas: e.target.value })}
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="consumeDrogas"
              value="no"
              checked={formData.consumeDrogas === "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consumeDrogas: e.target.value,
                  personasDrogas: [{ nombre: "", numero: "" }],
                })
              }
            />
            No
          </label>
        </div>
      </div>

      {formData.consumeDrogas === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.personasDrogas.map((item, index) => (
            <div key={index} className={styles.inputRow}>
              <select
                className={styles.input}
                value={item.numero}
                onChange={(e) => {
                  const numero = e.target.value;
                  const solicitante = solicitantes.find(
                    s => String(s.numero) === numero
                  );

                  handleChange(
                    { target: { name: "numero", value: numero } },
                    "personasDrogas",
                    index
                  );

                  handleChange(
                    { target: { name: "nombre", value: solicitante?.nombre || "" } },
                    "personasDrogas",
                    index
                  );
                }}
                required
              >
                <option value="">Seleccione solicitante</option>

                {solicitantes.map((s) => {
                  const used = getSelectedSolicitantes(
                    "personasDrogas",
                    index,
                    "numero"
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>

              {formData.personasDrogas.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove("personasDrogas", index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("personasDrogas", { nombre: "" })}
            disabled={formData.personasDrogas.length >= Number(totalPersonas)}
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}

      {/* Pregunta 3 - Embarazo */}
      <div className={`${styles.radioGroup} ${styles.span1}`}>
        <h4 className={styles.sectionTitle}>
          ¿Alguna de las solicitantes se encuentra en estado de embarazo?
        </h4>

        <div className={styles.radioOptions}>

          <label>
            <input
              type="radio"
              name="embarazo"
              value="si"
              checked={formData.embarazo === "si"}
              onChange={() => handleEmbarazoChange("si")}
            />
            Sí
          </label>

          <label>
            <input
              type="radio"
              name="embarazo"
              value="no"
              checked={formData.embarazo === "no"}
              onChange={() => handleEmbarazoChange("no")}
            />
            No
          </label>

        </div>
      </div>

      {formData.embarazo === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.personasEmbarazo.map((item, index) => (
            <div key={index} className={styles.inputRow}>
              <select
                className={styles.input}
                value={item.numero}
                onChange={(e) => {
                  const numero = e.target.value;
                  const solicitante = solicitantesMujeres.find(
                    (s) => String(s.numero) === String(numero)
                  );

                  handleChange(
                    {
                      target: {
                        name: "numero",
                        value: numero,
                      },
                    },
                    "personasEmbarazo",
                    index
                  );

                  handleChange(
                    {
                      target: {
                        name: "nombre",
                        value: solicitante?.nombre || "",
                      },
                    },
                    "personasEmbarazo",
                    index
                  );
                }}
                required
              >
                <option value="">Seleccione solicitante</option>
                {solicitantesMujeres.map((s) => {
                  const used = getSelectedSolicitantes(
                    "personasEmbarazo",
                    index,
                    "numero"
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>

              {formData.personasEmbarazo.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove("personasEmbarazo", index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.addButton}
            onClick={() =>
              handleAdd("personasEmbarazo", { nombre: "", numero: "" })
            }
            disabled={
              solicitantesMujeres.length === 0 ||
              formData.personasEmbarazo.length >= totalPersonas
            }
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}

      {/* Pregunta 4 - COVID UCI */}
      <div className={`${styles.radioGroup} ${styles.span1}`}>
        <h4 className={styles.sectionTitle}>
          ¿Alguno de los solicitantes en caso de haber tenido COVID o haber sido diagnosticado con dicha infección, responda: ¿Requirió tratamiento en UCI (unidad de cuidados intensivos) o UCE (unidad de cuidados especiales)?
        </h4>
        <div className={styles.radioOptions}>
          <label>
            <input
              type="radio"
              name="covid"
              value="si"
              checked={formData.covid === "si"}
              onChange={(e) => setFormData({ ...formData, covid: e.target.value })}
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="covid"
              value="no"
              checked={formData.covid === "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  covid: e.target.value,
                  personasCovid: [{ requerioUCI: "" }],
                })
              }
            />
            No
          </label>
        </div>
      </div>

      {formData.covid === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.personasCovid.map((item, index) => (
            <div key={index} className={styles.inputRow}>

              <select
                className={styles.input}
                name="requerioUCI"
                value={item.requerioUCI}
                onChange={(e) => handleChange(e, "personasCovid", index)}
                required
              >
                <option value="">Seleccione solicitante</option>
                {solicitantes.map((s) => {
                  const used = getSelectedSolicitantes(
                    "personasCovid",
                    index,
                    "requerioUCI"
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>

              {formData.personasCovid.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove("personasCovid", index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.addButton}
            onClick={() => handleAdd("personasCovid", { requerioUCI: "" })}
            disabled={formData.personasCovid.length >= totalPersonas}
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}


      {/* NUEVA PREGUNTA - Fumador/Bebidas */}
      <div className={`${styles.radioGroup} ${styles.span1}`}>
        <h4 className={styles.sectionTitle}>
          ¿Alguno de los solicitantes es fumador y/o consume bebidas embriagantes?
        </h4>
        <div className={styles.radioOptions}>
          <label>
            <input
              type="radio"
              name="fumadorBebidas"
              value="si"
              checked={formData.fumadorBebidas === "si"}
              onChange={(e) => setFormData({ ...formData, fumadorBebidas: e.target.value })}
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="fumadorBebidas"
              value="no"
              checked={formData.fumadorBebidas === "no"}
              onChange={(e) => setFormData({
                ...formData,
                fumadorBebidas: e.target.value,
                personasFumadorBebidas: [{ nombre: "", cantidad: "", frecuencia: "" }],
              })}
            />
            No
          </label>
        </div>
      </div>

      {formData.fumadorBebidas === "si" && (
        <div className={`${styles.radioGroup} ${styles.span1}`}>
          {formData.personasFumadorBebidas.map((item, index) => (
            <div key={index} className={styles.inputRow}>

              {/* Solicitante */}
              <select
                className={styles.input}
                name="numero"
                value={item.numero}
                onChange={(e) => {
                  const numero = e.target.value;
                  const solicitante = solicitantes.find(
                    s => String(s.numero) === numero
                  );

                  handleChange(
                    { target: { name: "numero", value: numero } },
                    "personasFumadorBebidas",
                    index
                  );

                  handleChange(
                    { target: { name: "nombre", value: solicitante?.nombre || "" } },
                    "personasFumadorBebidas",
                    index
                  );
                }}
                required
              >
                <option value="">Seleccione solicitante</option>
                {solicitantes.map((s) => {
                  const used = getSelectedSolicitantes(
                    "personasFumadorBebidas",
                    index,
                    "numero"
                  ).includes(String(s.numero));

                  return (
                    <option key={s.numero} value={s.numero} disabled={used}>
                      {s.numero} - {s.nombre}
                    </option>
                  );
                })}
              </select>

              {/* Cantidad */}
              <input
                className={styles.input}
                type="text"
                name="cantidad"
                placeholder="Cantidad Ej: 2 cigarrillos / 3 cervezas"
                value={item.cantidad}
                onChange={(e) =>
                  handleChange(e, "personasFumadorBebidas", index)
                }
                required
              />

              {/* Frecuencia */}
              <select
                className={styles.input}
                name="frecuencia"
                value={item.frecuencia}
                onChange={(e) =>
                  handleChange(e, "personasFumadorBebidas", index)
                }
                required
              >
                <option value="">Seleccione frecuencia</option>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="ocasional">Ocasional</option>
              </select>

              {/* Eliminar */}
              {formData.personasFumadorBebidas.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    handleRemove("personasFumadorBebidas", index)
                  }
                  title="Eliminar solicitante"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Agregar */}
          <button
            type="button"
            className={styles.addButton}
            onClick={() =>
              handleAdd("personasFumadorBebidas", {
                nombre: "",
                cantidad: "",
                frecuencia: "",
              })
            }
            disabled={
              formData.personasFumadorBebidas.length >= Number(totalPersonas)
            }
          >
            ＋ Agregar solicitante
          </button>
        </div>
      )}

      {/* Botones de navegación */}
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.submitButton} onClick={handlePrevious}>
          ← Preguntas anteriores
        </button>
        <button type="submit" className={styles.submitButton}>
          Siguientes preguntas →
        </button>
      </div>

    </form>
  );
};

export default Step7;
