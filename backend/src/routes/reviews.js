import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { protect, loadUser } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Crear una nueva reseña
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - rating
 *               - content
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID del item a reseñar
 *               rating:
 *                 type: number
 *                 minimum: 0.5
 *                 maximum: 5
 *                 description: Calificación (0.5 a 5 estrellas)
 *               content:
 *                 type: string
 *                 description: Contenido de la reseña
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Datos inválidos o ya existe reseña
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Item no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtener reseñas con paginación
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Lista de reseñas
 *       500:
 *         description: Error del servidor
 */
router.get('/', loadUser, getReviews);

export default router;
