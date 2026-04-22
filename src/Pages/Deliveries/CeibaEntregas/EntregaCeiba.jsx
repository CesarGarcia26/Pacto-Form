import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from "./EntregaCeiba.module.css";

const EntregaCeiba = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // PROTECCIÓN 1: Verificar que vengan del flujo correcto
  useEffect(() => {
    if (!location.state || location.state.from !== "flow") {
      navigate("/", { replace: true });
      return;
    }
  }, [location, navigate]);

  // PROTECCIÓN 2: Control del botón "atrás" del navegador
  useEffect(() => {
    const handlePopState = (event) => {
      navigate("/", { replace: true });
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // PROTECCIÓN 3: Limpiar el state después de cierto tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      window.onbeforeunload = () => {
        sessionStorage.removeItem('formCompleted');
      };
    }, 300000); // 5 minutos

    return () => clearTimeout(timer);
  }, []);

  // PROTECCIÓN 4: Prevenir clic derecho y F12 (opcional)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') || 
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.circleTopRight}></div>
      <div className={styles.circleBottomLeft}></div>

      <div className={styles.card}>
        <div style={{ marginBottom: '1.5rem' }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#3b82f6' }} />
        </div>

        <h2 className={styles.title}>¡Envío Exitoso!</h2>
        <p className={styles.message}>
          Hemos recibido tu información correctamente. 
          Nuestro equipo revisará tu solicitud y se comunicará contigo a la brevedad.
        </p>
        
        <p className={styles.secondaryMessage}>
          ¿Necesitas ayuda? Contáctanos en&nbsp;
          <a href="mailto:soporte@pactoarrubla.com" className={styles.link}>
            soporte@pactoarrubla.com
          </a>
        </p>

        <button 
          className={styles.button} 
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default EntregaCeiba;