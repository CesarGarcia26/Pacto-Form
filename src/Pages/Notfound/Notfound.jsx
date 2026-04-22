import React from 'react';
import { useNavigate } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import styles from './Notfound.module.css';

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notfoundContainer}>
      <div className={styles.circleTop}></div>
      <div className={styles.circleBottom}></div>

      <div className={styles.notfoundCard}>
        <div className={styles.notfoundIcon}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: '#3b82f6' }} />
        </div>
        <h1 className={styles.notfoundTitle}>404</h1>
        <p className={styles.notfoundText}>
          ¡Ups! Parece que te has perdido en el espacio digital.<br />
          La página que buscas no existe.
        </p>
        <button className={styles.notfoundButton} onClick={() => navigate('/')}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Notfound;
