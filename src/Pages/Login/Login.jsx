import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../../Services/authService";
import { useAuth } from "../../Context/authContext";

import pacto1 from "../../assets/Imagens/pacto_arrubla1.jpg";
import pacto2 from "../../assets/Imagens/pacto_arrubla2.jpg";
import pacto3 from "../../assets/Imagens/pacto_arrubla3.jpg";
import logo from "../../assets/Imagens/PactoArrubla.png";
import pacto4 from "../../assets/Imagens/pacto_arrubla4.jpg";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const images = [pacto1, pacto2, pacto3, pacto4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleCircleClick = (index) => {
    setCurrentImage(index);
  };

  const showErrorMessage = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 1700);
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const usernameTrimmed = username.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    // 🔹 Reset errores visuales
    setFieldErrors({});

    // 🔹 VALIDACIONES (PRIMERO)
    if (!usernameTrimmed && !passwordTrimmed) {
      setFieldErrors({ username: true, password: true });
      showErrorMessage("Debes ingresar usuario y contraseña");
      return;
    }

    if (!usernameTrimmed) {
      setFieldErrors({ username: true });
      showErrorMessage("El usuario es obligatorio");
      return;
    }

    if (!passwordTrimmed) {
      setFieldErrors({ password: true });
      showErrorMessage("La contraseña es obligatoria");
      return;
    }

    // 🔹 LOGIN
    try {
      setLoading(true);
      setErrorMessage("");
      setShowError(false);

      const loginData = await loginService(usernameTrimmed, passwordTrimmed);
      login(loginData.empresa, loginData.username);
      navigate("/dashboardCba");

    } catch (error) {
      setUsername("");
      setPassword("");
      showErrorMessage("Usuario o contraseña no válido");
    } finally {
      setLoading(false);
    }
  }, [username, password, login, navigate]);
  return (
    <div className={styles.container}>
      {/* IZQUIERDA - CARRUSEL */}
      <div className={styles.left}>
        <div className={styles.carousel}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className={`${styles.carouselImage} ${index === currentImage ? styles.active : ""
                }`}
            />
          ))}

          <div className={styles.overlay}></div>

          {/* TEXTO */}
          <div className={styles.welcomeText}>
            <h1>Bienvenid@</h1>
            <p>Ingresa para proteger lo que más importa</p>
          </div>

          {/* CÍRCULOS INDICADORES */}
          <div className={styles.circles}>
            {images.map((_, index) => (
              <span
                key={index}
                className={`${styles.circle} ${index === currentImage ? styles.activeCircle : ""
                  }`}
                onClick={() => handleCircleClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DERECHA - FORMULARIO */}
      <div className={styles.right}>
        <div className={styles.formContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2 className={styles.loginTitle}>Acceso</h2>
          <p className={styles.loginSubtitle}>
            Diligencia las credenciales proporcionadas por la empresa
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Usuario</label>
            <input
              className={fieldErrors.username ? styles.errorInput : ""}
              type="text"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
            />


            <label>Contraseña</label>
            <input
              className={fieldErrors.password ? styles.errorInput : ""}
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>

            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Iniciando sesión...</p>
              </div>
            )}


          </form>
        </div>
      </div>

      {/* NOTIFICACIÓN DE ERROR */}
      {errorMessage && (
        <div
          className={`${styles.errorNotification} ${showError ? styles.show : styles.hide
            }`}
        >
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Login;