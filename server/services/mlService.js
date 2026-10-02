const pool = require('../config/db');
const camelize = require('../utils/camelize');
const DecisionTreeClassifier = require('../utils/decisionTree');
const KMeansClustering = require('../utils/kmeans');

const getPriceTier = (price) => {
  const p = Number(price) || 0;
  if (p === 0) return 0;
  if (p <= 20) return 1;
  if (p <= 50) return 2;
  return 3;
};

const isWeekend = (dateStr) => {
  if (!dateStr) return 0;
  const day = new Date(dateStr).getDay();
  return (day === 0 || day === 6) ? 1 : 0;
};

const getInterestOverlap = (userInterests = [], eventCategory = '', eventTags = []) => {
  if (!Array.isArray(userInterests) || userInterests.length === 0) return 0;
  const userIntLower = userInterests.map(i => i.toLowerCase());

  let overlap = 0;
  if (eventCategory && userIntLower.includes(eventCategory.toLowerCase())) {
    overlap += 2;
  }
  if (Array.isArray(eventTags)) {
    for (const tag of eventTags) {
      if (userIntLower.includes(tag.toLowerCase())) {
        overlap += 1;
      }
    }
  }
  return overlap;
};

class MLService {
  async getPersonalizedRecommendations(userId, limit = 6) {
    try {
      const [usersRes, eventsRes, regsRes] = await Promise.all([
        pool.query('SELECT id, name, email, interests FROM users'),
        pool.query(`
          SELECT e.*,
                 COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS registered_count
          FROM events e
          LEFT JOIN registrations r ON r.event_id = e.id
          WHERE e.status = 'published'
          GROUP BY e.id
        `),
        pool.query("SELECT user_id, event_id FROM registrations WHERE status = 'confirmed'")
      ]);

      const users = usersRes.rows;
      const events = eventsRes.rows;
      const registrations = regsRes.rows;

      const userMap = new Map(users.map(u => [u.id, u]));
      const currentUser = userMap.get(userId);

      const userRegisteredEventIds = new Set(
        registrations.filter(r => r.user_id === userId).map(r => r.event_id)
      );

      const featureNames = [
        'Category Match',
        'Interest Overlap Score',
        'Price Tier',
        'Is Weekend',
        'User Registration History'
      ];

      const userRegCounts = {};
      registrations.forEach(r => {
        userRegCounts[r.user_id] = (userRegCounts[r.user_id] || 0) + 1;
      });

      const dataset = [];
      const labels = [];

      for (const reg of registrations) {
        const u = userMap.get(reg.user_id);
        const e = events.find(ev => ev.id === reg.event_id);
        if (u && e) {
          const categoryMatch = (u.interests || []).some(i => i.toLowerCase() === (e.category || '').toLowerCase()) ? 1 : 0;
          const overlap = getInterestOverlap(u.interests, e.category, e.tags);
          const priceTier = getPriceTier(e.price);
          const weekend = isWeekend(e.date);
          const regHistory = userRegCounts[u.id] || 1;

          dataset.push([categoryMatch, overlap, priceTier, weekend, regHistory]);
          labels.push(1);
        }
      }

      for (const u of users) {
        const uRegs = new Set(registrations.filter(r => r.user_id === u.id).map(r => r.event_id));
        const unregEvents = events.filter(ev => !uRegs.has(ev.id));

        const sampled = unregEvents.slice(0, 2);
        for (const e of sampled) {
          const categoryMatch = (u.interests || []).some(i => i.toLowerCase() === (e.category || '').toLowerCase()) ? 1 : 0;
          const overlap = getInterestOverlap(u.interests, e.category, e.tags);
          const priceTier = getPriceTier(e.price);
          const weekend = isWeekend(e.date);
          const regHistory = userRegCounts[u.id] || 0;

          dataset.push([categoryMatch, overlap, priceTier, weekend, regHistory]);
          labels.push(0);
        }
      }

      const dt = new DecisionTreeClassifier(4, 2);
      if (dataset.length > 0) {
        dt.fit(dataset, labels, featureNames);
      }

      const targetInterests = currentUser ? (currentUser.interests || []) : [];
      const targetUserHistory = userRegCounts[userId] || 0;

      const scoredEvents = events.map(e => {
        const isRegistered = userRegisteredEventIds.has(e.id);
        const categoryMatch = targetInterests.some(i => i.toLowerCase() === (e.category || '').toLowerCase()) ? 1 : 0;
        const overlap = getInterestOverlap(targetInterests, e.category, e.tags);
        const priceTier = getPriceTier(e.price);
        const weekend = isWeekend(e.date);

        const sample = [categoryMatch, overlap, priceTier, weekend, targetUserHistory];
        const prediction = dt.root ? dt.predictSample(sample) : { probability: 0.5, path: [] };

        let scorePct = Math.round(prediction.probability * 100);

        if (categoryMatch) scorePct = Math.min(99, scorePct + 15);
        if (overlap > 0) scorePct = Math.min(99, scorePct + 10);
        if (scorePct < 30) scorePct = Math.floor(Math.random() * 20) + 40;

        return {
          ...camelize(e),
          isRegistered,
          matchScore: scorePct,
          decisionExplanation: prediction.path[prediction.path.length - 1] || 'Matches your profile interests'
        };
      });

      const filtered = scoredEvents
        .filter(e => !e.isRegistered)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return {
        recommendations: filtered,
        model: 'CART Decision Tree Classifier',
        totalEvaluated: events.length
      };
    } catch (err) {
      console.error('getPersonalizedRecommendations error:', err);
      throw err;
    }
  }

