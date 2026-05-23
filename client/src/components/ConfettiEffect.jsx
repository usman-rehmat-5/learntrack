import { useEffect, useState } from 'react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
const SHAPES = ['circle', 'square', 'triangle'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    id: Math.random(),
    x: 50,
    y: -10,
    size: randomBetween(6, 14),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    speedX: randomBetween(-3, 3),
    speedY: randomBetween(2, 6),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-8, 8),
    opacity: 1
  };
}

function ConfettiEffect({ active, duration = 3000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const initial = Array.from({ length: 80 }, createParticle);
    setParticles(initial);

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.speedX * 0.3,
          y: p.y + p.speedY * 0.5,
          rotation: p.rotation + p.rotationSpeed,
          opacity: p.y > 80 ? p.opacity - 0.02 : p.opacity
        })).filter(p => p.opacity > 0 && p.y < 110);

        if (Math.random() > 0.6) {
          updated.push(createParticle());
        }

        return updated;
      });
    }, 30);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [active, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size,
            backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0',
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            transition: 'none',
            borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : 'none',
            borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : 'none',
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : 'none'
          }}
        />
      ))}
    </div>
  );
}

export default ConfettiEffect;
