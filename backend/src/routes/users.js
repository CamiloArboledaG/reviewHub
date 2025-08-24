import express from 'express';
import { follow, unfollow } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para seguir a un usuario
router.post('/:id/follow', protect, follow);

// Ruta para dejar de seguir a un usuario
router.post('/:id/unfollow', protect, unfollow);

export default router;
