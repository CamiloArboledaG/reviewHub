/**
 * Design Tokens - Spacing
 * Centraliza todos los valores de espaciado
 */

export const spacing = {
  // Spacing Scale - Valores individuales
  scale: {
    0: '0',
    0.5: '0.125rem',    // 2px
    1: '0.25rem',       // 4px
    1.5: '0.375rem',    // 6px
    2: '0.5rem',        // 8px
    2.5: '0.625rem',    // 10px
    3: '0.75rem',       // 12px
    3.5: '0.875rem',    // 14px
    4: '1rem',          // 16px
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    11: '2.75rem',      // 44px
    12: '3rem',         // 48px
    14: '3.5rem',       // 56px
    16: '4rem',         // 64px
    20: '5rem',         // 80px
    24: '6rem',         // 96px
  },

  // Padding Presets - Casos de uso comunes
  padding: {
    none: 'p-0',
    xs: 'p-2',          // 8px
    sm: 'p-3',          // 12px
    md: 'p-4',          // 16px
    lg: 'p-6',          // 24px
    xl: 'p-8',          // 32px
    '2xl': 'p-12',      // 48px
  },

  paddingX: {
    none: 'px-0',
    xs: 'px-2',         // 8px
    sm: 'px-3',         // 12px
    md: 'px-4',         // 16px
    lg: 'px-6',         // 24px
    xl: 'px-8',         // 32px
    '2xl': 'px-12',     // 48px
  },

  paddingY: {
    none: 'py-0',
    xs: 'py-2',         // 8px
    sm: 'py-3',         // 12px
    md: 'py-4',         // 16px
    lg: 'py-6',         // 24px
    xl: 'py-8',         // 32px
    '2xl': 'py-12',     // 48px
  },

  // Margin Presets
  margin: {
    none: 'm-0',
    xs: 'm-2',
    sm: 'm-3',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-12',
  },

  marginX: {
    none: 'mx-0',
    xs: 'mx-2',
    sm: 'mx-3',
    md: 'mx-4',
    lg: 'mx-6',
    xl: 'mx-8',
    '2xl': 'mx-12',
  },

  marginY: {
    none: 'my-0',
    xs: 'my-2',
    sm: 'my-3',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
    '2xl': 'my-12',
  },

  // Gap Presets - Para flexbox/grid
  gap: {
    none: 'gap-0',
    xs: 'gap-1',        // 4px
    sm: 'gap-2',        // 8px
    md: 'gap-3',        // 12px
    lg: 'gap-4',        // 16px
    xl: 'gap-6',        // 24px
    '2xl': 'gap-8',     // 32px
  },

  // Space Between - Para children spacing
  space: {
    none: 'space-y-0',
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-5',
    xl: 'space-y-6',
    '2xl': 'space-y-8',
  },
} as const;

/**
 * Component Spacing - Espaciado específico para componentes
 */
export const componentSpacing = {
  // Card Spacing
  card: {
    padding: 'p-4',           // Padding interno de cards
    gap: 'gap-3',             // Gap entre elementos de card
    contentGap: 'gap-2',      // Gap entre contenido de card
  },

  // Button Spacing
  button: {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
    icon: 'p-2',
  },

  // Input Spacing
  input: {
    sm: 'px-3 py-2',
    md: 'px-4 py-2.5',
    lg: 'px-4 py-3',
  },

  // Badge/Tag Spacing
  badge: {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-0.5',
    lg: 'px-3 py-1',
  },

  // Avatar Spacing
  avatar: {
    ring: '2',              // ring-2
    ringOffset: '0',        // ring-offset-0
  },

  // Modal/Dialog Spacing
  modal: {
    padding: 'p-6',
    gap: 'gap-4',
  },

  // Form Spacing
  form: {
    fieldGap: 'space-y-4',
    labelGap: 'mb-2',
  },
} as const;
