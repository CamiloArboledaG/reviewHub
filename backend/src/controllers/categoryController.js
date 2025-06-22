import mongoose from 'mongoose';

const Category = mongoose.model('Category');

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}; 