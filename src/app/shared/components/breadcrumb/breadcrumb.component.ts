import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { fadeIn } from '../../../core/animations/page.animations';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb" *ngIf="breadcrumbs.length > 0" [@fadeIn]>
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a routerLink="/" class="breadcrumb-link home">
            <svg class="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="sr-only">Home</span>
          </a>
        </li>
        
        <li 
          *ngFor="let crumb of breadcrumbs; let last = last"
          class="breadcrumb-item"
          [class.active]="last">
          <svg class="separator" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <a 
            *ngIf="!last"
            [routerLink]="crumb.url" 
            class="breadcrumb-link">
            {{ crumb.label }}
          </a>
          <span *ngIf="last" class="breadcrumb-current">
            {{ crumb.label }}
          </span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      padding: 1rem 0;
      margin-bottom: 1.5rem;
    }
    
    .breadcrumb-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 0.5rem;
    }
    
    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      
      &:first-child .separator {
        display: none;
      }
    }
    
    .separator {
      width: 16px;
      height: 16px;
      color: #9ca3af;
    }
    
    .breadcrumb-link {
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s ease;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &:hover {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }
      
      &.home {
        padding: 0.25rem;
      }
    }
    
    .home-icon {
      width: 18px;
      height: 18px;
    }
    
    .breadcrumb-current {
      color: #1f2937;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    @media (max-width: 768px) {
      .breadcrumb {
        padding: 0.75rem 0;
        margin-bottom: 1rem;
      }
      
      .breadcrumb-list {
        font-size: 0.8125rem;
      }
    }
  `],
  animations: [fadeIn]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  
  // Route label mapping
  private routeLabels: { [key: string]: string } = {
    'chat': 'AI Chat',
    'todo': 'Tasks',
    'timetable': 'Timetable',
    'flashcards': 'Flashcards',
    'exam-prep': 'Exam Prep',
    'profile': 'Profile',
    'login': 'Login',
    'signup': 'Sign Up',
    'settings': 'Settings',
    'help': 'Help'
  };
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Build breadcrumbs on navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.activatedRoute.root))
      )
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      });
    
    // Initial breadcrumb
    this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
  }
  
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Get child routes
    const children: ActivatedRoute[] = route.children;
    
    // Return if no children
    if (children.length === 0) {
      return breadcrumbs;
    }
    
    // Iterate over children
    for (const child of children) {
      // Get route URL segment
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');
      
      // Skip empty routes
      if (routeURL !== '') {
        url += `/${routeURL}`;
        
        // Get label from mapping or use route path
        const label = this.routeLabels[routeURL] || this.formatLabel(routeURL);
        
        // Add breadcrumb
        breadcrumbs.push({
          label,
          url
        });
      }
      
      // Recursive call for child routes
      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }
    
    return breadcrumbs;
  }
  
  private formatLabel(path: string): string {
    // Convert kebab-case to Title Case
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
