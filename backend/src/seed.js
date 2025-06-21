import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Review from './models/Review.js';

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
    await User.deleteMany({});
    console.log('Usuarios existentes eliminados.');
    await Item.deleteMany({});
    console.log('Items existentes eliminados.');
    await Review.deleteMany({});
    console.log('Reseñas existentes eliminadas.');


    const createdCategories = await Category.insertMany(categories);
    console.log('Nuevas categorías insertadas.');

    const users = [
        { name: 'Maria García', username: 'maria_reviews', email: 'maria@example.com', password: 'password123' },
        { name: 'Carlos Mendez', username: 'carlos_critic', email: 'carlos@example.com', password: 'password123' },
        { name: 'Ana Torres', username: 'ana_reads', email: 'ana@example.com', password: 'password123' },
    ];
    const createdUsers = await User.insertMany(users);
    console.log('Nuevos usuarios insertados.');

    const gameCategory = createdCategories.find(c => c.slug === 'game');
    const movieCategory = createdCategories.find(c => c.slug === 'movie');
    const bookCategory = createdCategories.find(c => c.slug === 'book');

    const items = [
        { title: 'The Last of Us Part II', category: gameCategory._id, description: 'Descripción de The Last of Us Part II', imageUrl: '/images/tlou2.jpg' },
        { title: 'Dune', category: movieCategory._id, description: 'Descripción de Dune', imageUrl: '/images/dune.jpg' },
        { title: 'Cien años de soledad', category: bookCategory._id, description: 'Descripción de Cien años de soledad', imageUrl: '/images/cien-anos.jpg' },
    ];
    const createdItems = await Item.insertMany(items);
    console.log('Nuevos items insertados.');

    const reviews = [
        {
            user: createdUsers[0]._id,
            item: createdItems[0]._id,
            rating: { value: 4.5, max: 5 },
            content: 'Una obra maestra emocional que redefine lo que puede ser un videojuego. La narrativa es profunda y los personajes están increíblemente desarrollados.',
        },
        {
            user: createdUsers[1]._id,
            item: createdItems[1]._id,
            rating: { value: 5, max: 5 },
            content: 'Villeneuve logra adaptar lo imposible. Visualmente espectacular y narrativamente sólida. Una experiencia cinematográfica única.',
        },
        {
            user: createdUsers[2]._id,
            item: createdItems[2]._id,
            rating: { value: 4, max: 5 },
            content: 'Una novela mágica que te atrapa desde la primera página. El realismo mágico en su máxima expresión.',
        }
    ];
    await Review.insertMany(reviews);
    console.log('Nuevas reseñas insertadas.');


  } catch (error) {
    console.error('Error durante el proceso de seed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedDB(); 