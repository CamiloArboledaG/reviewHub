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

    const reviews = [];
    const contents = [
      'Una obra maestra emocional que redefine lo que puede ser un videojuego. La narrativa es profunda y los personajes están increíblemente desarrollados.',
      'Villeneuve logra adaptar lo imposible. Visualmente espectacular y narrativamente sólida. Una experiencia cinematográfica única.',
      'Una novela mágica que te atrapa desde la primera página. El realismo mágico en su máxima expresión.',
      'Conceptos de ciencia ficción alucinantes que te harán reflexionar durante días. Lectura obligada.',
      'El final de temporada me dejó sin palabras. ¡Necesito la siguiente ya!',
      'Una película conmovedora con actuaciones brillantes. Prepara los pañuelos.',
    ]

    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[i % createdUsers.length];
      const randomItem = createdItems[i % createdItems.length];
      const randomContent = contents[i % contents.length];
      const randomRating = (Math.random() * 4 + 1).toFixed(1); // Rating entre 1.0 y 5.0

      reviews.push({
        user: randomUser._id,
        item: randomItem._id,
        rating: { value: parseFloat(randomRating), max: 5 },
        content: `Reseña autogenerada ${i + 1}: ${randomContent}`,
      });
    }

    await Review.insertMany(reviews);
    console.log(`${reviews.length} nuevas reseñas insertadas.`);


  } catch (error) {
    console.error('Error durante el proceso de seed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

seedDB(); 