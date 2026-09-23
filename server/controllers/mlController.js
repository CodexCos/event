const mlService = require('../services/mlService');

// GET /api/ml/recommendations/:userId
const getRecommendations = async (req, res) => {
  const { userId } = req.params;
  const limit = Number(req.query.limit) || 6;

  try {
    const data = await mlService.getPersonalizedRecommendations(userId, limit);
    res.json(data);
  } catch (err) {
    console.error('getRecommendations error:', err);
    res.status(500).json({ message: 'Error computing Decision Tree recommendations.' });
  }
};

// GET /api/ml/user-clusters
const getUserClusters = async (req, res) => {
  try {
    const data = await mlService.getUserClusters();
    res.json(data);
  } catch (err) {
    console.error('getUserClusters error:', err);
    res.status(500).json({ message: 'Error computing K-Means user clusters.' });
  }
};

// GET /api/ml/user-persona/:userId
const getUserPersona = async (req, res) => {
  const { userId } = req.params;
  try {
    const persona = await mlService.getUserPersona(userId);
    res.json(persona);
  } catch (err) {
    console.error('getUserPersona error:', err);
    res.status(500).json({ message: 'Error fetching user persona.' });
  }
};

module.exports = {
  getRecommendations,
  getUserClusters,
  getUserPersona
};
