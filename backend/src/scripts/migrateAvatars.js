import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Avatar from '../models/Avatar.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lista de avatares a migrar
// Si tienes los archivos en frontend/public/avatares, este script los subirá
const avatarsToMigrate = [
  { name: 'Avatar 1', file: 'avatar1.svg', category: 'abstract' },
  { name: 'Avatar 2', file: 'avatar2.svg', category: 'abstract' },
  { name: 'Avatar 3', file: 'avatar3.svg', category: 'abstract' },
  { name: 'Avatar 4', file: 'avatar4.svg', category: 'abstract' },
  { name: 'Avatar 5', file: 'avatar5.svg', category: 'abstract' },
  { name: 'Avatar 6', file: 'avatar6.svg', category: 'abstract' },
  { name: 'Avatar 7', file: 'avatar7.svg', category: 'abstract' },
  { name: 'Avatar 8', file: 'avatar8.svg', category: 'abstract' },
  // Agrega más avatares según los que tengas
];

const migrateAvatars = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Ruta a la carpeta de avatares en el frontend
    const avatarsPath = path.join(__dirname, '../../../frontend/public/avatares');

    console.log(`📁 Buscando avatares en: ${avatarsPath}`);

    // Verificar si la carpeta existe
    if (!fs.existsSync(avatarsPath)) {
      console.log('⚠️  La carpeta de avatares no existe en la ruta especificada');
      console.log('💡 Puedes subir avatares manualmente usando el endpoint POST /api/avatars');
      return;
    }

    // Limpiar colección de avatares (opcional - comenta si no quieres limpiar)
    await Avatar.deleteMany({});
    console.log('🗑️  Colección de avatares limpiada');

    let uploadedCount = 0;

    for (const avatarInfo of avatarsToMigrate) {
      const filePath = path.join(avatarsPath, avatarInfo.file);

      // Verificar si el archivo existe
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${avatarInfo.file}`);
        continue;
      }

      try {
        console.log(`⬆️  Subiendo ${avatarInfo.name}...`);

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'reviewhub/avatars',
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto' },
          ],
        });

        // Crear registro en la base de datos
        await Avatar.create({
          name: avatarInfo.name,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          category: avatarInfo.category,
          isDefault: true, // Marcar como predeterminado
        });

        uploadedCount++;
        console.log(`✅ ${avatarInfo.name} subido y registrado`);
      } catch (error) {
        console.error(`❌ Error al procesar ${avatarInfo.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Migración completada: ${uploadedCount}/${avatarsToMigrate.length} avatares migrados`);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar la migración
migrateAvatars();
