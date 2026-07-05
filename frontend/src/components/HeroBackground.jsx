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
    const handleMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // === PARTICLES (water droplets / molecules) ===
    const PARTICLE_COUNT = 70;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.6 + 0.15), // float upward
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // === BUBBLES (larger, slower, more transparent) ===
    const BUBBLE_COUNT = 12;
    const bubbles = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        radius: Math.random() * 18 + 8,
        speed: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        opacity: Math.random() * 0.12 + 0.04,
      });
    }

    // === WAVE parameters ===
    let waveOffset = 0;

    // === FILTRATION GRID (subtle horizontal lines that pulse) ===
    const GRID_LINES = 6;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // --- Background gradient (deep industrial water) ---
      const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.4, '#0d2847');
      bgGrad.addColorStop(0.7, '#0f3460');
      bgGrad.addColorStop(1, '#0a1628');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // --- Subtle radial glow (simulates deep water light) ---
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, W * 0.6);
      glow.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
      glow.addColorStop(0.5, 'rgba(37, 99, 235, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // --- Filtration grid lines (horizontal, subtle) ---
      for (let i = 1; i <= GRID_LINES; i++) {
        const y = (H / (GRID_LINES + 1)) * i;
        const pulse = Math.sin(waveOffset * 0.5 + i * 0.8) * 0.02 + 0.03;
        ctx.strokeStyle = `rgba(59, 130, 246, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 16]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- Connection lines between nearby particles ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // --- Particles ---
      particles.forEach(p => {
        p.pulse += 0.02;
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 100) {
          const force = (100 - mDist) / 100;
          p.x += (mdx / mDist) * force * 2;
          p.y += (mdy / mDist) * force * 2;
        }

        // Wrap around
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const r = p.radius + Math.sin(p.pulse) * 0.5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grad.addColorStop(0, `rgba(147, 197, 253, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(59, 130, 246, ${p.opacity * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(191, 219, 254, ${p.opacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Bubbles ---
      bubbles.forEach(b => {
        b.wobble += b.wobbleSpeed;
        b.y -= b.speed;
        b.x += Math.sin(b.wobble) * 0.6;

        if (b.y < -b.radius * 2) {
          b.y = H + b.radius + Math.random() * 100;
          b.x = Math.random() * W;
        }

        // Bubble outline
        ctx.strokeStyle = `rgba(147, 197, 253, ${b.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Bubble highlight
        ctx.fillStyle = `rgba(219, 234, 254, ${b.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Inner fill
        const bGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        bGrad.addColorStop(0, `rgba(59, 130, 246, ${b.opacity * 0.3})`);
        bGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Bottom wave ---
      waveOffset += 0.015;
      for (let layer = 0; layer < 3; layer++) {
        const baseY = H - 30 + layer * 12;
        const amplitude = 12 - layer * 3;
        const alpha = 0.06 - layer * 0.015;

        ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const y = baseY + Math.sin(x * 0.008 + waveOffset + layer * 1.2) * amplitude
                          + Math.sin(x * 0.015 + waveOffset * 0.7) * (amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      }

      // --- Vignette overlay ---
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 1.0);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(5, 10, 20, 0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default HeroBackground;
