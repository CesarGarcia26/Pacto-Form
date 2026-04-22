import React, { useState, useEffect, useRef } from "react";
import styles from './CeinaForm.module.css';
import { useNavigate } from "react-router-dom";
import PactoArrubla from '../../../../assets/Imagens/PactoArrubla.png';
import Step1 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step1';
import Step2 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step2';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Step3 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step3';
import Step4 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step4';
import Step5 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step5';
import Step6 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step6';
import Step7 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step7';
import Step8 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step8';
import Step9 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step9';
import Step10 from '../../../../Components/CeibaComponents/SaludColectivaSura/Step10';
const CeibaForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const scrollTopRef = useRef(null);
    const [formData, setFormData] = useState({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        step6: {},
        step7: {},
        step8: {},
        step9: {},
        step10: {}
    });
    //claudia hola asss
    const handleExitSaludColectiva = () => {
        navigate("/dashboardCba");
    };

    const handleNextStep = (stepData) => {
        // Guardar los datos del paso actual
        setFormData(prev => ({
            ...prev,
            [`step${currentStep}`]: stepData
        }));
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = (stepData) => {
        // Guardar los datos del paso actual antes de retroceder
        setFormData(prev => ({
            ...prev,
            [`step${currentStep}`]: stepData
        }));
        setCurrentStep(currentStep - 1);
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
                return <Step1
                    onNext={handleNextStep}
                    initialData={formData.step1}
                />;
            case 2:
                return <Step2
                    onNext={handleNextStep}
                    onPrevious={handlePreviousStep}
                    initialData={formData.step2}
                    step1Data={formData.step1}
                />;
            case 3:
                return (
                    <Step3
                        onPrevious={handlePreviousStep}
                        onNext={handleNextStep}
                        initialData={formData.step3}
                        solicitantesResumen={formData.step2?.solicitantesResumen || []}
                        cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                        solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}
                    />
                );
            case 4:
                return (
                    <Step4
                        onPrevious={handlePreviousStep}
                        onNext={handleNextStep}
                        initialData={formData.step4}
                        solicitantesResumen={formData.step2?.solicitantesResumen || []}
                        cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                        solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}
                    />
                );
            case 5:
                return <Step5
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    initialData={formData.step5}
                    solicitantesResumen={formData.step2?.solicitantesResumen || []}
                    cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                    solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}
                />;
            case 6:
                return <Step6
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    initialData={formData.step6}
                    solicitantesResumen={formData.step2?.solicitantesResumen || []}
                    cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                    solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}

                />;
            case 7:
                return <Step7
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    initialData={formData.step7}
                    solicitantesResumen={formData.step2?.solicitantesResumen || []}
                    cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                    solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}
                />;
            case 8:
                return <Step8
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    initialData={formData.step8}
                    solicitantesResumen={formData.step2?.solicitantesResumen || []}
                    cantidadPersonasAdicionales={formData.step2?.cantidadPersonasAdicionales}
                    solicitantePrincipalSeAgrega={formData.step2?.solicitantePrincipalSeAgrega}
                    step2Data={formData.step2}
                />;
            case 9:
                return <Step9
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    initialData={formData.step9}
                />;
            case 10:
                return <Step10
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    step1Data={formData.step1}
                    step2Data={formData.step2}
                    step3Data={formData.step3}
                    step4Data={formData.step4}
                    step5Data={formData.step5}
                    step6Data={formData.step6}
                    step7Data={formData.step7}
                    step8Data={formData.step8}
                    step9Data={formData.step9}
                    initialData={formData.step10}
                />;

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

            <h1 className={styles.title}>Formulario Salud colectiva</h1>

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

            {/* 📌 Contador de páginas */}
            <div className={styles.pageCounter}>
                Página {currentStep} / 10
            </div>

            {renderCurrentStep()}

            <div className={styles.circleTopRight}></div>
            <div className={styles.circleBottomLeft}></div>
        </div>
    );
};

export default CeibaForm;