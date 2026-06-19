import React, { useState, useEffect, useRef } from 'react';

const DewateringMascot = ({ isPasswordFocused, hasError, mouseX, mouseY }) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  
  // Usamos ref para mantener el target y hacer interpolación suave (Lerp)
  const targetOffset = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    if (isPasswordFocused || hasError) {
      targetOffset.current = { x: 0, y: 0 };
    } else {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 3; 
      
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      
      const angle = Math.atan2(deltaY, deltaX);
      
      // Distancia máxima menor para que no se salgan los ojos (más natural)
      const maxDistance = 3.5; 
      // Calculamos distancia suave basada en qué tan lejos está el mouse
      const distance = Math.min(maxDistance, Math.sqrt(deltaX*deltaX + deltaY*deltaY) / 80);

      targetOffset.current = {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      };
    }
  }, [mouseX, mouseY, isPasswordFocused, hasError]);

  // Bucle de animación para movimiento suave (Lerp)
  useEffect(() => {
    const smoothAnimate = () => {
      setEyeOffset(prev => ({
        x: prev.x + (targetOffset.current.x - prev.x) * 0.1, // Factor de suavidad 0.1
        y: prev.y + (targetOffset.current.y - prev.y) * 0.1
      }));
      requestRef.current = requestAnimationFrame(smoothAnimate);
    };
    requestRef.current = requestAnimationFrame(smoothAnimate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={{ 
      width: '120px', 
      height: '120px', 
      margin: '0 auto 1.5rem', 
      position: 'relative',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Efecto rebote suave
      transform: hasError ? 'scale(0.95)' : 'scale(1)'
    }}>
      <style>
        {`
          @keyframes blink {
            0%, 96%, 98% { transform: scaleY(1); }
            97% { transform: scaleY(0.1); }
            100% { transform: scaleY(1); }
          }
          .eye-blink {
            transform-origin: center;
            animation: blink 4s infinite;
          }
        `}
      </style>

      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 8px 16px rgba(37,99,235,0.2))' }}>
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hasError ? "#ef4444" : "#3b82f6"} />
            <stop offset="100%" stopColor={hasError ? "#991b1b" : "#1d4ed8"} />
          </linearGradient>
        </defs>
        
        {/* Cuerpo más amigable (bordes más suaves) */}
        <path 
          d="M50 8 C50 8 18 45 18 65 C18 83 32 92 50 92 C68 92 82 83 82 65 C82 45 50 8 50 8 Z" 
          fill="url(#logoGrad)"
          style={{ transition: 'fill 0.5s ease' }}
        />
        
        {/* Grupo de Párpados / Ojos con animación de parpadeo natural */}
        <g className={hasError || isPasswordFocused ? "" : "eye-blink"}>
          
          {isPasswordFocused ? (
            /* Ojos cerrados (Apretados / durmiendo) */
            <>
              <path d="M30 56 Q37 62 44 56" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <path d="M56 56 Q63 62 70 56" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            /* Ojos Abiertos */
            <>
              {/* Fondo de los ojos (Blancos) - ESTOS DEBEN QUEDARSE QUIETOS */}
              <circle cx="37" cy="56" r="7" fill="#ffffff" />
              <circle cx="63" cy="56" r="7" fill="#ffffff" />

              {/* LAS PUPILAS DINÁMICAS (Movimiento Suave) */}
              <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                {hasError ? (
                  <>
                    <path d="M34 53 L40 59 M40 53 L34 59" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M60 53 L66 59 M66 53 L60 59" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    {/* Pupilas normales un poco más grandes y juntas */}
                    <circle cx="37" cy="56" r="4" fill="#1e293b" />
                    <circle cx="63" cy="56" r="4" fill="#1e293b" />
                    {/* Brillo en los ojos para que se vea tierno/natural */}
                    <circle cx="35.5" cy="54.5" r="1.5" fill="#ffffff" opacity="0.8" />
                    <circle cx="61.5" cy="54.5" r="1.5" fill="#ffffff" opacity="0.8" />
                  </>
                )}
              </g>
            </>
          )}
        </g>

        {/* BOCA / EXPRESIÓN - Más amigable */}
        <g style={{ transition: 'all 0.3s ease' }}>
          {hasError ? (
            <path d="M42 76 Q50 71 58 76" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          ) : isPasswordFocused ? (
            <path d="M45 74 Q50 76 55 74" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M42 73 Q50 80 58 73" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
};

export default DewateringMascot;
