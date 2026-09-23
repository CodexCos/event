import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMLRecommendations } from '../services/mlService';

export default function RecommendedEvents({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [modelName, setModelName] = useState('CART Decision Tree Classifier');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      setLoading(true);
      getMLRecommendations(userId, 6)
        .then(res => {
          if (isMounted) {
            setRecommendations(res.recommendations || []);
            if (res.model) setModelName(res.model);
          }
        })
        .catch(err => console.error('Failed to load ML recommendations:', err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <div style={{ padding: '24px 0', color: '#9CA3AF', textAlign: 'center' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>✨</span> Training Decision Tree & Computing Recommendations...
        </p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ margin: '32px 0' }}>
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0
            }}
          >
            <span>🤖</span> Recommended For You
            <span
              style={{
                fontSize: '0.75rem',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              {modelName}
            </span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: '4px 0 0 0' }}>
            Personalized event suggestions computed using Gini Impurity feature classification.
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {recommendations.map(event => (
          <div
            key={event.id}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            }}
          >
            {/* Event Image & Badge */}
            <div style={{ position: 'relative', height: '140px', background: '#0F172A' }}>
              <img
                src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Match Score Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(99, 102, 241, 0.6)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  color: '#A5B4FC',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🔥</span> {event.matchScore}% Match
              </div>

              {/* Category Pill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(99, 102, 241, 0.9)',
                  color: '#FFF',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                {event.category || 'General'}
              </div>
            </div>

            {/* Event Content */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: '#F3F4F6',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}
              >
                {event.title}
              </h3>

              {/* Decision Explanation Rule */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderLeft: '3px solid #6366F1',
                  padding: '6px 10px',
                  borderRadius: '0 6px 6px 0',
                  fontSize: '0.75rem',
                  color: '#C7D2FE',
                  marginBottom: '12px',
                  fontStyle: 'italic'
                }}
                title="Decision tree node classification logic"
              >
                💡 Decision Rule: {event.decisionExplanation}
              </div>

              {/* Date & Location */}
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div>📍 {event.location || 'Online / TBD'}</div>
                <div>🏷️ {event.price ? `$${event.price}` : 'Free'}</div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                <Link
                  to={`/events/${event.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    width: '100%',
                    padding: '8px 0',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                >
                  View Event Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
