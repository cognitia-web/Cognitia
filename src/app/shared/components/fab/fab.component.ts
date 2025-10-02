import { Component, Output, EventEmitter, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface FabAction {
  icon: string;
  label: string;
  action: string;
  color?: string;
}

@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fab-container">
      <!-- Speed Dial Actions -->
      <div class="fab-actions" *ngIf="isOpen() && actions.length > 0">
        <button
          *ngFor="let action of actions; let i = index"
          class="fab-action"
          [style.animation-delay.ms]="i * 50"
          [style.background]="action.color || 'white'"
          (click)="onActionClick(action)"
          [@fadeInUp]>
          <span class="fab-action-icon">{{ action.icon }}</span>
          <span class="fab-action-label">{{ action.label }}</span>
        </button>
      </div>
      
      <!-- Main FAB Button -->
      <button
        class="fab-main"
        [class.fab-open]="isOpen()"
        (click)="toggle()"
        [@rotate]="isOpen() ? 'open' : 'closed'"
        [attr.aria-label]="ariaLabel"
        [attr.aria-expanded]="isOpen()">
        
        <svg 
          *ngIf="!isOpen()" 
          class="fab-icon"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        
        <svg 
          *ngIf="isOpen()" 
          class="fab-icon"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      
      <!-- Backdrop -->
      <div 
        class="fab-backdrop" 
        *ngIf="isOpen()"
        (click)="close()"
        [@fadeIn]>
      </div>
    </div>
  `,
  styles: [`
    .fab-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      
      @media (max-width: 768px) {
        bottom: 5rem;
        right: 1rem;
      }
    }
    
    .fab-main {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      position: relative;
      z-index: 1002;
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      &.fab-open {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
    }
    
    .fab-icon {
      width: 28px;
      height: 28px;
      transition: all 0.3s ease;
    }
    
    .fab-actions {
      position: absolute;
      bottom: 80px;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 1001;
    }
    
    .fab-action {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 50px;
      background: white;
      color: #1f2937;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      white-space: nowrap;
      animation: fadeInUp 0.3s ease-out backwards;
      
      &:hover {
        transform: translateX(-8px) scale(1.05);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      }
    }
    
    .fab-action-icon {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.1);
    }
    
    .fab-action-label {
      font-size: 0.9375rem;
      font-weight: 600;
    }
    
    .fab-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1000;
      backdrop-filter: blur(2px);
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  animations: [
    trigger('rotate', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open', style({ transform: 'rotate(45deg)' })),
      transition('closed <=> open', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FabComponent {
  @Input() actions: FabAction[] = [];
  @Input() ariaLabel: string = 'Quick actions';
  @Output() actionClicked = new EventEmitter<string>();
  
  private isOpenSignal = signal(false);
  isOpen = this.isOpenSignal.asReadonly();
  
  toggle() {
    this.isOpenSignal.update(open => !open);
  }
  
  close() {
    this.isOpenSignal.set(false);
  }
  
  onActionClick(action: FabAction) {
    this.actionClicked.emit(action.action);
    this.close();
  }
}
