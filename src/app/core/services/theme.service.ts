import { Injectable, signal } from '@angular/core';

interface ThemeGradient {
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'cognitia-theme';
  private readonly GRADIENT_KEY = 'cognitia-gradient';
  
  private isDarkModeSignal = signal(false);
  private currentGradientIndexSignal = signal(0);
  private isSunriseSignal = signal(false);
  
  isDarkMode = this.isDarkModeSignal.asReadonly();
  currentGradientIndex = this.currentGradientIndexSignal.asReadonly();
  isSunrise = this.isSunriseSignal.asReadonly();
  
  private gradients: ThemeGradient[] = [
    {
      name: 'default',
      gradient: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
      primary: '#6A11CB',
      secondary: '#2575FC'
    },
    {
      name: 'ocean',
      gradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
      primary: '#667eea',
      secondary: '#f093fb'
    },
    {
      name: 'fire',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      primary: '#f093fb',
      secondary: '#f5576c'
    },
    {
      name: 'forest',
      gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
      primary: '#0ba360',
      secondary: '#3cba92'
    }
  ];
  
  constructor() {
    this.initializeTheme();
  }
  
  private initializeTheme() {
    // Load saved theme
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.isDarkModeSignal.set(true);
      this.applyDarkMode(true);
    }
    
    // Load saved gradient
    const savedGradient = localStorage.getItem(this.GRADIENT_KEY);
    if (savedGradient) {
      const index = parseInt(savedGradient, 10);
      if (!isNaN(index) && index >= 0 && index < this.gradients.length) {
        this.currentGradientIndexSignal.set(index);
      }
    }
    
    this.applyTheme();
  }
  
  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  private applyTheme() {
    const gradient = this.gradients[this.currentGradientIndexSignal()];
    const root = document.documentElement;
    
    root.style.setProperty('--theme-gradient', gradient.gradient);
    root.style.setProperty('--theme-primary', gradient.primary);
    root.style.setProperty('--theme-secondary', gradient.secondary);
  }
  
  /**
   * Trigger sunrise background transition
   * Spec: 1200ms smooth transition as per Tim Cook requirements
   */
  triggerSunrise(isSunrise: boolean) {
    this.isSunriseSignal.set(isSunrise);
    
    if (isSunrise) {
      document.body.classList.add('sunrise');
      document.documentElement.style.setProperty('--bg-impact', '1');
    } else {
      document.body.classList.remove('sunrise');
      document.documentElement.style.setProperty('--bg-impact', '0');
    }
  }
  
  toggleDarkMode() {
    this.isDarkModeSignal.update(dark => !dark);
    this.applyDarkMode(this.isDarkModeSignal());
    localStorage.setItem(this.THEME_KEY, this.isDarkModeSignal() ? 'dark' : 'light');
  }
  
  nextGradient() {
    this.currentGradientIndexSignal.update(index => 
      (index + 1) % this.gradients.length
    );
    this.applyTheme();
    localStorage.setItem(this.GRADIENT_KEY, this.currentGradientIndexSignal().toString());
  }
  
  setGradientByName(name: string) {
    const index = this.gradients.findIndex(g => g.name === name);
    if (index !== -1) {
      this.currentGradientIndexSignal.set(index);
      this.applyTheme();
      localStorage.setItem(this.GRADIENT_KEY, index.toString());
    }
  }
  
  currentGradient() {
    return this.gradients[this.currentGradientIndexSignal()];
  }
  
  getAllGradients() {
    return this.gradients;
  }
}
