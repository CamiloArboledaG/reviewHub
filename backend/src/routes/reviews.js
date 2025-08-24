import express from 'express';
import { getReviews } from '../controllers/reviewController.js';
import { loadUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', loadUser, getReviews);

export default router;
