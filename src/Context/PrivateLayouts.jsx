import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Esperar a que se cargue el estado del AuthProvider
  if (loading) {
    return <div>Cargando...</div>; // 👈 puedes poner un spinner si quieres
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
