import React, { useRef, useEffect } from 'react';

export interface PixelBlastProps {
  variant?: 'circle' | 'square';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
}

export default function PixelBlast({
  variant = 'circle',
  pixelSize = 8,
  color = '#a64df8',
  patternScale = 2.5,
  patternDensity = 1.3,
  enableRipples = true,
  rippleSpeed = 0.45,
  rippleThickness = 0.1,
  rippleIntensityScale = 1,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
}: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    // Initial size
    resize();
    window.addEventListener('resize', resize);

    // Parse color hex to rgb
    let r = 166, g = 77, b = 248;
    if (color.startsWith('#') && color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }

    const render = () => {
      time += speed * 0.05;
      
      // We clear the canvas since it's transparent, or fill it
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!transparent) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      const actualPixelSize = pixelSize * patternScale;
      const gap = actualPixelSize / patternDensity;

      for (let x = 0; x < canvas.width; x += gap) {
        for (let y = 0; y < canvas.height; y += gap) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let alpha = 1;
          
          // edge fade
          if (edgeFade > 0) {
            const normalizedDist = dist / maxDist;
            alpha *= Math.max(0, 1 - (normalizedDist * edgeFade * 1.5));
          }

          // ripples
          if (enableRipples) {
            // Create a wave based on distance and time
            const wave = Math.sin((dist * 0.02) - (time * rippleSpeed * 5));
            // Only pixels near the peak of the wave are fully visible
            if (wave > (1 - rippleThickness)) {
              const intensity = (wave - (1 - rippleThickness)) / rippleThickness;
              alpha *= intensity * rippleIntensityScale;
            } else {
              alpha *= 0.15; // base faint visibility
            }
          }

          if (alpha <= 0.02) continue;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
          
          if (variant === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, (pixelSize / 2) * Math.min(1, alpha + 0.5), 0, Math.PI * 2);
            ctx.fill();
          } else {
            const s = pixelSize * Math.min(1, alpha + 0.5);
            ctx.fillRect(x - s/2, y - s/2, s, s);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale, speed, transparent, edgeFade]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
}