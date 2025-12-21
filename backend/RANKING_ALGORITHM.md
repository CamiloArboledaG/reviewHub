# Algoritmo de Ranking de Reviews

Este documento explica cómo funciona el algoritmo de ranking inteligente implementado en el backend para ordenar los reviews de manera más atractiva y relevante para los usuarios.

## Ubicación

**Archivo:** `backend/src/controllers/reviewController.js`
**Función:** `calculateReviewScore(review, followingSet)`
**Endpoint:** `GET /api/reviews`

## Objetivo

Reemplazar el ordenamiento simple por fecha (`createdAt: -1`) con un sistema de puntuación multi-factor que balancea:

- **Frescura** - Contenido reciente tiene prioridad
- **Engagement** - Contenido con interacción se destaca
- **Interés** - Opiniones extremas son más visibles
- **Personalización** - Contenido de usuarios seguidos tiene boost (solo en Home)

## Cómo Funciona

### 1. Recency Score (Puntuación por Frescura)

```javascript
const hoursSincePost = (now - reviewDate) / (1000 * 60 * 60);
const recencyScore = Math.exp(-hoursSincePost / 72);
```

**Comportamiento:**
- Usa decaimiento exponencial con vida media de **72 horas** (3 días)
- Reviews nuevos (0-24h): score ≈ 0.72 - 1.0
- Reviews de 3 días: score ≈ 0.37
- Reviews de 1 semana: score ≈ 0.11
- Reviews de 2 semanas: score ≈ 0.01

**Impacto:** `recencyScore * 10` en la fórmula final

**Por qué 72 horas:** Balance entre dar oportunidad a contenido nuevo sin eliminar contenido con buen engagement de días anteriores.

### 2. Engagement Score (Puntuación por Interacción)

```javascript
const engagementScore = (review.likes.length * 2) + (review.comments.length * 3);
```

**Pesos:**
- **Like:** 2 puntos (acción simple, más común)
- **Comentario:** 3 puntos (requiere más esfuerzo, más valioso)

**Ejemplos:**
- 5 likes + 2 comentarios = 10 + 6 = **16 puntos**
- 10 likes + 0 comentarios = 20 + 0 = **20 puntos**
- 0 likes + 5 comentarios = 0 + 15 = **15 puntos**

**Impacto:** `engagementScore * 0.5` en la fórmula final

**Por qué estos pesos:** Incentiva discusión (comentarios) mientras mantiene valor en likes. El factor 0.5 evita que engagement domine completamente sobre recency.

### 3. Rating Interest (Interés por Calificación)

```javascript
const ratingValue = review.rating?.value || 0;
let ratingInterest = 1;

if (ratingValue >= 4.5 || ratingValue <= 2) {
  ratingInterest = 1.5;  // Muy alto o muy bajo
} else if (ratingValue >= 4 || ratingValue <= 2.5) {
  ratingInterest = 1.2;  // Alto o bajo
}
```

**Multiplicadores:**
- ⭐⭐⭐⭐⭐ (4.5-5.0) o ⭐ (0.5-2.0): **1.5x**
- ⭐⭐⭐⭐ (4.0-4.4) o ⭐⭐ (2.1-2.5): **1.2x**
- ⭐⭐⭐ (2.6-3.9): **1.0x** (neutral)

**Razón:** Opiniones extremas son más interesantes. Un review de 5 estrellas o 1 estrella atrae más atención que un 3 estrellas neutral.

### 4. Following Boost (Boost por Seguir)

```javascript
const followingBoost = followingSet.has(review.user._id?.toString()) ? 1.3 : 1;
```

**Aplicación:**
- **Home feed:** Si sigues al autor → **1.3x** multiplicador final
- **Following feed:** No aplica (todos los reviews son de usuarios seguidos)

**Razón:** En Home, dar ligera prioridad a contenido de usuarios que sigues sin dominar completamente el feed.

## Fórmula Final

```javascript
const score = (recencyScore * 10) + (engagementScore * 0.5) + ratingInterest;
return score * followingBoost;
```

### Desglose de Componentes:

