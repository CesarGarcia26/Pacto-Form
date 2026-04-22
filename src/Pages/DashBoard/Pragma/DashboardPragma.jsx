import React from "react";
import styles from "./DashboardPragma.module.css";

const DashboardPragma = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Elija el formulario que quiere diligenciar</h1>
      <p className={styles.subtitle}>
        Haga clic en la tarjeta que se ajuste a su necesidad.praggmmaa
      </p>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h2>Salud colectiva</h2>
          <button className={styles.button}>ENTRAR</button>
        </div>

        <div className={styles.card}>
          <h2>Salud De pension</h2>
          <button className={styles.button}>ENTRAR</button>
        </div>
      </div>

      <div className={styles.circle}></div>
    </div>
  );
};

export default DashboardPragma;
