import React, { useState, useEffect } from 'react';

const DewateringMascot = ({ isPasswordFocused, hasError, mouseX, mouseY }) => {
  // Configuración de la posición de los ojos
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Si está tapado o hay error grave, no sigue el mouse
    if (isPasswordFocused || hasError) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    // Calcular el ángulo entre el centro del muñeco y el mouse
    // Asumimos que el muñeco está más o menos en el centro arriba del form.
    // Esto es un cálculo simplificado de tracking.
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3; 
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    
    const angle = Math.atan2(deltaY, deltaX);
    
    // Distancia máxima que los ojos se pueden mover del centro
    const maxDistance = 6; 
    const distance = Math.min(maxDistance, Math.sqrt(deltaX*deltaX + deltaY*deltaY) / 50);

    setEyeOffset({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
  }, [mouseX, mouseY, isPasswordFocused, hasError]);

  return (
    <div style={{ 
      width: '120px', 
      height: '120px', 
      margin: '0 auto 1.5rem', 
      position: 'relative',
      transition: 'transform 0.3s ease',
      transform: hasError ? 'scale(0.95)' : 'scale(1)'
    }}>
      {/* 
        EL CUERPO (EL LOGO): 
        Usamos una Gota/Engranaje minimalista y corporativo.
        El usuario puede luego reemplazar este <path> con el de su logo real.
      */}
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 8px 16px rgba(37,99,235,0.2))' }}>
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hasError ? "#ef4444" : "#2563eb"} />
            <stop offset="100%" stopColor={hasError ? "#991b1b" : "#1e40af"} />
          </linearGradient>
        </defs>
        
        {/* Forma Base Corporativa (Ej: Gota de filtración industrial) */}
        <path 
          d="M50 5 C50 5 15 45 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 45 50 5 50 5 Z" 
          fill="url(#logoGrad)"
          style={{ transition: 'fill 0.5s ease' }}
        />
        
        {/* 
          LOS OJOS DINÁMICOS
          Se mueven según el cálculo de eyeOffset
        */}
        <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`} style={{ transition: 'transform 0.1s ease-out' }}>
          
          {/* Fondo de los ojos (Blancos) */}
          <circle cx="35" cy="55" r="8" fill="#ffffff" />
          <circle cx="65" cy="55" r="8" fill="#ffffff" />

          {/* Pupilas (Si hay error, cambian de forma; si no, son puntos) */}
          {hasError ? (
            <>
              {/* Ojos de "Error / Mareado" (X X) */}
              <path d="M32 52 L38 58 M38 52 L32 58" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M62 52 L68 58 M68 52 L62 58" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Pupilas normales */}
              <circle cx="35" cy="55" r="3.5" fill="#1e293b" />
              <circle cx="65" cy="55" r="3.5" fill="#1e293b" />
            </>
          )}
        </g>

        {/* 
          ANIMACIÓN DE PASSWORD (TAPAR OJOS)
          Unos "escudos" digitales bajan corporativamente a tapar los ojos.
        */}
        <g style={{ 
            transform: isPasswordFocused ? 'translateY(0)' : 'translateY(-100px)', 
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isPasswordFocused ? 1 : 0
          }}>
          <rect x="25" y="45" width="20" height="20" rx="4" fill="#0f172a" />
          <rect x="55" y="45" width="20" height="20" rx="4" fill="#0f172a" />
          {/* Luz de seguridad */}
          <circle cx="35" cy="55" r="2" fill="#10b981" />
          <circle cx="65" cy="55" r="2" fill="#10b981" />
        </g>

        {/* BOCA / EXPRESIÓN */}
        <g style={{ transition: 'transform 0.3s ease' }}>
          {hasError ? (
            // Boca de error (Mueca ondulada)
            <path d="M40 75 Q45 70 50 75 T60 75" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          ) : isPasswordFocused ? (
            // Boca seria (Concentrado)
            <line x1="42" y1="75" x2="58" y2="75" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            // Boca Sonrisa leve
            <path d="M42 72 Q50 78 58 72" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
};

export default DewateringMascot;
