import Avatar from '../models/Avatar.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Obtener todos los avatares
// @route   GET /api/avatars
// @access  Public
export const getAvatars = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const avatars = await Avatar.find(filter).sort({ isDefault: -1, createdAt: -1 });

    res.json(avatars);
  } catch (error) {
    console.error('Error al obtener avatares:', error);
    res.status(500).json({ message: 'Error del servidor al obtener avatares' });
  }
};

// @desc    Obtener avatar por ID
// @route   GET /api/avatars/:id
// @access  Public
export const getAvatarById = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);

    if (!avatar) {
      return res.status(404).json({ message: 'Avatar no encontrado' });
    }

    res.json(avatar);
  } catch (error) {
    console.error('Error al obtener avatar:', error);
    res.status(500).json({ message: 'Error del servidor al obtener el avatar' });
  }
};

// @desc    Crear un nuevo avatar
// @route   POST /api/avatars
// @access  Private (admin)
export const createAvatar = async (req, res) => {
  try {
    const { name, category, isDefault } = req.body;

    // Validar campos requeridos
    if (!name) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Subir imagen a Cloudinary
    const stream = Readable.from(req.file.buffer);

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'reviewhub/avatars',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Crear el avatar
    const avatar = await Avatar.create({
      name,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      category: category || 'custom',
      isDefault: isDefault === 'true' || isDefault === true,
    });

    res.status(201).json(avatar);
  } catch (error) {
    console.error('Error al crear avatar:', error);
    res.status(500).json({ message: 'Error del servidor al crear el avatar' });
  }
};

// @desc    Eliminar un avatar
// @route   DELETE /api/avatars/:id
// @access  Private (admin)
export const deleteAvatar = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);

    if (!avatar) {
      return res.status(404).json({ message: 'Avatar no encontrado' });
    }

    // No permitir eliminar avatares predeterminados
    if (avatar.isDefault) {
      return res.status(400).json({ message: 'No se pueden eliminar avatares predeterminados' });
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(avatar.publicId);

    // Eliminar de la base de datos
    await Avatar.findByIdAndDelete(req.params.id);

    res.json({ message: 'Avatar eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar avatar:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar el avatar' });
  }
};

// @desc    Obtener avatares predeterminados
// @route   GET /api/avatars/defaults
// @access  Public
export const getDefaultAvatars = async (req, res) => {
  try {
    const avatars = await Avatar.find({ isDefault: true }).sort({ name: 1 });
    res.json(avatars);
  } catch (error) {
    console.error('Error al obtener avatares predeterminados:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
