import { createContext, useState, useContext, useEffect } from "react";
import { verifyAuthService, logoutService } from "../Services/authService";

const AuthContext = createContext({
  isAuthenticated: false,
  userInfo: { empresa: null, username: null },
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ empresa: null, username: null });
  const [loading, setLoading] = useState(true);

  // 🔐 CAMBIO CRÍTICO: Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Llamar al endpoint /me para verificar si la cookie es válida
        const userData = await verifyAuthService();
        setIsAuthenticated(true);
        setUserInfo(userData);
      } catch (error) {
        // Si falla, el usuario no está autenticado
        setIsAuthenticated(false);
        setUserInfo({ empresa: null, username: null });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ❌ YA NO recibimos ni guardamos el token
  const login = (empresa, username) => {
    const userData = { empresa, username };
    setIsAuthenticated(true);
    setUserInfo(userData);
    // ❌ NO más localStorage.setItem
    // La cookie httpOnly ya está guardada por el backend
  };

  const logout = async () => {
    // Llamar al backend para limpiar la cookie
    await logoutService();
    
    setIsAuthenticated(false);
    setUserInfo({ empresa: null, username: null });
    // ❌ NO más localStorage.removeItem (no hay nada que eliminar)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);