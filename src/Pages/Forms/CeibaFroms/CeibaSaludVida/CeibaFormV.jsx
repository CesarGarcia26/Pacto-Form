import React, { useState, useEffect, useRef } from "react";
import styles from '../CeibaSaludColetiva/CeinaForm.module.css';
import { useNavigate } from "react-router-dom";
import PactoArrubla from '../../../../assets/Imagens/PactoArrubla.png';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Step1V from '../../../../Components/CeibaComponents/SaludVida/Step1V';
import Step2V from '../../../../Components/CeibaComponents/SaludVida/Step2V';
import Step3V from '../../../../Components/CeibaComponents/SaludVida/Step3V';
import Step4V from "../../../../Components/CeibaComponents/SaludVida/Step4V";
import Step5V from "../../../../Components/CeibaComponents/SaludVida/Step5V";
import Step6V from "../../../../Components/CeibaComponents/SaludVida/Step6V";
import Step7V from "../../../../Components/CeibaComponents/SaludVida/Step7V";
import Step8V from "../../../../Components/CeibaComponents/SaludVida/Step8V";
import Step9V from "../../../../Components/CeibaComponents/SaludVida/Step9V";
import Step10V from "../../../../Components/CeibaComponents/SaludVida/Step10V";
import Step11V from "../../../../Components/CeibaComponents/SaludVida/Step11V";
import Step13V from "../../../../Components/CeibaComponents/SaludVida/Step13V";

const CeibaFormV = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const scrollTopRef = useRef(null);
  const [formData, setFormData] = useState({
    step1VData: {},
    step2VData: {},

    step3VData: {},
    step4VData: {},
    step5VData: {},
    step6VData: {},
    step7VData: {},
    step8VData: {},
    step9VData: {},
    step10VData: {},
    step11VData: {},
    step12VData: {},
  });

  const handleExitSaludColectiva = () => {
    navigate("/dashboardCba");
  };

  const handleNextStep = (stepData) => {
    const stepKey = `step${currentStep}VData`;

    setFormData((prev) => ({
      ...prev,
      [stepKey]: stepData,
    }));

    setCurrentStep((prev) => Math.min(prev + 1, 12));
  };


  const handlePreviousStep = (stepData) => {
    const stepKey = `step${currentStep}VData`;

    setFormData((prev) => ({
      ...prev,
      [stepKey]: stepData,
    }));

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Efecto para hacer scroll automático cuando cambia el step
  useEffect(() => {
    // Múltiples intentos para asegurar que el scroll funcione
    const scrollToTop = () => {
      // Intentar primero con el elemento ref
      if (scrollTopRef.current) {
        scrollTopRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }

      // También hacer scroll directo en window y document
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    // Primer intento inmediato
    scrollToTop();

    // Segundo intento con delay para asegurar que el DOM se haya actualizado
    const timer1 = setTimeout(scrollToTop, 100);

    // Tercer intento con más delay por si el render es lento
    const timer2 = setTimeout(scrollToTop, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1V onNext={handleNextStep} initialData={formData.step1VData} />;
      case 2:
        return <Step2V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step2VData} />;
      case 3:
        return <Step3V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step3VData} />;
      case 4:
        return <Step4V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step4VData} />;
      case 5:
        return <Step5V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step5VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData} />;
      case 6:
        return <Step6V
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          initialData={formData.step6VData}
          step1Data={formData.step1VData}
          step2Data={formData.step2VData}
          step4Data={formData.step4VData}
          step5Data={formData.step5VData} // ✅ Aquí lo agregamos
        />;
      case 7:
        return <Step7V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step7VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData} step6Data={formData.step6VData} step5Data={formData.step5VData} />;
      case 8:
        return <Step8V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step8VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData}
          step7Data={formData.step7VData} step6Data={formData.step6VData} step5Data={formData.step5VData} />;
      case 9:
        return <Step9V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step9VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData}
          step8Data={formData.step8VData} step7Data={formData.step7VData} step6Data={formData.step6VData} step5Data={formData.step5VData} />;
      case 10:
        return <Step10V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step10VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData}
          step9Data={formData.step9VData} step8Data={formData.step8VData} step7Data={formData.step7VData} step6Data={formData.step6VData} step5Data={formData.step5VData} />;
      case 11:
        return <Step11V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step11VData} step4Data={formData.step4VData} step2Data={formData.step2VData} step1Data={formData.step1VData} />;
      case 12:
        return (
          <Step13V onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={formData.step12VData} {...formData}
          />
        );
      default:
        return <Step1V onNext={handleNextStep} initialData={formData.step1VData} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Elemento invisible para scroll automático - posicionado al inicio del contenedor */}
      <div
        ref={scrollTopRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
        aria-hidden="true"
      />

      <h1 className={styles.title}>Formulario Vida Grupo</h1>
      <div style={{ alignSelf: 'flex-start', width: '100%' }}>
        <button
          className={`${styles.volver} ${currentStep !== 1 ? styles.invisible : ''}`}
          onClick={handleExitSaludColectiva}
        >
          <ArrowBackIosIcon />
          Volver
        </button>
      </div>
      <img src={PactoArrubla} alt="Logo Login" className={styles.loginImage} />
      <div className={styles.pageCounter}>Página {currentStep} / 12</div>
      {renderCurrentStep()}
      <div className={styles.circleTopRight}></div>
      <div className={styles.circleBottomLeft}></div>
    </div>
  );
};

export default CeibaFormV;
