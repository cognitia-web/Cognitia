import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSignal = signal(true);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private progressSignal = signal(0);
  
  public isLoading$ = this.loadingSubject.asObservable();
  public progress$ = new BehaviorSubject<number>(0).asObservable();
  
  /**
   * Show loading screen with optional minimum duration
   */
  show(minDuration: number = 0): void {
    this.loadingSignal.set(true);
    this.loadingSubject.next(true);
    
    if (minDuration > 0) {
      setTimeout(() => this.hide(), minDuration);
    }
  }
  
  /**
   * Hide loading screen
   */
  hide(): void {
    this.loadingSignal.set(false);
    this.loadingSubject.next(false);
    this.progressSignal.set(0);
  }
  
  /**
   * Simulate loading progress
   * Useful for initial app load
   */
  simulateProgress(duration: number = 2000): Observable<number> {
    const steps = 100;
    const interval = duration / steps;
    
    return timer(0, interval).pipe(
      map(step => {
        const progress = Math.min((step / steps) * 100, 100);
        this.progressSignal.set(progress);
        
        if (progress >= 100) {
          setTimeout(() => this.hide(), 300);
        }
        
        return progress;
      })
    );
  }
  
  /**
   * Set loading progress manually
   */
  setProgress(progress: number): void {
    this.progressSignal.set(Math.min(Math.max(progress, 0), 100));
  }
  
  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.loadingSignal();
  }
  
  /**
   * Get current progress
   */
  getProgress(): number {
    return this.progressSignal();
  }
}
