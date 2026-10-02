import { apiFetch } from '../utils/api';

export const getMLRecommendations = async (userId, limit = 6) => {
  if (!userId) return { recommendations: [], model: 'CART Decision Tree Classifier' };
  try {
    return await apiFetch(`/api/ml/recommendations/${userId}?limit=${limit}`);
  } catch (err) {
    console.error('getMLRecommendations error:', err);
    return { recommendations: [], model: 'CART Decision Tree Classifier' };
  }
};

export const getUserClusters = async () => {
  try {
    return await apiFetch('/api/ml/user-clusters');
  } catch (err) {
    console.error('getUserClusters error:', err);
    return { totalUsers: 0, clusters: [] };
  }
};

export const getUserPersona = async (userId) => {
  if (!userId) return null;
  try {
    return await apiFetch(`/api/ml/user-persona/${userId}`);
  } catch (err) {
    console.error('getUserPersona error:', err);
    return null;
  }
};
