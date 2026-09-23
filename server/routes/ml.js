const router = require('express').Router();
const {
  getRecommendations,
  getUserClusters,
  getUserPersona
} = require('../controllers/mlController');

// Optional auth helper
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const jwt = require('jsonwebtoken');
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

// Endpoints
router.get('/recommendations/:userId', optionalAuth, getRecommendations);
router.get('/user-clusters', optionalAuth, getUserClusters);
router.get('/user-persona/:userId', optionalAuth, getUserPersona);

module.exports = router;
