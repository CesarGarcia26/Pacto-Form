import { useEffect, useRef } from 'react';
import Choices from 'choices.js';
import { choicesConfig, shouldInitializeChoices, injectChoicesStyles } from '../Config/choicesConfig';

/**
 * Hook personalizado para inicializar Choices.js en un select
 * Solo inicializa si el select tiene más de 10 opciones
 * 
 * @param {number} optionsCount - Número de opciones en el select
 * @returns {Object} - { selectRef, choicesInstance }
 */
export const useChoices = (optionsCount) => {
    const selectRef = useRef(null);
    const choicesInstanceRef = useRef(null);

    useEffect(() => {
        // Inyectar estilos personalizados una sola vez
        injectChoicesStyles();

        // Solo inicializar si hay más de 10 opciones y el select existe
        if (selectRef.current && shouldInitializeChoices(optionsCount)) {
            // Destruir instancia anterior si existe
            if (choicesInstanceRef.current) {
                choicesInstanceRef.current.destroy();
            }

            // Crear nueva instancia de Choices
            try {
                choicesInstanceRef.current = new Choices(selectRef.current, choicesConfig);
            } catch (error) {
                console.error('Error al inicializar Choices.js:', error);
            }
        } else if (choicesInstanceRef.current && !shouldInitializeChoices(optionsCount)) {
            // Si ya no cumple la condición, destruir la instancia
            choicesInstanceRef.current.destroy();
            choicesInstanceRef.current = null;
        }

        // Cleanup al desmontar
        return () => {
            if (choicesInstanceRef.current) {
                choicesInstanceRef.current.destroy();
                choicesInstanceRef.current = null;
            }
        };
    }, [optionsCount]); // Re-ejecutar cuando cambie el número de opciones

    return {
        selectRef,
        choicesInstance: choicesInstanceRef.current
    };
};
