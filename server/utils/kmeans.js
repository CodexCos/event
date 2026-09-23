/**
 * K-Means Clustering Machine Learning Algorithm
 * Implemented in pure JavaScript for EventMate User Persona Segmentation
 */

class KMeansClustering {
  constructor(k = 3, maxIterations = 50) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = [];
    this.clusterLabels = [
      "Tech & Innovation Enthusiast",
      "Social & Cultural Explorer",
      "Workshop & Career Hunter"
    ];
  }

  /**
   * Euclidean distance between two numeric vectors
   */
  euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = (a[i] || 0) - (b[i] || 0);
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Initialize k centroids by selecting random data points or spread seeds
   */
  initializeCentroids(data) {
    const centroids = [];
    const usedIndices = new Set();
    const dataLen = data.length;

    while (centroids.length < this.k && centroids.length < dataLen) {
      const randIdx = Math.floor(Math.random() * dataLen);
      if (!usedIndices.has(randIdx)) {
        usedIndices.add(randIdx);
        centroids.push([...data[randIdx]]);
      }
    }

    // Fallback if dataset is smaller than k
    while (centroids.length < this.k) {
      const dim = data[0] ? data[0].length : 5;
      const dummy = Array.from({ length: dim }, () => Math.random());
      centroids.push(dummy);
    }

    return centroids;
  }

  /**
   * Assign each sample vector to nearest centroid index
   */
  assignClusters(data, centroids) {
    const clusters = Array.from({ length: this.k }, () => []);
    const assignments = [];

    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity;
      let closestCluster = 0;

      for (let c = 0; c < centroids.length; c++) {
        const dist = this.euclideanDistance(data[i], centroids[c]);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = c;
        }
      }

      clusters[closestCluster].push(data[i]);
      assignments.push(closestCluster);
    }

    return { clusters, assignments };
  }

  /**
   * Recalculate centroids based on cluster mean vectors
   */
  recalculateCentroids(clusters, dimensions) {
    const newCentroids = [];

    for (let c = 0; c < this.k; c++) {
      const clusterData = clusters[c];
      if (clusterData.length === 0) {
        // Keep old centroid or randomize if empty
        newCentroids.push(this.centroids[c] || Array.from({ length: dimensions }, () => 0));
        continue;
      }

      const meanVector = new Array(dimensions).fill(0);
      for (const sample of clusterData) {
        for (let d = 0; d < dimensions; d++) {
          meanVector[d] += sample[d] || 0;
        }
      }

      for (let d = 0; d < dimensions; d++) {
        meanVector[d] = meanVector[d] / clusterData.length;
      }

      newCentroids.push(meanVector);
    }

    return newCentroids;
  }

  /**
   * Fit K-Means on user feature matrix
   */
  fit(data) {
    if (!data || data.length === 0) {
      return { assignments: [], centroids: [] };
    }

    const dimensions = data[0].length;
    this.centroids = this.initializeCentroids(data);

    let iterations = 0;
    let assignments = [];
    let clusters = [];

    while (iterations < this.maxIterations) {
      const res = this.assignClusters(data, this.centroids);
      clusters = res.clusters;
      assignments = res.assignments;

      const newCentroids = this.recalculateCentroids(clusters, dimensions);

      // Check convergence (if centroids did not change)
      let shifted = false;
      for (let c = 0; c < this.k; c++) {
        if (this.euclideanDistance(this.centroids[c], newCentroids[c]) > 0.001) {
          shifted = true;
          break;
        }
      }

      this.centroids = newCentroids;
      if (!shifted) break;
      iterations++;
    }

    return {
      assignments,
      centroids: this.centroids,
      clusters
    };
  }

  /**
   * Predict cluster index for a single vector
   */
  predictSingle(vector) {
    if (!this.centroids || this.centroids.length === 0) return 0;

    let minDist = Infinity;
    let closestCluster = 0;

    for (let c = 0; c < this.centroids.length; c++) {
      const dist = this.euclideanDistance(vector, this.centroids[c]);
      if (dist < minDist) {
        minDist = dist;
        closestCluster = c;
      }
    }

    return closestCluster;
  }

  /**
   * Map cluster index to a human-friendly persona badge
   */
  getPersonaBadge(clusterIndex) {
    const personas = [
      { id: 0, name: "Tech & Innovation Enthusiast", color: "#3B82F6", icon: "⚡" },
      { id: 1, name: "Social & Cultural Explorer", color: "#EC4899", icon: "🎨" },
      { id: 2, name: "Workshop & Career Hunter", color: "#10B981", icon: "🎯" }
    ];
    return personas[clusterIndex % personas.length];
  }
}

module.exports = KMeansClustering;
