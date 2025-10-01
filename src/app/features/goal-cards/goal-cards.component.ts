import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { staggerFadeIn, cardHover } from '../../core/animations/page.animations';

interface Goal {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
  stats?: {
    label: string;
    value: string;
  };
}

@Component({
  selector: 'app-goal-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="goal-cards-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-subtitle">What We Offer</span>
          <h2 class="section-title">Achieve Your Academic Goals</h2>
          <p class="section-description">
            Powerful tools designed to help students succeed in their studies and reach their full potential.
          </p>
        </div>
        
        <!-- Goal Cards Grid -->
        <div class="cards-grid" [@staggerFadeIn]="goals.length">
          <div 
            *ngFor="let goal of goals"
            class="goal-card"
            [class.hovered]="hoveredCard() === goal.id"
            (mouseenter)="onCardHover(goal.id)"
            (mouseleave)="onCardLeave()">
            
            <!-- Icon -->
            <div class="card-icon" [style.background]="goal.color">
              <span class="icon-emoji">{{ goal.icon }}</span>
            </div>
            
            <!-- Content -->
            <h3 class="card-title">{{ goal.title }}</h3>
            <p class="card-description">{{ goal.description }}</p>
            
            <!-- Stats (if available) -->
            <div class="card-stats" *ngIf="goal.stats">
              <span class="stats-value">{{ goal.stats.value }}</span>
              <span class="stats-label">{{ goal.stats.label }}</span>
            </div>
            
            <!-- Hover Arrow -->
            <div class="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
            
            <!-- Glow Effect -->
            <div class="card-glow"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .goal-cards-section {
      padding: 8rem 0;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(102, 126, 234, 0.05) 100%
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
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
    
    .goal-card {
      position: relative;
      padding: 2.5rem;
      background: white;
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
      cursor: pointer;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }
      
      &:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
        
        &::before {
          transform: scaleX(1);
        }
        
        .card-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        
        .card-glow {
          opacity: 1;
        }
      }
      
      &.hovered {
        z-index: 1;
      }
    }
    
    .card-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      transition: all 0.4s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .icon-emoji {
      font-size: 2.5rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    
    .card-description {
      font-size: 1rem;
      line-height: 1.75;
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
    
    .card-stats {
      display: flex;
      flex-direction: column;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    
    .stats-value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.25rem;
    }
    
    .stats-label {
      font-size: 0.875rem;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .card-arrow {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.4s ease;
      
      svg {
        width: 20px;
        height: 20px;
        color: white;
      }
    }
    
    .card-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      background: radial-gradient(
        circle,
        rgba(102, 126, 234, 0.3) 0%,
        transparent 70%
      );
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }
  `],
  animations: [staggerFadeIn, cardHover]
})
export class GoalCardsComponent {
  private hoveredCardSignal = signal<number | null>(null);
  hoveredCard = this.hoveredCardSignal.asReadonly();
  
  goals: Goal[] = [
    {
      id: 1,
      icon: '🎯',
      title: 'Smart Task Management',
      description: 'Organize your assignments, projects, and deadlines with intelligent prioritization and reminders.',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: {
        label: 'Tasks Completed',
        value: '1,234+'
      }
    },
    {
      id: 2,
      icon: '📅',
      title: 'AI-Powered Scheduling',
      description: 'Create optimized study timetables that adapt to your learning patterns and maximize productivity.',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: {
        label: 'Hours Saved',
        value: '500+'
      }
    },
    {
      id: 3,
      icon: '📝',
      title: 'Smart Notes',
      description: 'Take notes with rich text editing, markdown support, and intelligent organization features.',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: {
        label: 'Notes Created',
        value: '2,500+'
      }
    },
    {
      id: 4,
      icon: '🎴',
      title: 'Interactive Flashcards',
      description: 'Master any subject with spaced repetition and adaptive learning algorithms.',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stats: {
        label: 'Cards Studied',
        value: '10K+'
      }
    },
    {
      id: 5,
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visualize your academic progress with detailed analytics and performance insights.',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: {
        label: 'Goals Achieved',
        value: '89%'
      }
    },
    {
      id: 6,
      icon: '🤖',
      title: 'AI Study Assistant',
      description: 'Get instant help with homework, explanations, and personalized study recommendations.',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      stats: {
        label: 'Questions Answered',
        value: '5K+'
      }
    }
  ];
  
  onCardHover(id: number) {
    this.hoveredCardSignal.set(id);
  }
  
  onCardLeave() {
    this.hoveredCardSignal.set(null);
  }
}