  async getUserClusters() {
    try {
      const [usersRes, eventsRes, regsRes] = await Promise.all([
        pool.query('SELECT id, name, email, interests, role FROM users'),
        pool.query('SELECT id, category, price FROM events'),
        pool.query("SELECT user_id, event_id FROM registrations WHERE status = 'confirmed'")
      ]);

      const users = usersRes.rows;
      const events = eventsRes.rows;
      const regs = regsRes.rows;

      const eventMap = new Map(events.map(e => [e.id, e]));

      const categories = ['Technology', 'Music', 'Business', 'Health', 'Arts', 'Sports'];

      const userVectors = users.map(u => {
        const uRegs = regs.filter(r => r.user_id === u.id);
        const regEvents = uRegs.map(r => eventMap.get(r.event_id)).filter(Boolean);

        const catFreqs = categories.map(cat => {
          const inInterests = (u.interests || []).some(i => i.toLowerCase() === cat.toLowerCase()) ? 1 : 0;
          const inRegs = regEvents.filter(e => (e.category || '').toLowerCase() === cat.toLowerCase()).length;
          return inInterests + inRegs * 2;
        });

        const avgPrice = regEvents.length > 0
          ? regEvents.reduce((acc, e) => acc + Number(e.price || 0), 0) / regEvents.length
          : 0;

        const activity = regEvents.length;

        return [...catFreqs, getPriceTier(avgPrice), activity];
      });

      const kmeans = new KMeansClustering(3, 50);
      const fitResult = kmeans.fit(userVectors);

      const clusteredUsers = users.map((u, idx) => {
        const clusterIdx = fitResult.assignments[idx] || 0;
        const badge = kmeans.getPersonaBadge(clusterIdx);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          clusterIndex: clusterIdx,
          personaBadge: badge
        };
      });

      const clusterStats = [0, 1, 2].map(cIdx => {
        const badge = kmeans.getPersonaBadge(cIdx);
        const members = clusteredUsers.filter(u => u.clusterIndex === cIdx);
        return {
          clusterIndex: cIdx,
          name: badge.name,
          color: badge.color,
          icon: badge.icon,
          count: members.length,
          percentage: users.length > 0 ? Math.round((members.length / users.length) * 100) : 0,
          members: members.slice(0, 5)
        };
      });

      return {
        totalUsers: users.length,
        clusters: clusterStats,
        userMap: Object.fromEntries(clusteredUsers.map(u => [u.id, u.personaBadge]))
      };
    } catch (err) {
      console.error('getUserClusters error:', err);
      throw err;
    }
  }

  async getUserPersona(userId) {
    const allClusters = await this.getUserClusters();
    const persona = allClusters.userMap[userId] || {
      id: 0,
      name: "Tech & Innovation Enthusiast",
      color: "#3B82F6",
      icon: "⚡"
    };
    return persona;
  }
}

module.exports = new MLService();
