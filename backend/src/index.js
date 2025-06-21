import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// Importar y usar rutas
import categoryRoutes from './routes/categories.js';
app.use('/api/categories', categoryRoutes);

// TODO: Importar y usar rutas

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () =>
    console.log(`Servidor en puerto ${process.env.PORT}`)))
  .catch(err => console.error(err))
