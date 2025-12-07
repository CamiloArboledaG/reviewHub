/**
 * Design Tokens - Transitions & Animations
 * Centraliza todos los estilos de transiciones y animaciones
 */

export const transitions = {
  // Duration
  duration: {
    fastest: 'duration-75',
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300',
    slower: 'duration-500',
    slowest: 'duration-700',
  },

  // Timing Functions
  timing: {
    linear: 'ease-linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },

  // Delay
  delay: {
    0: 'delay-0',
    75: 'delay-75',
    100: 'delay-100',
    150: 'delay-150',
    200: 'delay-200',
    300: 'delay-300',
    500: 'delay-500',
    700: 'delay-700',
  },

  // Property - Qué propiedades animar
  property: {
    none: 'transition-none',
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    shadow: 'transition-shadow',
    transform: 'transition-transform',
  },
} as const;

/**
 * Transition Presets - Combinaciones comunes
 */
export const transitionPresets = {
  // Hover Effects
  hover: {
    default: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    shadow: 'transition-shadow duration-300 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
  },

  // Focus Effects
  focus: {
    default: 'transition-all duration-150 ease-in-out',
    ring: 'transition-all duration-150 ease-in-out focus:ring-2',
  },

  // Modal/Dialog
  modal: {
    overlay: 'transition-opacity duration-300 ease-in-out',
    content: 'transition-all duration-300 ease-in-out',
  },

  // Slide Animations
  slide: {
    up: 'transition-transform duration-300 ease-in-out',
    down: 'transition-transform duration-300 ease-in-out',
    left: 'transition-transform duration-300 ease-in-out',
    right: 'transition-transform duration-300 ease-in-out',
  },

  // Fade Animations
  fade: {
    in: 'transition-opacity duration-300 ease-in',
    out: 'transition-opacity duration-300 ease-out',
    inOut: 'transition-opacity duration-300 ease-in-out',
  },

  // Scale Animations
  scale: {
    default: 'transition-transform duration-200 ease-in-out hover:scale-105',
    subtle: 'transition-transform duration-200 ease-in-out hover:scale-102',
    strong: 'transition-transform duration-200 ease-in-out hover:scale-110',
  },
} as const;

/**
 * Animation Keyframes - Para animaciones más complejas
 */
export const animations = {
  // Loading/Spinner
  spin: 'animate-spin',
  ping: 'animate-ping',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',

  // Custom Animations (definidas en globals.css)
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
} as const;

/**
 * Component-specific Transitions
 */
export const componentTransitions = {
  // Button Transitions
  button: {
    default: 'transition-all duration-200 ease-in-out',
    hover: 'transition-colors duration-200 ease-in-out hover:opacity-90',
  },

  // Card Transitions
  card: {
    default: 'transition-shadow duration-300 ease-in-out',
    hover: 'transition-all duration-300 ease-in-out',
  },

  // Input Transitions
  input: {
    default: 'transition-all duration-150 ease-in-out',
    focus: 'transition-all duration-150 ease-in-out focus:ring-2',
  },

  // Modal Transitions
  modal: {
    overlay: 'transition-opacity duration-300 ease-in-out',
    content: 'transition-all duration-300 ease-out',
  },

  // Dropdown Transitions
  dropdown: {
    default: 'transition-all duration-200 ease-in-out',
  },

  // Toast Transitions
  toast: {
    enter: 'transition-all duration-300 ease-out',
    exit: 'transition-all duration-200 ease-in',
  },
} as const;
