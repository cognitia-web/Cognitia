import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton"
      [class]="'skeleton-' + type"
      [style.width]="width"
      [style.height]="height"
      [class.skeleton-circle]="circle"
      [class.skeleton-animate]="animate">
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        #e5e7eb 0%,
        #f3f4f6 50%,
        #e5e7eb 100%
      );
      background-size: 200% 100%;
      border-radius: 0.5rem;
      
      &.skeleton-animate {
        animation: shimmer 2s infinite linear;
      }
    }
    
    .skeleton-circle {
      border-radius: 50%;
    }
    
    .skeleton-text {
      height: 1rem;
      margin-bottom: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
        width: 80%;
      }
    }
    
    .skeleton-title {
      height: 2rem;
      width: 60%;
      margin-bottom: 1rem;
    }
    
    .skeleton-card {
      height: 200px;
      width: 100%;
    }
    
    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    
    .skeleton-button {
      height: 40px;
      width: 120px;
      border-radius: 0.5rem;
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .skeleton-animate {
        animation: none;
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'text' | 'title' | 'card' | 'avatar' | 'button' | 'custom' = 'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() circle: boolean = false;
  @Input() animate: boolean = true;
}
