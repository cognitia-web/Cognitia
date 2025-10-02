import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  keywords?: string[];
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="command-palette-overlay" *ngIf="isOpen()" [@fadeIn] (click)="close()">
      <div class="command-palette" (click)="$event.stopPropagation()" [@slideIn]>
        <!-- Search Input -->
        <div class="search-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            #searchInput
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Type a command or search..."
            class="search-input"
            autocomplete="off"
            spellcheck="false">
          <kbd class="kbd">ESC</kbd>
        </div>
        
        <!-- Commands List -->
        <div class="commands-list" *ngIf="filteredCommands().length > 0">
          <div
            *ngFor="let command of filteredCommands(); let i = index"
            class="command-item"
            [class.selected]="selectedIndex() === i"
            (click)="executeCommand(command)"
            (mouseenter)="setSelectedIndex(i)">
            <span class="command-icon">{{ command.icon }}</span>
            <div class="command-content">
              <div class="command-label">{{ command.label }}</div>
              <div class="command-description" *ngIf="command.description">
                {{ command.description }}
              </div>
            </div>
            <svg class="command-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
        
        <!-- No Results -->
        <div class="no-results" *ngIf="filteredCommands().length === 0 && searchQuery">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>No commands found for "{{ searchQuery }}"</p>
        </div>
        
        <!-- Footer -->
        <div class="command-footer">
          <div class="footer-hint">
            <kbd class="kbd">↑↓</kbd> Navigate
            <kbd class="kbd">↵</kbd> Select
            <kbd class="kbd">ESC</kbd> Close
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .command-palette-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
    }
    
    .command-palette {
      width: 100%;
      max-width: 640px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      
      @media (max-width: 768px) {
        max-width: calc(100% - 2rem);
        margin: 0 1rem;
      }
    }
    
    .search-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .search-icon {
      width: 20px;
      height: 20px;
      color: #9ca3af;
      flex-shrink: 0;
    }
    
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      color: #1f2937;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-family: monospace;
    }
    
    .commands-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 0.5rem;
    }
    
    .command-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover,
      &.selected {
        background: rgba(102, 126, 234, 0.1);
      }
      
      &.selected {
        outline: 2px solid rgba(102, 126, 234, 0.3);
        outline-offset: -2px;
      }
    }
    
    .command-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
      flex-shrink: 0;
    }
    
    .command-content {
      flex: 1;
      min-width: 0;
    }
    
    .command-label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.125rem;
    }
    
    .command-description {
      font-size: 0.8125rem;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .command-arrow {
      width: 16px;
      height: 16px;
      color: #9ca3af;
      flex-shrink: 0;
    }
    
    .no-results {
      padding: 3rem 2rem;
      text-align: center;
      color: #6b7280;
      
      svg {
        width: 48px;
        height: 48px;
        margin: 0 auto 1rem;
        color: #d1d5db;
      }
      
      p {
        margin: 0;
        font-size: 0.9375rem;
      }
    }
    
    .command-footer {
      padding: 0.75rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }
    
    .footer-hint {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.8125rem;
      color: #6b7280;
      
      .kbd {
        margin-left: 0.25rem;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ])
  ]
})
export class CommandPaletteComponent {
  private isOpenSignal = signal(false);
  private selectedIndexSignal = signal(0);
  private filteredCommandsSignal = signal<Command[]>([]);
  
  isOpen = this.isOpenSignal.asReadonly();
  selectedIndex = this.selectedIndexSignal.asReadonly();
  filteredCommands = this.filteredCommandsSignal.asReadonly();
  
  searchQuery = '';
  
  commands: Command[] = [
    {
      id: 'new-task',
      label: 'New Task',
      description: 'Create a new task',
      icon: '✓',
      action: () => this.router.navigate(['/todo']),
      keywords: ['create', 'add', 'task', 'todo']
    },
    {
      id: 'new-timetable',
      label: 'New Timetable',
      description: 'Create a study schedule',
      icon: '📅',
      action: () => this.router.navigate(['/timetable']),
      keywords: ['schedule', 'calendar', 'timetable']
    },
    {
      id: 'flashcards',
      label: 'Study Flashcards',
      description: 'Review your flashcards',
      icon: '🎴',
      action: () => this.router.navigate(['/flashcards']),
      keywords: ['study', 'review', 'cards', 'flashcards']
    },
    {
      id: 'chat',
      label: 'AI Chat',
      description: 'Ask AI for help',
      icon: '🤖',
      action: () => this.router.navigate(['/chat']),
      keywords: ['ai', 'assistant', 'help', 'chat']
    },
    {
      id: 'exam-prep',
      label: 'Exam Preparation',
      description: 'Prepare for exams',
      icon: '📚',
      action: () => this.router.navigate(['/exam-prep']),
      keywords: ['exam', 'test', 'preparation', 'study']
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      description: 'Manage your account',
      icon: '👤',
      action: () => this.router.navigate(['/profile']),
      keywords: ['settings', 'account', 'profile']
    }
  ];
  
  constructor(private router: Router) {
    this.filteredCommandsSignal.set(this.commands);
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    // Open with Cmd+K or Ctrl+K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.open();
      return;
    }
    
    // Close with Escape
    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.close();
      return;
    }
    
    if (!this.isOpen()) return;
    
    // Navigate with arrow keys
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectNext();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectPrevious();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredCommands()[this.selectedIndex()];
      if (selected) {
        this.executeCommand(selected);
      }
    }
  }
  
  open() {
    this.isOpenSignal.set(true);
    this.searchQuery = '';
    this.selectedIndexSignal.set(0);
    this.filteredCommandsSignal.set(this.commands);
    
    // Focus input after animation
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      input?.focus();
    }, 100);
  }
  
  close() {
    this.isOpenSignal.set(false);
    this.searchQuery = '';
  }
  
  onSearchChange() {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredCommandsSignal.set(this.commands);
    } else {
      const filtered = this.commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query) ||
        cmd.description?.toLowerCase().includes(query) ||
        cmd.keywords?.some(k => k.includes(query))
      );
      this.filteredCommandsSignal.set(filtered);
    }
    
    this.selectedIndexSignal.set(0);
  }
  
  selectNext() {
    const max = this.filteredCommands().length - 1;
    this.selectedIndexSignal.update((i: number) => Math.min(i + 1, max));
  }
  
  selectPrevious() {
    this.selectedIndexSignal.update((i: number) => Math.max(i - 1, 0));
  }
  
  setSelectedIndex(index: number) {
    this.selectedIndexSignal.set(index);
  }
  
  executeCommand(command: Command) {
    command.action();
    this.close();
  }
}
