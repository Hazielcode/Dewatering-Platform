import React, { useRef, useEffect } from 'react';

const HeroBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Subtle floating light particles (industrial dust / ambient light)
    const PARTICLE_COUNT = 25;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      time += 0.005;

      // Subtle floating dust/light particles
      particles.forEach(p => {
        p.pulse += 0.015;
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse glow attraction (subtle)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150) {
          const force = (150 - mDist) / 150;
          p.opacity = Math.min(0.6, p.opacity + force * 0.02);
        }

        // Wrap around
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        const r = p.radius + Math.sin(p.pulse) * 0.3;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `rgba(200, 220, 255, ${currentOpacity})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle light sweep (like a slow searchlight across the image)
      const sweepX = W * 0.5 + Math.sin(time * 0.4) * W * 0.35;
      const sweepY = H * 0.4 + Math.cos(time * 0.3) * H * 0.15;
      const sweep = ctx.createRadialGradient(sweepX, sweepY, 0, sweepX, sweepY, W * 0.4);
      sweep.addColorStop(0, 'rgba(59, 130, 246, 0.04)');
      sweep.addColorStop(0.5, 'rgba(59, 130, 246, 0.015)');
      sweep.addColorStop(1, 'transparent');
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, W, H);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Background image with Ken Burns animation */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage: 'url(/images/hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurns 25s ease-in-out infinite alternate',
        }} />
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,15,30,0.65) 0%, rgba(10,15,30,0.75) 50%, rgba(10,15,30,0.85) 100%)',
        }} />
      </div>

      {/* Interactive particle overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 1, pointerEvents: 'auto',
        }}
      />

      {/* CSS Keyframes injection */}
      <style>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1.0) translate(0%, 0%);
          }
          33% {
            transform: scale(1.08) translate(-1.5%, -1%);
          }
          66% {
            transform: scale(1.12) translate(1%, -2%);
          }
          100% {
            transform: scale(1.05) translate(-0.5%, 0.5%);
          }
        }
      `}</style>
    </>
  );
};

export default HeroBackground;
