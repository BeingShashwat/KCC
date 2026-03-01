import { useMemo } from 'react';

export default function ParticlesBg() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 6 + 2}px`,
      height: `${Math.random() * 6 + 2}px`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 15 + 15}s`,
      bg: Math.random() > 0.5 ? '#059669' : '#f59e0b',
    }));
  }, []);

  return (
    <div className="particles-bg">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.bg,
          }}
        />
      ))}
    </div>
  );
}
