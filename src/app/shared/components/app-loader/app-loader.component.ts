import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * App Loader Component
 * 
 * Tim Cook Specs:
 * - Full-screen overlay
 * - Center spinner + brand logo
 * - Animation: scale 0.9 → 1.05 → 1
 * - Duration: 900ms
 * - Easing: cubic-bezier(0.2, 0.8, 0.2, 1)
 * - Opacity: 0 → 1 → 0
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="isLoading">
      <div class="loader-content">
        <!-- Brand Logo -->
        <div class="brand-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2.5" 
                d="M13 10V3L4 14h7v7l9-11h-7z">
              </path>
            </svg>
          </div>
        </div>
        
        <!-- Brand Name -->
        <h1 class="brand-name">Cognitia</h1>
        
        <!-- Loading Spinner -->
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        
        <!-- Loading Text -->
        <p class="loading-text">Loading your workspace...</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0b1020 0%, #0f1724 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 300ms ease-out;
    }
    
    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      animation: scaleIn 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .brand-logo {
      position: relative;
      width: 80px;
      height: 80px;
    }
    
    .logo-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 60px rgba(106, 17, 203, 0.4);
      animation: pulse 2s ease-in-out infinite;
      
      svg {
        width: 48px;
        height: 48px;
        color: white;
      }
    }
    
    .brand-name {
      font-family: var(--font-display);
      font-size: 48px;
      font-weight: 900;
      background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -1px;
    }
    
    .spinner {
      position: relative;
      width: 60px;
      height: 60px;
    }
    
    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top-color: #6A11CB;
      border-radius: 50%;
      animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      
      &:nth-child(1) {
        animation-delay: -0.45s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.3s;
        border-top-color: #2575FC;
      }
      
      &:nth-child(3) {
        animation-delay: -0.15s;
        border-top-color: #FFD47A;
      }
    }
    
    .loading-text {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      animation: fadeInOut 2s ease-in-out infinite;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes scaleIn {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 20px 60px rgba(106, 17, 203, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 25px 70px rgba(106, 17, 203, 0.6);
      }
    }
    
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    
    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
    
    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .loader-content {
        animation: fadeIn 300ms ease-out;
      }
      
      .logo-icon {
        animation: none;
      }
      
      .spinner-ring {
        animation: none;
        border-top-color: #6A11CB;
      }
      
      .loading-text {
        animation: none;
        opacity: 0.8;
      }
    }
  `]
})
export class AppLoaderComponent {
  @Input() isLoading: boolean = true;
}
