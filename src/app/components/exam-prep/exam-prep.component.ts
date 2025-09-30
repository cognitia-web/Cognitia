import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface QAPair {
  question: string;
  answer: string;
  timestamp: Date;
}

@Component({
  selector: 'app-exam-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-prep.component.html',
  styleUrl: './exam-prep.component.css'
})
export class ExamPrepComponent {
  question = '';
  qaHistory: QAPair[] = [];
  loading = false;
  
  private aiService = inject(AiService);
  
  async askQuestion(): Promise<void> {
    if (!this.question.trim() || this.loading) return;
    
    const questionText = this.question.trim();
    this.question = '';
    this.loading = true;
    
    try {
      this.aiService.askQuestion(questionText).subscribe((answer) => {
        this.qaHistory.unshift({
          question: questionText,
          answer: answer,
          timestamp: new Date()
        });
        this.loading = false;
      });
    } catch (error) {
      console.error('Error asking question:', error);
      this.loading = false;
    }
  }
  
  clearHistory(): void {
    this.qaHistory = [];
  }
}
