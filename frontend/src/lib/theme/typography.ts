/**
 * Design Tokens - Typography
 * Centraliza todos los estilos de tipografía
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
  },

  // Font Sizes - Con line-height apropiado
  fontSize: {
    xs: {
      size: '0.75rem',      // 12px
      lineHeight: '1rem',   // 16px
      class: 'text-xs',
    },
    sm: {
      size: '0.875rem',     // 14px
      lineHeight: '1.25rem', // 20px
      class: 'text-sm',
    },
    base: {
      size: '1rem',         // 16px
      lineHeight: '1.5rem', // 24px
      class: 'text-base',
    },
    lg: {
      size: '1.125rem',     // 18px
      lineHeight: '1.75rem', // 28px
      class: 'text-lg',
    },
    xl: {
      size: '1.25rem',      // 20px
      lineHeight: '1.75rem', // 28px
      class: 'text-xl',
    },
    '2xl': {
      size: '1.5rem',       // 24px
      lineHeight: '2rem',   // 32px
      class: 'text-2xl',
    },
    '3xl': {
      size: '1.875rem',     // 30px
      lineHeight: '2.25rem', // 36px
      class: 'text-3xl',
    },
    '4xl': {
      size: '2.25rem',      // 36px
      lineHeight: '2.5rem', // 40px
      class: 'text-4xl',
    },
  },

  // Font Weights
  fontWeight: {
    normal: {
      value: '400',
      class: 'font-normal',
    },
    medium: {
      value: '500',
      class: 'font-medium',
    },
    semibold: {
      value: '600',
      class: 'font-semibold',
    },
    bold: {
      value: '700',
      class: 'font-bold',
    },
  },

  // Line Heights
  lineHeight: {
    none: {
      value: '1',
      class: 'leading-none',
    },
    tight: {
      value: '1.25',
      class: 'leading-tight',
    },
    snug: {
      value: '1.375',
      class: 'leading-snug',
    },
    normal: {
      value: '1.5',
      class: 'leading-normal',
    },
    relaxed: {
      value: '1.625',
      class: 'leading-relaxed',
    },
    loose: {
      value: '2',
      class: 'leading-loose',
    },
  },

  // Letter Spacing
  letterSpacing: {
    tighter: {
      value: '-0.05em',
      class: 'tracking-tighter',
    },
    tight: {
      value: '-0.025em',
      class: 'tracking-tight',
    },
    normal: {
      value: '0',
      class: 'tracking-normal',
    },
    wide: {
      value: '0.025em',
      class: 'tracking-wide',
    },
    wider: {
      value: '0.05em',
      class: 'tracking-wider',
    },
  },
} as const;

/**
 * Typography Presets - Combinaciones predefinidas para casos de uso comunes
 */
export const typographyPresets = {
  // Headers
  h1: 'text-4xl font-bold leading-tight',
  h2: 'text-3xl font-bold leading-tight',
  h3: 'text-2xl font-semibold leading-snug',
  h4: 'text-xl font-semibold leading-snug',
  h5: 'text-lg font-semibold leading-normal',
  h6: 'text-base font-semibold leading-normal',

  // Body Text
  bodyLarge: 'text-lg font-normal leading-relaxed',
  body: 'text-base font-normal leading-normal',
  bodySmall: 'text-sm font-normal leading-normal',

  // Labels & UI Text
  label: 'text-sm font-medium leading-normal',
  labelSmall: 'text-xs font-medium leading-normal',
  caption: 'text-xs font-normal leading-normal',

  // Interactive Elements
  buttonLarge: 'text-base font-semibold leading-normal',
  button: 'text-sm font-semibold leading-normal',
  buttonSmall: 'text-xs font-semibold leading-normal',

  // Card Components
  cardTitle: 'text-base font-semibold leading-tight',
  cardSubtitle: 'text-sm font-normal leading-normal',
  cardDescription: 'text-sm font-normal leading-relaxed',
  cardMeta: 'text-xs font-normal leading-normal',

  // Badge & Tag
  badge: 'text-xs font-normal leading-none',
  tag: 'text-xs font-medium leading-none',

  // Review Specific
  reviewTitle: 'text-base font-semibold leading-tight',
  reviewContent: 'text-sm font-normal leading-relaxed',
  reviewMeta: 'text-xs font-normal leading-normal',
  userName: 'font-semibold leading-normal',
  userHandle: 'text-sm text-muted-foreground leading-normal',
  timestamp: 'text-sm text-muted-foreground leading-normal',
} as const;

/**
 * Responsive Typography - Escalas responsivas
 */
export const responsiveTypography = {
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h2: 'text-2xl md:text-3xl lg:text-4xl font-bold',
  h3: 'text-xl md:text-2xl lg:text-3xl font-semibold',
  body: 'text-sm md:text-base',
} as const;
