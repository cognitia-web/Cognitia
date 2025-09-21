import type { Express } from "express";
import { createServer, type Server } from "http";
import { firestoreService } from "./services/firestore";
import { verifyFirebaseToken, optionalFirebaseAuth } from "./middleware/firebaseAuth";
import { aiService } from "./services/aiService";
import { quoteService } from "./services/quoteService";
import { spacedRepetitionService } from "./services/spacedRepetition";
import { z } from "zod";
import type { Request, Response } from "express";

// Validation schemas for Firestore data
const taskSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  intensity: z.enum(['Low', 'Medium', 'High']),
  estimateMin: z.number().min(1),
  date: z.string(),
});

const deckSchema = z.object({
  title: z.string().min(1),
  source: z.string().nullable().optional(),
  sourceContent: z.string().nullable().optional(),
});

const flashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).default([]),
});

const qaSchema = z.object({
  prompt: z.string().min(1),
  mode: z.string(),
  model: z.string().optional(),
  sources: z.array(z.string()).default([]),
});

const revisionTopicSchema = z.object({
  topic: z.string().min(1),
  subject: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.get('/api/auth/user', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      let user = await firestoreService.getUser(userId);
      
      // Create user if doesn't exist
      if (!user) {
        user = await firestoreService.createUser({
          id: userId,
          email: req.firebaseUser!.email || null,
          firstName: req.firebaseUser!.name?.split(' ')[0] || null,
          lastName: req.firebaseUser!.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: req.firebaseUser!.picture || null,
          streak: 0,
          level: "Bronze",
          points: 0,
          modelDefaults: {},
          settings: {},
          lastActiveDate: new Date().toISOString().split('T')[0],
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task operations
  app.get('/api/tasks/today', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await firestoreService.getTasks(userId, today);
      res.json(todayTasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      res.status(500).json({ message: "Failed to fetch today's tasks" });
    }
  });

  app.get('/api/tasks', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const date = req.query.date as string;
      const tasks = await firestoreService.getTasks(userId, date);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const validatedData = taskSchema.parse(req.body);
      
      const task = await firestoreService.createTask({
        userId,
        title: validatedData.title,
        subject: validatedData.subject,
        intensity: validatedData.intensity,
        estimateMin: validatedData.estimateMin,
        date: validatedData.date,
        status: 'pending',
        completedAt: null,
        pointsAwarded: 0,
      });
      
      // Award points for creating task
      const points = await calculateTaskPoints(validatedData.intensity, validatedData.estimateMin);
      await awardPoints(userId, 'task_created', points, { taskId: task.id });
      
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.firebaseUser!.uid;
      const updates = req.body;
      
      await firestoreService.updateTask(id, updates);
      
      // If task is being completed, award points
      if (updates.status === 'completed' && updates.completedAt) {
        const tasks = await firestoreService.getTasks(userId);
        const updatedTask = tasks.find(t => t.id === id);
        
        if (updatedTask) {
          const points = await calculateTaskPoints(updatedTask.intensity, updatedTask.estimateMin);
          await awardPoints(userId, 'task_completed', points, { taskId: updatedTask.id });
          await firestoreService.updateTask(id, { pointsAwarded: points });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await firestoreService.deleteTask(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Deck operations
  app.get('/api/decks', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const decks = await firestoreService.getDecks(userId);
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  app.get('/api/decks/:id', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deck = await firestoreService.getDeck(id);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      const flashcards = await firestoreService.getFlashcards(id);
      res.json({ ...deck, flashcards });
    } catch (error) {
      console.error("Error fetching deck:", error);
      res.status(500).json({ message: "Failed to fetch deck" });
    }
  });

  app.post('/api/decks', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const validatedData = deckSchema.parse(req.body);
      
      const deck = await firestoreService.createDeck({
        userId,
        title: validatedData.title,
        source: validatedData.source || null,
        sourceContent: validatedData.sourceContent || null,
        stats: {},
      });
      
      res.json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  // Generate flashcards from content
  app.post('/api/decks/:id/generate', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const { id: deckId } = req.params;
      const { content, count = 10 } = req.body;
      
      const user = await firestoreService.getUser(userId);
      const model = user?.modelDefaults?.flashcards || 'gpt-4';
      
      const flashcards = await aiService.generateFlashcards(content, count, model);
      
      // Create flashcards in database
      const flashcardsToCreate = flashcards.map(card => ({
        deckId,
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || 'medium' as const,
        tags: [],
        nextReview: null,
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0,
      }));
      
      const createdCards = await firestoreService.createFlashcards(flashcardsToCreate);
      
      // Update deck stats
      await firestoreService.updateDeck(deckId, {
        stats: { totalCards: createdCards.length }
      });
      
      res.json(createdCards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ message: "Failed to generate flashcards" });
    }
  });

  // Study flashcard and update spaced repetition
  app.post('/api/flashcards/:id/review', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const { id } = req.params;
      const { quality } = req.body; // 1=again, 2=hard, 3=good, 4=easy
      
      const updates = spacedRepetitionService.updateCard(quality);
      // Convert string date to Date for Firestore
      const firestoreUpdates = {
        ...updates,
        nextReview: new Date(updates.nextReview),
        reviewCount: updates.reviewCount,
        correctCount: updates.correctCount,
      };
      await firestoreService.updateFlashcard(id, {
        nextReview: firestoreUpdates.nextReview,
        interval: firestoreUpdates.intervalDays,
        easeFactor: firestoreUpdates.ease,
        reviewCount: firestoreUpdates.reviewCount as any,
        correctCount: firestoreUpdates.correctCount as any,
      });
      
      if (quality >= 3) {
        await awardPoints(userId, 'flashcard_correct', 10, { flashcardId: id });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error reviewing flashcard:", error);
      res.status(500).json({ message: "Failed to review flashcard" });
    }
  });

  // Q&A operations
  app.get('/api/qa/history', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const history = await firestoreService.getQaHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching Q&A history:", error);
      res.status(500).json({ message: "Failed to fetch Q&A history" });
    }
  });

  app.post('/api/qa/ask', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const validatedData = qaSchema.parse(req.body);
      
      const user = await firestoreService.getUser(userId);
      const model = validatedData.model || user?.modelDefaults?.qa || 'gpt-4';
      
      const response = await aiService.generateAnswer(
        validatedData.prompt, 
        validatedData.mode as 'concise' | 'eli15' | 'exam_style', 
        model, 
        validatedData.sources
      );
      
      const qaRecord = await firestoreService.createQaHistory({
        userId,
        prompt: validatedData.prompt,
        answer: response.answer,
        outline: response.outline || null,
        sources: validatedData.sources,
        model,
        mode: validatedData.mode,
      });
      
      res.json({ ...response, id: qaRecord.id });
    } catch (error) {
      console.error("Error generating answer:", error);
      res.status(500).json({ message: "Failed to generate answer" });
    }
  });

  // Points and rewards
  app.get('/api/points/history', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
      const userId = req.firebaseUser!.uid;
      const events = await firestoreService.getPointsHistory(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching points history:", error);
      res.status(500).json({ message: "Failed to fetch points history" });
    }
  });

  // Daily quote
  app.get('/api/quote/daily', async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      // For now, generate a new quote each time - we can implement caching later
      const quote = await quoteService.fetchDailyQuote();
      res.json(quote);
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      res.status(500).json({ message: "Failed to fetch daily quote" });
    }
  });

  // Helper functions
  async function calculateTaskPoints(intensity: string, estimateMin: number): Promise<number> {
    const basePoints = 25;
    const intensityMultiplier: Record<string, number> = { Low: 1, Medium: 1.5, High: 2 };
    const timeBonus = Math.floor(estimateMin / 30) * 10;
    return Math.floor(basePoints * intensityMultiplier[intensity] + timeBonus);
  }

  async function awardPoints(userId: string, type: string, amount: number, meta: any = {}): Promise<void> {
    await firestoreService.createPointsEvent({
      userId,
      type,
      points: amount,
      description: `${type.replace('_', ' ')} - ${amount} points`,
      metadata: meta,
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}