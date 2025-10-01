import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  toasts = this.toastsSignal.asReadonly();
  
  private idCounter = 0;
  
  /**
   * Show success toast
   */
  success(message: string, duration: number = 3000) {
    this.show({
      type: 'success',
      message,
      duration,
      icon: '✓'
    });
  }
  
  /**
   * Show error toast
   */
  error(message: string, duration: number = 5000) {
    this.show({
      type: 'error',
      message,
      duration,
      icon: '✕'
    });
  }
  
  /**
   * Show warning toast
   */
  warning(message: string, duration: number = 4000) {
    this.show({
      type: 'warning',
      message,
      duration,
      icon: '⚠'
    });
  }
  
  /**
   * Show info toast
   */
  info(message: string, duration: number = 3000) {
    this.show({
      type: 'info',
      message,
      duration,
      icon: 'ℹ'
    });
  }
  
  /**
   * Show custom toast
   */
  show(toast: Omit<Toast, 'id'>) {
    const id = `toast-${this.idCounter++}`;
    const newToast: Toast = { ...toast, id };
    
    // Add toast
    this.toastsSignal.update(toasts => [...toasts, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, toast.duration);
  }
  
  /**
   * Remove toast by id
   */
  remove(id: string) {
    this.toastsSignal.update(toasts => 
      toasts.filter(toast => toast.id !== id)
    );
  }
  
  /**
   * Clear all toasts
   */
  clear() {
    this.toastsSignal.set([]);
  }
}
