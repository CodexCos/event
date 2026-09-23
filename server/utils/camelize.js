const camelize = (obj) => {
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(camelize);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = camelize(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

module.exports = camelize;
