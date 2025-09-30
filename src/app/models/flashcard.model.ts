export interface Flashcard {
  id?: string;
  userId: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: Date;
  lastReviewed?: Date;
}
