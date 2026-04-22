import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StepsVCSS.module.css";
import { useFormDataSaludVidaService } from "../../../Services/FormDataSaludVidaService";
import ShowMessage from "../../../Config/ShowMessage";
import SignatureCanvas from "react-signature-canvas";

const Step13V = ({
  onNext,
  onPrevious,
  initialData = {},
  step1VData,
  step2VData,
  step3VData,
  step4VData,
  step5VData,
  step6VData,
  step7VData,
  step8VData,
  step9VData,
  step10VData,
  step11VData,
  step12VData
}) => {

  const sigCanvas = useRef(null);
  const fileInputRef = useRef(null);

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const [firmaAceptada, setFirmaAceptada] = useState(false);
  const [firmaDesdeImagen, setFirmaDesdeImagen] = useState(false);
  const [firmaModalPreview, setFirmaModalPreview] = useState(null);


  const [formData, setFormData] = useState(() => ({
    vacunadoCovid: initialData?.vacunadoCovid || "",
    vacunadoAsegurados: initialData?.vacunadoAsegurados?.length > 0
      ? initialData.vacunadoAsegurados
      : [{ numeroAsegurado: "", na: false }],
    autorizacionTratamiento: initialData?.autorizacionTratamiento || "",
    firma: initialData?.firma || null, // 👈 FIRMA
  }));

  const handleOpenSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { sendFormDataSaludVida } = useFormDataSaludVidaService();

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        vacunadoCovid: initialData?.vacunadoCovid || "",
        vacunadoAsegurados: initialData?.vacunadoAsegurados?.length > 0
          ? initialData.vacunadoAsegurados
          : [{ numeroAsegurado: "", na: false }],
        autorizacionTratamiento: initialData?.autorizacionTratamiento || ""
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.vacunadoCovid === "No") {
      setFormData(prev => ({
        ...prev,
        vacunadoAsegurados: [{ numeroAsegurado: "", na: false }]
      }));
    }
  }, [formData.vacunadoCovid]);

  const handleFinalizarClick = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!firmaAceptada) {
      ShowMessage("alerta", "Debe agregar y aceptar la firma para continuar.");
      return;
    }

    if (formData.autorizacionTratamiento !== "Sí") {
      ShowMessage(
        "alerta",
        "Debe autorizar el tratamiento de datos personales para continuar."
      );
      return;
    }

    if (faltaNumeroAseguradora) {
      ShowMessage(
        "alerta",
        "Debe ingresar el número de la aseguradora porque respondió que sí está vacunado."
      );
      return;
    }

    // ✅ SI TODO ESTÁ BIEN, ENVÍA EL FORM
    handleSubmit(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVacunadoAseguradoChange = (e, index) => {
    const { value } = e.target;
    const updated = [...formData.vacunadoAsegurados];
    updated[index].numeroAsegurado = value;
    setFormData(prev => ({ ...prev, vacunadoAsegurados: updated }));
  };

  const handleAddVacunado = () => {
    if (formData.vacunadoAsegurados.length < asegurados.length) {
      setFormData(prev => ({
        ...prev,
        vacunadoAsegurados: [
          ...prev.vacunadoAsegurados,
          { numeroAsegurado: "", na: false }
        ]
      }));
    }
  };

  const handleRemoveVacunado = (index) => {
    if (formData.vacunadoAsegurados.length > 1) {
      const updated = formData.vacunadoAsegurados.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, vacunadoAsegurados: updated }));
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (onPrevious) {
      onPrevious(formData);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      ShowMessage("error", "El archivo debe ser una imagen.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFirmaModalPreview(reader.result); // 👈 preview en modal
      setFirmaPreview(reader.result);      // 👈 preview final
      setFormData(prev => ({ ...prev, firma: reader.result }));
      setFirmaAceptada(true);
      setFirmaDesdeImagen(true);            // 👈 bloquea canvas
    };
    reader.readAsDataURL(file);
  };


  const handleAcceptDrawSignature = () => {
    if (firmaDesdeImagen) {
      setShowSignatureModal(false);
      ShowMessage("success", "Firma aceptada correctamente.");
      return;
    }

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      ShowMessage("error", "Debe firmar antes de aceptar.");
      return;
    }

    const firmaBase64 = sigCanvas.current.toDataURL("image/png");
    setFirmaPreview(firmaBase64);
    setFormData(prev => ({ ...prev, firma: firmaBase64 }));
    setFirmaAceptada(true);
    setShowSignatureModal(false);

    ShowMessage("success", "Firma aceptada correctamente.");
  };

  const handleClearSignature = () => {
    // Limpiar canvas
    sigCanvas.current?.clear();

    // Limpiar firma de imagen y canvas
    setFirmaPreview(null);
    setFirmaModalPreview(null);
    setFirmaAceptada(false);
    setFirmaDesdeImagen(false);

    // Resetear el formData.firma
    setFormData(prev => ({ ...prev, firma: null }));

    // Limpiar input file para permitir subir otra imagen
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const faltaNumeroAseguradora =
    formData.vacunadoCovid === "Sí" &&
    formData.vacunadoAsegurados.some(
      (item) => !item.numeroAsegurado || item.numeroAsegurado.trim() === ""
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 VALIDACIÓN OBLIGATORIA
    if (faltaNumeroAseguradora) {
      ShowMessage(
        "alerta",
        "Debe ingresar el número de la aseguradora para continuar."
      );
      return;
    }

    if (!formData.firma) {
      ShowMessage("error", "Debe agregar una firma para continuar.");
      return;
    }

    setLoading(true);

    try {
      await sendFormDataSaludVida({
        step1VData,
        step2VData,
        step3VData,
        step4VData,
        step5VData,
        step6VData,
        step7VData,
        step8VData,
        step9VData,
        step10VData,
        step11VData,
        step12VData,
        step13VData: formData
      });

      if (onNext) onNext(formData);
      navigate("/finForm", { state: { from: "flow" } });

    } catch (error) {
      ShowMessage("error", "Hubo un error al enviar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  const getAseguradosSeleccionados = () =>
    formData.vacunadoAsegurados
      .map(a => String(a.numeroAsegurado))
      .filter(a => a !== "");


  /* =============================
     ASEGURADOS (PRINCIPAL + FAMILIA)
  ============================= */

  const asegurados = [];

  if (step1VData?.nombreCompleto) {
    asegurados.push({
      aseguradoIndex: 1,
      nombreCompleto: step1VData.nombreCompleto,
      esPrincipal: true,
    });
  }

  (step4VData?.asegurados || []).forEach((a) => {
    asegurados.push({
      ...a,
      aseguradoIndex: asegurados.length + 1,
      esPrincipal: false,
    });
  });

  const opcionesAsegurados = asegurados.map((a) => ({
    value: a.aseguradoIndex,
    label: a.esPrincipal
      ? `1 - ${a.nombreCompleto}`
      : `${a.aseguradoIndex} - ${a.nombreCompleto}`,
  }));

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          5. ¿Ha sido vacunado contra la COVID-19 y tiene el esquema completo?
        </h4>
        <div className={styles.radioOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="vacunadoCovid"
              value="Sí"
              checked={formData.vacunadoCovid === "Sí"}
              onChange={handleChange}
              required
            />
            Sí
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="vacunadoCovid"
              value="No"
              checked={formData.vacunadoCovid === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        {formData.vacunadoCovid === "Sí" && (
          <div>
            <p className={styles.sectionSubtitle}>
              Indique el número del asegurado:
            </p>
            {formData.vacunadoAsegurados.map((item, index) => (
              <div key={index} className={styles.inputRow}>
                <select
                  className={styles.input}
                  value={item.numeroAsegurado}
                  onChange={(e) => handleVacunadoAseguradoChange(e, index)}
                >
                  <option value="">Seleccione asegurado</option>

                  {opcionesAsegurados.map((opt) => {
                    const yaSeleccionado =
                      getAseguradosSeleccionados().includes(String(opt.value)) &&
                      String(opt.value) !== String(item.numeroAsegurado);

                    return (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={yaSeleccionado}
                      >
                        {opt.label}
                      </option>
                    );
                  })}
                </select>
                {formData.vacunadoAsegurados.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveVacunado(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {formData.vacunadoAsegurados.length < asegurados.length && (
              <div className={styles.inputRow}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddVacunado}
                >
                  + Agregar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>TRATAMIENTO DE DATOS PERSONALES</h4>
        <p className={styles.legalText}>
          Autorizo a Suramericana SA en calidad de responsable, así como sus filiales, subsidiarias y vinculadas económicamente en Colombia y el exterior, el tratamiento de mis datos personales con la finalidad de vincularme como cliente de la solución contratada, para ser contactado para el ofrecimiento de productos y servicios y para las demás finalidades contenidas en la política de privacidad que puede ser consultada en www.segurossura.com.co/paginas/legal/politica-privacidad-datos.aspx, donde se encuentran los canales de contacto, y la forma de ejercer mis derechos a revocar la autorización, conocer, actualizar, rectificar y suprimir mi información.
        </p>
        <div className={styles.radioOptions}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="autorizacionTratamiento"
              value="Sí"
              checked={formData.autorizacionTratamiento === "Sí"}
              onChange={handleChange}
              required
            />
            Sí
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="autorizacionTratamiento"
              value="No"
              checked={formData.autorizacionTratamiento === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>

      {showSignatureModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>

            {/* ✅ Botón X para cerrar modal */}
            <button
              type="button"
              className={styles.closeModalButton}
              onClick={handleCloseSignatureModal}
            >
              ×
            </button>

            <h3>Agregar firma</h3>

            <div className={styles.signatureWrapper}>
              {firmaDesdeImagen && firmaModalPreview ? (
                <img
                  src={firmaModalPreview}
                  alt="Firma cargada"
                  className={styles.signatureImagePreview}
                />
              ) : (
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#111"
                  canvasProps={{ className: styles.signatureCanvas }}
                  clearOnResize={false}
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleUploadImage}
            />

            <div className={styles.signatureActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleClearSignature}
              >
                🧹 Limpiar
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => fileInputRef.current.click()}
              >
                📁 Subir imagen
              </button>

              <button
                type="button"
                className={styles.acceptButton}
                onClick={handleAcceptDrawSignature}
              >
                ✅ Aceptar firma
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Firma del solicitante</h4>

        {!firmaPreview ? (
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleOpenSignatureModal}
          >
            Agregar firma
          </button>
        ) : (
          <>
            <img
              src={firmaPreview}
              alt="Firma"
              className={styles.signaturePreview}
            />
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleClearSignature}
            >
              Eliminar firma
            </button>

          </>
        )}

      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Enviando información, por favor espera...</p>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.submitButton}
          onClick={handlePrevious}
          disabled={loading}
        >
          ← Preguntas anteriores
        </button>

        <button
          type="button"
          className={`${styles.submitButton} ${(!firmaAceptada ||
            faltaNumeroAseguradora ||
            formData.autorizacionTratamiento !== "Sí")
            ? styles.disabledVisual
            : ""
            }`}
          onClick={handleFinalizarClick}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Finalizar formulario →"}
        </button>
      </div>
    </form>
  );
};

export default Step13V;