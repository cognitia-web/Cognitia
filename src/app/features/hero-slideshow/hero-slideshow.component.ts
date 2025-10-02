import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { fadeIn, fadeInUp } from '../../core/animations/page.animations';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

@Component({
  selector: 'app-hero-slideshow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-slideshow" [@fadeIn]>
      <!-- Slides Container -->
      <div class="slides-container">
        <div 
          *ngFor="let slide of slides; let i = index"
          class="slide"
          [class.active]="currentSlide() === i"
          [style.background-image]="'url(' + slide.image + ')'">
          
          <!-- Overlay -->
          <div class="slide-overlay"></div>
          
          <!-- Content -->
          <div class="slide-content" *ngIf="currentSlide() === i" [@fadeInUp]>
            <span class="slide-subtitle">{{ slide.subtitle }}</span>
            <h1 class="slide-title">{{ slide.title }}</h1>
            <p class="slide-description">{{ slide.description }}</p>
            <button class="slide-cta" (click)="onCtaClick(slide.ctaLink)">
              {{ slide.cta }}
              <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Navigation Dots -->
      <div class="navigation-dots">
        <button 
          *ngFor="let slide of slides; let i = index"
          class="dot"
          [class.active]="currentSlide() === i"
          (click)="goToSlide(i)"
          [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
      
      <!-- Previous/Next Buttons -->
      <button 
        class="nav-button prev"
        (click)="previousSlide()"
        aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      
      <button 
        class="nav-button next"
        (click)="nextSlide()"
        aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      
      <!-- Progress Bar -->
      <div class="progress-bar">
        <div 
          class="progress-fill"
          [style.width.%]="progress()">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-slideshow {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    
    .slides-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1000ms cubic-bezier(0.4, 0.0, 0.2, 1);
      
      &.active {
        opacity: 1;
        z-index: 1;
      }
    }
    
    .slide-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.85) 0%,
        rgba(118, 75, 162, 0.85) 100%
      );
      z-index: 1;
    }
    
    .slide-content {
      position: relative;
      z-index: 2;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
    }
    
    .slide-subtitle {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 1rem;
      opacity: 0.9;
    }
    
    .slide-title {
      font-size: 4.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      max-width: 800px;
      
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
    }
    
    .slide-description {
      font-size: 1.25rem;
      line-height: 1.75;
      margin-bottom: 2.5rem;
      max-width: 600px;
      opacity: 0.95;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .slide-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #667eea;
      background: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        
        .cta-arrow {
          transform: translateX(4px);
        }
      }
      
      &:active {
        transform: translateY(-2px);
      }
    }
    
    .cta-arrow {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    
    .navigation-dots {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 1rem;
      z-index: 10;
      
      @media (max-width: 768px) {
        bottom: 2rem;
      }
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
      
      &:hover {
        transform: scale(1.2);
        background: rgba(255, 255, 255, 0.5);
      }
      
      &.active {
        width: 40px;
        border-radius: 6px;
        background: white;
      }
    }
    
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid white;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-50%) scale(1.1);
      }
      
      &:active {
        transform: translateY(-50%) scale(0.95);
      }
      
      svg {
        width: 24px;
        height: 24px;
      }
      
      &.prev {
        left: 2rem;
        
        @media (max-width: 768px) {
          left: 1rem;
        }
      }
      
      &.next {
        right: 2rem;
        
        @media (max-width: 768px) {
          right: 1rem;
        }
      }
    }
    
    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      z-index: 10;
    }
    
    .progress-fill {
      height: 100%;
      background: white;
      transition: width 100ms linear;
    }
  `],
  animations: [fadeIn, fadeInUp]
})
export class HeroSlideshowComponent implements OnInit, OnDestroy {
  private currentSlideSignal = signal(0);
  private progressSignal = signal(0);

  constructor(private router: Router) {}
  
  currentSlide = this.currentSlideSignal.asReadonly();
  progress = this.progressSignal.asReadonly();
  
  private autoplaySubscription?: Subscription;
  private progressSubscription?: Subscription;
  private readonly autoplayInterval = 5000; // 5 seconds per slide
  
  slides: Slide[] = [
    {
      id: 1,
      title: 'Transform Your Study Habits',
      subtitle: 'AI-Powered Learning',
      description: 'Boost your productivity with intelligent task management, smart scheduling, and personalized study plans.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
      cta: 'Get Started',
      ctaLink: '/signup'
    },
    {
      id: 2,
      title: 'Master Your Time',
      subtitle: 'Smart Scheduling',
      description: 'Create optimized timetables that adapt to your learning style and help you achieve your academic goals.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80',
      cta: 'Learn More',
      ctaLink: '/features'
    },
    {
      id: 3,
      title: 'Achieve Your Goals',
      subtitle: 'Track Progress',
      description: 'Set goals, track your progress, and celebrate achievements with our comprehensive productivity platform.',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1920&q=80',
      cta: 'Start Free Trial',
      ctaLink: '/signup'
    }
  ];
  
  ngOnInit() {
    this.startAutoplay();
  }
  
  ngOnDestroy() {
    this.stopAutoplay();
  }
  
  private startAutoplay() {
    // Progress bar animation
    this.progressSubscription = interval(100).subscribe(() => {
      const currentProgress = this.progress();
      if (currentProgress >= 100) {
        this.nextSlide();
        this.progressSignal.set(0);
      } else {
        this.progressSignal.update(p => p + (100 / (this.autoplayInterval / 100)));
      }
    });
  }
  
  private stopAutoplay() {
    this.autoplaySubscription?.unsubscribe();
    this.progressSubscription?.unsubscribe();
  }
  
  private resetProgress() {
    this.progressSignal.set(0);
  }
  
  nextSlide() {
    this.currentSlideSignal.update(current => 
      (current + 1) % this.slides.length
    );
    this.resetProgress();
  }
  
  previousSlide() {
    this.currentSlideSignal.update(current => 
      current === 0 ? this.slides.length - 1 : current - 1
    );
    this.resetProgress();
  }
  
  goToSlide(index: number) {
    this.currentSlideSignal.set(index);
    this.resetProgress();
  }
  
  onCtaClick(link: string) {
    this.router.navigate([link]);
  }
}
