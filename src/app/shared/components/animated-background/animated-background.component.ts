import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animated-background">
      <canvas #canvas class="background-canvas"></canvas>
      <div class="gradient-overlay"></div>
    </div>
  `,
  styles: [`
    .animated-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    
    .background-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.1) 0%,
        rgba(118, 75, 162, 0.1) 100%
      );
      pointer-events: none;
    }
  `]
})
export class AnimatedBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  
  ngOnInit() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.setupMouseTracking();
  }
  
  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  private createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }
  }
  
  private setupMouseTracking() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
  
  private animate = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw connections
    this.particles.forEach((particle, i) => {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);
      
      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = particle.x - this.particles[j].x;
        const dy = particle.y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(102, 126, 234, ${1 - distance / 150})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    });
    
    this.animationId = requestAnimationFrame(this.animate);
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }
  
  update(mouseX: number, mouseY: number) {
    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.vx -= (dx / distance) * force * 0.2;
      this.vy -= (dy / distance) * force * 0.2;
    }
    
    // Move particle
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce off edges
    if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    
    // Friction
    this.vx *= 0.99;
    this.vy *= 0.99;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(102, 126, 234, 0.6)';
    ctx.fill();
  }
}
