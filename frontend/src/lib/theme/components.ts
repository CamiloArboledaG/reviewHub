/**
 * Design Tokens - Components
 * Tokens específicos para componentes individuales
 */

/**
 * ReviewCard Component Tokens
 */
export const reviewCard = {
  // Container
  container: {
    base: 'w-full max-w-2xl',
    border: 'border-border/50',
    borderRadius: 'rounded-xl',
    background: 'bg-card',
    shadow: 'shadow-sm hover:shadow-md',
    transition: 'transition-shadow duration-300',
    overflow: 'overflow-hidden',
  },

  // Header Section
  header: {
    container: 'flex items-start justify-between p-4 pb-3',
    userSection: 'flex items-center gap-3',
    actionsSection: 'flex items-center gap-2',
  },

  // Avatar
  avatar: {
    size: 'h-11 w-11',
    ring: 'ring-2 ring-border',
    fallback: {
      background: 'bg-primary/10',
      text: 'text-primary font-medium',
    },
  },

  // User Info
  userInfo: {
    container: 'flex flex-col',
    nameRow: 'flex items-center gap-2',
    name: 'font-semibold text-foreground',
    handle: 'text-muted-foreground text-sm',
    separator: 'text-muted-foreground/60 text-sm',
    timestamp: 'text-muted-foreground/60 text-sm',
  },

  // Badge (Category)
  badge: {
    container: 'w-fit mt-1 gap-1.5 text-xs font-normal px-2 py-0.5 border',
    icon: 'h-3 w-3',
    skeleton: 'h-5 w-24 bg-muted rounded-full animate-pulse mt-1',
    colors: (slug: 'game' | 'movie' | 'series' | 'book') => {
      const colorMap = {
        game: 'bg-purple-100 text-purple-700 border-purple-200',
        movie: 'bg-rose-100 text-rose-700 border-rose-200',
        series: 'bg-blue-100 text-blue-700 border-blue-200',
        book: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };
      return colorMap[slug];
    },
  },

  // Follow Button
  followButton: {
    base: 'rounded-full h-8 px-4 text-xs font-medium',
    following: 'variant-secondary',
    notFollowing: 'variant-default',
  },

  // More Button
  moreButton: {
    base: 'h-8 w-8 text-muted-foreground',
    icon: 'h-4 w-4',
  },

  // Content Section
  content: {
    container: 'px-4 pb-4',
    box: 'flex gap-4 p-4 rounded-xl bg-muted/50 border border-border/50',
  },

  // Item Cover
  cover: {
    container: 'flex-shrink-0',
    image: 'relative w-20 h-28 rounded-lg overflow-hidden shadow-lg ring-1 ring-black/5',
    placeholder: 'w-full h-full bg-gray-200 flex items-center justify-center',
    placeholderIcon: 'h-8 w-8 text-gray-400',
  },

  // Item Info
  itemInfo: {
    container: 'flex-1 min-w-0 flex flex-col gap-2',
    title: 'font-semibold text-foreground text-base leading-tight line-clamp-1',
    ratingContainer: 'flex items-center gap-1.5',
    reviewText: 'text-sm text-foreground/90 leading-relaxed line-clamp-2',
  },

  // Actions Section
  actions: {
    container: 'flex items-center justify-between px-4 py-3 border-t border-border/50',
    leftGroup: 'flex items-center gap-1',
    button: {
      base: 'gap-2 rounded-full h-9 px-3 text-sm font-medium',
      like: 'text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10',
      comment: 'text-muted-foreground hover:text-primary hover:bg-primary/10',
      share: 'text-muted-foreground hover:text-primary hover:bg-primary/10',
      icon: 'h-[18px] w-[18px]',
    },
  },
} as const;

/**
 * Button Component Tokens
 */
export const button = {
  // Base Styles
  base: 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',

  // Sizes
  sizes: {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
    icon: 'h-10 w-10',
  },

  // Variants
  variants: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },

  // Radius
  radius: {
    default: 'rounded-md',
    full: 'rounded-full',
  },
} as const;

/**
 * Input Component Tokens
 */
export const input = {
  // Base Styles
  base: 'w-full transition-all duration-150 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',

  // Sizes
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-base',
  },

  // Variants
  variants: {
    default: 'border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20',
    error: 'border-2 border-red-500 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
  },

  // With Icons
  withIcon: {
    left: {
      sm: 'pl-10',
      md: 'pl-11',
      lg: 'pl-12',
    },
    right: {
      sm: 'pr-10',
      md: 'pr-11',
      lg: 'pr-12',
    },
  },
} as const;

