import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending'],
    default: 'active',
  },
  suggestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  // Opcional: Se podría añadir más metadata específica de la categoría
  // por ejemplo, 'director' para películas o 'developer' para juegos.
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item; 