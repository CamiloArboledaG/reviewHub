/**
 * Design Tokens - Borders
 * Centraliza todos los estilos de bordes
 */

export const borders = {
  // Border Width
  width: {
    0: 'border-0',
    1: 'border',          // 1px
    2: 'border-2',        // 2px
    4: 'border-4',        // 4px
    8: 'border-8',        // 8px
  },

  // Border Radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',       // 2px
    md: 'rounded-md',       // 6px
    lg: 'rounded-lg',       // 8px
    xl: 'rounded-xl',       // 12px
    '2xl': 'rounded-2xl',   // 16px
    '3xl': 'rounded-3xl',   // 24px
    full: 'rounded-full',   // 9999px
  },

  // Border Styles
  style: {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
    none: 'border-none',
  },

  // Ring (Focus rings)
  ring: {
    0: 'ring-0',
    1: 'ring-1',
    2: 'ring-2',
    4: 'ring-4',
    8: 'ring-8',
  },

  ringOffset: {
    0: 'ring-offset-0',
    1: 'ring-offset-1',
    2: 'ring-offset-2',
    4: 'ring-offset-4',
  },

  // Outline Styles
  outline: {
    none: 'outline-none',
    white: 'outline-white',
    black: 'outline-black',
    offset: {
      0: 'outline-offset-0',
      1: 'outline-offset-1',
      2: 'outline-offset-2',
      4: 'outline-offset-4',
    },
  },
} as const;

/**
 * Border Presets - Combinaciones comunes
 */
export const borderPresets = {
  // Card Borders
  card: {
    default: 'border border-border/50',
    hover: 'border border-border/50 hover:border-border',
    active: 'border-2 border-primary',
  },

  // Input Borders
  input: {
    default: 'border-2 border-gray-200',
    focus: 'focus:border-primary focus:ring-2 focus:ring-primary/20',
    error: 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/20',
  },

  // Button Borders
  button: {
    default: 'border-0',
    outline: 'border-2 border-current',
    ghost: 'border-0',
  },

  // Avatar Borders
  avatar: {
    default: 'ring-2 ring-border',
    active: 'ring-2 ring-primary',
    none: 'ring-0',
  },

  // Badge/Tag Borders
  badge: {
    default: 'border border-transparent',
    outlined: 'border border-current',
  },

  // Divider
  divider: {
    horizontal: 'border-t border-border/50',
    vertical: 'border-l border-border/50',
  },
} as const;

/**
 * Component-specific Border Configurations
 */
export const componentBorders = {
  // ReviewCard
  reviewCard: {
    container: 'border-border/50 rounded-xl',
    image: 'rounded-lg ring-1 ring-black/5',
    contentBox: 'rounded-xl border border-border/50',
  },

  // Modal
  modal: {
    default: 'rounded-2xl border-2 border-border',
    withGlow: (category: 'game' | 'movie' | 'series' | 'book') => {
      const glows = {
        game: 'border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.5)]',
        movie: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
        series: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        book: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      };
      return `rounded-2xl border-2 ${glows[category]}`;
    },
  },

  // Form Elements
  form: {
    input: 'rounded-lg border-2 border-gray-300 focus:border-primary',
    textarea: 'rounded-lg border-2 border-gray-300 focus:border-primary',
    select: 'rounded-lg border-2 border-gray-300',
  },
} as const;
