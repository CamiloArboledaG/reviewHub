# ReviewHub Design System

Sistema centralizado de design tokens para mantener consistencia visual y facilitar el mantenimiento de estilos en toda la aplicación.

## 📁 Estructura

```
theme/
├── index.ts           # Exporta todo el sistema
├── colors.ts          # Tokens de colores
├── typography.ts      # Tokens de tipografía
├── spacing.ts         # Tokens de espaciado
├── borders.ts         # Tokens de bordes
├── shadows.ts         # Tokens de sombras
├── transitions.ts     # Tokens de transiciones y animaciones
├── components.ts      # Tokens específicos por componente
└── README.md          # Esta documentación
```

## 🎨 Filosofía

1. **Single Source of Truth**: Todos los valores de diseño viven en un solo lugar
2. **Consistencia**: Garantiza que los mismos valores se usen en toda la app
3. **Mantenibilidad**: Cambiar un valor actualiza todos los usos
4. **Type Safety**: TypeScript asegura que uses valores válidos
5. **Developer Experience**: Autocomplete y documentación inline

## 🚀 Uso Básico

### Importar el theme

```tsx
import { theme } from '@/lib/theme';

// O importar selectivamente
import { colors, typography, spacing } from '@/lib/theme';
```

### Usar tokens directos

```tsx
// Colores
<div style={{ color: theme.colors.category.game[600] }}>
  Texto morado
</div>

// Tipografía
<h1 className={theme.typographyPresets.h1}>
  Título Principal
</h1>

// Spacing
<div className={theme.spacing.padding.lg}>
  Contenido con padding grande
</div>
```

### Usar tokens de componentes

```tsx
const { reviewCard } = theme.components;

<div className={`${reviewCard.container.base} ${reviewCard.container.shadow}`}>
  <div className={reviewCard.header.container}>
    {/* Contenido */}
  </div>
</div>
```

## 📚 Módulos Principales

### Colors (`colors.ts`)

Define todos los colores de la aplicación:

```tsx
import { colors, categoryColorClasses } from '@/lib/theme';

// Colores por categoría (RGB values)
colors.category.game[600]  // 'rgb(147, 51, 234)'
colors.category.movie[500] // 'rgb(244, 63, 94)'

// Colores semánticos
colors.semantic.primary.DEFAULT
colors.semantic.success.light

// Colores de UI
colors.ui.background
colors.ui.foreground
colors.ui.muted

// Clases de Tailwind para categorías
categoryColorClasses.game.bg.base      // 'bg-purple-100'
categoryColorClasses.movie.text.dark   // 'text-rose-900'
```

### Typography (`typography.ts`)

Estilos de texto estandarizados:

```tsx
import { typography, typographyPresets } from '@/lib/theme';

// Tamaños de fuente
typography.fontSize.sm.class      // 'text-sm'
typography.fontSize.lg.size       // '1.125rem'

// Pesos de fuente
typography.fontWeight.semibold.class  // 'font-semibold'

// Presets completos
typographyPresets.h1              // 'text-4xl font-bold leading-tight'
typographyPresets.body            // 'text-base font-normal leading-normal'
typographyPresets.cardTitle       // 'text-base font-semibold leading-tight'
```

### Spacing (`spacing.ts`)

Escalas de espaciado consistentes:

```tsx
import { spacing, componentSpacing } from '@/lib/theme';

// Padding
spacing.padding.md           // 'p-4'
spacing.paddingX.lg          // 'px-6'

// Gap (para flexbox/grid)
spacing.gap.md               // 'gap-3'

// Spacing específico de componentes
componentSpacing.card.padding      // 'p-4'
componentSpacing.button.md         // 'px-4 py-2'
```

### Borders (`borders.ts`)

Configuraciones de bordes:

```tsx
import { borders, borderPresets } from '@/lib/theme';

// Border radius
borders.radius.xl            // 'rounded-xl'
borders.radius.full          // 'rounded-full'

// Border width
borders.width[2]             // 'border-2'

// Presets
borderPresets.card.default   // 'border border-border/50'
borderPresets.input.focus    // 'focus:border-primary focus:ring-2...'
```

### Shadows (`shadows.ts`)

Elevaciones y sombras:

```tsx
import { shadows, glowEffects } from '@/lib/theme';

// Sombras estándar
shadows.scale.lg             // 'shadow-lg'
shadows.colored.game         // 'shadow-lg shadow-purple-500/20'

// Efectos de brillo por categoría
glowEffects.game.strong      // 'shadow-[0_0_20px_rgba(147,51,234,0.5)]'
```

### Transitions (`transitions.ts`)

Animaciones y transiciones:

```tsx
import { transitions, transitionPresets } from '@/lib/theme';

// Duraciones
transitions.duration.normal  // 'duration-200'

// Presets
transitionPresets.hover.default    // 'transition-all duration-200 ease-in-out'
transitionPresets.hover.shadow     // 'transition-shadow duration-300...'
```

## 🧩 Componentes

### ReviewCard

```tsx
import { theme } from '@/lib/theme';

const { reviewCard } = theme.components;

function MyReviewCard() {
  return (
    <div className={`${reviewCard.container.base} ${reviewCard.container.shadow}`}>
      <div className={reviewCard.header.container}>
        <div className={reviewCard.avatar.size}>
          {/* Avatar */}
        </div>
      </div>
    </div>
  );
}
```

