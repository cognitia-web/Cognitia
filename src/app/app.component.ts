import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Cognitia';
  isAuthenticated = false;
  showNav = false;
  mobileMenuOpen = false;
  
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    
    // Hide nav on login/signup pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNav = !event.url.includes('/login') && !event.url.includes('/signup');
      this.mobileMenuOpen = false;
    });
  }
  
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
  
  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  async logout(): Promise<void> {
    await this.authService.logout();
    this.mobileMenuOpen = false;
  }
}
