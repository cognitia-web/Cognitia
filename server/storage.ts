import { firestoreService } from "./services/firestore";
import type {
  User,
  UpsertUser,
  Task,
  InsertTask,
  Deck,
  InsertDeck,
  Flashcard,
  InsertFlashcard,
  QaHistory,
  InsertQa,
  RevisionTopic,
  InsertRevisionTopic,
  PointsEvent,
  DailyQuote,
} from "@shared/schema";
import type {
  FirestoreUser,
  FirestoreTask,
  FirestoreDeck,
  FirestoreFlashcard,
  FirestoreQaHistory,
  FirestoreRevisionTopic,
  FirestorePointsEvent,
} from "@shared/firestore-schema";

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
  createPointsEvent(event: Omit<PointsEvent, 'id' | 'created_at'>): Promise<PointsEvent>;
  
  // Daily quote operations
  getDailyQuote(dayKey: string): Promise<DailyQuote | undefined>;
  createDailyQuote(quote: Omit<DailyQuote, 'id' | 'created_at'>): Promise<DailyQuote>;
}

export class FirebaseStorage implements IStorage {
  // Helper methods to convert Firestore objects to shared schema objects
  private convertFirestoreUserToUser(firestoreUser: FirestoreUser): User {
    return {
      id: firestoreUser.id,
      email: firestoreUser.email || undefined,
      firstName: firestoreUser.firstName || undefined,
      lastName: firestoreUser.lastName || undefined,
      profileImageUrl: firestoreUser.profileImageUrl || undefined,
      streak: firestoreUser.streak,
      level: firestoreUser.level,
      points: firestoreUser.points,
      modelDefaults: firestoreUser.modelDefaults,
      settings: firestoreUser.settings,
      lastActiveDate: firestoreUser.lastActiveDate,
      createdAt: firestoreUser.createdAt.toISOString(),
      updatedAt: firestoreUser.updatedAt.toISOString(),
    };
  }

  private convertFirestoreTaskToTask(firestoreTask: FirestoreTask): Task {
    return {
      id: firestoreTask.id,
      userId: firestoreTask.userId,
      title: firestoreTask.title,
      subject: firestoreTask.subject,
      intensity: firestoreTask.intensity,
      estimateMin: firestoreTask.estimateMin,
      date: firestoreTask.date,
      status: firestoreTask.status,
      completedAt: firestoreTask.completedAt?.toISOString(),
      pointsAwarded: firestoreTask.pointsAwarded,
      createdAt: firestoreTask.createdAt.toISOString(),
    };
  }

  private convertFirestoreDeckToDeck(firestoreDeck: FirestoreDeck): Deck {
    return {
      id: firestoreDeck.id,
      userId: firestoreDeck.userId,
      title: firestoreDeck.title,
      source: firestoreDeck.source,
      sourceContent: firestoreDeck.sourceContent,
      stats: firestoreDeck.stats,
      createdAt: firestoreDeck.createdAt.toISOString(),
    };
  }

  private convertFirestoreFlashcardToFlashcard(firestoreFlashcard: FirestoreFlashcard): Flashcard {
    return {
      id: firestoreFlashcard.id,
      deckId: firestoreFlashcard.deckId,
      question: firestoreFlashcard.question,
      answer: firestoreFlashcard.answer,
      difficulty: firestoreFlashcard.difficulty,
      nextReview: firestoreFlashcard.nextReview?.toISOString(),
      intervalDays: firestoreFlashcard.interval,
      ease: firestoreFlashcard.easeFactor,
      reviewCount: firestoreFlashcard.reviewCount,
      correctCount: firestoreFlashcard.correctCount,
      createdAt: firestoreFlashcard.createdAt.toISOString(),
    };
  }

  private convertFirestoreQaHistoryToQaHistory(firestoreQa: FirestoreQaHistory): QaHistory {
    return {
      id: firestoreQa.id,
      userId: firestoreQa.userId,
      prompt: firestoreQa.prompt,
      mode: firestoreQa.mode,
      model: firestoreQa.model,
      answer: firestoreQa.answer,
      outline: firestoreQa.outline,
      sources: firestoreQa.sources,
      savedAt: firestoreQa.createdAt.toISOString(),
    };
  }

