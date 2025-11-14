import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen a Cloudinary
 *     tags: [Upload]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (máximo 5MB)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 imageUrl:
 *                   type: string
 *                   description: URL de la imagen en Cloudinary
 *                 publicId:
 *                   type: string
 *                   description: ID público de la imagen
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *       400:
 *         description: No se proporcionó archivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', protect, upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/upload/{publicId}:
 *   delete:
 *     summary: Eliminar una imagen de Cloudinary
 *     tags: [Upload]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID público de la imagen (URL encoded)
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Imagen no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:publicId', protect, deleteImage);

export default router;
