import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

/**
 * Signature Action Button Component
 * 
 * Spec from Tim Cook:
 * - Rotates 360° when clicked (600ms linear)
 * - Swaps icon mid-rotation (at 55% elapsed = 330ms)
 * - Triggers smooth "sunrise" site-wide background transition
 * - Respects prefers-reduced-motion
 */
@Component({
  selector: 'app-action-toggle-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="action-btn"
      [class.rotating]="isRotating()"
      [class.active]="isActive()"
      (click)="onToggle()"
      [attr.aria-pressed]="isActive()"
      [attr.aria-label]="isActive() ? 'Deactivate sunrise mode' : 'Activate sunrise mode'">
      
      <!-- Start Icon (Outline) -->
      <svg 
        *ngIf="!isActive()" 
        class="icon icon-start" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor">
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
        </path>
      </svg>
      
      <!-- End Icon (Filled) -->
      <svg 
        *ngIf="isActive()" 
        class="icon icon-end" 
        viewBox="0 0 24 24" 
        fill="currentColor">
        <path 
          d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z">
        </path>
      </svg>
    </button>
  `,
  styles: [`
    .action-btn {
      /* Exact specs from Tim Cook */
      width: 56px;
      height: 56px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, var(--primary-grad-a), var(--primary-grad-b));
      color: white;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      transition: transform var(--transition-base) var(--ease-smooth),
                  box-shadow var(--transition-base) var(--ease-smooth),
                  background var(--transition-base) var(--ease-smooth);
      position: relative;
      overflow: hidden;
      
      &:hover:not(.rotating) {
        transform: scale(1.05);
        box-shadow: var(--shadow-lg);
      }
      
      &:active:not(.rotating) {
        transform: scale(0.95);
      }
      
      &:focus-visible {
        outline: 3px solid rgba(99, 102, 241, 0.5);
        outline-offset: 2px;
      }
      
      /* Rotation animation - 600ms linear as specified */
      &.rotating {
        animation: rotate360 600ms linear;
      }
      
      &.active {
        background: linear-gradient(135deg, #FFD47A, #FF8A65);
      }
    }
    
    .icon {
      width: 28px;
      height: 28px;
      transition: opacity var(--transition-fast);
    }
    
    /* Rotation keyframe - exact 360° */
    @keyframes rotate360 {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .action-btn.rotating {
        animation: scaleRotate 600ms ease;
      }
      
      @keyframes scaleRotate {
        0% {
          transform: rotate(0deg) scale(1);
        }
        50% {
          transform: rotate(45deg) scale(1.1);
        }
        100% {
          transform: rotate(90deg) scale(1);
        }
      }
    }
  `]
})
export class ActionToggleButtonComponent {
  private isActiveSignal = signal(false);
  private isRotatingSignal = signal(false);
  
  isActive = this.isActiveSignal.asReadonly();
  isRotating = this.isRotatingSignal.asReadonly();
  
  // Rotation duration as specified
  private readonly ROTATE_DURATION = 600; // ms
  private readonly ICON_SWAP_TIMING = 0.55; // 55% of rotation
  
  constructor(private themeService: ThemeService) {}
  
  onToggle() {
    // Prevent multiple clicks during rotation
    if (this.isRotatingSignal()) return;
    
    this.isRotatingSignal.set(true);
    
    // Calculate icon swap timing (55% of 600ms = 330ms)
    const swapDelay = Math.round(this.ROTATE_DURATION * this.ICON_SWAP_TIMING);
    
    // Mid-rotation: swap icon and trigger sunrise
    setTimeout(() => {
      this.isActiveSignal.update(active => !active);
      
      // Trigger global sunrise theme change
      this.themeService.triggerSunrise(this.isActiveSignal());
    }, swapDelay);
    
    // End rotation
    setTimeout(() => {
      this.isRotatingSignal.set(false);
    }, this.ROTATE_DURATION);
  }
}
