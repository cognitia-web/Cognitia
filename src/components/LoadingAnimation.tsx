import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const LoadingAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let animationFrameId: number;
    let time = 0;
    const particles: EmberParticle[] = [];
    const maxParticles = prefersReducedMotion ? 0 : 30;

    class EmberParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number;

      constructor(centerX: number, centerY: number) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 2 + 1;
        this.x = centerX;
        this.y = centerY;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.life = 1;
        this.maxLife = Math.random() * 60 + 40;
        this.size = Math.random() * 2 + 1;
        this.hue = 256 + Math.random() * 70;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1 / this.maxLife;
        this.vy += 0.05;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.life;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 70%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawNeuralNetwork = (centerX: number, centerY: number, globalTime: number) => {
      const nodeCount = 8;
      const radius = 60;
      const nodes: { x: number; y: number; active: number }[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + globalTime * 0.01;
        const breathe = Math.sin(globalTime * 0.02 + i) * 5;
        const x = centerX + Math.cos(angle) * (radius + breathe);
        const y = centerY + Math.sin(angle) * (radius + breathe);
        const active = Math.sin(globalTime * 0.05 + i * 0.5) * 0.5 + 0.5;
        nodes.push({ x, y, active });
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const pulse = Math.sin(globalTime * 0.03 + i + j) * 0.5 + 0.5;
          const opacity = (nodes[i].active + nodes[j].active) / 2 * pulse * 0.3;
          
          const gradient = ctx.createLinearGradient(
            nodes[i].x, nodes[i].y,
            nodes[j].x, nodes[j].y
          );
          gradient.addColorStop(0, `hsla(256, 70%, 60%, ${opacity})`);
          gradient.addColorStop(0.5, `hsla(280, 80%, 70%, ${opacity * 1.2})`);
          gradient.addColorStop(1, `hsla(328, 70%, 60%, ${opacity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      nodes.forEach((node, i) => {
        const size = 4 + node.active * 3;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
        glow.addColorStop(0, `hsla(${256 + i * 10}, 80%, 70%, ${node.active})`);
        glow.addColorStop(0.5, `hsla(${256 + i * 10}, 80%, 70%, ${node.active * 0.5})`);
        glow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = `hsla(${256 + i * 10}, 90%, 80%, ${node.active})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      drawNeuralNetwork(centerX, centerY, time);

      if (particles.length < maxParticles && Math.random() > 0.7) {
        particles.push(new EmberParticle(centerX, centerY));
      }

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    canvas.width = 400;
    canvas.height = 400;

    if (prefersReducedMotion) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      drawNeuralNetwork(centerX, centerY, 0);
    } else {
      animate();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const textVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.03,
        duration: prefersReducedMotion ? 0 : undefined,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  const text = "Loading Cognitia";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-lg">
      <div className="relative flex flex-col items-center">
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: '400px', height: '400px' }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  width: `${120 + i * 40}px`,
                  height: `${120 + i * 40}px`,
                  borderColor: `hsl(${256 + i * 30}, 70%, 60%)`,
                }}
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="relative w-32 h-32 flex items-center justify-center z-10"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: "radial-gradient(circle, hsl(256, 81%, 62%), hsl(328, 82%, 60%))",
              }}
              animate={prefersReducedMotion ? {} : {
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              animate={prefersReducedMotion ? {} : {
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Brain className="w-20 h-20 text-primary relative z-10" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-4 text-center"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <p className="text-xl font-semibold flex">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                style={{
                  display: char === " " ? "inline-block" : "inline-block",
                  width: char === " " ? "0.5em" : "auto",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </p>
          
          <motion.div
            className="flex justify-center gap-1.5 mt-3"
            animate={prefersReducedMotion ? {} : {
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
