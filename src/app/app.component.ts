import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { FabComponent, FabAction } from './shared/components/fab/fab.component';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';
import { AnimatedBackgroundComponent } from './shared/components/animated-background/animated-background.component';
import { PremiumFooterComponent } from './shared/components/premium-footer/premium-footer.component';
import { FloatingNavComponent } from './shared/components/floating-nav/floating-nav.component';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { ActionToggleButtonComponent } from './shared/components/action-button/action-toggle-button.component';
import { ToastService } from './shared/components/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ToastComponent,
    BreadcrumbComponent,
    FabComponent,
    CommandPaletteComponent,
    AnimatedBackgroundComponent,
    PremiumFooterComponent,
    FloatingNavComponent,
    AppLoaderComponent,
    ActionToggleButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cognitia';
  showNav = true;
  isAuthenticated = false;
  mobileMenuOpen = false;

  // App ready state for loader
  private isAppReadySignal = signal(false);
  isAppReady = this.isAppReadySignal.asReadonly();

  fabActions: FabAction[] = [
    {
      icon: '✓',
      label: 'New Task',
      action: 'new-task',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: '📅',
      label: 'New Schedule',
      action: 'new-schedule',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
      icon: '📝',
      label: 'New Note',
      action: 'new-note',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      icon: '🎴',
      label: 'New Flashcard',
      action: 'new-flashcard',
      color: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
    }
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Check authentication status
    this.checkAuthStatus();
    
    // Simulate app initialization (2.5s loader)
    setTimeout(() => {
      this.isAppReadySignal.set(true);
      
      // Show welcome message after loader
      if (this.isAuthenticated) {
        this.toastService.success('Welcome back! 🎉');
      }
    }, 2500);
  }

  checkAuthStatus() {
    // This would typically check your auth service
    // For now, we'll check if we're on login/signup pages
    const currentPath = window.location.pathname;
    this.isAuthenticated = !['/login', '/signup', '/'].includes(currentPath);
    this.showNav = this.isAuthenticated;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = this.isDarkMode();
    this.toastService.info(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  onFabAction(action: string) {
    switch(action) {
      case 'new-task':
        this.toastService.success('Creating new task...');
        break;
      case 'new-schedule':
        this.toastService.success('Creating new schedule...');
        break;
      case 'new-note':
        this.toastService.success('Creating new note...');
        break;
      case 'new-flashcard':
        this.toastService.success('Creating new flashcard...');
        break;
    }
  }
}
