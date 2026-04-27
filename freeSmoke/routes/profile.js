const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const jwt     = require('jsonwebtoken');

// Middleware auth inline
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// POST /api/profile/save
router.post('/save', auth, async (req, res) => {
  try {
    const { profile, quitPlan } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profile, quitPlan },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message:  'Profil sauvegardé',
      profile:  user.profile,
      quitPlan: user.quitPlan,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/profile/get
router.get('/get', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      profile:  user.profile,
      quitPlan: user.quitPlan,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;