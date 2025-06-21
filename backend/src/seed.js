import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const categories = [
  { name: 'Videojuegos', slug: 'game' },
  { name: 'Películas', slug: 'movie' },
  { name: 'Series', slug: 'series' },
  { name: 'Libros', slug: 'book' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado para el seeder.');

    await Category.deleteMany({});
    console.log('Categorías existentes eliminadas.');

    await Category.insertMany(categories);
    console.log('Nuevas categorías insertadas.');

  } catch (error) {
    console.error('Error durante el proceso de seed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedDB(); 