import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [class]="'toast-' + toast.type"
        [@slideIn]
        (click)="toastService.remove(toast.id)">
        
        <div class="toast-icon">{{ toast.icon }}</div>
        
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        
        <button 
          class="toast-close"
          (click)="toastService.remove(toast.id)"
          aria-label="Close notification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="toast-progress" [style.animation-duration.ms]="toast.duration"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      
      @media (max-width: 768px) {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
    }
    
    .toast {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      overflow: hidden;
      border-left: 4px solid;
      
      &:hover {
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
      }
    }
    
    .toast-success {
      border-left-color: #10b981;
      
      .toast-icon {
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
      }
      
      .toast-progress {
        background: #10b981;
      }
    }
    
    .toast-error {
      border-left-color: #ef4444;
      
      .toast-icon {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
      
      .toast-progress {
        background: #ef4444;
      }
    }
    
    .toast-warning {
      border-left-color: #f59e0b;
      
      .toast-icon {
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
      }
      
      .toast-progress {
        background: #f59e0b;
      }
    }
    
    .toast-info {
      border-left-color: #3b82f6;
      
      .toast-icon {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
      }
      
      .toast-progress {
        background: #3b82f6;
      }
    }
    
    .toast-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .toast-content {
      flex: 1;
      padding-top: 0.5rem;
    }
    
    .toast-message {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
      font-weight: 500;
    }
    
    .toast-close {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s ease;
      flex-shrink: 0;
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #1f2937;
      }
    }
    
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      transform-origin: left;
      animation: progress linear forwards;
    }
    
    @keyframes progress {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(100%)' 
        }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateX(0)' 
          })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-out', 
          style({ 
            opacity: 0, 
            transform: 'translateX(100%)' 
          })
        )
      ])
    ])
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
