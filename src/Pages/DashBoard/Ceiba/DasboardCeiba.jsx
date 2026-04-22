import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaHeartbeat, FaSignOutAlt } from "react-icons/fa";
import styles from "./DasboardCebiba.module.css";

const DashboardCeibaPro = () => {
  const navigate = useNavigate();

  const handleOpenSaludColectiva = () => {
    navigate("/dashboardCba/saludColectiva");
  };

  const handleOpenSaludVida = () => {
    navigate("/dashboardCba/saludVida");
  };

  const handleLogout = () => {
    // Aquí podrías limpiar token o sesión si lo usas
    // localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.blob1 + " " + styles.blob}></div>
      <div className={styles.blob2 + " " + styles.blob}></div>
      <div className={styles.blob3 + " " + styles.blob}></div>

      <div className={styles.header}>
        <h1 className={styles.title}>Portal de Servicios</h1>
        <p className={styles.subtitle}>
          Seleccione el formulario al que desea acceder y rellena la información
          solicitada para que pueda ser procesada de manera eficiente y segura.
        </p>
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.card} onClick={handleOpenSaludColectiva}>
          <div className={styles.cardIcon}>
            <FaHeartbeat size={32} />
          </div>
          <h2 className={styles.cardTitle}>
            Salud Colectiva <span>SURA</span>
          </h2>
          <button className={styles.button}>ACCEDER</button>
        </div>

        <div className={styles.card} onClick={handleOpenSaludVida}>
          <div className={styles.cardIcon}>
            <FaUserShield size={32} />
          </div>
          <h2 className={styles.cardTitle}>Vida Grupo</h2>
          <button className={styles.button}>ACCEDER</button>
        </div>
      </div>

      {/* 🔴 Botón cerrar sesión */}
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default DashboardCeibaPro;
