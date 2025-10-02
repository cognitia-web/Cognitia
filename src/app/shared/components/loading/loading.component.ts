import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="(isLoading$ | async)" class="loading-overlay" [@fadeInOut]>
      <div class="loading-container">
        <!-- Animated Logo -->
        <div class="loading-logo">
          <div class="logo-circle">
            <svg viewBox="0 0 100 100" fill="none">
              <circle
                class="logo-ring"
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-dasharray="283"
                stroke-dashoffset="283">
                <animate
                  attributeName="stroke-dashoffset"
                  from="283"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"/>
              </circle>
              <circle
                class="logo-ring-inner"
                cx="50"
                cy="50"
                r="35"
                stroke="url(#gradient2)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="220"
                stroke-dashoffset="220">
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="220"
                  dur="1.5s"
                  repeatCount="indefinite"/>
              </circle>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Pulsing Particles -->
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
          <div class="particle particle-6"></div>
        </div>

        <!-- Loading Text -->
        <div class="loading-text">
          <span class="loading-letter" *ngFor="let letter of loadingLetters; let i = index" [style.animation-delay.ms]="i * 100">
            {{ letter }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="loading-progress">
          <div class="progress-bar-track">
            <div class="progress-bar-fill"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .loading-logo {
      position: relative;
      width: 120px;
      height: 120px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .logo-circle {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .logo-circle svg {
      width: 100%;
      height: 100%;
    }

    .particle {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
      animation: particle-float 2s ease-in-out infinite;
    }

    @keyframes particle-float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(var(--tx), var(--ty)) scale(1.5);
        opacity: 0.5;
      }
    }

    .particle-1 {
      top: 0;
      left: 50%;
      --tx: -30px;
      --ty: -30px;
      animation-delay: 0s;
    }

    .particle-2 {
      top: 50%;
      right: 0;
      --tx: 30px;
      --ty: -20px;
      animation-delay: 0.3s;
    }

    .particle-3 {
      bottom: 0;
      left: 50%;
      --tx: 20px;
      --ty: 30px;
      animation-delay: 0.6s;
    }

    .particle-4 {
      top: 50%;
      left: 0;
      --tx: -30px;
      --ty: 20px;
      animation-delay: 0.9s;
    }

    .particle-5 {
      top: 25%;
      right: 25%;
      --tx: 25px;
      --ty: -25px;
      animation-delay: 1.2s;
    }

    .particle-6 {
      bottom: 25%;
      left: 25%;
      --tx: -25px;
      --ty: 25px;
      animation-delay: 1.5s;
    }

    .loading-text {
      display: flex;
      gap: 4px;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      letter-spacing: 2px;
    }

    .loading-letter {
      animation: bounce 1.2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-15px);
      }
    }

    .loading-progress {
      width: 200px;
    }

    .progress-bar-track {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: white;
      border-radius: 2px;
      animation: loading-progress 2s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    @keyframes loading-progress {
      0% {
        width: 0%;
      }
      50% {
        width: 100%;
      }
      100% {
        width: 0%;
      }
    }
  `]
})
export class LoadingComponent implements OnInit {
  isLoading$ = this.loadingService.isLoading$;
  loadingLetters = ['C', 'o', 'g', 'n', 'i', 't', 'i', 'a'];

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }
}
