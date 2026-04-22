import 'choices.js/public/assets/styles/choices.min.css';

/**
 * Configuración base para Choices.js
 * Adaptada a los estilos existentes del proyecto
 */
export const choicesConfig = {
  searchEnabled: true,
  searchPlaceholderValue: 'Buscar...',
  noResultsText: 'No se encontraron resultados',
  noChoicesText: 'No hay opciones disponibles',
  itemSelectText: 'Presione para seleccionar',
  searchResultLimit: 50,
  shouldSort: false, // Mantener el orden original de las opciones
  removeItemButton: false,
  position: 'bottom',
  classNames: {
    containerOuter: 'choices',
    containerInner: 'choices__inner',
    input: 'choices__input',
    inputCloned: 'choices__input--cloned',
    list: 'choices__list',
    listItems: 'choices__list--multiple',
    listSingle: 'choices__list--single',
    listDropdown: 'choices__list--dropdown',
    item: 'choices__item',
    itemSelectable: 'choices__item--selectable',
    itemDisabled: 'choices__item--disabled',
    itemChoice: 'choices__item--choice',
    placeholder: 'choices__placeholder',
    group: 'choices__group',
    groupHeading: 'choices__heading',
    button: 'choices__button',
    activeState: 'is-active',
    focusState: 'is-focused',
    openState: 'is-open',
    disabledState: 'is-disabled',
    highlightedState: 'is-highlighted',
    selectedState: 'is-selected',
    flippedState: 'is-flipped',
    loadingState: 'is-loading',
  }
};

/**
 * Determina si un select debe inicializarse con Choices.js
 * @param {number} optionsCount - Número de opciones en el select
 * @returns {boolean} - true si debe inicializarse
 */
export const shouldInitializeChoices = (optionsCount) => {
  return optionsCount > 10;
};

/**
 * Estilos CSS personalizados para Choices.js
 * Estos estilos se inyectan dinámicamente para adaptarse al diseño existente
 */
export const injectChoicesStyles = () => {
  // Verificar si ya se inyectaron los estilos
  if (document.getElementById('choices-custom-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'choices-custom-styles';
  style.textContent = `
    /* Solo ajuste de z-index para evitar conflictos de renderizado */
    .choices__list--dropdown {
      z-index: 1000 !important;
    }
  `;
  document.head.appendChild(style);
};
