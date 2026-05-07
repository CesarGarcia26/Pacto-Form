import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// 🔐 Ya NO necesitamos el hook useAuth porque el token está en la cookie
export const useFromDataGlobalService = () => {
  const sendFormData = async ({
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    step6Data,
    step7Data,
    step8Data,
    step9Data,
    step10Data,
  }) => {
    // ❌ ELIMINADO: Validación del token (ahora está en la cookie)
    // if (!userInfo?.token) {
    //   throw new Error("Usuario no autenticado. Inicie sesión para continuar.");
    // }

    // Limpieza de arrays anidados
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
          } else if (typeof value === "object") {
            newItem[key] = value;
          } else {
            newItem[key] = String(value);
          }
        });
        return newItem;
      });
    };

    const cleanValue = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string" && value.toUpperCase() === "N/A") return "";
      return value;
    };


    // Unificamos todos los pasos
    const formDataComplete = {
      // STEP 1
      tipoIdentificacion: step1Data?.tipoIdentificacion || "",
      numeroIdentificacion: step1Data?.numeroIdentificacion || "",
      nombreCompleto: step1Data?.nombreCompleto || "",
      genero: step1Data?.genero || "",
      estadoCivil: step1Data?.estadoCivil || "",
      cantidadHijos: step1Data?.cantidadHijos || "",
      departamento: step1Data?.departamento || "",
      ciudadCorrespondencia: step1Data?.ciudadCorrespondencia || "",
      telefono: step1Data?.telefono || "",
      direccion: step1Data?.direccion || "",
      tipoDireccion: step1Data?.tipoDireccion || "",

      // 🔥 AQUÍ EL FIX
      fechaNacimiento: cleanValue(step1Data?.fechaNacimiento),

      plan: step1Data?.plan || "",
      urgencias: step1Data?.urgencias || "",
      consulta: step1Data?.consulta || "",

      // STEP 2
      solicitantePrincipalSeAgrega: step2Data?.solicitantePrincipalSeAgrega || "",
      tipoIdentificacionPrincipal: step2Data?.tipoIdentificacionPrincipal || "",
      numeroIdentificacionPrincipal: step2Data?.numeroIdentificacionPrincipal || "",
      nombresApellidosPrincipal: step2Data?.nombresApellidosPrincipal || "",
      parentescoPrincipal: step2Data?.parentescoPrincipal || "",
      fechaNacimientoPrincipal: cleanValue(step2Data?.fechaNacimientoPrincipal),
      sexoPrincipal: step2Data?.sexoPrincipal || "",
      estadoCivilPrincipal: step2Data?.estadoCivilPrincipal || "",
      pesoKgPrincipal: step2Data?.pesoKgPrincipal || "",
      estaturaCmPrincipal: step2Data?.estaturaCmPrincipal || "",
      ocupacionPrincipal: step2Data?.ocupacionPrincipal || "",
      nombreEpsPrincipal: step2Data?.nombreEpsPrincipal || "",
      tipoSolicitantePrincipal: step2Data?.tipoSolicitantePrincipal || "",
      valorAseguradoPrincipal: step2Data?.valorAseguradoPrincipal || "",
      rentaIdealPrincipal: step2Data?.rentaIdealPrincipal || "",
      emergenciaEmiPrincipal: step2Data?.emergenciaEmiPrincipal || "",
      cantidadPersonasAdicionales: step2Data?.cantidadPersonasAdicionales || "",
      personasAdicionales: cleanArray(step2Data?.personasAdicionales || []),

      // STEP 3
      solicitaContinuidad: step3Data?.solicitaContinuidad || "",
      tieneExclusion: step3Data?.tieneExclusion || "",
      especificacion: step3Data?.especificacion || "",
      enfermedadesCardiacas: cleanArray(step3Data?.enfermedadesCardiacas || []),
      enfermedadesPulmonares: cleanArray(step3Data?.enfermedadesPulmonares || []),

      // STEP 4
      enfermedadesGastrointestinales: cleanArray(step4Data?.enfermedadesGastrointestinales || []),
      enfermedadesGenitourinarias: cleanArray(step4Data?.enfermedadesGenitourinarias || []),
      enfermedadesDiabetes: cleanArray(step4Data?.enfermedadesDiabetes || []),

      // STEP 5
      enfermedadesNeurologicas: cleanArray(step5Data?.enfermedadesNeurologicas || []),
      enfermedadesOseas: cleanArray(step5Data?.enfermedadesOseas || []),
      enfermedadesOjosPiel: cleanArray(step5Data?.enfermedadesOjosPiel || []),

      // STEP 6
      step6SolicitaContinuidad: step6Data?.solicitaContinuidad || "",
      step6TieneExclusion: step6Data?.tieneExclusion || "",
      practicaDeportes: step6Data?.practicaDeportes || "",
      otrasEnfermedades: cleanArray(step6Data?.otrasEnfermedades || []),
      deportesRiesgo: cleanArray(step6Data?.deportesRiesgo || []),

      // STEP 7
      consumeDrogas: step7Data?.consumeDrogas || "",
      personasDrogas: cleanArray(step7Data?.personasDrogas || []),
      embarazo: step7Data?.embarazo || "",
      personasEmbarazo: cleanArray(step7Data?.personasEmbarazo || []),
      covid: step7Data?.covid || "",
      personasCovid: cleanArray(step7Data?.personasCovid || []),
      fumadorBebidas: step7Data?.fumadorBebidas || "",
      personasFumadorBebidas: cleanArray(step7Data?.personasFumadorBebidas || []),

      // STEP 8
      mujeres: step8Data?.mujeres || "",
      mujeresInfo: cleanArray(step8Data?.mujeresInfo || []),
      historial: step8Data?.historial || "",
      historialFamilia: cleanArray(step8Data?.historialFamilia || []),

      // STEP 10
      respuesta: step10Data?.respuesta || "",
      firma: step10Data?.firma || null,
      archivoFirma: step10Data?.archivoFirma || null,
    };

    try {
      // 🔐 CAMBIO CRÍTICO: withCredentials envía la cookie automáticamente
      const response = await axios.post(`${API_URL}/guardar-colectiva`, allStepsData, {
        headers: {
          "Content-Type": "application/json",
          // ❌ ELIMINADO: Authorization: `Bearer ${userInfo.token}`
        },
        
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

  return { sendFormData };
};