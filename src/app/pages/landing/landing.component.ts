import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSlideshowComponent } from '../../features/hero-slideshow/hero-slideshow.component';
import { GoalCardsComponent } from '../../features/goal-cards/goal-cards.component';
import { fadeIn, fadeInUp, staggerFadeIn } from '../../core/animations/page.animations';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSlideshowComponent,
    GoalCardsComponent
  ],
  template: `
    <div class="landing-page">
      <!-- Hero Slideshow Section -->
      <app-hero-slideshow></app-hero-slideshow>
      
      <!-- Stats Section -->
      <section class="stats-section" [@fadeIn]>
        <div class="container">
          <div class="stats-grid">
            <div 
              *ngFor="let stat of stats"
              class="stat-card"
              [@fadeInUp]>
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Goal Cards Section -->
      <app-goal-cards></app-goal-cards>
      
      <!-- Features Section -->
      <section class="features-section" [@fadeIn]>
        <div class="container">
          <div class="section-header">
            <span class="section-subtitle">Why Choose Us</span>
            <h2 class="section-title">Everything You Need to Succeed</h2>
            <p class="section-description">
              Powerful features designed to boost your productivity and help you achieve your academic goals.
            </p>
          </div>
          
          <div class="features-grid" [@staggerFadeIn]="features.length">
            <div 
              *ngFor="let feature of features"
              class="feature-card">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Testimonials Section -->
      <section class="testimonials-section" [@fadeIn]>
        <div class="container">
          <div class="section-header">
            <span class="section-subtitle">Student Success Stories</span>
            <h2 class="section-title">Loved by Students Worldwide</h2>
          </div>
          
          <div class="testimonials-grid">
            <div 
              *ngFor="let testimonial of testimonials"
              class="testimonial-card"
              [@fadeInUp]>
              <div class="testimonial-header">
                <img 
                  [src]="testimonial.avatar" 
                  [alt]="testimonial.name"
                  class="testimonial-avatar">
                <div class="testimonial-info">
                  <h4 class="testimonial-name">{{ testimonial.name }}</h4>
                  <p class="testimonial-role">{{ testimonial.role }}</p>
                </div>
              </div>
              <div class="testimonial-rating">
                <span *ngFor="let star of [1,2,3,4,5]" class="star">
                  {{ star <= testimonial.rating ? '★' : '☆' }}
                </span>
              </div>
              <p class="testimonial-content">"{{ testimonial.content }}"</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section" [@fadeIn]>
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Transform Your Study Habits?</h2>
            <p class="cta-description">
              Join thousands of students who are already achieving their academic goals with Cognitia.
            </p>
            <div class="cta-buttons">
              <button class="btn-primary" routerLink="/signup">
                Get Started Free
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <button class="btn-secondary" routerLink="/features">
                Learn More
              </button>
            </div>
            <p class="cta-note">
              ✓ No credit card required  ✓ 14-day free trial  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      width: 100%;
      overflow-x: hidden;
    }
    
    /* Stats Section */
    .stats-section {
      padding: 4rem 0;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.8);
      
      @media (max-width: 768px) {
        padding: 3rem 0;
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3rem;
      
      @media (max-width: 968px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
    
    .stat-card {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
      }
    }
    
    .stat-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 1rem;
      color: #6b7280;
      font-weight: 500;
    }
    
    /* Features Section */
    .features-section {
      padding: 8rem 0;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(102, 126, 234, 0.03) 100%
      );
      
      @media (max-width: 768px) {
        padding: 4rem 0;
      }
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 5rem;
      
      @media (max-width: 768px) {
        margin-bottom: 3rem;
      }
    }
    
    .section-subtitle {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #667eea;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .section-description {
      font-size: 1.25rem;
      line-height: 1.75;
      color: #6b7280;
      max-width: 700px;
      margin: 0 auto;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
      
      @media (max-width: 968px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }
    
    .feature-card {
      padding: 2.5rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.4s ease;
      border: 2px solid transparent;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
        border-color: rgba(102, 126, 234, 0.2);
        
        .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      display: block;
      transition: all 0.4s ease;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
    
    .feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    
    .feature-description {
      font-size: 1rem;
      line-height: 1.75;
      color: #6b7280;
    }
    
    /* Testimonials Section */
    .testimonials-section {
      padding: 8rem 0;
      background: white;
      
      @media (max-width: 768px) {
        padding: 4rem 0;
      }
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      
      @media (max-width: 968px) {
        grid-template-columns: 1fr;
      }
    }
    
    .testimonial-card {
      padding: 2.5rem;
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.05) 0%,
        rgba(118, 75, 162, 0.05) 100%
      );
      border-radius: 24px;
      border: 2px solid rgba(102, 126, 234, 0.1);
      transition: all 0.4s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
        border-color: rgba(102, 126, 234, 0.3);
      }
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .testimonial-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .testimonial-info {
      flex: 1;
    }
    
    .testimonial-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .testimonial-role {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .testimonial-rating {
      margin-bottom: 1rem;
      
      .star {
        color: #fbbf24;
        font-size: 1.25rem;
        margin-right: 0.25rem;
      }
    }
    
    .testimonial-content {
      font-size: 1rem;
      line-height: 1.75;
      color: #4b5563;
      font-style: italic;
    }
    
    /* CTA Section */
    .cta-section {
      padding: 8rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 600px;
        height: 600px;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
        border-radius: 50%;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -50%;
        left: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
        border-radius: 50%;
      }
      
      @media (max-width: 768px) {
        padding: 4rem 0;
      }
    }
    
    .cta-content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cta-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .cta-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 3rem;
      line-height: 1.75;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .btn-primary,
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      
      @media (max-width: 480px) {
        width: 100%;
        justify-content: center;
      }
    }
    
    .btn-primary {
      background: white;
      color: #667eea;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        
        .btn-icon {
          transform: translateX(4px);
        }
      }
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-4px);
      }
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    
    .cta-note {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }
  `],
  animations: [fadeIn, fadeInUp, staggerFadeIn]
})
export class LandingComponent {
  stats: Stat[] = [
    {
      value: '10K+',
      label: 'Active Students',
      icon: '👨‍🎓'
    },
    {
      value: '50K+',
      label: 'Tasks Completed',
      icon: '✅'
    },
    {
      value: '98%',
      label: 'Satisfaction Rate',
      icon: '⭐'
    },
    {
      value: '24/7',
      label: 'AI Support',
      icon: '🤖'
    }
  ];
  
  features: Feature[] = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance ensures smooth experience across all devices.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security.'
    },
    {
      icon: '🎯',
      title: 'Goal Tracking',
      description: 'Set and achieve your academic goals with intelligent progress tracking.'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your study tools anywhere, anytime on any device.'
    },
    {
      icon: '🔄',
      title: 'Auto Sync',
      description: 'Seamlessly sync your data across all your devices in real-time.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Enjoy a modern, intuitive interface that makes studying a pleasure.'
    }
  ];
  
  testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Cognitia transformed how I manage my studies. My grades improved by 30% in just one semester!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Medical Student',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'The AI-powered scheduling is a game-changer. I finally have time for both studies and life.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Engineering Student',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Best productivity app for students. The flashcards feature helped me ace my exams!',
      rating: 5
    }
  ];
}
