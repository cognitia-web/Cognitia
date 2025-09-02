import { z } from "zod";

// User types
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  streak: number;
  level: string;
  points: number;
  modelDefaults?: {
    flashcards?: string;
    qa?: string;
  };
  settings?: {
    theme?: string;
    notifications?: boolean;
    reducedMotion?: boolean;
  };
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

// Task types
export interface Task {
  id: string;
  userId: string;
  title: string;
  subject: string;
  intensity: string;
  estimateMin: number;
  date: string;
  status: string;
  completedAt?: string;
  pointsAwarded: number;
  createdAt: string;
}

export interface InsertTask {
  title: string;
  subject: string;
  intensity: string;
  estimateMin: number;
  date: string;
  status?: string;
}

// Deck types
export interface Deck {
  id: string;
  userId: string;
  title: string;
  source?: string;
  sourceContent?: string;
  stats?: {
    totalCards?: number;
    masteredCards?: number;
    averageAccuracy?: number;
    lastStudied?: string;
  };
  createdAt: string;
}

export interface InsertDeck {
  title: string;
  source?: string;
  sourceContent?: string;
  stats?: any;
}

// Flashcard types
export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  difficulty: string;
  nextReview?: string;
  intervalDays: number;
  ease: number;
  reviewCount: number;
  correctCount: number;
  createdAt: string;
}

export interface InsertFlashcard {
  question: string;
  answer: string;
  difficulty?: string;
}

// Q&A types
export interface QaHistory {
  id: string;
  userId: string;
  prompt: string;
  mode: string;
  model: string;
  answer: string;
  outline?: string;
  sources?: string[];
  savedAt: string;
}

export interface InsertQa {
  prompt: string;
  mode: string;
  model: string;
  answer: string;
  outline?: string;
  sources?: string[];
}

// Revision types
export interface RevisionTopic {
  id: string;
  userId: string;
  title: string;
  subject: string;
  nextDate: string;
  intervalDays: number;
  ease: number;
  reviewHistory: Array<{
    date: string;
    quality: number;
    timeSpent: number;
  }>;
  createdAt: string;
}

export interface InsertRevisionTopic {
  title: string;
  subject: string;
}

// Points types
export interface PointsEvent {
  id: string;
  userId: string;
  type: string;
  amount: number;
  meta?: {
    taskId?: string;
    deckId?: string;
    topicId?: string;
    streakDay?: number;
  };
  created_at: string;
}

// Daily quote types
export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  sourceUrl?: string;
  dayKey: string;
  created_at: string;
}

// Validation schemas
export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  intensity: z.enum(["Low", "Medium", "High"]),
  estimateMin: z.number().min(1).max(480),
  date: z.string(),
  status: z.string().default("pending"),
});

export const insertDeckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  source: z.string().optional(),
  sourceContent: z.string().optional(),
});

export const insertFlashcardSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const insertQaSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  mode: z.enum(["concise", "eli15", "exam_style"]),
  model: z.string(),
  answer: z.string(),
  outline: z.string().optional(),
  sources: z.array(z.string()).optional(),
});

export const insertRevisionTopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
});