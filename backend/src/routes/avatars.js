import express from 'express';
import {
  getAvatars,
  getAvatarById,
  createAvatar,
  deleteAvatar,
  getDefaultAvatars,
} from '../controllers/avatarController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/avatars:
 *   get:
 *     summary: Obtener todos los avatares
 *     tags: [Avatars]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [human, animal, fantasy, abstract, custom]
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de avatares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   category:
 *                     type: string
 *                   isDefault:
 *                     type: boolean
 *       500:
 *         description: Error del servidor
 */
router.get('/', getAvatars);

/**
 * @swagger
 * /api/avatars/defaults:
 *   get:
 *     summary: Obtener avatares predeterminados
 *     tags: [Avatars]
 *     responses:
 *       200:
 *         description: Lista de avatares predeterminados
 *       500:
 *         description: Error del servidor
 */
router.get('/defaults', getDefaultAvatars);

/**
 * @swagger
 * /api/avatars/{id}:
 *   get:
 *     summary: Obtener un avatar por ID
 *     tags: [Avatars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar encontrado
 *       404:
 *         description: Avatar no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getAvatarById);

/**
 * @swagger
 * /api/avatars:
 *   post:
 *     summary: Crear un nuevo avatar
 *     tags: [Avatars]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del avatar
 *               category:
 *                 type: string
 *                 enum: [human, animal, fantasy, abstract, custom]
 *                 description: Categoría del avatar
 *               isDefault:
 *                 type: boolean
 *                 description: Si es un avatar predeterminado del sistema
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del avatar
 *     responses:
 *       201:
 *         description: Avatar creado exitosamente
 *       400:
 *         description: Datos requeridos faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', protect, upload.single('image'), createAvatar);

/**
 * @swagger
 * /api/avatars/{id}:
 *   delete:
 *     summary: Eliminar un avatar
 *     tags: [Avatars]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar eliminado
 *       400:
 *         description: No se pueden eliminar avatares predeterminados
 *       404:
 *         description: Avatar no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', protect, deleteAvatar);

export default router;
