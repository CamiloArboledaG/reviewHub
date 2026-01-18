import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import '../models/index.js';

import {
  batchUpdateReviewScores,
  batchUpdateCommentScores,
} from '../utils/scoreCalculator.js';

const Review = mongoose.model('Review');
const Comment = mongoose.model('Comment');

const migrateScores = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    console.log('\n--- Migrando Reviews ---');
    const reviewsUpdated = await batchUpdateReviewScores(Review);
    console.log(`Reviews actualizados: ${reviewsUpdated}`);

    console.log('\n--- Migrando Comments ---');
    const commentsUpdated = await batchUpdateCommentScores(Comment, Review);
    console.log(`Comments actualizados: ${commentsUpdated}`);

    console.log('\n--- Migración completada ---');
    console.log(`Total Reviews: ${reviewsUpdated}`);
    console.log(`Total Comments: ${commentsUpdated}`);

    await mongoose.connection.close();
    console.log('\nConexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrateScores();
