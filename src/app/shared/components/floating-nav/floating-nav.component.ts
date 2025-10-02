import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-floating-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="floating-nav" [class.collapsed]="isCollapsed()" [class.visible]="isVisible()">
      <!-- Toggle Button -->
      <button class="nav-toggle" (click)="toggleNav()" aria-label="Toggle navigation">
        <svg *ngIf="!isCollapsed()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
        <svg *ngIf="isCollapsed()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Brand -->
      <div class="nav-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="3"/>
            <path d="M30,50 L45,65 L70,35" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="brand-text" *ngIf="!isCollapsed()">Cognitia</span>
      </div>

      <!-- Navigation Items -->
      <ul class="nav-items">
        <li *ngFor="let item of navItems" class="nav-item-wrapper">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [attr.aria-label]="item.label"
            (mouseenter)="setHoveredItem(item.id)"
            (mouseleave)="clearHoveredItem()">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span class="nav-label" *ngIf="!isCollapsed()">{{ item.label }}</span>
            <div class="nav-indicator"></div>
          </a>

          <!-- Tooltip for collapsed state -->
          <div class="nav-tooltip" *ngIf="isCollapsed() && hoveredItem() === item.id">
            {{ item.label }}
          </div>
        </li>
      </ul>

      <!-- Footer Actions -->
      <div class="nav-footer">
        <button class="nav-action" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span *ngIf="!isCollapsed()">Settings</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .floating-nav {
      position: fixed;
      left: 24px;
      top: 50%;
      transform: translateY(-50%);
      width: 280px;
      max-height: 90vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 1.5rem 1rem;
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
      opacity: 0;
      pointer-events: none;

      @media (max-width: 1024px) {
        display: none;
      }

      &.visible {
        opacity: 1;
        pointer-events: all;
      }

      &.collapsed {
        width: 80px;
        padding: 1.5rem 0.75rem;
      }
    }

    .nav-toggle {
      position: absolute;
      right: -12px;
      top: 24px;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      z-index: 10;

      svg {
        width: 16px;
        height: 16px;
        color: white;
        transition: transform 0.3s ease;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
      }
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      overflow: hidden;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      color: #667eea;
      transition: transform 0.3s ease;

      svg {
        width: 100%;
        height: 100%;
      }

      .floating-nav:hover & {
        transform: rotate(360deg);
      }
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
      transition: opacity 0.3s ease;

      .collapsed & {
        opacity: 0;
        width: 0;
      }
    }

    .nav-items {
      flex: 1;
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(102, 126, 234, 0.3);
        border-radius: 2px;
      }
    }

    .nav-item-wrapper {
      position: relative;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      overflow: hidden;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        transform: translateX(4px);
      }

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
        color: #667eea;

        .nav-indicator {
          transform: scaleY(1);
        }

        .nav-icon {
          transform: scale(1.1);
        }
      }

      .collapsed & {
        justify-content: center;
        padding: 0.875rem;
      }
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .nav-label {
      font-size: 0.9375rem;
      font-weight: 500;
      white-space: nowrap;
      transition: opacity 0.3s ease;

      .collapsed & {
        opacity: 0;
        width: 0;
      }
    }

    .nav-indicator {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      width: 4px;
      height: 60%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 0 2px 2px 0;
      transition: transform 0.3s ease;
    }

    .nav-tooltip {
      position: absolute;
      left: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      padding: 0.5rem 1rem;
      background: #1f2937;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: tooltip-in 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border: 6px solid transparent;
        border-right-color: #1f2937;
      }
    }

    @keyframes tooltip-in {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }

    .nav-footer {
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .nav-action {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: none;
      border: none;
      color: #6b7280;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }

      .collapsed & {
        justify-content: center;
        padding: 0.875rem;

        span {
          display: none;
        }
      }
    }
  `]
})
export class FloatingNavComponent {
  private isCollapsedSignal = signal(false);
  private isVisibleSignal = signal(false);
  private hoveredItemSignal = signal<string | null>(null);

  isCollapsed = this.isCollapsedSignal.asReadonly();
  isVisible = this.isVisibleSignal.asReadonly();
  hoveredItem = this.hoveredItemSignal.asReadonly();

  navItems: NavItem[] = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
      route: '/chat'
    },
    {
      id: 'todo',
      label: 'Tasks',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
      route: '/todo'
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
      route: '/timetable'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>',
      route: '/flashcards'
    },
    {
      id: 'exam-prep',
      label: 'Exam Prep',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
      route: '/exam-prep'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      route: '/profile'
    }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 200) {
      this.isVisibleSignal.set(true);
    } else {
      this.isVisibleSignal.set(false);
    }
  }

  toggleNav() {
    this.isCollapsedSignal.update(collapsed => !collapsed);
  }

  setHoveredItem(id: string) {
    this.hoveredItemSignal.set(id);
  }

  clearHoveredItem() {
    this.hoveredItemSignal.set(null);
  }
}
