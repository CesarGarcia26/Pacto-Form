import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const loginService = async (username, password) => {
  try {
    // 🔐 CAMBIO CRÍTICO: withCredentials permite enviar/recibir cookies
    const response = await axios.post(
      `${API_URL}/login`, 
      { username, password },
      { withCredentials: true } // ← OBLIGATORIO para cookies
    );

    // El backend ahora NO devuelve el token (está en la cookie httpOnly)
    // Solo devuelve username, empresa, email, message
    
    return {
      empresa: response.data.empresa,
      username: response.data.username,
      email: response.data.email
      // ❌ YA NO retornamos el token (está en la cookie httpOnly)
    };

  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Credenciales inválidas");
    }
    throw new Error(error.message || "Error al conectar con el servidor");
  }
};

// 🆕 NUEVO: Verificar si el usuario está autenticado
const verifyAuthService = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/me`,
      { withCredentials: true } // ← Envía la cookie automáticamente
    );
    
    return {
      empresa: response.data.empresa,
      username: response.data.username,
      email: response.data.email
    };
  } catch (error) {
    throw new Error("No autenticado");
  }
};

// 🆕 NUEVO: Logout
const logoutService = async () => {
  try {
    await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error al hacer logout:", error);
  }
};

export default loginService;
export { verifyAuthService, logoutService };