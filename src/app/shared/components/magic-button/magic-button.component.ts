import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-magic-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="magic-button"
      [class.rotating]="isRotating()"
      [class.liked]="isLiked()"
      (click)="handleClick()"
      aria-label="Like this page">
      <!-- Icon Container -->
      <div class="icon-container">
        <!-- Heart Icon (default) -->
        <svg
          *ngIf="!isLiked() || (isRotating() && rotationProgress() < 50)"
          class="icon heart-outline"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>

        <!-- Filled Heart Icon (after rotation) -->
        <svg
          *ngIf="isLiked() && (!isRotating() || rotationProgress() >= 50)"
          class="icon heart-filled"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
        </svg>
      </div>

      <!-- Ripple Effect -->
      <div class="ripple" *ngIf="showRipple()"></div>

      <!-- Particles -->
      <div class="particles" *ngIf="showParticles()">
        <div *ngFor="let particle of particleAngles" class="particle" [style.transform]="'rotate(' + particle + 'deg)'">
          <div class="particle-dot"></div>
        </div>
      </div>
    </button>
  `,
  styles: [`
    .magic-button {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow:
        0 10px 30px rgba(102, 126, 234, 0.4),
        0 0 0 0 rgba(102, 126, 234, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all 0.3s ease;
      position: relative;
      overflow: visible;

      &:hover {
        transform: scale(1.1);
        box-shadow:
          0 15px 40px rgba(102, 126, 234, 0.5),
          0 0 0 8px rgba(102, 126, 234, 0.1);
      }

      &:active {
        transform: scale(0.95);
      }

      &.rotating {
        animation: rotate360 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
      }

      &.liked {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        box-shadow:
          0 10px 30px rgba(245, 87, 108, 0.4),
          0 0 0 0 rgba(245, 87, 108, 0.5);

        &:hover {
          box-shadow:
            0 15px 40px rgba(245, 87, 108, 0.5),
            0 0 0 8px rgba(245, 87, 108, 0.1);
        }
      }

      @media (max-width: 768px) {
        width: 56px;
        height: 56px;
        bottom: 24px;
        right: 24px;
      }
    }

    @keyframes rotate360 {
      0% {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.2);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    .icon-container {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon {
      width: 100%;
      height: 100%;
      color: white;
      transition: all 0.3s ease;
    }

    .heart-outline {
      stroke-width: 2;
    }

    .heart-filled {
      animation: heart-pulse 0.5s ease;
    }

    @keyframes heart-pulse {
      0%, 100% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.3);
      }
      50% {
        transform: scale(0.9);
      }
      75% {
        transform: scale(1.1);
      }
    }

    .ripple {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      animation: ripple-expand 0.6s ease-out;
    }

    @keyframes ripple-expand {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }

    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 40px;
      transform-origin: 50% 0%;
      animation: particle-fly 0.8s ease-out forwards;
    }

    .particle-dot {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
    }

    @keyframes particle-fly {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-40px) scale(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .magic-button {
        animation: none !important;
      }

      .heart-filled,
      .ripple,
      .particle {
        animation: none !important;
      }
    }
  `]
})
export class MagicButtonComponent {
  private isRotatingSignal = signal(false);
  private isLikedSignal = signal(false);
  private rotationProgressSignal = signal(0);
  private showRippleSignal = signal(false);
  private showParticlesSignal = signal(false);

  isRotating = this.isRotatingSignal.asReadonly();
  isLiked = this.isLikedSignal.asReadonly();
  rotationProgress = this.rotationProgressSignal.asReadonly();
  showRipple = this.showRippleSignal.asReadonly();
  showParticles = this.showParticlesSignal.asReadonly();

  particleAngles = Array.from({ length: 12 }, (_, i) => i * 30);

  private currentHue = 220;
  private targetHue = 220;
  private transitionInterval: any;

  constructor(private themeService: ThemeService) {}

  handleClick() {
    if (this.isRotating()) return;

    this.isRotatingSignal.set(true);
    this.showRippleSignal.set(true);

    const newLikedState = !this.isLiked();

    this.simulateRotation();

    setTimeout(() => {
      this.isLikedSignal.set(newLikedState);
      this.showParticlesSignal.set(true);

      setTimeout(() => {
        this.showParticlesSignal.set(false);
      }, 800);
    }, 300);

    setTimeout(() => {
      this.isRotatingSignal.set(false);
      this.rotationProgressSignal.set(0);
      this.showRippleSignal.set(false);
    }, 600);

    if (newLikedState) {
      this.targetHue = 340;
    } else {
      this.targetHue = 220;
    }

    this.animateBackgroundTransition();
  }

  private simulateRotation() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      this.rotationProgressSignal.set(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 30);
  }

  private animateBackgroundTransition() {
    if (this.transitionInterval) {
      clearInterval(this.transitionInterval);
    }

    const duration = 1000;
    const startTime = Date.now();
    const startHue = this.currentHue;
    const hueChange = this.targetHue - startHue;

    this.transitionInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = this.easeInOutCubic(progress);

      this.currentHue = startHue + hueChange * easeProgress;

      this.updateBackgroundGradient();

      if (progress >= 1) {
        clearInterval(this.transitionInterval);
        this.transitionInterval = null;
      }
    }, 16);
  }

  private updateBackgroundGradient() {
    const color1 = this.hslToRgb(this.currentHue, 70, 65);
    const color2 = this.hslToRgb((this.currentHue + 20) % 360, 60, 55);

    document.body.style.background = `linear-gradient(135deg, rgb(${color1.r}, ${color1.g}, ${color1.b}) 0%, rgb(${color2.r}, ${color2.g}, ${color2.b}) 100%)`;
    document.body.style.transition = 'background 0.3s ease';
  }

  private hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
