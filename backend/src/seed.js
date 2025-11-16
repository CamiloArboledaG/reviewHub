import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Review from './models/Review.js';
import Avatar from './models/Avatar.js';

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
    await Avatar.deleteMany({});
    console.log('Avatares existentes eliminados.');

    const createdCategories = await Category.insertMany(categories);
    console.log('Nuevas categorías insertadas.');

    // Crear avatares
    const avatars = [
      {
        name: 'Avatar 1',
        imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763322683/reviewhub/avatars/cmaaokrlgxjcoixhgher.svg',
        publicId: 'reviewhub/avatars/cmaaokrlgxjcoixhgher',
        isDefault: true,
        category: 'human'
      },
      {
        name: 'Avatar 2',
        imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763322684/reviewhub/avatars/lmfrnyncuuchcwabm8ve.svg',
        publicId: 'reviewhub/avatars/lmfrnyncuuchcwabm8ve',
        isDefault: true,
        category: 'human'
      },
      {
        name: 'Avatar 3',
        imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763322685/reviewhub/avatars/kmjb7ejyi093zobsc4ys.svg',
        publicId: 'reviewhub/avatars/kmjb7ejyi093zobsc4ys',
        isDefault: true,
        category: 'human'
      },
      {
        name: 'Avatar 4',
        imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763322686/reviewhub/avatars/mo2ze81fyrozpsetrzxd.svg',
        publicId: 'reviewhub/avatars/mo2ze81fyrozpsetrzxd',
        isDefault: true,
        category: 'human'
      }
    ];
    const createdAvatars = await Avatar.insertMany(avatars);
    console.log('Nuevos avatares insertados.');

    const users = [
        { name: 'Maria García', username: 'maria_reviews', email: 'maria@example.com', password: 'password123', avatar: createdAvatars[0]._id },
        { name: 'Carlos Mendez', username: 'carlos_critic', email: 'carlos@example.com', password: 'password123', avatar: createdAvatars[1]._id },
        { name: 'Ana Torres', username: 'ana_reads', email: 'ana@example.com', password: 'password123', avatar: createdAvatars[2]._id },
    ];
    const createdUsers = await User.insertMany(users);
    console.log('Nuevos usuarios insertados.');

    const gameCategory = createdCategories.find(c => c.slug === 'game');
    const movieCategory = createdCategories.find(c => c.slug === 'movie');
    const bookCategory = createdCategories.find(c => c.slug === 'book');

    const items = [
        {
          title: 'The Last of Us Part II',
          category: gameCategory._id,
          description: 'Un videojuego de acción y aventura desarrollado por Naughty Dog. Una historia épica de venganza y redención.',
          imageUrl: ''
        },
        {
          title: 'Dune',
          category: movieCategory._id,
          description: 'Épica adaptación de la novela de Frank Herbert dirigida por Denis Villeneuve. Una obra maestra visual de ciencia ficción.',
          imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763321823/reviewhub/items/kmbaf3ugksvsmytfvera.jpg'
        },
        {
          title: 'Cien años de soledad',
          category: bookCategory._id,
          description: 'La obra maestra de Gabriel García Márquez. Una saga familiar que define el realismo mágico latinoamericano.',
          imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763078394/reviewhub/items/hyx8oofd6ediwevuxqpe.jpg'
        },
        {
          title: '1984',
          category: bookCategory._id,
          description: 'La distopía clásica de George Orwell sobre un futuro totalitario. Una advertencia sobre el poder y el control.',
          imageUrl: 'https://res.cloudinary.com/dlb3zmaac/image/upload/v1763079567/reviewhub/items/ccui8cuxlhj2xqlt3vp9.jpg'
        },
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