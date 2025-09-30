import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  
  // Placeholder API endpoint - replace with your actual AI API
  private apiUrl = '/api/ask';
  
  askQuestion(question: string): Observable<string> {
    // For now, return a mock response
    // In production, replace this with actual API call:
    // return this.http.post<{answer: string}>(this.apiUrl, { question }).pipe(
    //   map(response => response.answer)
    // );
    
    return of(this.getMockResponse(question)).pipe(delay(1000));
  }
  
  private getMockResponse(question: string): string {
    const responses = [
      "That's a great question! Based on the topic, I'd suggest focusing on understanding the core concepts first, then practicing with examples.",
      "To answer your question: This concept is fundamental in the subject. Make sure to review the key principles and how they apply in different scenarios.",
      "Here's what you need to know: Start by breaking down the problem into smaller parts. This will help you understand each component better.",
      "Good question! The answer involves understanding the relationship between different elements. Try creating a mind map to visualize the connections.",
      "Let me help you with that. The key to mastering this topic is consistent practice and reviewing your mistakes to learn from them."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
