import React, { useState } from "react";
import styles from "./StepsCSS.module.css"; 
import ShowMessage from "../../../Config/ShowMessage";
// Importación de estilos para cláusulas

const Step9 = ({ onPrevious, onNext }) => {
  const [formData, setFormData] = useState({
    DatosPersonales: "", // inicialmente vacío
  });

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: debe aceptar "sí"
    if (formData.DatosPersonales !== "si") {
      ShowMessage("alerta", "Debes aceptar el tratamiento de datos personales para continuar.");
      return; // bloquea avance
    }

    onNext(formData); // avanza si aceptó
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      DatosPersonales: e.target.value,
    });
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.clauseSection}>
          <h4 className={styles.clauseTitle}>CLÁUSULA DE GARANTÍA:</h4>
          <p className={styles.clauseText}>
            Como asegurado principal garantizo que las declaraciones sobre mi estado de salud
            y el de mi grupo familiar son exactas y verídicas, acepto que serán parte integrante
            del contrato de seguro, igualmente si existiera reticencia sobre los hechos o circunstancias
            que de ser conocidas por la Suramericana la hubieran retraído de celebrar el contrato,
            acepto la nulidad del contrato de seguro.
          </p>
        </div>

        <div className={styles.clauseSection}>
          <h4 className={styles.clauseTitle}>
            AUTORIZACIÓN PARA SOLICITUD DE HISTORIA CLÍNICA Y OTROS:
          </h4>
          <p className={styles.clauseText}>
            En cumplimiento de las previsiones de la ley 23 de 1981, de la resolución 1995 de 1999
            del Ministerio de Protección Social y demás normatividad sobre la materia, autorizo de
            manera particular a cualquier institución hospitalaria, médico, empleado de hospital o
            cualquier otra persona que nos haya atendido a mí o a cualquiera de los integrantes del
            grupo asegurado o haya sido consultada por nosotros para que suministre a SEGUROS DE
            VIDA SURAMERICANA S.A. copia de nuestra historia clínica o de cualquier información que
            ella considere necesaria para la contratación del presente seguro o para la atención de
            cualquier reclamación que afecte cualquiera de los amparos del mismo.
          </p>
          
        </div>

        <div className={styles.clauseSection}>
          <h4 className={styles.clauseTitle}>
            AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES
          </h4>
          <p className={styles.clauseText}>
            En nombre propio, y en nombre de los demás asegurados bajo su encargo, autorizo(amos)
            a SURAMERICANA S.A en calidad de responsable, así como sus filiales, subsidiarias y
            vinculadas económicamente en Colombia y el exterior, el tratamiento de mis (nuestros)
            datos personales, incluso los datos biométricos y de salud que son sensibles, con la
            finalidad de vincularme como cliente de la solución contratada, prestación del servicio,
            envío de información, ofertas comerciales y publicitarias, transferir o transmitir a
            terceros tales como aliados estratégicos, empresas vinculadas, reaseguradores e
            intermediarios de seguros, en Colombia o en el exterior; y para las demás finalidades
            contempladas en la Política de Privacidad, disponible en www.segurossura.com.co, donde
            se encuentra el listado de terceros con quienes se comparte información, la forma de
            ejercer mis derechos a conocer, actualizar, rectificar, revocar o suprimir mis datos
            personales, informarme sobre el uso de los mismos, solicitar prueba de la autorización,
            a través de los siguientes canales de contacto: 604437 8888 desde Medellín, 601437 8888
            Bogotá y 602437 8888 Cali o al 01 800051888 en el resto del país o a través del correo
            electrónico protecciondedatos@suramericana.com.co.
          </p>
          <p className={styles.clauseText}>
            La presente solicitud no constituye aceptación de riesgo por parte de SEGUROS DE VIDA
            SURAMERICANA S.A. hasta tanto la Compañía se manifieste de manera expresa y en documento
            escrito. La no veracidad de la información consignada en este formulario, o el no
            diligenciamiento del mismo en su totalidad, producirá la nulidad del contrato de seguro
            y por lo tanto la no indemnización en caso de siniestro. Autorizo descuento de la prima
            del presente seguro por nómina.
          </p>

          <div className={styles.radioOptions}>
            <label>
              <input
                type="radio"
                name="respuesta"
                value="si"
                required
                checked={formData.DatosPersonales === "si"}
                onChange={handleRadioChange}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="respuesta"
                value="no"
                checked={formData.DatosPersonales === "no"}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>
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
  );
};

export default Step9;
