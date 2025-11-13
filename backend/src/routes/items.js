import express from 'express';
import { createItem, searchItems, getItemById } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', searchItems);
router.get('/:id', getItemById);

// Rutas protegidas
router.post('/', protect, upload.single('image'), createItem);

export default router;
