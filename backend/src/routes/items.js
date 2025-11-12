import express from 'express';
import { searchItems, getItemById } from '../controllers/itemController.js';

const router = express.Router();

// Rutas públicas
router.get('/', searchItems);
router.get('/:id', getItemById);

export default router;
