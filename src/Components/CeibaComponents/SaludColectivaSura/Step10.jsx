import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import styles from "./StepsCSS.module.css";

import { useFromDataGlobalService } from "../../../Services/FormDataGlobalService";
import ShowMessage from "../../../Config/ShowMessage";

const Step10 = ({
  onPrevious,
  onNext,
  step1Data,
  step2Data,
  step3Data,
  step4Data,
  step5Data,
  step6Data,
  step7Data,
  step8Data,
  step9Data,
}) => {

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    respuesta: "",
    firma: null,
    archivoFirma: null,
  });

  const [firmaDesdeImagen, setFirmaDesdeImagen] = useState(false);
  const [firmaModalPreview, setFirmaModalPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const sigCanvas = useRef(null);

  const [firmaAceptada, setFirmaAceptada] = useState(false);


  const { sendFormData } = useFromDataGlobalService();

  useEffect(() => {
    if (!sigCanvas.current) return;

    const canvas = sigCanvas.current.getCanvas();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
  }, []);

  const handleOpenSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };

  const handleBlockedClick = () => {
    const mensaje = getMensajeBloqueo();
    if (mensaje) {
      ShowMessage("alerta", mensaje);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;


    // resetear input para poder subir la misma imagen después
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      ShowMessage("error", "El archivo debe ser una imagen.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFirmaPreview(reader.result);         // preview final
      setFirmaModalPreview(reader.result);    // preview en modal
      setFormData({
        ...formData,
        archivoFirma: reader.result,
        firma: reader.result,
      });
      setFirmaAceptada(true);
      setFirmaDesdeImagen(true);             // ❌ bloquea canvas
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
    setFormData({ ...formData, firma: firmaBase64 });
    setFirmaAceptada(true);
    setShowSignatureModal(false);

    ShowMessage("success", "Firma aceptada correctamente.");
  };

  const handleClearSignature = () => {
    sigCanvas.current?.clear();
    setFirmaAceptada(false);
    setFirmaPreview(null);
    setFirmaModalPreview(null);
    setFirmaDesdeImagen(false);
    setFormData({ ...formData, firma: null, archivoFirma: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // limpiar el input file
    }
  };

  const getMensajeBloqueo = () => {
    if (loading) return "El formulario se está enviando.";

    if (!formData.respuesta) {
      return "Debe seleccionar una opción (Sí o No) para continuar.";
    }

    if (formData.respuesta === "Sí") {
      return "No es posible enviar el formulario. De acuerdo con la normatividad vigente, las personas que hayan cometido delitos o ejerzan actividades ilícitas no son elegibles para la afiliación.";
    }

    if (!firmaAceptada) {
      return "Debe agregar una firma para continuar.";
    }

    return null;
  };


  const handlePrevious = (e) => {
    e.preventDefault();
    if (onPrevious) onPrevious(formData);
  };

  const handleAcceptSignature = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      ShowMessage("error", "Debe firmar antes de aceptar.");
      return;
    }

    setFirmaAceptada(true);
    ShowMessage("success", "Firma aceptada correctamente.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.respuesta) {
      return;
    }

    if (formData.respuesta === "Sí") {
      return; // ya está bloqueado arriba
    }

    // 🔒 BLOQUEO REAL SI NO HAY FIRMA
    if (!firmaAceptada || !formData.firma) {
      return; // ⛔ AQUÍ SE BLOQUEA EL ENVÍO
    }

    const firmaBase64 = formData.firma;

    setLoading(true);

    try {
      await sendFormData({
        step1Data,
        step2Data,
        step3Data,
        step4Data,
        step5Data,
        step6Data,
        step7Data,
        step8Data,
        step9Data,
        step10Data: {
          ...formData,
          firma: firmaBase64,
        },
      });

      if (onNext) onNext(formData);
      navigate("/finForm", { state: { from: "flow" } });
    } catch (error) {
      console.error("❌ Error al enviar formulario:", error);
      ShowMessage("error", "Ocurrió un error al enviar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={`${styles.radioGroup} ${styles.fullWidth}`}>
          <h4>DECLARACIÓN DE OCUPACIÓN</h4>
          <h4>
            ¿Alguno de los asegurados ejercen actividades catalogadas por la ley
            como ilícitas o han cometido delitos?
          </h4>
          <p className={styles.clauseText}>
            Esta declaración es obligatoria para cumplir con la normativa vigente en
            materia de prevención de lavado de activos y financiación del terrorismo.
            La información suministrada será tratada con confidencialidad y verificada
            conforme a las políticas de la compañía.
          </p>

          <div>
            <label>
              <input
                type="radio"
                name="respuesta"
                value="Sí"
                checked={formData.respuesta === "Sí"}
                onChange={() =>
                  setFormData({ ...formData, respuesta: "Sí" })
                }
              />
              Sí
            </label>

            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="respuesta"
                value="No"
                checked={formData.respuesta === "No"}
                onChange={() =>
                  setFormData({ ...formData, respuesta: "No" })
                }
              />
              No
            </label>
          </div>
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



      <div className={`${styles.fullWidth} ${styles.signatureContainer}`}>
        <h4>Firma del solicitante</h4>

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

        <div onClick={getMensajeBloqueo() ? handleBlockedClick : undefined}>
          <button
            type="submit"
            className={`${styles.submitButton} ${getMensajeBloqueo() ? styles.disabledVisual : ""
              }`}
          >
            {loading ? "Enviando..." : "Enviar Formulario"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default Step10;