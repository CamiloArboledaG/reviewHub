/**
 * Design System - Theme Index
 *
 * Sistema centralizado de design tokens para ReviewHub
 *
 * Este archivo exporta todos los tokens de diseño utilizados en la aplicación.
 * Centralizar estos valores facilita el mantenimiento y garantiza consistencia.
 *
 * @example
 * ```tsx
 * import { theme } from '@/lib/theme';
 *
 * // Usar tokens de tipografía
 * <h1 className={theme.typography.presets.h1}>Título</h1>
 *
 * // Usar colores de categoría
 * <div className={theme.colors.categoryColorClasses.game.bg.base}>
 *
 * // Usar componentes predefinidos
 * <div className={theme.components.reviewCard.container.base}>
 * ```
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './borders';
export * from './shadows';
export * from './transitions';
export * from './components';

import { colors, categoryColorClasses } from './colors';
import { typography, typographyPresets, responsiveTypography } from './typography';
import { spacing, componentSpacing } from './spacing';
import { borders, borderPresets, componentBorders } from './borders';
import { shadows, componentShadows, glowEffects } from './shadows';
import { transitions, transitionPresets, animations, componentTransitions } from './transitions';
import * as components from './components';

/**
 * Theme Object - Acceso unificado a todos los tokens
 */
export const theme = {
  colors,
  categoryColorClasses,
  typography,
  typographyPresets,
  responsiveTypography,
  spacing,
  componentSpacing,
  borders,
  borderPresets,
  componentBorders,
  shadows,
  componentShadows,
  glowEffects,
  transitions,
  transitionPresets,
  animations,
  componentTransitions,
  components,
} as const;

/**
 * Helper Functions para trabajar con el theme
 */

/**
 * Obtiene las clases de color para una categoría específica
 */
export const getCategoryColors = (category: 'game' | 'movie' | 'series' | 'book') => {
  return categoryColorClasses[category];
};

/**
 * Obtiene las clases de badge para una categoría específica
 */
export function getCategoryBadgeClasses(category: 'game' | 'movie' | 'series' | 'book'): string {
  const badgeColors = {
    game: 'bg-purple-100 text-purple-700 border-purple-200',
    movie: 'bg-rose-100 text-rose-700 border-rose-200',
    series: 'bg-blue-100 text-blue-700 border-blue-200',
    book: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return badgeColors[category];
}

/**
 * Obtiene el glow effect para una categoría y nivel específico
 */
export const getCategoryGlow = (
  category: 'game' | 'movie' | 'series' | 'book',
  level: 'subtle' | 'medium' | 'strong' = 'medium'
) => {
  return glowEffects[category][level];
};

/**
 * Combina clases de manera segura (similar a cn de shadcn)
 */
export const combineClasses = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Type exports para TypeScript
 */
export type CategorySlug = 'game' | 'movie' | 'series' | 'book';
export type GlowLevel = 'subtle' | 'medium' | 'strong';
export type ButtonSize = keyof typeof components.button.sizes;
export type ButtonVariant = keyof typeof components.button.variants;
export type InputSize = keyof typeof components.input.sizes;
export type BadgeSize = keyof typeof components.badge.sizes;
export type AvatarSize = keyof typeof components.avatar.sizes;

/**
 * Default export
 */
export default theme;
