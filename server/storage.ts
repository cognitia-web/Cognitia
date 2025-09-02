import {
  users,
  tasks,
  decks,
  flashcards,
  qaHistory,
  revisionTopics,
  pointsEvents,
  dailyQuotes,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type Deck,
  type InsertDeck,
  type Flashcard,
  type InsertFlashcard,
  type QaHistory,
  type InsertQa,
  type RevisionTopic,
  type InsertRevisionTopic,
  type PointsEvent,
  type DailyQuote,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<void>;
  updateUserStreak(userId: string, streak: number): Promise<void>;
  updateUserLevel(userId: string, level: string): Promise<void>;
  
  // Task operations
  getTasks(userId: string, date?: string): Promise<Task[]>;
  getTasksForDate(userId: string, date: string): Promise<Task[]>;
  createTask(task: InsertTask & { userId: string }): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Deck operations
  getDecks(userId: string): Promise<Deck[]>;
  getDeck(id: string): Promise<Deck | undefined>;
  createDeck(deck: InsertDeck & { userId: string }): Promise<Deck>;
  updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined>;
  deleteDeck(id: string): Promise<boolean>;
  
  // Flashcard operations
  getFlashcards(deckId: string): Promise<Flashcard[]>;
  getFlashcardsForReview(userId: string, date: string): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard & { deckId: string }): Promise<Flashcard>;
  updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard | undefined>;
  deleteFlashcard(id: string): Promise<boolean>;
  
  // Q&A operations
  getQaHistory(userId: string, limit?: number): Promise<QaHistory[]>;
  createQaRecord(qa: InsertQa & { userId: string }): Promise<QaHistory>;
  deleteQaRecord(id: string): Promise<boolean>;
  
  // Revision operations
  getRevisionTopics(userId: string): Promise<RevisionTopic[]>;
  getRevisionTopicsDue(userId: string, date: string): Promise<RevisionTopic[]>;
  createRevisionTopic(topic: InsertRevisionTopic & { userId: string; nextDate: string }): Promise<RevisionTopic>;
  updateRevisionTopic(id: string, updates: Partial<RevisionTopic>): Promise<RevisionTopic | undefined>;
  deleteRevisionTopic(id: string): Promise<boolean>;
  
  // Points operations
  getPointsEvents(userId: string, limit?: number): Promise<PointsEvent[]>;
  createPointsEvent(event: Omit<PointsEvent, 'id' | 'createdAt'>): Promise<PointsEvent>;
  
  // Daily quote operations
  getDailyQuote(dayKey: string): Promise<DailyQuote | undefined>;
  createDailyQuote(quote: Omit<DailyQuote, 'id' | 'createdAt'>): Promise<DailyQuote>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    await db
      .update(users)
      .set({ points, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    await db
      .update(users)
      .set({ streak, lastActiveDate: new Date().toISOString().split('T')[0], updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserLevel(userId: string, level: string): Promise<void> {
    await db
      .update(users)
      .set({ level, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Task operations
  async getTasks(userId: string, date?: string): Promise<Task[]> {
    if (date) {
      return await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.date, date)))
        .orderBy(desc(tasks.createdAt));
    }
    
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksForDate(userId: string, date: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.date, date)))
      .orderBy(asc(tasks.createdAt));
  }

  async createTask(task: InsertTask & { userId: string }): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Deck operations
  async getDecks(userId: string): Promise<Deck[]> {
    return await db
      .select()
      .from(decks)
      .where(eq(decks.userId, userId))
      .orderBy(desc(decks.createdAt));
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck;
  }

  async createDeck(deck: InsertDeck & { userId: string }): Promise<Deck> {
    const [newDeck] = await db.insert(decks).values(deck).returning();
    return newDeck;
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    const [updatedDeck] = await db
      .update(decks)
      .set(updates as any)
      .where(eq(decks.id, id))
      .returning();
    return updatedDeck;
  }

  async deleteDeck(id: string): Promise<boolean> {
    const result = await db.delete(decks).where(eq(decks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Flashcard operations
  async getFlashcards(deckId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.deckId, deckId))
      .orderBy(asc(flashcards.createdAt));
  }

  async getFlashcardsForReview(userId: string, date: string): Promise<Flashcard[]> {
    return await db
      .select({
        id: flashcards.id,
        deckId: flashcards.deckId,
        question: flashcards.question,
        answer: flashcards.answer,
        difficulty: flashcards.difficulty,
        nextReview: flashcards.nextReview,
        intervalDays: flashcards.intervalDays,
        ease: flashcards.ease,
        reviewCount: flashcards.reviewCount,
        correctCount: flashcards.correctCount,
        createdAt: flashcards.createdAt,
      })
      .from(flashcards)
      .innerJoin(decks, eq(flashcards.deckId, decks.id))
      .where(
        and(
          eq(decks.userId, userId),
          lte(flashcards.nextReview, date)
        )
      );
  }

  async createFlashcard(flashcard: InsertFlashcard & { deckId: string }): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const [updatedFlashcard] = await db
      .update(flashcards)
      .set(updates as any)
      .where(eq(flashcards.id, id))
      .returning();
    return updatedFlashcard;
  }

  async deleteFlashcard(id: string): Promise<boolean> {
    const result = await db.delete(flashcards).where(eq(flashcards.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Q&A operations
  async getQaHistory(userId: string, limit = 50): Promise<QaHistory[]> {
    return await db
      .select()
      .from(qaHistory)
      .where(eq(qaHistory.userId, userId))
      .orderBy(desc(qaHistory.savedAt))
      .limit(limit);
  }

  async createQaRecord(qa: InsertQa & { userId: string }): Promise<QaHistory> {
    const [newQa] = await db.insert(qaHistory).values(qa).returning();
    return newQa;
  }

  async deleteQaRecord(id: string): Promise<boolean> {
    const result = await db.delete(qaHistory).where(eq(qaHistory.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Revision operations
  async getRevisionTopics(userId: string): Promise<RevisionTopic[]> {
    return await db
      .select()
      .from(revisionTopics)
      .where(eq(revisionTopics.userId, userId))
      .orderBy(asc(revisionTopics.nextDate));
  }

  async getRevisionTopicsDue(userId: string, date: string): Promise<RevisionTopic[]> {
    return await db
      .select()
      .from(revisionTopics)
      .where(
        and(
          eq(revisionTopics.userId, userId),
          lte(revisionTopics.nextDate, date)
        )
      )
      .orderBy(asc(revisionTopics.nextDate));
  }

  async createRevisionTopic(topic: InsertRevisionTopic & { userId: string; nextDate: string }): Promise<RevisionTopic> {
    const [newTopic] = await db.insert(revisionTopics).values(topic).returning();
    return newTopic;
  }

  async updateRevisionTopic(id: string, updates: Partial<RevisionTopic>): Promise<RevisionTopic | undefined> {
    const [updatedTopic] = await db
      .update(revisionTopics)
      .set(updates as any)
      .where(eq(revisionTopics.id, id))
      .returning();
    return updatedTopic;
  }

  async deleteRevisionTopic(id: string): Promise<boolean> {
    const result = await db.delete(revisionTopics).where(eq(revisionTopics.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Points operations
  async getPointsEvents(userId: string, limit = 100): Promise<PointsEvent[]> {
    return await db
      .select()
      .from(pointsEvents)
      .where(eq(pointsEvents.userId, userId))
      .orderBy(desc(pointsEvents.createdAt))
      .limit(limit);
  }

  async createPointsEvent(event: Omit<PointsEvent, 'id' | 'createdAt'>): Promise<PointsEvent> {
    const [newEvent] = await db.insert(pointsEvents).values(event).returning();
    return newEvent;
  }

  // Daily quote operations
  async getDailyQuote(dayKey: string): Promise<DailyQuote | undefined> {
    const [quote] = await db
      .select()
      .from(dailyQuotes)
      .where(eq(dailyQuotes.dayKey, dayKey));
    return quote;
  }

  async createDailyQuote(quote: Omit<DailyQuote, 'id' | 'createdAt'>): Promise<DailyQuote> {
    const [newQuote] = await db.insert(dailyQuotes).values(quote).returning();
    return newQuote;
  }
}

export const storage = new DatabaseStorage();
