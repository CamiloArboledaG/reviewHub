import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

export default router; 