| Componente | Rango Típico | Peso en Score |
|------------|--------------|---------------|
| Recency | 0-10 | Alto - Decrece con tiempo |
| Engagement | 0-50+ | Medio - Crece con interacción |
| Rating Interest | 1.0-1.5 | Bajo - Multiplicador sutil |
| Following Boost | 1.0-1.3 | Bajo - Multiplicador final |

## Ejemplos Prácticos

### Ejemplo 1: Review Nuevo con Poco Engagement
```
- Edad: 2 horas
- Likes: 1, Comentarios: 0
- Rating: 4.5 estrellas
- Usuario seguido: No

recencyScore = exp(-2/72) ≈ 0.97
engagement = (1 * 2) + (0 * 3) = 2
ratingInterest = 1.5 (rating extremo)
followingBoost = 1.0

score = (0.97 * 10) + (2 * 0.5) + 1.5
score = 9.7 + 1.0 + 1.5 = 12.2
```

### Ejemplo 2: Review Antiguo con Mucho Engagement
```
- Edad: 4 días (96 horas)
- Likes: 15, Comentarios: 8
- Rating: 3.5 estrellas
- Usuario seguido: Sí

recencyScore = exp(-96/72) ≈ 0.27
engagement = (15 * 2) + (8 * 3) = 54
ratingInterest = 1.0 (rating neutral)
followingBoost = 1.3

score = (0.27 * 10) + (54 * 0.5) + 1.0
score = 2.7 + 27.0 + 1.0 = 30.7
score_final = 30.7 * 1.3 = 39.9
```

### Ejemplo 3: Review Mediano
```
- Edad: 1 día (24 horas)
- Likes: 5, Comentarios: 2
- Rating: 5.0 estrellas
- Usuario seguido: No

recencyScore = exp(-24/72) ≈ 0.72
engagement = (5 * 2) + (2 * 3) = 16
ratingInterest = 1.5 (rating extremo)
followingBoost = 1.0

score = (0.72 * 10) + (16 * 0.5) + 1.5
score = 7.2 + 8.0 + 1.5 = 16.7
```

**Orden resultante:** Ejemplo 2 > Ejemplo 3 > Ejemplo 1

El engagement alto del Ejemplo 2 compensa su edad mayor.

## Flujo en el Endpoint

```javascript
// 1. Obtener todos los reviews que cumplen el filtro (categoría, following)
let reviews = await Review.find(query).populate(...).lean();

// 2. Calcular score para cada review
reviews = reviews.map(review => ({
  ...review,
  score: calculateReviewScore(review, followingSet)
}));

// 3. Ordenar por score (mayor a menor)
reviews.sort((a, b) => b.score - a.score);

// 4. Aplicar paginación
const paginatedReviews = reviews.slice(skip, skip + limit);

// 5. Remover el campo 'score' antes de enviar
return paginatedReviews.map(({ score, ...review }) => review);
```

## Parámetros del Endpoint

### Query Parameters

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `page` | integer | Número de página | 1 |
| `limit` | integer | Reviews por página | 10 |
| `category` | string[] | Filtrar por slug de categoría | null |
| `followingOnly` | boolean | Solo reviews de usuarios seguidos | false |

### Ejemplos de Uso

```bash
# Home feed (todos los reviews, ranking con boost para seguidos)
GET /api/reviews?page=1&limit=5

# Following feed (solo seguidos)
GET /api/reviews?page=1&limit=5&followingOnly=true

# Filtrar por categoría
GET /api/reviews?page=1&limit=5&category=game&category=movie

# Following + categoría
GET /api/reviews?page=1&limit=5&followingOnly=true&category=series
```

## Consideraciones para Futuras Modificaciones

### 🎯 Ajustar Balance Recency vs Engagement

Si los reviews antiguos dominan mucho:
```javascript
// Aumentar peso de recency
const score = (recencyScore * 15) + (engagementScore * 0.5) + ratingInterest;
```

Si los reviews nuevos dominan mucho:
```javascript
// Reducir peso de recency o aumentar engagement
const score = (recencyScore * 5) + (engagementScore * 1.0) + ratingInterest;
```

### 📊 Agregar Nuevos Factores

Ejemplos de factores adicionales:

