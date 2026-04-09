import { useEffect, useState, useRef, useCallback } from 'react';

const PARTICLE_COUNT = 24;
const RAIN_COUNT = 60;

const ThemeParticles = ({ type }) => {
  const [particles, setParticles] = useState([]);
  const prevTypeRef = useRef(null);

  const generateParticles = useCallback((particleType) => {
    if (!particleType) return [];
    const count = particleType === 'rain' ? RAIN_COUNT : PARTICLE_COUNT;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * (particleType === 'rain' ? 4 : 8),
      duration: particleType === 'rain' ? (0.4 + Math.random() * 0.8) : (6 + Math.random() * 8),
      size: particleType === 'rain' ? (0.5 + Math.random() * 0.8) : (0.6 + Math.random() * 0.6),
      opacity: particleType === 'rain' ? (0.2 + Math.random() * 0.5) : (0.3 + Math.random() * 0.4),
      drift: (Math.random() - 0.5) * 120,
    }));
  }, []);

  useEffect(() => {
    if (type !== prevTypeRef.current) {
      prevTypeRef.current = type;
      setParticles(generateParticles(type));
    }
  }, [type, generateParticles]);

  if (!type || particles.length === 0) return null;

  const renderParticle = (p) => {
    const fallingStyle = {
      left: `${p.left}%`,
      animationDelay: `${p.delay}s`,
      animationDuration: `${p.duration}s`,
      transform: `scale(${p.size})`,
      opacity: p.opacity,
    };

    const ambientStyle = {
      left: `${p.left}%`,
      top: `${p.top}%`,
      animationDelay: `${p.delay}s`,
      animationDuration: `${p.duration}s`,
      transform: `scale(${p.size})`,
      opacity: p.opacity,
    };

    switch (type) {
      case 'snow':
        return (
          <div key={p.id} className="particle particle-snow" style={fallingStyle} />
        );
      case 'hearts':
        return (
          <div key={p.id} className="particle particle-heart" style={fallingStyle}>
            💕
          </div>
        );
      case 'petals':
        return (
          <div key={p.id} className="particle particle-petal" style={fallingStyle} />
        );
      case 'leaves':
        return (
          <div key={p.id} className="particle particle-leaf" style={fallingStyle} />
        );
      case 'sparkles':
        return (
          <div
            key={p.id}
            className="particle particle-sparkle"
            style={{
              ...ambientStyle,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            ✨
          </div>
        );
      case 'fireflies':
        return (
          <div
            key={p.id}
            className="particle particle-firefly"
            style={{
              ...ambientStyle,
              '--drift-x': `${p.drift}px`,
              '--drift-y': `${(Math.random() - 0.5) * 80}px`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        );
      case 'bubbles':
        return (
          <div
            key={p.id}
            className="particle particle-bubble"
            style={{
              left: `${p.left}%`,
              bottom: `-20px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              transform: `scale(${p.size})`,
              opacity: p.opacity,
            }}
          />
        );
      case 'sunrays':
        return (
          <div
            key={p.id}
            className="particle particle-sunray"
            style={{
              left: `${p.left}%`,
              top: `0`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: p.opacity,
            }}
          />
        );
      case 'rain':
        return (
          <div
            key={p.id}
            className="particle particle-rain"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `scaleX(${0.8 + Math.random() * 0.4}) scaleY(${p.size})`,
              opacity: p.opacity,
            }}
          />
        );
      default:
        return null;
    }
  };

  const isRain = type === 'rain';

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(renderParticle)}
      {isRain && <div className="rain-mist-overlay" />}
      {isRain && (
        <div className="rain-splash-row">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={`splash-${i}`}
              className="rain-splash"
              style={{
                left: `${6 + i * 8}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.6 + Math.random() * 0.6}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeParticles;
