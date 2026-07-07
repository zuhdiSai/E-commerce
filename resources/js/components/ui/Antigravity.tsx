import React, { useRef, useEffect } from 'react';

export interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'capsule' | 'circle' | 'square';
    fieldStrength?: number;
}

export default function Antigravity({
    count = 480,
    magnetRadius = 17, 
    ringRadius = 10,   
    waveSpeed = 0.4,
    waveAmplitude = 1.6, 
    particleSize = 3.5,
    lerpSpeed = 0.1, 
    color = "#FF9FFC",
    autoAnimate = false, 
    particleVariance = 1,
    rotationSpeed = 0.05,
    depthFactor = 1, 
    pulseSpeed = 3, 
    particleShape = "capsule",
    fieldStrength = 10 
}: AntigravityProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        let mouse = { x: -1000, y: -1000 };
        
        const init = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    size: (Math.random() * particleVariance + 0.5) * particleSize,
                    speedX: (Math.random() - 0.5) * waveSpeed,
                    speedY: (Math.random() - 0.5) * waveSpeed,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpd: (Math.random() - 0.5) * rotationSpeed,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            
            particles.forEach(p => {
                // Float around
                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpd;
                
                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Simple magnetic effect to mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    p.x -= dx * 0.05;
                    p.y -= dy * 0.05;
                }
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                
                ctx.beginPath();
                if (particleShape === 'circle') {
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                } else if (particleShape === 'square') {
                    ctx.rect(-p.size/2, -p.size/2, p.size, p.size);
                } else { // capsule
                    ctx.roundRect(-p.size, -p.size/2, p.size*2, p.size, p.size/2);
                }
                ctx.fill();
                ctx.restore();
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();
        
        const handleResize = () => init();
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [count, color, particleSize, waveSpeed, particleShape, rotationSpeed, particleVariance]);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', zIndex: 0 }} 
        />
    );
}
