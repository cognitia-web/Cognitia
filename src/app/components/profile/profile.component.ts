import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
