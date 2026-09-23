import React, { useEffect, useState } from 'react';
import { getUserPersona } from '../services/mlService';

export default function UserPersonaBadge({ userId }) {
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      getUserPersona(userId)
        .then(data => {
          if (isMounted && data) setPersona(data);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [userId]);

  if (loading || !persona) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '20px',
        background: `rgba(255, 255, 255, 0.08)`,
        border: `1px solid ${persona.color || '#3B82F6'}55`,
        backdropFilter: 'blur(8px)',
        boxShadow: `0 2px 10px ${persona.color || '#3B82F6'}22`,
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#fff',
        transition: 'all 0.3s ease'
      }}
      title="ML User Persona assigned by K-Means Clustering algorithm"
    >
      <span style={{ fontSize: '1.1rem' }}>{persona.icon || '⚡'}</span>
      <span style={{ color: persona.color || '#60A5FA' }}>{persona.name}</span>
      <span
        style={{
          fontSize: '0.65rem',
          background: `${persona.color || '#3B82F6'}33`,
          color: persona.color || '#93C5FD',
          padding: '2px 6px',
          borderRadius: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        K-Means ML
      </span>
    </div>
  );
}
