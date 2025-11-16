import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
    // ID público de Cloudinary para poder eliminar la imagen si es necesario
  },
  isDefault: {
    type: Boolean,
    default: false,
    // Marca si este avatar es uno de los predeterminados del sistema
  },
  category: {
    type: String,
    enum: ['human', 'animal', 'fantasy', 'abstract', 'custom'],
    default: 'custom',
    // Categoría para organizar los avatares
  },
}, { timestamps: true });

const Avatar = mongoose.model('Avatar', avatarSchema);

export default Avatar;
