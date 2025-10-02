import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeGradient {
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'cognitia_theme';
  private readonly GRADIENT_KEY = 'cognitia_gradient';
  
  // Theme gradients (sunrise effect backgrounds)
  private readonly gradients: ThemeGradient[] = [
    {
      name: 'sunrise',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primary: '#667eea',
      secondary: '#764ba2'
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
    },
    {
      name: 'sunset',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      primary: '#fa709a',
      secondary: '#fee140'
    },
    {
      name: 'twilight',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      primary: '#4facfe',
      secondary: '#00f2fe'
    },
    {
      name: 'aurora',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      primary: '#a8edea',
      secondary: '#fed6e3'
    },
    {
      name: 'cosmic',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      primary: '#30cfd0',
      secondary: '#330867'
    }
  ];
  
  // Signals for reactive state
  private currentGradientIndex = signal(0);
  private isDarkModeSignal = signal(false);
  
  // Computed values
  currentGradient = computed(() => this.gradients[this.currentGradientIndex()]);
  isDarkMode = computed(() => this.isDarkModeSignal());
  
  // BehaviorSubjects for RxJS compatibility
  private gradientSubject = new BehaviorSubject<ThemeGradient>(this.gradients[0]);
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  
  public gradient$ = this.gradientSubject.asObservable();
  public darkMode$ = this.darkModeSubject.asObservable();
  
  constructor() {
    this.loadSavedTheme();
    this.applyTheme();
    
    // Effect to sync signal changes with subjects
    effect(() => {
      this.gradientSubject.next(this.currentGradient());
      this.darkModeSubject.next(this.isDarkMode());
    });
  }
  
  /**
   * Load saved theme from localStorage
   */
  private loadSavedTheme(): void {
    const savedGradientIndex = localStorage.getItem(this.GRADIENT_KEY);
    const savedDarkMode = localStorage.getItem(this.THEME_KEY);
    
    if (savedGradientIndex) {
      const index = parseInt(savedGradientIndex, 10);
      if (index >= 0 && index < this.gradients.length) {
        this.currentGradientIndex.set(index);
      }
    }
    
    if (savedDarkMode) {
      this.isDarkModeSignal.set(savedDarkMode === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkModeSignal.set(prefersDark);
    }
  }
  
  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const root = document.documentElement;
    const gradient = this.currentGradient();
    
    // Apply gradient
    root.style.setProperty('--theme-gradient', gradient.gradient);
    root.style.setProperty('--theme-primary', gradient.primary);
    root.style.setProperty('--theme-secondary', gradient.secondary);
    
    // Apply dark mode
    if (this.isDarkMode()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  
  /**
   * Cycle to next gradient (sunrise effect)
   */
  nextGradient(): void {
    const nextIndex = (this.currentGradientIndex() + 1) % this.gradients.length;
    this.currentGradientIndex.set(nextIndex);
    localStorage.setItem(this.GRADIENT_KEY, nextIndex.toString());
    this.applyTheme();
  }
  
  /**
   * Set specific gradient by index
   */
  setGradient(index: number): void {
    if (index >= 0 && index < this.gradients.length) {
      this.currentGradientIndex.set(index);
      localStorage.setItem(this.GRADIENT_KEY, index.toString());
      this.applyTheme();
    }
  }
  
  /**
   * Set specific gradient by name
   */
  setGradientByName(name: string): void {
    const index = this.gradients.findIndex(g => g.name === name);
    if (index !== -1) {
      this.setGradient(index);
    }
  }
  
  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.isDarkModeSignal.update(current => !current);
    const newMode = this.isDarkMode() ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, newMode);
    this.applyTheme();
  }
  
  /**
   * Set dark mode explicitly
   */
  setDarkMode(enabled: boolean): void {
    this.isDarkModeSignal.set(enabled);
    const mode = enabled ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, mode);
    this.applyTheme();
  }
  
  /**
   * Get all available gradients
   */
  getGradients(): ThemeGradient[] {
    return [...this.gradients];
  }
  
  /**
   * Get current gradient index
   */
  getCurrentGradientIndex(): number {
    return this.currentGradientIndex();
  }
  
  /**
   * Animate background transition
   * Returns a promise that resolves when animation completes
   */
  async animateBackgroundTransition(duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      const root = document.documentElement;
      root.style.transition = `background ${duration}ms ease`;
      
      setTimeout(() => {
        root.style.transition = '';
        resolve();
      }, duration);
    });
  }
  
  /**
   * Apply custom gradient
   */
  applyCustomGradient(gradient: string, primary: string, secondary: string): void {
    const root = document.documentElement;
    root.style.setProperty('--theme-gradient', gradient);
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--theme-secondary', secondary);
  }
  
  /**
   * Reset to default theme
   */
  resetTheme(): void {
    this.currentGradientIndex.set(0);
    this.isDarkModeSignal.set(false);
    localStorage.removeItem(this.GRADIENT_KEY);
    localStorage.removeItem(this.THEME_KEY);
    this.applyTheme();
  }
  
  /**
   * Get theme CSS variables
   */
  getThemeVariables(): Record<string, string> {
    const gradient = this.currentGradient();
    return {
      '--theme-gradient': gradient.gradient,
      '--theme-primary': gradient.primary,
      '--theme-secondary': gradient.secondary,
      '--theme-mode': this.isDarkMode() ? 'dark' : 'light'
    };
  }
}
