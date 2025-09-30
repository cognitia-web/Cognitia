import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;
  
  private authService = inject(AuthService);
  
  async onSignup(): Promise<void> {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    try {
      await this.authService.signup(this.email, this.password);
    } catch (error: any) {
      this.error = error.message || 'Failed to create account. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
