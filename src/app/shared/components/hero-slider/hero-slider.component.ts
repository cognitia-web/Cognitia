import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-slider">
      <div class="slides-container">
        <div 
          *ngFor="let slide of slides; let i = index"
          class="slide"
          [class.active]="currentIndex() === i"
          [style.background-image]="'url(' + slide.image + ')'">
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <h2 class="slide-subtitle">{{ slide.subtitle }}</h2>
            <h1 class="slide-title">{{ slide.title }}</h1>
            <button *ngIf="slide.cta" class="slide-cta">
              {{ slide.cta }}
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Navigation Dots -->
      <div class="dots-navigation">
        <button 
          *ngFor="let slide of slides; let i = index"
          class="dot"
          [class.active]="currentIndex() === i"
          (click)="goToSlide(i)">
        </button>
      </div>
      
      <!-- Arrow Navigation -->
      <button class="nav-arrow prev" (click)="previousSlide()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="nav-arrow next" (click)="nextSlide()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .hero-slider {
      position: relative;
      width: 100%;
      height: 600px;
      overflow: hidden;
      border-radius: 24px;
      
      @media (max-width: 768px) {
        height: 400px;
        border-radius: 16px;
      }
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
      transform: scale(1.1);
      transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.active {
        opacity: 1;
        transform: scale(1);
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
        rgba(102, 126, 234, 0.8) 0%,
        rgba(118, 75, 162, 0.8) 100%
      );
    }
    
    .slide-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 10%;
      color: white;
      
      @media (max-width: 768px) {
        padding: 0 5%;
      }
    }
    
    .slide-subtitle {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 1rem;
      opacity: 0;
      transform: translateY(30px);
      animation: slideUp 0.8s ease-out 0.3s forwards;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
    
    .slide-title {
      font-size: 4rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 2rem;
      max-width: 800px;
      opacity: 0;
      transform: translateY(30px);
      animation: slideUp 0.8s ease-out 0.5s forwards;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .slide-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 700;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(30px);
      animation: slideUp 0.8s ease-out 0.7s forwards;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        
        .arrow-icon {
          transform: translateX(5px);
        }
      }
    }
    
    .arrow-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    
    .dots-navigation {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.75rem;
      z-index: 10;
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
        transform: scale(1.3);
        background: rgba(255, 255, 255, 0.5);
      }
      
      &.active {
        width: 40px;
        border-radius: 6px;
        background: white;
      }
    }
    
    .nav-arrow {
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
      
      svg {
        width: 24px;
        height: 24px;
      }
      
      &.prev {
        left: 2rem;
      }
      
      &.next {
        right: 2rem;
      }
      
      @media (max-width: 768px) {
        width: 44px;
        height: 44px;
        
        &.prev {
          left: 1rem;
        }
        
        &.next {
          right: 1rem;
        }
      }
    }
    
    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
      title: 'Transform Your Study Habits',
      subtitle: 'AI-Powered Learning',
      cta: 'Get Started'
    },
    {
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80',
      title: 'Master Your Time',
      subtitle: 'Smart Scheduling',
      cta: 'Learn More'
    },
    {
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1920&q=80',
      title: 'Achieve Your Goals',
      subtitle: 'Track Progress',
      cta: 'Start Free'
    }
  ];
  
  @Input() autoplayDelay: number = 5000;
  
  private currentIndexSignal = signal(0);
  currentIndex = this.currentIndexSignal.asReadonly();
  private autoplaySubscription?: Subscription;
  
  ngOnInit() {
    this.startAutoplay();
  }
  
  ngOnDestroy() {
    this.autoplaySubscription?.unsubscribe();
  }
  
  private startAutoplay() {
    this.autoplaySubscription = interval(this.autoplayDelay).subscribe(() => {
      this.nextSlide();
    });
  }
  
  nextSlide() {
    this.currentIndexSignal.update((i: number) => (i + 1) % this.slides.length);
  }
  
  previousSlide() {
    this.currentIndexSignal.update((i: number) => 
      i === 0 ? this.slides.length - 1 : i - 1
    );
  }
  
  goToSlide(index: number) {
    this.currentIndexSignal.set(index);
  }
}
