/**
 * Design Tokens - Shadows
 * Centraliza todos los estilos de sombras
 */

export const shadows = {
  // Shadow Scale
  scale: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // Shadow Colors - Para sombras de colores específicos
  colored: {
    game: 'shadow-lg shadow-purple-500/20',
    movie: 'shadow-lg shadow-rose-500/20',
    series: 'shadow-lg shadow-blue-500/20',
    book: 'shadow-lg shadow-emerald-500/20',
  },

  // Inner Shadow
  inner: 'shadow-inner',
} as const;

/**
 * Component Shadow Presets
 */
export const componentShadows = {
  // Card Shadows
  card: {
    default: 'shadow-sm',
    hover: 'hover:shadow-md',
    transition: 'shadow-sm hover:shadow-md transition-shadow duration-300',
  },

  // Button Shadows
  button: {
    default: 'shadow-none',
    elevated: 'shadow-sm',
    hover: 'hover:shadow-md',
  },

  // Modal/Dialog Shadows
  modal: {
    default: 'shadow-2xl',
    backdrop: 'shadow-xl',
  },

  // Dropdown/Menu Shadows
  dropdown: {
    default: 'shadow-lg',
  },

  // Image Shadows
  image: {
    default: 'shadow-md',
    cover: 'shadow-lg',
  },

  // Avatar Shadows
  avatar: {
    default: 'shadow-none',
    elevated: 'shadow-sm',
  },

  // Floating Action Button
  fab: {
    default: 'shadow-xl shadow-gray-400',
    hover: 'hover:shadow-2xl',
  },
} as const;

/**
 * Category-specific Glow Effects
 */
export const glowEffects = {
  game: {
    subtle: 'shadow-[0_0_10px_rgba(147,51,234,0.3)]',
    medium: 'shadow-[0_0_15px_rgba(147,51,234,0.4)]',
    strong: 'shadow-[0_0_20px_rgba(147,51,234,0.5)]',
  },
  movie: {
    subtle: 'shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    medium: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    strong: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
  },
  series: {
    subtle: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    medium: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    strong: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  },
  book: {
    subtle: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    medium: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    strong: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
  },
} as const;
