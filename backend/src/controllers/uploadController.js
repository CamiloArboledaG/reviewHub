import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Subir imagen a Cloudinary
// @route   POST /api/upload
// @access  Private (solo usuarios autenticados pueden subir)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }

    // Convertir el buffer a stream
    const stream = Readable.from(req.file.buffer);

    // Crear una promesa para el upload
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'reviewhub/items', // Carpeta en Cloudinary
          transformation: [
            { width: 500, height: 500, crop: 'limit' }, // Limitar tamaño máximo
            { quality: 'auto' }, // Calidad automática
            { fetch_format: 'auto' }, // Formato automático (WebP si es soportado)
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      message: 'Error al subir la imagen',
      error: error.message
    });
  }
};

// @desc    Eliminar imagen de Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: 'Se requiere el ID público de la imagen' });
    }

    // Decodificar el publicId (viene en formato URL)
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Imagen eliminada correctamente',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No se pudo eliminar la imagen',
      });
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      message: 'Error al eliminar la imagen',
      error: error.message
    });
  }
};
