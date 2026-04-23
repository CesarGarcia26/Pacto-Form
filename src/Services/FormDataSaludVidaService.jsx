import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useFormDataSaludVidaService = () => {
  const sendFormDataSaludVida = async ({
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
    step13VData,
  }) => {


    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
        const newItem = {};
        Object.keys(item).forEach((key) => {
          const value = item[key];
          if (value === null || value === undefined) {
            newItem[key] = "";
          } else if (typeof value === "string") {
            newItem[key] = value.toUpperCase() === "N/A" ? "" : value;
          } else if (typeof value === "number" || typeof value === "boolean") {
            newItem[key] = String(value);
          } else if (Array.isArray(value)) {
            newItem[key] = cleanArray(value);
          } else {
            newItem[key] = value;
          }
        });
        return newItem;
      });
    };

    const allStepsData = {
      // STEP 1
      tipoIdentificacion: step1VData?.tipoIdentificacion || "",
      numeroIdentificacion: step1VData?.numeroIdentificacion || "",
      nombreCompleto: step1VData?.nombreCompleto || "",
      sexo: step1VData?.sexo || "",
      fechaNacimiento: step1VData?.fechaNacimiento || "",
      peso: step1VData?.peso || "",
      estatura: step1VData?.estatura || "",
      departamento: step1VData?.departamento || "",
      departamentoId: step1VData?.departamentoId || "",
      ciudadCorrespondencia: step1VData?.ciudadCorrespondencia || "",
      ciudadId: step1VData?.ciudadId || "",
      telefono: step1VData?.telefono || "",
      celular: step1VData?.celular || "",
      direccion: step1VData?.direccion || "",
      correo: step1VData?.correo || "",

      // STEP 2
      empresa: step2VData?.empresa || "",
      salario: step2VData?.salario || "",
      coberturaVidaTier: step2VData?.coberturaVidaTier || "",
      valorAseguradoTotal: step2VData?.valorAseguradoTotal || "",
      valorFinal_CyP: step2VData?.valorFinal_CyP || step2VData?.ValorFinal_CyP || "",

      // STEP 3
      cantidadBeneficiarios: step3VData?.cantidadBeneficiarios || 0,
      beneficiarios: Array.isArray(step3VData?.beneficiarios)
        ? step3VData.beneficiarios.map((b) => ({
          tipoIdentificacion: String(b.tipoIdentificacion || ""),
          numeroIdentificacion: String(b.numeroIdentificacion || ""),
          nombreCompleto: String(b.nombreCompleto || ""),
          porcentaje: String(b.porcentaje || "")
        }))
        : [],
      acrecimiento: step3VData?.acrecimiento || "",

      // STEP 4
      cantidadAsegurados: step4VData?.cantidadAsegurados || 0,
      asegurados: Array.isArray(step4VData?.asegurados)
        ? step4VData.asegurados.map((a) => ({
          tipoIdentificacion: String(a.tipoIdentificacion || ""),
          numeroIdentificacion: String(a.numeroIdentificacion || ""),
          nombreCompleto: String(a.nombreCompleto || ""),
          correo: String(a.correo || ""),
          telefono: String(a.telefono || ""),
          parentesco: String(a.parentesco || ""),
          fechaNacimiento: String(a.fechaNacimiento || ""),
          sexo: String(a.sexo || ""),
          peso: String(a.peso || ""),
          estatura: String(a.estatura || "")
        }))
        : [],

      // STEP 5
      valoresAsegurados: step5VData?.valoresAsegurados || [],
      enfermedadesStep5: Array.isArray(step5VData?.enfermedades)
        ? step5VData.enfermedades.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 6
      enfermedadesStep6: Array.isArray(step6VData?.enfermedades)
        ? step6VData.enfermedades.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 7
      enfermedadesStep7: Array.isArray(step7VData?.enfermedadesStep7)
        ? step7VData.enfermedadesStep7.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 8
      enfermedadesStep8: Array.isArray(step8VData?.enfermedadesStep8)
        ? step8VData.enfermedadesStep8.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 9
      enfermedadesStep9: Array.isArray(step9VData?.enfermedades)
        ? step9VData.enfermedades.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 10
      enfermedadesStep10: Array.isArray(step10VData?.enfermedadesStep10)
        ? step10VData.enfermedadesStep10.filter(e => e.checked).map(e => ({
          id: String(e.id || ""),
          nombre: String(e.nombre || ""),
          checked: Boolean(e.checked),
          asegurados: Array.isArray(e.asegurados) ? e.asegurados.filter(a => a) : []
        }))
        : [],

      // STEP 11
      perdidaFuncional: step11VData?.perdidaFuncional || { checked: false, asegurados: [] },
      alcoholismoUltimosCinco: step11VData?.alcoholismoUltimosCinco || "",
      detalleAlcoholismoUltimosCinco: Array.isArray(step11VData?.detalleAlcoholismoUltimosCinco)
        ? step11VData.detalleAlcoholismoUltimosCinco.map((d) => ({
          asegurado: String(d.asegurado || ""),
          medico: String(d.medico || ""),
          institucion: String(d.institucion || ""),
          eps: String(d.eps || ""),
          observacion: String(d.observacion || ""), // <-- agregar
        }))
        : [],
      alcoholismoActual: step11VData?.alcoholismoActual || "",
      detalleAlcoholismoActual: Array.isArray(step11VData?.detalleAlcoholismoActual)
        ? step11VData.detalleAlcoholismoActual.map((d) => ({
          asegurado: String(d.asegurado || ""),
          medico: String(d.medico || ""),
          institucion: String(d.institucion || ""),
          eps: String(d.eps || ""),
          observacion: String(d.observacion || ""), // <-- agregar
        }))
        : [],
      consumeDrogas: step11VData?.consumeDrogas || "",
      otrasEnfermedades: step11VData?.otrasEnfermedades || "",
      detalleOtrasEnfermedades:
        Array.isArray(step11VData?.detalleOtrasEnfermedades)
          ? step11VData.detalleOtrasEnfermedades.map((d) => ({
            asegurado: String(d.asegurado || ""),
            medico: String(d.medico || ""),
            institucion: String(d.institucion || ""),
            observacion: String(d.observacion || ""),
            eps: String(d.eps || ""),
          }))
          : [],

      // STEP 13 - VACUNACIÓN + FIRMA
      vacunadoCovid: step13VData?.vacunadoCovid || "",
      vacunadoAsegurados: Array.isArray(step13VData?.vacunadoAsegurados)
        ? step13VData.vacunadoAsegurados
          .filter((item) => item && item.numeroAsegurado)
          .map((item) => ({
            numeroAsegurado: String(item.numeroAsegurado || ""),
            na: item.na === true || item.na === "true"
          }))
        : [],
      autorizacionTratamiento: step13VData?.autorizacionTratamiento || "",

      // 👇👇👇 FIRMA
      firma: step13VData?.firma || "",
    };
    console.log("STEP 11 ENVIADO 👉", {
      perdidaFuncional: allStepsData.perdidaFuncional,
      detalleOtrasEnfermedades: allStepsData.detalleOtrasEnfermedades,
    });

    try {
      // 🔐 CAMBIO CRÍTICO: withCredentials envía la cookie automáticamente
      const response = await axios.post(`${API_URL}/guardar`, allStepsData, {
        headers: {
          "Content-Type": "application/json",
          // ❌ ELIMINADO: Authorization: `Bearer ${userInfo.token}`
        },
        withCredentials: true, // ← OBLIGATORIO para enviar cookies
      });

      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Datos del error:", error.response.data);
      }
      throw error;
    }
  };

  return { sendFormDataSaludVida };
};