```javascript
// Diversidad de autor
const authorDiversityBoost = !recentAuthors.has(review.user._id) ? 1.2 : 1;

// Variedad de categoría
const categoryVarietyBoost = !recentCategories.has(review.category) ? 1.15 : 1;

// Calidad del contenido (longitud)
const contentQuality = review.content.length > 100 ? 1.1 : 1;

// Usuario verificado o con reputación
const authorReputation = review.user.isVerified ? 1.2 : 1;
```

### ⚡ Optimización de Performance

**Problema Actual:** El algoritmo carga TODOS los reviews en memoria, calcula scores, ordena, y luego pagina.

**Para grandes volúmenes de datos (10,000+ reviews):**

1. **Opción A - Pre-calcular scores:**
   ```javascript
   // Agregar campo 'score' al modelo Review
   // Recalcular periódicamente con un cron job
   reviewSchema.add({ cachedScore: Number, scoreUpdatedAt: Date });
   ```

2. **Opción B - Usar MongoDB Aggregation Pipeline:**
   ```javascript
   // Calcular score directamente en la query de MongoDB
   Review.aggregate([
     { $match: query },
     { $addFields: {
       hoursSincePost: { $divide: [
         { $subtract: [new Date(), "$createdAt"] },
         3600000
       ]},
       engagementScore: {
         $add: [
           { $multiply: [{ $size: "$likes" }, 2] },
           { $multiply: [{ $size: "$comments" }, 3] }
         ]
       }
     }},
     { $sort: { calculatedScore: -1 } },
     { $skip: skip },
     { $limit: limit }
   ]);
   ```

3. **Opción C - Indexación híbrida:**
   ```javascript
   // Crear índice compuesto para filtros comunes
   reviewSchema.index({ createdAt: -1, 'likes.length': -1 });
   ```

### 🔧 Ajustes Recomendados por Contexto

**Para feeds con poco contenido:**
- Reducir vida media de recency (36h en lugar de 72h)
- Aumentar peso de engagement

**Para feeds muy activos:**
- Aumentar vida media de recency (120h en lugar de 72h)
- Agregar factor de diversidad de autor

**Para comunidades pequeñas:**
- Reducir following boost (1.15x en lugar de 1.3x)
- Dar más peso a rating interest

## Testing del Algoritmo

### Tests Unitarios Recomendados

```javascript
describe('calculateReviewScore', () => {
  it('should give higher score to recent reviews', () => {
    const recent = createReview({ hoursOld: 2 });
    const old = createReview({ hoursOld: 100 });
    expect(calculateReviewScore(recent)).toBeGreaterThan(calculateReviewScore(old));
  });

  it('should boost reviews from followed users', () => {
    const review = createReview({ userId: 'user123' });
    const followingSet = new Set(['user123']);
    const scoreWithBoost = calculateReviewScore(review, followingSet);
    const scoreWithoutBoost = calculateReviewScore(review, new Set());
    expect(scoreWithBoost).toBeGreaterThan(scoreWithoutBoost);
  });

  it('should value extreme ratings more', () => {
    const extremeHigh = createReview({ rating: 5.0 });
    const neutral = createReview({ rating: 3.0 });
    // Assuming same age and engagement
    expect(calculateReviewScore(extremeHigh)).toBeGreaterThan(calculateReviewScore(neutral));
  });
});
```

## Monitoreo y Métricas

Para evaluar si el algoritmo está funcionando bien:

**Métricas a Trackear:**
- Engagement promedio de reviews en top 10
- Distribución de edad de reviews en top 10
- Tasa de clicks en reviews ordenados
- Tiempo de permanencia en feed
- Diversidad de autores en top 20

**Señales de Problemas:**
- Todos los top reviews son del mismo autor
- Todos los top reviews tienen >1 semana de antigüedad
- Reviews con 0 engagement dominan el feed
- Feed demasiado estático (mismo orden por horas)

## Changelog

### v1.0 - Implementación Inicial (2025-12-21)
- Algoritmo de ranking multi-factor
- Soporte para `followingOnly` parameter
- Balance entre recency, engagement, y rating interest
- Following boost para personalización

---

**Nota:** Este algoritmo está diseñado para ser ajustado iterativamente basándose en datos reales de uso. Experimenta con los pesos y factores según el comportamiento de tu audiencia.
