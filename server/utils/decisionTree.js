/**
 * Classification and Regression Trees (CART) Decision Tree Algorithm
 * Implemented in pure JavaScript for EventMate Machine Learning
 */

class Node {
  constructor({ feature = null, threshold = null, left = null, right = null, value = null, impurity = 0, samples = 0, rule = '' }) {
    this.feature = feature;       // Feature index or name to split on
    this.threshold = threshold;   // Splitting threshold value
    this.left = left;             // Left child node (<= threshold or === threshold)
    this.right = right;           // Right child node (> threshold or !== threshold)
    this.value = value;           // Target probability / class distribution if leaf node
    this.impurity = impurity;     // Gini impurity at this node
    this.samples = samples;       // Number of training samples at node
    this.rule = rule;             // Human-readable rule description
  }

  isLeaf() {
    return this.value !== null;
  }
}

class DecisionTreeClassifier {
  constructor(maxDepth = 4, minSamplesSplit = 2) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.root = null;
    this.featureNames = [];
  }

  /**
   * Calculate Gini Impurity for a set of labels
   * Gini = 1 - sum(p_i ^ 2)
   */
  calculateGini(labels) {
    if (!labels || labels.length === 0) return 0;
    const total = labels.length;
    const counts = {};
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }

    let impurity = 1.0;
    for (const key in counts) {
      const prob = counts[key] / total;
      impurity -= prob * prob;
    }
    return impurity;
  }

  /**
   * Evaluate best feature and threshold to split dataset
   */
  findBestSplit(dataset, labels) {
    let bestGini = Infinity;
    let bestSplit = null;
    const numSamples = dataset.length;
    const numFeatures = dataset[0] ? dataset[0].length : 0;

    for (let f = 0; f < numFeatures; f++) {
      // Get unique values for this feature
      const values = [...new Set(dataset.map(row => row[f]))];

      for (const val of values) {
        // Split dataset based on value
        const leftIdx = [];
        const rightIdx = [];

        for (let i = 0; i < numSamples; i++) {
          if (dataset[i][f] <= val) {
            leftIdx.push(i);
          } else {
            rightIdx.push(i);
          }
        }

        if (leftIdx.length === 0 || rightIdx.length === 0) continue;

        const leftLabels = leftIdx.map(i => labels[i]);
        const rightLabels = rightIdx.map(i => labels[i]);

        const leftGini = this.calculateGini(leftLabels);
        const rightGini = this.calculateGini(rightLabels);

        // Weighted Gini Impurity of the split
        const weightedGini = (leftLabels.length / numSamples) * leftGini + (rightLabels.length / numSamples) * rightGini;

        if (weightedGini < bestGini) {
          bestGini = weightedGini;
          bestSplit = {
            featureIndex: f,
            threshold: val,
            leftDataset: leftIdx.map(i => dataset[i]),
            leftLabels,
            rightDataset: rightIdx.map(i => dataset[i]),
            rightLabels,
            gini: weightedGini
          };
        }
      }
    }

    return bestSplit;
  }

  /**
   * Recursively build Decision Tree nodes
   */
  buildTree(dataset, labels, depth = 0) {
    const numSamples = dataset.length;
    const currentGini = this.calculateGini(labels);

    // Calculate leaf value (probability of positive class y = 1)
    const posCount = labels.filter(l => l === 1).length;
    const leafValue = numSamples > 0 ? posCount / numSamples : 0;

    // Base conditions for leaf node creation
    if (
      depth >= this.maxDepth ||
      numSamples < this.minSamplesSplit ||
      currentGini === 0 ||
      posCount === 0 ||
      posCount === numSamples
    ) {
      return new Node({
        value: leafValue,
        impurity: currentGini,
        samples: numSamples,
        rule: `Probability of interest: ${(leafValue * 100).toFixed(0)}%`
      });
    }

    const bestSplit = this.findBestSplit(dataset, labels);

    if (!bestSplit || bestSplit.gini >= currentGini) {
      return new Node({
        value: leafValue,
        impurity: currentGini,
        samples: numSamples,
        rule: `Probability of interest: ${(leafValue * 100).toFixed(0)}%`
      });
    }

    const featureName = this.featureNames[bestSplit.featureIndex] || `Feature ${bestSplit.featureIndex}`;

    const leftChild = this.buildTree(bestSplit.leftDataset, bestSplit.leftLabels, depth + 1);
    const rightChild = this.buildTree(bestSplit.rightDataset, bestSplit.rightLabels, depth + 1);

    return new Node({
      feature: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: leftChild,
      right: rightChild,
      impurity: bestSplit.gini,
      samples: numSamples,
      rule: `${featureName} <= ${bestSplit.threshold}`
    });
  }

  fit(dataset, labels, featureNames = []) {
    this.featureNames = featureNames;
    this.root = this.buildTree(dataset, labels, 0);
  }

  predictSample(sample, node = this.root, path = []) {
    if (!node) return { probability: 0, path };

    if (node.isLeaf()) {
      return {
        probability: node.value,
        path: [...path, node.rule]
      };
    }

    const val = sample[node.feature];
    const featureName = this.featureNames[node.feature] || `Feature ${node.feature}`;

    if (val <= node.threshold) {
      return this.predictSample(sample, node.left, [...path, `${featureName} matches criteria (<= ${node.threshold})`]);
    } else {
      return this.predictSample(sample, node.right, [...path, `${featureName} (> ${node.threshold})`]);
    }
  }

  predict(samples) {
    return samples.map(sample => this.predictSample(sample));
  }
}

module.exports = DecisionTreeClassifier;
