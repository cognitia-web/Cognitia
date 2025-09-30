import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  
  private authService = inject(AuthService);
  
  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.error = error.message || 'Failed to login. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }
}
