import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (window.innerWidth < 900) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    let time = 0;

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      opacity: number;
      baseOpacity: number;
      pulsePhase: number;
      pulseSpeed: number;
      waveOffset: number;
      layer: number;
      hue: number;
      breathePhase: number;

      constructor(canvasWidth: number, canvasHeight: number, index: number) {
        this.baseX = Math.random() * canvasWidth;
        this.baseY = Math.random() * canvasHeight;
        this.x = this.baseX;
        this.y = this.baseY;
        
        this.layer = Math.floor(Math.random() * 3);
        this.baseSize = this.layer === 0 ? Math.random() * 2 + 1 : 
                        this.layer === 1 ? Math.random() * 4 + 2 : 
                        Math.random() * 6 + 3;
        this.size = this.baseSize;
        
        const layerSpeed = this.layer === 0 ? 0.3 : this.layer === 1 ? 0.5 : 0.8;
        this.speedX = (Math.random() - 0.5) * layerSpeed;
        this.speedY = (Math.random() - 0.5) * layerSpeed;
        
        this.baseOpacity = this.layer === 0 ? 0.3 : this.layer === 1 ? 0.5 : 0.7;
        this.opacity = this.baseOpacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.015;
        this.waveOffset = index * 0.1;
        this.breathePhase = Math.random() * Math.PI * 2;
        
        this.hue = 256 + (this.layer * 20) + Math.random() * 30;
      }

      update(canvasWidth: number, canvasHeight: number, globalTime: number) {
        const waveAmplitude = 30;
        const waveFrequency = 0.002;
        const waveX = Math.sin(globalTime * waveFrequency + this.waveOffset) * waveAmplitude;
        const waveY = Math.cos(globalTime * waveFrequency * 0.8 + this.waveOffset) * waveAmplitude;
        
        const easeX = this.easeInOutCubic(Math.abs(Math.sin(globalTime * 0.001 + this.waveOffset)));
        const easeY = this.easeInOutCubic(Math.abs(Math.cos(globalTime * 0.0008 + this.waveOffset)));
        
        this.baseX += this.speedX * easeX;
        this.baseY += this.speedY * easeY;
        
        if (this.baseX > canvasWidth) this.baseX = 0;
        if (this.baseX < 0) this.baseX = canvasWidth;
        if (this.baseY > canvasHeight) this.baseY = 0;
        if (this.baseY < 0) this.baseY = canvasHeight;
        
        this.x = this.baseX + waveX;
        this.y = this.baseY + waveY;
        
        this.pulsePhase += this.pulseSpeed;
        this.breathePhase += 0.01;
        const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.6;
        const breathe = Math.sin(this.breathePhase) * 0.2 + 0.8;
        
        this.opacity = this.baseOpacity * pulse;
        this.size = this.baseSize * pulse * breathe;
        
        this.hue = 256 + (this.layer * 20) + Math.sin(globalTime * 0.0005) * 30;
      }

      easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const saturation = 70 + Math.sin(this.pulsePhase) * 10;
        const lightness = 50 + this.layer * 10;
        
        const outerGlowSize = this.size * 5;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, outerGlowSize
        );
        gradient.addColorStop(0, `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${this.opacity * 0.9})`);
        gradient.addColorStop(0.3, `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${this.opacity * 0.5})`);
        gradient.addColorStop(0.6, `hsla(${this.hue + 20}, ${saturation}%, ${lightness + 10}%, ${this.opacity * 0.2})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, outerGlowSize, 0, Math.PI * 2);
        ctx.fill();
        
        const coreGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        coreGradient.addColorStop(0, `hsla(${this.hue + 30}, 90%, 80%, ${this.opacity})`);
        coreGradient.addColorStop(1, `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${this.opacity * 0.8})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      for (let i = 0; i < 80; i++) {
        particles.push(new Particle(canvas.width, canvas.height, i));
      }
    };

    const drawBackgroundMesh = (globalTime: number) => {
      const meshGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      const hue1 = 256 + Math.sin(globalTime * 0.0003) * 20;
      const hue2 = 280 + Math.cos(globalTime * 0.0004) * 20;
      const hue3 = 320 + Math.sin(globalTime * 0.0002) * 20;
      
      meshGradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.03)`);
      meshGradient.addColorStop(0.5, `hsla(${hue2}, 75%, 55%, 0.02)`);
      meshGradient.addColorStop(1, `hsla(${hue3}, 80%, 60%, 0.01)`);
      
      ctx.fillStyle = meshGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      time += 1;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawBackgroundMesh(time);

      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height, time);
        particle.draw(ctx);
      });

      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach(particleB => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            const distanceFactor = 1 - distance / maxDistance;
            const pulse = Math.sin(time * 0.02 + distance * 0.01) * 0.3 + 0.7;
            const baseOpacity = 0.15 * distanceFactor * pulse;
            const layerBoost = (particleA.layer + particleB.layer) / 6;
            const opacity = baseOpacity * (1 + layerBoost);
            
            const avgHue = (particleA.hue + particleB.hue) / 2;
            const gradient = ctx.createLinearGradient(
              particleA.x, particleA.y,
              particleB.x, particleB.y
            );
            gradient.addColorStop(0, `hsla(${particleA.hue}, 70%, 60%, ${opacity})`);
            gradient.addColorStop(0.5, `hsla(${avgHue}, 80%, 70%, ${opacity * 1.3})`);
            gradient.addColorStop(1, `hsla(${particleB.hue}, 70%, 60%, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = distanceFactor * 2;
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
};
