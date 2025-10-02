import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animated-background">
      <!-- Gradient Orbs -->
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-orb orb-4"></div>
      <div class="gradient-orb orb-5"></div>

      <!-- Animated Waves -->
      <div class="wave-container">
        <svg class="wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(102, 126, 234, 0.05)" d="M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,154.7C672,149,768,107,864,106.7C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg class="wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(118, 75, 162, 0.05)" d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,101.3C672,96,768,128,864,154.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg class="wave wave-3" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(240, 147, 251, 0.03)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,192C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <!-- Floating Particles -->
      <div class="particles">
        <div *ngFor="let particle of particles"
             class="particle"
             [style.left.%]="particle.x"
             [style.animation-delay.s]="particle.delay"
             [style.animation-duration.s]="particle.duration">
        </div>
      </div>

      <!-- Grid Pattern Overlay -->
      <div class="grid-pattern"></div>
    </div>
  `,
  styles: [`
    .animated-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      background: linear-gradient(
        135deg,
        #f5f7fa 0%,
        #c3cfe2 100%
      );
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
      animation: float-orb 20s ease-in-out infinite;
    }

    @keyframes float-orb {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(100px, -100px) scale(1.1);
      }
      50% {
        transform: translate(-50px, 100px) scale(0.9);
      }
      75% {
        transform: translate(-100px, -50px) scale(1.05);
      }
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      top: -300px;
      left: -200px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
      animation-delay: 0s;
      animation-duration: 25s;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      top: 20%;
      right: -100px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%);
      animation-delay: 5s;
      animation-duration: 30s;
    }

    .orb-3 {
      width: 700px;
      height: 700px;
      bottom: -200px;
      left: 30%;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
      animation-delay: 10s;
      animation-duration: 35s;
    }

    .orb-4 {
      width: 450px;
      height: 450px;
      top: 40%;
      left: 10%;
      background: radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%);
      animation-delay: 15s;
      animation-duration: 28s;
    }

    .orb-5 {
      width: 550px;
      height: 550px;
      bottom: 10%;
      right: 20%;
      background: radial-gradient(circle, rgba(245, 87, 108, 0.25) 0%, transparent 70%);
      animation-delay: 20s;
      animation-duration: 32s;
    }

    .wave-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      animation: wave-move 15s ease-in-out infinite;
    }

    @keyframes wave-move {
      0%, 100% {
        transform: translateX(0%) translateY(0%);
      }
      50% {
        transform: translateX(-5%) translateY(2%);
      }
    }

    .wave-1 {
      animation-duration: 20s;
      animation-delay: 0s;
    }

    .wave-2 {
      animation-duration: 25s;
      animation-delay: -5s;
    }

    .wave-3 {
      animation-duration: 30s;
      animation-delay: -10s;
    }

    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      bottom: -10px;
      animation: float-up linear infinite;
    }

    @keyframes float-up {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(calc(var(--drift) * 1px)) scale(0);
        opacity: 0;
      }
    }

    .grid-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.5;
      animation: grid-shift 20s linear infinite;
    }

    @keyframes grid-shift {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(50px, 50px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .gradient-orb,
      .wave,
      .particle,
      .grid-pattern {
        animation: none;
      }
    }
  `]
})
export class AnimatedBackgroundComponent implements OnInit {
  particles: Array<{ x: number; delay: number; duration: number }> = [];

  ngOnInit() {
    this.generateParticles();
  }

  private generateParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 20
      });
    }
  }
}
