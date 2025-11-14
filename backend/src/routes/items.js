import express from 'express';
import { createItem, searchItems, getItemById } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Buscar items por categoría
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto de búsqueda (título o descripción)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items por página
 *     responses:
 *       200:
 *         description: Lista de items encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *       400:
 *         description: Categoría no especificada
 *       500:
 *         description: Error del servidor
 */
router.get('/', searchItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener un item por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del item
 *     responses:
 *       200:
 *         description: Item encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getItemById);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crear un nuevo item
 *     tags: [Items]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del item
 *               description:
 *                 type: string
 *                 description: Descripción del item
 *               category:
 *                 type: string
 *                 description: ID de la categoría
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del item (opcional)
 *     responses:
 *       201:
 *         description: Item creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Datos requeridos faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', protect, upload.single('image'), createItem);

export default router;
