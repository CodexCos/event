import React, { useEffect, useState } from 'react';
import { getUserClusters } from '../services/mlService';

export default function UserClustersWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserClusters()
      .then(res => setData(res))
      .catch(err => console.error('Failed to load user clusters:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-48 shimmer bg-dark-800 rounded-xl" />;
  }

  if (!data || !data.clusters || data.clusters.length === 0) return null;

  return (
    <div className="glass-card p-6 bg-dark-900 border border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <span>🧠</span> ML User Personas (K-Means Clustering)
          </h2>
          <p className="text-dark-400 text-xs mt-0.5 font-semibold">
            Unsupervised segmentation of {data.totalUsers} platform users into behavior clusters.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#014baa] border border-[#014baa]/30 text-xs font-bold">
          K = 3 Clusters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {data.clusters.map(cluster => (
          <div
            key={cluster.clusterIndex}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid #014baa44`,
              borderRadius: '12px',
              padding: '16px'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{cluster.icon}</span>
              <span
                style={{
                  background: `#014baa22`,
                  color: '#014baa',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                {cluster.percentage}% Users
              </span>
            </div>
            <h3 className="font-bold text-sm text-dark-100 mb-1">{cluster.name}</h3>
            <p className="text-xs text-dark-400 font-semibold mb-3">{cluster.count} Active Members</p>

            {/* Progress bar */}
            <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.max(5, cluster.percentage)}%`,
                  background: '#014baa',
                  height: '100%',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
