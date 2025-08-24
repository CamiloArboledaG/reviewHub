import User from '../models/User.js';

// Seguir a un usuario
export const follow = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
  }

  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Ya estás siguiendo a este usuario.' });
    }

    await currentUser.updateOne({ $push: { following: req.params.id } });
    await userToFollow.updateOne({ $push: { followers: req.user.id } });

    res.status(200).json({ message: 'Has comenzado a seguir al usuario.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir al usuario.', error });
  }
};

// Dejar de seguir a un usuario
export const unfollow = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: 'No puedes dejar de seguirte a ti mismo.' });
  }

  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'No estás siguiendo a este usuario.' });
    }

    await currentUser.updateOne({ $pull: { following: req.params.id } });
    await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });

    res.status(200).json({ message: 'Has dejado de seguir al usuario.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dejar de seguir al usuario.', error });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
      .populate({ path: 'following', select: 'name username avatarUrl _id' })
      .select('following');

    if (!currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ following: currentUser.following });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener seguidos.', error: error.message });
  }
};
  