import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  route: string;
  label: string;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-floating-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Desktop Floating Nav -->
    <nav 
      class="floating-nav"
      role="navigation"
      aria-label="Primary navigation"
      [class.expanded]="isExpanded()"
      (mouseenter)="expand()"
      (mouseleave)="collapse()">
      <ul class="nav-list">
        <li *ngFor="let item of navItems" class="nav-item">
          <a 
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: false}"
            [attr.aria-label]="item.ariaLabel"
            [attr.aria-current]="isActive(item.route) ? 'page' : null"
            class="nav-link">
            <span class="icon" [innerHTML]="item.icon"></span>
            <span class="label">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- Mobile Hamburger -->
    <button 
      class="mobile-menu-toggle"
      (click)="toggleMobileMenu()"
      [attr.aria-expanded]="isMobileMenuOpen()"
      aria-label="Toggle navigation menu">
      <svg *ngIf="!isMobileMenuOpen()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <svg *ngIf="isMobileMenuOpen()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    
    <!-- Mobile Off-Canvas Menu -->
    <div 
      class="mobile-menu-overlay"
      *ngIf="isMobileMenuOpen()"
      (click)="closeMobileMenu()">
    </div>
    <div 
      class="mobile-menu"
      [class.open]="isMobileMenuOpen()">
      <div class="mobile-menu-header">
        <h2>Menu</h2>
        <button 
          class="close-btn"
          (click)="closeMobileMenu()"
          aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <ul class="mobile-nav-list">
        <li *ngFor="let item of navItems" class="mobile-nav-item">
          <a 
            [routerLink]="item.route"
            routerLinkActive="active"
            (click)="closeMobileMenu()"
            class="mobile-nav-link">
            <span class="icon" [innerHTML]="item.icon"></span>
            <span class="label">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    /* Desktop Floating Nav - Exact Tim Cook Specs */
    .floating-nav {
      position: fixed;
      top: 50%;
      left: 18px;
      transform: translateY(-50%);
      z-index: 1100;
      width: 72px;
      height: auto;
      background: rgba(8, 10, 15, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 14px;
      padding: 10px;
      transition: width 300ms ease;
      
      &.expanded {
        width: 240px;
      }
      
      @media (max-width: 900px) {
        display: none;
      }
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .nav-item {
      width: 100%;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 10px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);
      transition: all 200ms ease;
      position: relative;
      overflow: hidden;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }
      
      &:focus-visible {
        outline: 3px solid rgba(99, 102, 241, 0.5);
        outline-offset: 2px;
      }
      
      &.active {
        background: linear-gradient(90deg, #6A11CB, #2575FC);
        color: white;
        
        .icon {
          transform: scale(1.1);
        }
      }
    }
    
    .icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 200ms ease;
      
      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
    
    .label {
      opacity: 0;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 600;
      transition: opacity 200ms ease;
      
      .floating-nav.expanded & {
        opacity: 1;
      }
    }
    
    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
      display: none;
      position: fixed;
      top: 18px;
      left: 18px;
      z-index: 1200;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      border: none;
      background: rgba(8, 10, 15, 0.8);
      backdrop-filter: blur(8px);
      color: white;
      cursor: pointer;
      padding: 0;
      transition: all 200ms ease;
      
      svg {
        width: 24px;
        height: 24px;
      }
      
      &:hover {
        background: rgba(8, 10, 15, 0.95);
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      @media (max-width: 900px) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    /* Mobile Menu Overlay */
    .mobile-menu-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1150;
      
      @media (max-width: 900px) {
        display: block;
      }
    }
    
    /* Mobile Off-Canvas Menu */
    .mobile-menu {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      height: 100vh;
      background: rgba(8, 10, 15, 0.98);
      backdrop-filter: blur(20px);
      z-index: 1200;
      transform: translateX(-100%);
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      
      &.open {
        transform: translateX(0);
      }
      
      @media (max-width: 900px) {
        display: block;
      }
    }
    
    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: white;
      }
    }
    
    .close-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 200ms ease;
      
      svg {
        width: 20px;
        height: 20px;
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    .mobile-nav-list {
      list-style: none;
      padding: 20px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-weight: 600;
      transition: all 200ms ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }
      
      &.active {
        background: linear-gradient(90deg, #6A11CB, #2575FC);
        color: white;
      }
      
      .icon {
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class FloatingNavComponent {
  private isExpandedSignal = signal(false);
  private isMobileMenuOpenSignal = signal(false);
  
  isExpanded = this.isExpandedSignal.asReadonly();
  isMobileMenuOpen = this.isMobileMenuOpenSignal.asReadonly();
  
  navItems: NavItem[] = [
    {
      route: '/chat',
      label: 'AI Chat',
      ariaLabel: 'Navigate to AI Chat',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>'
    },
    {
      route: '/todo',
      label: 'Tasks',
      ariaLabel: 'Navigate to Tasks',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
    },
    {
      route: '/timetable',
      label: 'Schedule',
      ariaLabel: 'Navigate to Timetable',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    },
    {
      route: '/flashcards',
      label: 'Flashcards',
      ariaLabel: 'Navigate to Flashcards',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>'
    },
    {
      route: '/exam-prep',
      label: 'Exam Prep',
      ariaLabel: 'Navigate to Exam Preparation',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'
    },
    {
      route: '/profile',
      label: 'Profile',
      ariaLabel: 'Navigate to Profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'
    }
  ];
  
  expand() {
    this.isExpandedSignal.set(true);
  }
  
  collapse() {
    this.isExpandedSignal.set(false);
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpenSignal.update(open => !open);
  }
  
  closeMobileMenu() {
    this.isMobileMenuOpenSignal.set(false);
  }
  
  isActive(route: string): boolean {
    return window.location.pathname.startsWith(route);
  }
  
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }
}
