// Firestore service for StudyHub - handles all database operations
import admin from 'firebase-admin';
import { 
  FirestoreUser,
  FirestoreTask,
  FirestoreDeck,
  FirestoreFlashcard,
  FirestoreQaHistory,
  FirestoreRevisionTopic,
  FirestorePointsEvent,
  COLLECTIONS
} from '@shared/firestore-schema';

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App;

export function initializeFirebaseAdmin() {
  if (!firebaseAdmin) {
    // Check if we're in a test environment or if credentials are provided
    if (process.env.NODE_ENV === 'test') {
      // Use emulator for testing
      firebaseAdmin = admin.initializeApp({
        projectId: 'test-project',
      });
    } else {
      // Production/development - use service account or environment credentials
      const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Firebase project ID is required');
      }

      try {
        firebaseAdmin = admin.initializeApp({
          projectId,
          // In production, you would typically use a service account key
          // For now, we'll use the default application credentials
        });
      } catch (error) {
        console.warn('Firebase Admin initialization failed, using fallback config:', error);
        // Fallback for development without service account
        firebaseAdmin = admin.initializeApp({
          projectId,
        });
      }
    }
  }
  return firebaseAdmin;
}

export function getFirestore() {
  const app = initializeFirebaseAdmin();
  return app.firestore();
}

export class FirestoreService {
  private db = getFirestore();

  // User operations
  async createUser(user: Omit<FirestoreUser, 'createdAt' | 'updatedAt'>): Promise<FirestoreUser> {
    const now = new Date();
    const userData: FirestoreUser = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.collection(COLLECTIONS.USERS).doc(user.id).set(userData);
    return userData;
  }

  async getUser(userId: string): Promise<FirestoreUser | null> {
    const doc = await this.db.collection(COLLECTIONS.USERS).doc(userId).get();
    return doc.exists ? (doc.data() as FirestoreUser) : null;
  }

  async updateUser(userId: string, updates: Partial<FirestoreUser>): Promise<void> {
    await this.db.collection(COLLECTIONS.USERS).doc(userId).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Task operations
  async createTask(task: Omit<FirestoreTask, 'id' | 'createdAt'>): Promise<FirestoreTask> {
    const docRef = this.db.collection(COLLECTIONS.TASKS).doc();
    const taskData: FirestoreTask = {
      ...task,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(taskData);
    return taskData;
  }

  async getTasks(userId: string, date?: string): Promise<FirestoreTask[]> {
    let query = this.db.collection(COLLECTIONS.TASKS).where('userId', '==', userId);
    
    if (date) {
      query = query.where('date', '==', date);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as FirestoreTask);
  }

  async updateTask(taskId: string, updates: Partial<FirestoreTask>): Promise<void> {
    await this.db.collection(COLLECTIONS.TASKS).doc(taskId).update(updates);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.db.collection(COLLECTIONS.TASKS).doc(taskId).delete();
  }

  // Deck operations
  async createDeck(deck: Omit<FirestoreDeck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreDeck> {
    const docRef = this.db.collection(COLLECTIONS.DECKS).doc();
    const now = new Date();
    const deckData: FirestoreDeck = {
      ...deck,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(deckData);
    return deckData;
  }

  async getDecks(userId: string): Promise<FirestoreDeck[]> {
    const snapshot = await this.db.collection(COLLECTIONS.DECKS)
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => doc.data() as FirestoreDeck);
  }

  async getDeck(deckId: string): Promise<FirestoreDeck | null> {
    const doc = await this.db.collection(COLLECTIONS.DECKS).doc(deckId).get();
    return doc.exists ? (doc.data() as FirestoreDeck) : null;
  }

  async updateDeck(deckId: string, updates: Partial<FirestoreDeck>): Promise<void> {
    await this.db.collection(COLLECTIONS.DECKS).doc(deckId).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteDeck(deckId: string): Promise<void> {
    // Also delete associated flashcards
    const flashcardsSnapshot = await this.db.collection(COLLECTIONS.FLASHCARDS)
      .where('deckId', '==', deckId)
      .get();

    const batch = this.db.batch();
    flashcardsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    batch.delete(this.db.collection(COLLECTIONS.DECKS).doc(deckId));

    await batch.commit();
  }

  // Flashcard operations
  async createFlashcards(flashcards: Omit<FirestoreFlashcard, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<FirestoreFlashcard[]> {
    const batch = this.db.batch();
    const now = new Date();
    const createdCards: FirestoreFlashcard[] = [];

    flashcards.forEach(flashcard => {
      const docRef = this.db.collection(COLLECTIONS.FLASHCARDS).doc();
      const cardData: FirestoreFlashcard = {
        ...flashcard,
        id: docRef.id,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(docRef, cardData);
      createdCards.push(cardData);
    });

    await batch.commit();
    return createdCards;
  }

  async getFlashcards(deckId: string): Promise<FirestoreFlashcard[]> {
    const snapshot = await this.db.collection(COLLECTIONS.FLASHCARDS)
      .where('deckId', '==', deckId)
      .get();
    return snapshot.docs.map(doc => doc.data() as FirestoreFlashcard);
  }

  async updateFlashcard(cardId: string, updates: Partial<FirestoreFlashcard>): Promise<void> {
    await this.db.collection(COLLECTIONS.FLASHCARDS).doc(cardId).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  // QA History operations
  async createQaHistory(qa: Omit<FirestoreQaHistory, 'id' | 'createdAt'>): Promise<FirestoreQaHistory> {
    const docRef = this.db.collection(COLLECTIONS.QA_HISTORY).doc();
    const qaData: FirestoreQaHistory = {
      ...qa,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(qaData);
    return qaData;
  }

  async getQaHistory(userId: string): Promise<FirestoreQaHistory[]> {
    const snapshot = await this.db.collection(COLLECTIONS.QA_HISTORY)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    return snapshot.docs.map(doc => doc.data() as FirestoreQaHistory);
  }

  // Points operations
  async createPointsEvent(event: Omit<FirestorePointsEvent, 'id' | 'createdAt'>): Promise<FirestorePointsEvent> {
    const docRef = this.db.collection(COLLECTIONS.POINTS_EVENTS).doc();
    const eventData: FirestorePointsEvent = {
      ...event,
      id: docRef.id,
      createdAt: new Date(),
    };

    await docRef.set(eventData);
    
    // Update user points
    const userRef = this.db.collection(COLLECTIONS.USERS).doc(event.userId);
    await userRef.update({
      points: admin.firestore.FieldValue.increment(event.points),
      updatedAt: new Date(),
    });

    return eventData;
  }

  async getPointsHistory(userId: string): Promise<FirestorePointsEvent[]> {
    const snapshot = await this.db.collection(COLLECTIONS.POINTS_EVENTS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    return snapshot.docs.map(doc => doc.data() as FirestorePointsEvent);
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();