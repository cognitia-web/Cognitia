// Firestore data models for StudyHub
// This replaces the PostgreSQL schema with Firebase/Firestore collections

export interface FirestoreUser {
  id: string; // Firebase UID
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  streak: number;
  level: string;
  points: number;
  modelDefaults: {
    flashcards?: string;
    qa?: string;
  };
  settings: {
    theme?: string;
    notifications?: boolean;
    reducedMotion?: boolean;
  };
  lastActiveDate: string; // ISO date string
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreTask {
  id: string;
  userId: string;
  title: string;
  subject: string;
  intensity: string; // Low, Medium, High
  estimateMin: number;
  date: string; // ISO date string
  status: string; // pending, in_progress, completed
  completedAt: Date | null;
  pointsAwarded: number;
  createdAt: Date;
}

export interface FirestoreDeck {
  id: string;
  userId: string;
  title: string;
  source: string | null; // text, pdf, url
  sourceContent: string | null;
  stats: {
    totalCards?: number;
    masteredCards?: number;
    averageAccuracy?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreFlashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  difficulty: string; // easy, medium, hard
  tags: string[];
  nextReview: Date | null;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  correctCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreQaHistory {
  id: string;
  userId: string;
  prompt: string;
  answer: string;
  outline: string | null;
  sources: string[];
  model: string;
  mode: string;
  createdAt: Date;
}

export interface FirestoreRevisionTopic {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  difficulty: string;
  nextReview: Date;
  interval: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestorePointsEvent {
  id: string;
  userId: string;
  type: string; // task_complete, streak_bonus, flashcard_correct, etc.
  points: number;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  DECKS: 'decks',
  FLASHCARDS: 'flashcards',
  QA_HISTORY: 'qa_history',
  REVISION_TOPICS: 'revision_topics',
  POINTS_EVENTS: 'points_events',
} as const;