  private convertFirestorePointsEventToPointsEvent(firestoreEvent: FirestorePointsEvent): PointsEvent {
    return {
      id: firestoreEvent.id,
      userId: firestoreEvent.userId,
      type: firestoreEvent.type,
      amount: firestoreEvent.points,
      meta: firestoreEvent.metadata,
      created_at: firestoreEvent.createdAt.toISOString(),
    };
  }
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const firestoreUser = await firestoreService.getUser(id);
      if (!firestoreUser) return undefined;
      
      // Convert Firestore user to shared schema user
      return {
        id: firestoreUser.id,
        email: firestoreUser.email || undefined,
        firstName: firestoreUser.firstName || undefined,
        lastName: firestoreUser.lastName || undefined,
        profileImageUrl: firestoreUser.profileImageUrl || undefined,
        streak: firestoreUser.streak,
        level: firestoreUser.level,
        points: firestoreUser.points,
        modelDefaults: firestoreUser.modelDefaults,
        settings: firestoreUser.settings,
        lastActiveDate: firestoreUser.lastActiveDate,
        createdAt: firestoreUser.createdAt.toISOString(),
        updatedAt: firestoreUser.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // Check if user exists
      const existingUser = await firestoreService.getUser(userData.id);
      
      if (existingUser) {
        // Update existing user
        await firestoreService.updateUser(userData.id, {
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
        });
        
        const updatedUser = await firestoreService.getUser(userData.id);
        if (!updatedUser) throw new Error('Failed to retrieve updated user');
        
        return this.convertFirestoreUserToUser(updatedUser);
      } else {
        // Create new user with defaults
        const newUser = await firestoreService.createUser({
          id: userData.id,
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          streak: 0,
          level: 'Bronze',
          points: 0,
          modelDefaults: {
            flashcards: 'gpt-4',
            qa: 'gpt-4',
          },
          settings: {
            theme: 'system',
            notifications: true,
            reducedMotion: false,
          },
          lastActiveDate: new Date().toISOString().split('T')[0],
        });
        
        return this.convertFirestoreUserToUser(newUser);
      }
    } catch (error) {
      throw new Error(`Failed to upsert user: ${error}`);
    }
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    try {
      await firestoreService.updateUser(userId, { points });
    } catch (error) {
      throw new Error(`Failed to update user points: ${error}`);
    }
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    try {
      await firestoreService.updateUser(userId, {
        streak,
        lastActiveDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      throw new Error(`Failed to update user streak: ${error}`);
    }
  }

  async updateUserLevel(userId: string, level: string): Promise<void> {
    try {
      await firestoreService.updateUser(userId, { level });
    } catch (error) {
      throw new Error(`Failed to update user level: ${error}`);
    }
  }

  // Task operations
  async getTasks(userId: string, date?: string): Promise<Task[]> {
    try {
      const firestoreTasks = await firestoreService.getTasks(userId, date);
      return firestoreTasks.map(task => this.convertFirestoreTaskToTask(task));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async getTasksForDate(userId: string, date: string): Promise<Task[]> {
    try {
      const firestoreTasks = await firestoreService.getTasks(userId, date);
      return firestoreTasks.map(task => this.convertFirestoreTaskToTask(task));
    } catch (error) {
      console.error('Error fetching tasks for date:', error);
      return [];
    }
  }

  async createTask(task: InsertTask & { userId: string }): Promise<Task> {
    try {
      const firestoreTask = await firestoreService.createTask({
        userId: task.userId,
        title: task.title,
        subject: task.subject,
        intensity: task.intensity,
        estimateMin: task.estimateMin,
        date: task.date,
        status: task.status || 'pending',
        completedAt: null,
        pointsAwarded: 0,
      });
      
      return this.convertFirestoreTaskToTask(firestoreTask);
    } catch (error) {
      throw new Error(`Failed to create task: ${error}`);
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    try {
      const firestoreUpdates: Partial<FirestoreTask> = {};
      
      if (updates.title !== undefined) firestoreUpdates.title = updates.title;
      if (updates.subject !== undefined) firestoreUpdates.subject = updates.subject;
      if (updates.intensity !== undefined) firestoreUpdates.intensity = updates.intensity;
      if (updates.estimateMin !== undefined) firestoreUpdates.estimateMin = updates.estimateMin;
      if (updates.date !== undefined) firestoreUpdates.date = updates.date;
      if (updates.status !== undefined) firestoreUpdates.status = updates.status;
      if (updates.completedAt !== undefined) {
        firestoreUpdates.completedAt = updates.completedAt ? new Date(updates.completedAt) : null;
      }
      if (updates.pointsAwarded !== undefined) firestoreUpdates.pointsAwarded = updates.pointsAwarded;
      
      await firestoreService.updateTask(id, firestoreUpdates);
      
      // Note: FirestoreService doesn't have getTaskById, so we return undefined
      // This needs to be implemented in FirestoreService for proper functionality
      console.warn('updateTask: Cannot return updated task - getTaskById not implemented in FirestoreService');
      return undefined;
    } catch (error) {
      console.error('Error updating task:', error);
      return undefined;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      await firestoreService.deleteTask(id);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // Deck operations
  async getDecks(userId: string): Promise<Deck[]> {
    try {
      const firestoreDecks = await firestoreService.getDecks(userId);
      return firestoreDecks.map(deck => this.convertFirestoreDeckToDeck(deck));
    } catch (error) {
      console.error('Error fetching decks:', error);
      return [];
    }
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    try {
      const firestoreDeck = await firestoreService.getDeck(id);
      return firestoreDeck ? this.convertFirestoreDeckToDeck(firestoreDeck) : undefined;
    } catch (error) {
      console.error('Error fetching deck:', error);
      return undefined;
    }
  }

  async createDeck(deck: InsertDeck & { userId: string }): Promise<Deck> {
    try {
      const firestoreDeck = await firestoreService.createDeck({
        userId: deck.userId,
        title: deck.title,
        source: deck.source || null,
        sourceContent: deck.sourceContent || null,
        stats: deck.stats || {},
      });
      
      return this.convertFirestoreDeckToDeck(firestoreDeck);
    } catch (error) {
      throw new Error(`Failed to create deck: ${error}`);
    }
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    try {
      const firestoreUpdates: Partial<FirestoreDeck> = {};
      
      if (updates.title !== undefined) firestoreUpdates.title = updates.title;
      if (updates.source !== undefined) firestoreUpdates.source = updates.source;
      if (updates.sourceContent !== undefined) firestoreUpdates.sourceContent = updates.sourceContent;
      if (updates.stats !== undefined) firestoreUpdates.stats = updates.stats;
      
      await firestoreService.updateDeck(id, firestoreUpdates);
      
      const updatedDeck = await firestoreService.getDeck(id);
      return updatedDeck ? this.convertFirestoreDeckToDeck(updatedDeck) : undefined;
    } catch (error) {
      console.error('Error updating deck:', error);
      return undefined;
    }
  }

  async deleteDeck(id: string): Promise<boolean> {
    try {
      await firestoreService.deleteDeck(id);
      return true;
    } catch (error) {
      console.error('Error deleting deck:', error);
      return false;
    }
  }

  // Flashcard operations
  async getFlashcards(deckId: string): Promise<Flashcard[]> {
    try {
      const firestoreFlashcards = await firestoreService.getFlashcards(deckId);
      return firestoreFlashcards.map(flashcard => this.convertFirestoreFlashcardToFlashcard(flashcard));
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      return [];
    }
  }

  async getFlashcardsForReview(userId: string, date: string): Promise<Flashcard[]> {
    try {
      // Get all decks for the user first
      const userDecks = await firestoreService.getDecks(userId);
      const deckIds = userDecks.map(deck => deck.id);
      
      // Get flashcards for all user decks that are due for review
      const allFlashcards: FirestoreFlashcard[] = [];
      
      for (const deckId of deckIds) {
        const deckFlashcards = await firestoreService.getFlashcards(deckId);
        allFlashcards.push(...deckFlashcards);
      }
      
      // Filter flashcards that are due for review
      const reviewDate = new Date(date);
      const dueFlashcards = allFlashcards.filter(flashcard => 
        flashcard.nextReview && flashcard.nextReview <= reviewDate
      );
      
      return dueFlashcards.map(flashcard => this.convertFirestoreFlashcardToFlashcard(flashcard));
    } catch (error) {
      console.error('Error fetching flashcards for review:', error);
      return [];
    }
  }

  async createFlashcard(flashcard: InsertFlashcard & { deckId: string }): Promise<Flashcard> {
    try {
      const firestoreFlashcards = await firestoreService.createFlashcards([{
        deckId: flashcard.deckId,
        question: flashcard.question,
        answer: flashcard.answer,
        difficulty: flashcard.difficulty || 'medium',
        tags: [],
        nextReview: null,
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0,
      }]);
      
      return this.convertFirestoreFlashcardToFlashcard(firestoreFlashcards[0]);
    } catch (error) {
      throw new Error(`Failed to create flashcard: ${error}`);
    }
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard | undefined> {
    try {
      const firestoreUpdates: Partial<FirestoreFlashcard> = {};
      
      if (updates.question !== undefined) firestoreUpdates.question = updates.question;
      if (updates.answer !== undefined) firestoreUpdates.answer = updates.answer;
      if (updates.difficulty !== undefined) firestoreUpdates.difficulty = updates.difficulty;
      if (updates.nextReview !== undefined) {
        firestoreUpdates.nextReview = updates.nextReview ? new Date(updates.nextReview) : null;
      }
      if (updates.intervalDays !== undefined) firestoreUpdates.interval = updates.intervalDays;
      if (updates.ease !== undefined) firestoreUpdates.easeFactor = updates.ease;
      if (updates.reviewCount !== undefined) firestoreUpdates.reviewCount = updates.reviewCount;
      if (updates.correctCount !== undefined) firestoreUpdates.correctCount = updates.correctCount;
      
      await firestoreService.updateFlashcard(id, firestoreUpdates);
      
      // Note: FirestoreService doesn't have getFlashcardById
      // This needs to be implemented for proper functionality
      console.warn('updateFlashcard: Cannot return updated flashcard - getFlashcardById not implemented in FirestoreService');
      return undefined;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      return undefined;
    }
  }

  async deleteFlashcard(id: string): Promise<boolean> {
    try {
      // Note: Firebase Firestore service doesn't have a deleteFlashcard method
      // This functionality would need to be implemented in the firestore service
      console.error('deleteFlashcard not implemented in Firestore service');
      return false;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      return false;
    }
  }

  // Q&A operations
  async getQaHistory(userId: string, limit = 50): Promise<QaHistory[]> {
    try {
      const firestoreQaHistory = await firestoreService.getQaHistory(userId);
      return firestoreQaHistory
        .slice(0, limit)
        .map(qa => this.convertFirestoreQaHistoryToQaHistory(qa));
    } catch (error) {
      console.error('Error fetching Q&A history:', error);
      return [];
    }
  }

  async createQaRecord(qa: InsertQa & { userId: string }): Promise<QaHistory> {
    try {
      const firestoreQa = await firestoreService.createQaHistory({
        userId: qa.userId,
        prompt: qa.prompt,
        mode: qa.mode,
        model: qa.model,
        answer: qa.answer,
        outline: qa.outline || null,
        sources: qa.sources || [],
      });
      
      return this.convertFirestoreQaHistoryToQaHistory(firestoreQa);
    } catch (error) {
      throw new Error(`Failed to create Q&A record: ${error}`);
    }
  }

  async deleteQaRecord(id: string): Promise<boolean> {
    try {
      // Note: Firebase Firestore service doesn't have a deleteQaRecord method
      // This functionality would need to be implemented in the firestore service
      console.error('deleteQaRecord not implemented in Firestore service');
      return false;
    } catch (error) {
      console.error('Error deleting Q&A record:', error);
      return false;
    }
  }

  // Revision operations
  async getRevisionTopics(userId: string): Promise<RevisionTopic[]> {
    try {
      // Note: Firebase Firestore service doesn't have revision topics operations
      // This functionality would need to be implemented in the firestore service
      console.error('getRevisionTopics not implemented in Firestore service');
      return [];
    } catch (error) {
      console.error('Error fetching revision topics:', error);
      return [];
    }
  }

  async getRevisionTopicsDue(userId: string, date: string): Promise<RevisionTopic[]> {
    try {
      // Note: Firebase Firestore service doesn't have revision topics operations
      // This functionality would need to be implemented in the firestore service
      console.error('getRevisionTopicsDue not implemented in Firestore service');
      return [];
    } catch (error) {
      console.error('Error fetching due revision topics:', error);
      return [];
    }
  }

  async createRevisionTopic(topic: InsertRevisionTopic & { userId: string; nextDate: string }): Promise<RevisionTopic> {
    try {
      // Note: Firebase Firestore service doesn't have revision topics operations
      // This functionality would need to be implemented in the firestore service
      throw new Error('createRevisionTopic not implemented in Firestore service');
    } catch (error) {
      throw new Error(`Failed to create revision topic: ${error}`);
    }
  }

  async updateRevisionTopic(id: string, updates: Partial<RevisionTopic>): Promise<RevisionTopic | undefined> {
    try {
      // Note: Firebase Firestore service doesn't have revision topics operations
      // This functionality would need to be implemented in the firestore service
      console.error('updateRevisionTopic not implemented in Firestore service');
      return undefined;
    } catch (error) {
      console.error('Error updating revision topic:', error);
      return undefined;
    }
  }

  async deleteRevisionTopic(id: string): Promise<boolean> {
    try {
      // Note: Firebase Firestore service doesn't have revision topics operations
      // This functionality would need to be implemented in the firestore service
      console.error('deleteRevisionTopic not implemented in Firestore service');
      return false;
    } catch (error) {
      console.error('Error deleting revision topic:', error);
      return false;
    }
  }

  // Points operations
  async getPointsEvents(userId: string, limit = 100): Promise<PointsEvent[]> {
    try {
      const firestoreEvents = await firestoreService.getPointsHistory(userId);
      return firestoreEvents
        .slice(0, limit)
        .map(event => this.convertFirestorePointsEventToPointsEvent(event));
    } catch (error) {
      console.error('Error fetching points events:', error);
      return [];
    }
  }

  async createPointsEvent(event: Omit<PointsEvent, 'id' | 'created_at'>): Promise<PointsEvent> {
    try {
      const firestoreEvent = await firestoreService.createPointsEvent({
        userId: event.userId,
        type: event.type,
        points: event.amount,
        description: `${event.type} event`,
        metadata: event.meta || {},
      });
      
      return this.convertFirestorePointsEventToPointsEvent(firestoreEvent);
    } catch (error) {
      throw new Error(`Failed to create points event: ${error}`);
    }
  }

  // Daily quote operations
  async getDailyQuote(dayKey: string): Promise<DailyQuote | undefined> {
    try {
      // Note: Firebase Firestore service doesn't have daily quote operations
      // This functionality would need to be implemented in the firestore service
      console.error('getDailyQuote not implemented in Firestore service');
      return undefined;
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      return undefined;
    }
  }

  async createDailyQuote(quote: Omit<DailyQuote, 'id' | 'created_at'>): Promise<DailyQuote> {
    try {
      // Note: Firebase Firestore service doesn't have daily quote operations
      // This functionality would need to be implemented in the firestore service
      throw new Error('createDailyQuote not implemented in Firestore service');
    } catch (error) {
      throw new Error(`Failed to create daily quote: ${error}`);
    }
  }
}

export const storage = new FirebaseStorage();