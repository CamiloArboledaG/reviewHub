import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo en producción
    sameSite: 'strict',
    path: '/' // Cookie disponible en todo el sitio
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
};

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
      if (userExists.username === username) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
      }
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    if (user) {
      sendTokenResponse(user, 201, res);
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const logout = (req, res) => {
  // Para borrar la cookie, se debe responder con las mismas opciones con las que se creó.
  res.status(200).cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0) // Fecha en el pasado para expirar inmediatamente
  }).json({ success: true, message: 'Logout successful' });
};

export const getProfile = (req, res) => {
  res.json(req.user);
}; 