/**
 * Design Tokens - Colors
 * Centraliza todos los colores usados en la aplicación
 */

export const colors = {
  // Category Colors - Colores base por categoría
  category: {
    game: {
      50: 'rgb(250, 245, 255)',    // purple-50
      100: 'rgb(243, 232, 255)',   // purple-100
      200: 'rgb(233, 213, 255)',   // purple-200
      500: 'rgb(168, 85, 247)',    // purple-500
      600: 'rgb(147, 51, 234)',    // purple-600
      700: 'rgb(126, 34, 206)',    // purple-700
      800: 'rgb(107, 33, 168)',    // purple-800
      900: 'rgb(88, 28, 135)',     // purple-900
    },
    movie: {
      50: 'rgb(255, 241, 242)',    // rose-50
      100: 'rgb(255, 228, 230)',   // rose-100
      200: 'rgb(254, 205, 211)',   // rose-200
      500: 'rgb(244, 63, 94)',     // rose-500
      600: 'rgb(225, 29, 72)',     // rose-600
      700: 'rgb(190, 18, 60)',     // rose-700
      800: 'rgb(159, 18, 57)',     // rose-800
      900: 'rgb(136, 19, 55)',     // rose-900
    },
    series: {
      50: 'rgb(239, 246, 255)',    // blue-50
      100: 'rgb(219, 234, 254)',   // blue-100
      200: 'rgb(191, 219, 254)',   // blue-200
      500: 'rgb(59, 130, 246)',    // blue-500
      600: 'rgb(37, 99, 235)',     // blue-600
      700: 'rgb(29, 78, 216)',     // blue-700
      800: 'rgb(30, 64, 175)',     // blue-800
      900: 'rgb(30, 58, 138)',     // blue-900
    },
    book: {
      50: 'rgb(236, 253, 245)',    // emerald-50
      100: 'rgb(209, 250, 229)',   // emerald-100
      200: 'rgb(167, 243, 208)',   // emerald-200
      500: 'rgb(16, 185, 129)',    // emerald-500
      600: 'rgb(5, 150, 105)',     // emerald-600
      700: 'rgb(4, 120, 87)',      // emerald-700
      800: 'rgb(6, 95, 70)',       // emerald-800
      900: 'rgb(6, 78, 59)',       // emerald-900
    },
  },

  // Semantic Colors - Colores semánticos de la aplicación
  semantic: {
    primary: {
      DEFAULT: 'rgb(147, 51, 234)',     // purple-600
      foreground: 'rgb(255, 255, 255)', // white
      hover: 'rgb(126, 34, 206)',       // purple-700
    },
    secondary: {
      DEFAULT: 'rgb(243, 244, 246)',    // gray-100
      foreground: 'rgb(17, 24, 39)',    // gray-900
      hover: 'rgb(229, 231, 235)',      // gray-200
    },
    success: {
      DEFAULT: 'rgb(16, 185, 129)',     // emerald-500
      foreground: 'rgb(255, 255, 255)', // white
      light: 'rgb(209, 250, 229)',      // emerald-100
    },
    error: {
      DEFAULT: 'rgb(239, 68, 68)',      // red-500
      foreground: 'rgb(255, 255, 255)', // white
      light: 'rgb(254, 226, 226)',      // red-100
    },
    warning: {
      DEFAULT: 'rgb(251, 191, 36)',     // amber-400
      foreground: 'rgb(17, 24, 39)',    // gray-900
      light: 'rgb(254, 243, 199)',      // amber-100
    },
    info: {
      DEFAULT: 'rgb(59, 130, 246)',     // blue-500
      foreground: 'rgb(255, 255, 255)', // white
      light: 'rgb(219, 234, 254)',      // blue-100
    },
  },

  // UI Colors - Colores de interfaz
  ui: {
    background: 'rgb(255, 255, 255)',       // white
    foreground: 'rgb(17, 24, 39)',          // gray-900
    card: 'rgb(255, 255, 255)',             // white
    cardForeground: 'rgb(17, 24, 39)',      // gray-900
    muted: 'rgb(243, 244, 246)',            // gray-100
    mutedForeground: 'rgb(107, 114, 128)',  // gray-500
    border: 'rgb(229, 231, 235)',           // gray-200
    accent: 'rgb(243, 244, 246)',           // gray-100
    accentForeground: 'rgb(17, 24, 39)',    // gray-900
  },

  // Interaction Colors - Colores de interacción
  interaction: {
    like: {
      DEFAULT: 'rgb(244, 63, 94)',      // rose-500
      hover: 'rgb(225, 29, 72)',        // rose-600
      background: 'rgba(244, 63, 94, 0.1)', // rose-500/10
    },
    comment: {
      DEFAULT: 'rgb(147, 51, 234)',     // purple-600
      hover: 'rgb(126, 34, 206)',       // purple-700
      background: 'rgba(147, 51, 234, 0.1)', // purple-600/10
    },
    share: {
      DEFAULT: 'rgb(59, 130, 246)',     // blue-500
      hover: 'rgb(37, 99, 235)',        // blue-600
      background: 'rgba(59, 130, 246, 0.1)', // blue-500/10
    },
  },

  // Utility Colors
  utility: {
    white: 'rgb(255, 255, 255)',
    black: 'rgb(0, 0, 0)',
    transparent: 'transparent',
  },
} as const;

/**
 * Genera clases de Tailwind para colores de categoría
 * Útil para aplicar estilos dinámicamente
 */
export const categoryColorClasses = {
  game: {
    bg: {
      light: 'bg-purple-50',
      base: 'bg-purple-100',
      medium: 'bg-purple-500',
      dark: 'bg-purple-700',
    },
    text: {
      light: 'text-purple-600',
      base: 'text-purple-700',
      dark: 'text-purple-900',
    },
    border: {
      light: 'border-purple-200',
      base: 'border-purple-500',
      dark: 'border-purple-700',
    },
  },
  movie: {
    bg: {
      light: 'bg-rose-50',
      base: 'bg-rose-100',
      medium: 'bg-rose-500',
      dark: 'bg-rose-700',
    },
    text: {
      light: 'text-rose-600',
      base: 'text-rose-700',
      dark: 'text-rose-900',
    },
    border: {
      light: 'border-rose-200',
      base: 'border-rose-500',
      dark: 'border-rose-700',
    },
  },
  series: {
    bg: {
      light: 'bg-blue-50',
      base: 'bg-blue-100',
      medium: 'bg-blue-500',
      dark: 'bg-blue-700',
    },
    text: {
      light: 'text-blue-600',
      base: 'text-blue-700',
      dark: 'text-blue-900',
    },
    border: {
      light: 'border-blue-200',
      base: 'border-blue-500',
      dark: 'border-blue-700',
    },
  },
  book: {
    bg: {
      light: 'bg-emerald-50',
      base: 'bg-emerald-100',
      medium: 'bg-emerald-500',
      dark: 'bg-emerald-700',
    },
    text: {
      light: 'text-emerald-600',
      base: 'text-emerald-700',
      dark: 'text-emerald-900',
    },
    border: {
      light: 'border-emerald-200',
      base: 'border-emerald-500',
      dark: 'border-emerald-700',
    },
  },
} as const;
