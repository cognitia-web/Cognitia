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
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return data;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }
    
    return data;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ points, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Failed to update user points: ${error.message}`);
    }
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ 
        streak, 
        last_active_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Failed to update user streak: ${error.message}`);
    }
  }

  async updateUserLevel(userId: string, level: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ level, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      throw new Error(`Failed to update user level: ${error.message}`);
    }
  }

  // Task operations
  async getTasks(userId: string, date?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    
    return data || [];
  }

  async getTasksForDate(userId: string, date: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch tasks for date: ${error.message}`);
    }
    
    return data || [];
  }

  async createTask(task: InsertTask & { userId: string }): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: task.userId,
        title: task.title,
        subject: task.subject,
        intensity: task.intensity,
        estimate_min: task.estimateMin,
        date: task.date,
        status: task.status || 'pending',
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
    
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      return undefined;
    }
    
    return data;
  }

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Deck operations
  async getDecks(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch decks: ${error.message}`);
    }
    
    return data || [];
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching deck:', error);
      return undefined;
    }
    
    return data;
  }

  async createDeck(deck: InsertDeck & { userId: string }): Promise<Deck> {
    const { data, error } = await supabase
      .from('decks')
      .insert({
        user_id: deck.userId,
        title: deck.title,
        source: deck.source,
        source_content: deck.sourceContent,
        stats: deck.stats || {},
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create deck: ${error.message}`);
    }
    
    return data;
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating deck:', error);
      return undefined;
    }
    
    return data;
  }

  async deleteDeck(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Flashcard operations
  async getFlashcards(deckId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }
    
    return data || [];
  }

  async getFlashcardsForReview(userId: string, date: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select(`
        *,
        decks!inner(user_id)
      `)
      .eq('decks.user_id', userId)
      .lte('next_review', date);
    
    if (error) {
      throw new Error(`Failed to fetch flashcards for review: ${error.message}`);
    }
    
    return data || [];
  }

  async createFlashcard(flashcard: InsertFlashcard & { deckId: string }): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        deck_id: flashcard.deckId,
        question: flashcard.question,
        answer: flashcard.answer,
        difficulty: flashcard.difficulty || 'medium',
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create flashcard: ${error.message}`);
    }
    
    return data;
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating flashcard:', error);
      return undefined;
    }
    
    return data;
  }

  async deleteFlashcard(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Q&A operations
  async getQaHistory(userId: string, limit = 50): Promise<QaHistory[]> {
    const { data, error } = await supabase
      .from('qa_history')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch Q&A history: ${error.message}`);
    }
    
    return data || [];
  }

  async createQaRecord(qa: InsertQa & { userId: string }): Promise<QaHistory> {
    const { data, error } = await supabase
      .from('qa_history')
      .insert({
        user_id: qa.userId,
        prompt: qa.prompt,
        mode: qa.mode,
        model: qa.model,
        answer: qa.answer,
        outline: qa.outline,
        sources: qa.sources,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create Q&A record: ${error.message}`);
    }
    
    return data;
  }

  async deleteQaRecord(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('qa_history')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Revision operations
  async getRevisionTopics(userId: string): Promise<RevisionTopic[]> {
    const { data, error } = await supabase
      .from('revision_topics')
      .select('*')
      .eq('user_id', userId)
      .order('next_date', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch revision topics: ${error.message}`);
    }
    
    return data || [];
  }

  async getRevisionTopicsDue(userId: string, date: string): Promise<RevisionTopic[]> {
    const { data, error } = await supabase
      .from('revision_topics')
      .select('*')
      .eq('user_id', userId)
      .lte('next_date', date)
      .order('next_date', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch due revision topics: ${error.message}`);
    }
    
    return data || [];
  }

  async createRevisionTopic(topic: InsertRevisionTopic & { userId: string; nextDate: string }): Promise<RevisionTopic> {
    const { data, error } = await supabase
      .from('revision_topics')
      .insert({
        user_id: topic.userId,
        title: topic.title,
        subject: topic.subject,
        next_date: topic.nextDate,
        interval_days: 1,
        ease: 2.5,
        review_history: [],
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create revision topic: ${error.message}`);
    }
    
    return data;
  }

  async updateRevisionTopic(id: string, updates: Partial<RevisionTopic>): Promise<RevisionTopic | undefined> {
    const { data, error } = await supabase
      .from('revision_topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating revision topic:', error);
      return undefined;
    }
    
    return data;
  }

  async deleteRevisionTopic(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('revision_topics')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Points operations
  async getPointsEvents(userId: string, limit = 100): Promise<PointsEvent[]> {
    const { data, error } = await supabase
      .from('points_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch points events: ${error.message}`);
    }
    
    return data || [];
  }

  async createPointsEvent(event: Omit<PointsEvent, 'id' | 'created_at'>): Promise<PointsEvent> {
    const { data, error } = await supabase
      .from('points_events')
      .insert({
        user_id: event.userId,
        type: event.type,
        amount: event.amount,
        meta: event.meta || {},
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create points event: ${error.message}`);
    }
    
    return data;
  }

  // Daily quote operations
  async getDailyQuote(dayKey: string): Promise<DailyQuote | undefined> {
    const { data, error } = await supabase
      .from('daily_quotes')
      .select('*')
      .eq('day_key', dayKey)
      .single();
    
    if (error) {
      console.error('Error fetching daily quote:', error);
      return undefined;
    }
    
    return data;
  }

  async createDailyQuote(quote: Omit<DailyQuote, 'id' | 'created_at'>): Promise<DailyQuote> {
    const { data, error } = await supabase
      .from('daily_quotes')
      .insert({
        text: quote.text,
        author: quote.author,
        source_url: quote.sourceUrl,
        day_key: quote.dayKey,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create daily quote: ${error.message}`);
    }
    
    return data;
  }
}

export const storage = new SupabaseStorage();