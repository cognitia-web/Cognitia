import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;
  
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });
  }
  
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
  
  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