/**
 * Badge Component Tokens
 */
export const badge = {
  // Base Styles
  base: 'inline-flex items-center font-normal transition-colors',

  // Sizes
  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  },

  // Variants
  variants: {
    default: 'bg-primary text-primary-foreground border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    outline: 'text-foreground border-current',
  },

  // Radius
  radius: 'rounded-full',
} as const;

/**
 * Modal Component Tokens
 */
export const modal = {
  // Overlay
  overlay: {
    base: 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
    animation: 'transition-opacity duration-300 ease-in-out',
  },

  // Container
  container: {
    base: 'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
    background: 'bg-card',
    border: 'rounded-2xl border-2 border-border',
    shadow: 'shadow-2xl',
    animation: 'transition-all duration-300 ease-out',
  },

  // Header
  header: {
    container: 'flex items-center justify-between p-6 pb-4',
    title: 'text-2xl font-bold',
    description: 'text-sm text-muted-foreground mt-1',
  },

  // Content
  content: {
    container: 'px-6 pb-6',
  },

  // Category Glow Variants
  categoryGlow: (category: 'game' | 'movie' | 'series' | 'book') => {
    const glows = {
      game: 'border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.5)]',
      movie: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
      series: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      book: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    };
    return `rounded-2xl border-2 ${glows[category]} animate-border-glow`;
  },
} as const;

/**
 * Card Component Tokens
 */
export const card = {
  // Base Styles
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',

  // Variants
  variants: {
    default: 'border-border',
    elevated: 'border-border shadow-md',
    interactive: 'border-border hover:shadow-md transition-shadow duration-300 cursor-pointer',
  },

  // Parts
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-2xl font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',
} as const;

/**
 * Avatar Component Tokens
 */
export const avatar = {
  // Sizes
  sizes: {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-11 w-11',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  },

  // Base Styles
  base: 'relative flex shrink-0 overflow-hidden rounded-full',

  // Ring Styles
  ring: {
    none: '',
    default: 'ring-2 ring-border',
    primary: 'ring-2 ring-primary',
    violet: 'ring-2 ring-violet-500/20 hover:ring-violet-500/40',
  },

  // Fallback
  fallback: 'flex h-full w-full items-center justify-center rounded-full bg-muted',
} as const;

/**
 * Sidebar Component Tokens
 */
export const sidebar = {
  // Container
  container: {
    base: 'fixed left-0 top-16 z-40 w-64',
    height: 'h-[calc(100vh-4rem)]',
    border: 'border-r border-border/40',
    background: 'bg-background',
  },

  // Scroll Area
  scroll: {
    base: 'h-full py-6',
  },

  // Content Wrapper
  content: {
    base: 'px-4 space-y-6',
  },

  // Navigation Section
  nav: {
    container: 'space-y-1',
    button: {
      base: 'w-full justify-start gap-3 h-11 px-4 font-medium transition-all',
      active: 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/15',
      inactive: 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      icon: 'h-5 w-5',
      iconActive: 'text-violet-500',
    },
  },

  // Categories Section
  categories: {
    container: 'space-y-3',
    header: 'px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70',
    nav: 'space-y-1',
    button: {
      base: 'w-full justify-start gap-3 h-10 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all',
      icon: 'h-5 w-5',
      label: 'font-medium',
    },
  },

  // Separator
  separator: 'bg-border/50',

  // Category Colors
  categoryColors: {
    game: 'text-emerald-500',
    movie: 'text-rose-500',
    series: 'text-sky-500',
    book: 'text-amber-500',
  },
} as const;

/**
 * Header Component Tokens
 */
export const header = {
  // Container
  container: {
    base: 'sticky top-0 z-50 w-full',
    border: 'border-b border-border/40',
    background: 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  },

  // Inner wrapper
  inner: {
    base: 'flex h-16 items-center justify-between px-6',
  },

  // Logo
  logo: {
    container: 'flex items-center gap-2',
    text: 'text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent',
  },

  // Search
  search: {
    container: 'flex-1 max-w-md mx-8',
    wrapper: 'relative',
    icon: 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
    input: 'pl-10 h-10 bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors rounded-full',
  },

  // Actions
  actions: {
    container: 'flex items-center gap-2',
    button: 'h-10 w-10 rounded-full text-muted-foreground hover:text-foreground',
    icon: 'h-5 w-5',
  },

  // Avatar (in header)
  avatar: {
    size: 'h-9 w-9',
    ring: 'ring-2 ring-violet-500/20 cursor-pointer hover:ring-violet-500/40 transition-all',
    fallback: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium text-sm',
  },
} as const;
