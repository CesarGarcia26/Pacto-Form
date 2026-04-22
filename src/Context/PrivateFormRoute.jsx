// src/components/PrivateFormRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateFormRoute = ({ children, requiredState = "flow" }) => {
  const location = useLocation();
  
  // Verifica si vienen del flujo correcto
  const hasValidAccess = location.state?.from === requiredState;
  
  if (!hasValidAccess) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default PrivateFormRoute;