import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import './models/index.js'; // Importar todos los modelos para registrarlos

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Blurbit API Docs'
}))

// Importar y usar rutas
import avatarRoutes from './routes/avatars.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import itemRoutes from './routes/items.js';
import uploadRoutes from './routes/upload.js';

app.use('/api/avatars', avatarRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/upload', uploadRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () =>
    console.log(`Servidor en puerto ${process.env.PORT}`)))
  .catch(err => console.error(err))