### Button

```tsx
const { button } = theme.components;

<button className={`${button.base} ${button.variants.default} ${button.sizes.md}`}>
  Click me
</button>
```

## 🎯 Helpers Útiles

### getCategoryColors

Obtiene todas las clases de color para una categoría:

```tsx
import { getCategoryColors } from '@/lib/theme';

const gameColors = getCategoryColors('game');
// { bg: { light, base, medium, dark }, text: { ... }, border: { ... } }

<div className={gameColors.bg.base}>
  Background morado
</div>
```

### getCategoryBadgeClasses

Obtiene las clases completas para un badge de categoría:

```tsx
import { getCategoryBadgeClasses } from '@/lib/theme';

const badgeClasses = getCategoryBadgeClasses('movie');
// 'bg-rose-100 text-rose-700 border-rose-200'

<span className={badgeClasses}>
  Película
</span>
```

### getCategoryGlow

Obtiene efectos de brillo por categoría:

```tsx
import { getCategoryGlow } from '@/lib/theme';

const glow = getCategoryGlow('series', 'strong');
<div className={glow}>
  Modal con brillo azul
</div>
```

## 🔧 Migrar Componentes Existentes

### Antes

```tsx
function MyComponent() {
  return (
    <div className="p-4 bg-purple-100 text-purple-700 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Título</h2>
      <p className="text-sm text-gray-600">Descripción</p>
    </div>
  );
}
```

### Después

```tsx
import { theme } from '@/lib/theme';

function MyComponent() {
  return (
    <div className={`
      ${theme.spacing.padding.md}
      ${theme.categoryColorClasses.game.bg.base}
      ${theme.categoryColorClasses.game.text.base}
      ${theme.borders.radius.lg}
      ${theme.shadows.scale.md}
    `}>
      <h2 className={theme.typographyPresets.h2}>Título</h2>
      <p className={theme.typographyPresets.bodySmall}>Descripción</p>
    </div>
  );
}
```

## 📝 Mejores Prácticas

### ✅ DO

```tsx
// Usar tokens del theme
<div className={theme.spacing.padding.lg}>

// Usar presets cuando existan
<h1 className={theme.typographyPresets.h1}>

// Combinar tokens de forma semántica
const cardClasses = `
  ${theme.components.card.base}
  ${theme.shadows.scale.md}
`;
```

### ❌ DON'T

```tsx
// No usar valores hardcodeados
<div className="p-6 text-lg">

// No duplicar combinaciones que ya existen
<h1 className="text-4xl font-bold leading-tight">
// Usar: theme.typographyPresets.h1

// No crear tu propia escala de colores
<div className="bg-purple-123">
// Usar: theme.colors.category.game[...]
```

## 🔄 Actualizar el Theme

### Cambiar un color de categoría

1. Ir a `colors.ts`
2. Actualizar el valor en `colors.category.game[600]`
3. Todos los componentes que usen ese color se actualizarán automáticamente

### Cambiar tamaño de fuente global

1. Ir a `typography.ts`
2. Actualizar `typography.fontSize.base.size`
3. Todos los textos base se actualizarán

### Agregar un nuevo componente

1. Ir a `components.ts`
2. Agregar configuración del componente:

```tsx
export const myNewComponent = {
  container: 'flex items-center gap-4',
  title: 'text-lg font-semibold',
  // ...
} as const;
```

3. Exportar en `index.ts` si es necesario

## 🎨 Tokens por Caso de Uso

### Headers/Títulos
- `theme.typographyPresets.h1` a `h6`
- Para Review Cards: `theme.typographyPresets.cardTitle`

### Textos de cuerpo
- `theme.typographyPresets.body`
- Para descripciones: `theme.typographyPresets.cardDescription`

### Badges/Tags de categoría
- Color: `getCategoryBadgeClasses(slug)`
- Spacing: `theme.components.badge.sizes.sm`

### Botones
- Tamaños: `theme.components.button.sizes.md`
- Variantes: `theme.components.button.variants.default`

### Cards
- Container: `theme.components.card.base`
- Para ReviewCard específicamente: `theme.components.reviewCard.*`

## 🆘 Troubleshooting

### TypeScript no autocompleta

Asegúrate de importar desde `@/lib/theme`:
```tsx
import { theme } from '@/lib/theme';
```

### Clases no se aplican

Verifica que Tailwind esté procesando los archivos del theme:
```js
// tailwind.config.js
content: [
  './src/**/*.{ts,tsx}',
],
```

### Valores no se actualizan

Si modificaste el theme:
1. Guarda los cambios
2. Reinicia el dev server
3. Verifica que no haya errores de TypeScript

## 🚀 Roadmap

- [ ] Migrar todos los componentes al nuevo sistema
- [ ] Crear Storybook con ejemplos de todos los tokens
- [ ] Agregar modo oscuro (dark mode tokens)
- [ ] Agregar tokens de responsividad
- [ ] Crear CLI para generar componentes con theme

## 💡 Tips

1. **Usa autocomplete**: TypeScript te sugerirá valores válidos
2. **Mantén consistencia**: Si existe un preset, úsalo
3. **Documenta excepciones**: Si necesitas un valor custom, agrega un comentario
4. **Comunica cambios**: Los cambios al theme afectan toda la app

---

**Última actualización**: 2025-12-07
**Versión del sistema**: 1.0.0
