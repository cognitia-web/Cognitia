import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSliderComponent } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSliderComponent],
  template: `
    <div class="home-page">
      <!-- Hero Slider Section -->
      <section class="hero-section">
        <div class="container">
          <app-hero-slider></app-hero-slider>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Everything You Need to Excel</h2>
            <p class="section-subtitle">Powerful tools designed for modern students</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card" *ngFor="let feature of features">
              <div class="feature-icon" [innerHTML]="feature.icon"></div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <a [routerLink]="feature.link" class="feature-link">
                Learn more
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Stats Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card" *ngFor="let stat of stats">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Transform Your Learning?</h2>
            <p class="cta-subtitle">Join thousands of students achieving their academic goals</p>
            <div class="cta-buttons">
              <button routerLink="/signup" class="btn-primary-large">
                Get Started Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <button routerLink="/demo" class="btn-secondary-large">
                Watch Demo
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .hero-section {
      padding: 3rem 0 6rem;
    }
    
    .features-section {
      padding: 6rem 0;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    
    .section-title {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
        border-color: rgba(102, 126, 234, 0.3);
        
        .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .feature-link svg {
          transform: translateX(5px);
        }
      }
    }
    
    .feature-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      transition: transform 0.4s ease;
      font-size: 2rem;
    }
    
    .feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .feature-description {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.75;
      margin-bottom: 1.5rem;
    }
    
    .feature-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      
      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
      }
      
      &:hover {
        color: #764ba2;
      }
    }
    
    .stats-section {
      padding: 4rem 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      margin: 0 2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
    }
    
    .stat-card {
      text-align: center;
    }
    
    .stat-value {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
    }
    
    .stat-label {
      font-size: 1.125rem;
      color: #6b7280;
      font-weight: 600;
    }
    
    .cta-section {
      padding: 8rem 0;
    }
    
    .cta-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cta-title {
      font-size: 3.5rem;
      font-weight: 900;
      color: #1f2937;
      margin-bottom: 1.5rem;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .cta-subtitle {
      font-size: 1.5rem;
      color: #6b7280;
      margin-bottom: 3rem;
      
      @media (max-width: 768px) {
        font-size: 1.125rem;
      }
    }
    
    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-primary-large,
    .btn-secondary-large {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 3rem;
      font-size: 1.125rem;
      font-weight: 700;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      
      svg {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease;
      }
      
      &:hover svg {
        transform: translateX(5px);
      }
    }
    
    .btn-primary-large {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
      }
    }
    
    .btn-secondary-large {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      color: #667eea;
      border: 2px solid rgba(102, 126, 234, 0.3);
      
      &:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.9);
        border-color: #667eea;
      }
    }
  `]
})
export class HomeComponent {
  features = [
    {
      icon: '🤖',
      title: 'AI-Powered Chat',
      description: 'Get instant help with homework, explanations, and study guidance from our advanced AI assistant.',
      link: '/chat'
    },
    {
      icon: '✓',
      title: 'Smart Task Manager',
      description: 'Organize assignments, set priorities, and never miss a deadline with intelligent reminders.',
      link: '/todo'
    },
    {
      icon: '📅',
      title: 'Dynamic Timetable',
      description: 'Create and manage your class schedule with automatic conflict detection and optimization.',
      link: '/timetable'
    },
    {
      icon: '🎴',
      title: 'Interactive Flashcards',
      description: 'Master any subject with spaced repetition and adaptive learning algorithms.',
      link: '/flashcards'
    },
    {
      icon: '📚',
      title: 'Exam Preparation',
      description: 'Comprehensive study plans, practice tests, and performance analytics for exam success.',
      link: '/exam-prep'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visualize your learning journey with detailed analytics and achievement milestones.',
      link: '/profile'
    }
  ];
  
  stats = [
    { value: '10K+', label: 'Active Students' },
    { value: '50K+', label: 'Tasks Completed' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9★', label: 'User Rating' }
  ];
}
