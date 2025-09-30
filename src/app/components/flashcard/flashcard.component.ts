import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, where, deleteDoc, doc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Flashcard } from '../../models/flashcard.model';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent implements OnInit {
  flashcards: Flashcard[] = [];
  showAddForm = false;
  currentCardIndex = 0;
  isFlipped = false;
  studyMode = false;
  
  newFlashcard: Partial<Flashcard> = {
    question: '',
    answer: '',
    category: ''
  };
  
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.loadFlashcards();
  }
  
  loadFlashcards(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const flashcardsRef = collection(this.firestore, 'flashcards');
    const q = query(
      flashcardsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    onSnapshot(q, (snapshot) => {
      this.flashcards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Flashcard));
    });
  }
  
  async addFlashcard(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.newFlashcard.question?.trim() || !this.newFlashcard.answer?.trim()) return;
    
    try {
      const flashcard: Omit<Flashcard, 'id'> = {
        userId: user.uid,
        question: this.newFlashcard.question.trim(),
        answer: this.newFlashcard.answer.trim(),
        category: this.newFlashcard.category?.trim() || '',
        createdAt: new Date()
      };
      
      await addDoc(collection(this.firestore, 'flashcards'), flashcard);
      
      // Reset form
      this.newFlashcard = {
        question: '',
        answer: '',
        category: ''
      };
      this.showAddForm = false;
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  }
  
  async deleteFlashcard(flashcardId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'flashcards', flashcardId));
      if (this.currentCardIndex >= this.flashcards.length - 1) {
        this.currentCardIndex = Math.max(0, this.flashcards.length - 2);
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  }
  
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }
  
  nextCard(): void {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.currentCardIndex++;
      this.isFlipped = false;
    }
  }
  
  previousCard(): void {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.isFlipped = false;
    }
  }
  
  startStudyMode(): void {
    if (this.flashcards.length > 0) {
      this.studyMode = true;
      this.currentCardIndex = 0;
      this.isFlipped = false;
    }
  }
  
  exitStudyMode(): void {
    this.studyMode = false;
    this.isFlipped = false;
  }
  
  get currentCard(): Flashcard | null {
    return this.flashcards[this.currentCardIndex] || null;
  }
}
