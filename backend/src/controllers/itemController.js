import Item from '../models/Item.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Crear un nuevo item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validar campos requeridos
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Título, descripción y categoría son requeridos' });
    }

    let imageUrl = '';

    // Si se subió una imagen, subirla a Cloudinary
    if (req.file) {
      const stream = Readable.from(req.file.buffer);

      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'reviewhub/items',
            transformation: [
              { width: 500, height: 500, crop: 'limit' },
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
      imageUrl = result.secure_url;
    }

    // Crear el item
    const item = await Item.create({
      title,
      description,
      imageUrl,
      category,
    });

    // Populate la categoría antes de devolver
    const populatedItem = await Item.findById(item._id).populate('category', 'name slug');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ message: 'Error del servidor al crear el item' });
  }
};

// @desc    Buscar items por categoría con paginación y búsqueda
// @route   GET /api/items
// @access  Public
export const searchItems = async (req, res) => {
  try {
    const { category, search = '', page = 1, limit = 10 } = req.query;

    // Validar que se proporcione una categoría
    if (!category) {
      return res.status(400).json({ message: 'Se requiere especificar una categoría' });
    }

    // Construir el filtro de búsqueda
    const filter = { category };

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calcular el skip para la paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar items con populate de categoría
    const items = await Item.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar el total de items que coinciden con el filtro
    const total = await Item.countDocuments(filter);

    res.json({
      items,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      hasNextPage: skip + items.length < total,
    });
  } catch (error) {
    console.error('Error al buscar items:', error);
    res.status(500).json({ message: 'Error del servidor al buscar items' });
  }
};

// @desc    Obtener un item por ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('category', 'name slug');

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ message: 'Error del servidor al obtener el item' });
  }
};
