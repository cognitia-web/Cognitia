import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { aiService } from "./services/aiService";
import { quoteService } from "./services/quoteService";
import { spacedRepetitionService } from "./services/spacedRepetition";
import { z } from "zod";
import type { Request, Response } from "express";

// Validation schemas
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

const qaSchema = z.object({
  prompt: z.string().min(1),
  mode: z.string(),
  model: z.string().optional(),
  sources: z.array(z.string()).default([]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      let user = await storage.getUser(userId);
      
      // Create user if doesn't exist
      if (!user) {
        const claims = (req.user as any).claims;
        user = await storage.upsertUser({
          id: userId,
          email: claims.email || null,
          firstName: claims.first_name || null,
          lastName: claims.last_name || null,
          profileImageUrl: claims.profile_image_url || null,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task operations
  app.get('/api/tasks/today', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await storage.getTasksForDate(userId, today);
      res.json(todayTasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      res.status(500).json({ message: "Failed to fetch today's tasks" });
    }
  });

  app.get('/api/tasks', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const date = req.query.date as string;
      const tasks = await storage.getTasks(userId, date);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const validatedData = taskSchema.parse(req.body);
      
      const task = await storage.createTask({
        userId,
        title: validatedData.title,
        subject: validatedData.subject,
        intensity: validatedData.intensity,
        estimateMin: validatedData.estimateMin,
        date: validatedData.date,
        status: 'pending',
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

  app.patch('/api/tasks/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).claims.sub;
      const updates = req.body;
      
      const updatedTask = await storage.updateTask(id, updates);
      
      // If task is being completed, award points
      if (updates.status === 'completed' && updates.completedAt && updatedTask) {
        const points = await calculateTaskPoints(updatedTask.intensity, updatedTask.estimateMin);
        await awardPoints(userId, 'task_completed', points, { taskId: updatedTask.id });
        await storage.updateTask(id, { pointsAwarded: points });
      }
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTask(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Deck operations
  app.get('/api/decks', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const decks = await storage.getDecks(userId);
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  app.get('/api/decks/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deck = await storage.getDeck(id);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      const flashcards = await storage.getFlashcards(id);
      res.json({ ...deck, flashcards });
    } catch (error) {
      console.error("Error fetching deck:", error);
      res.status(500).json({ message: "Failed to fetch deck" });
    }
  });

  app.post('/api/decks', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const validatedData = deckSchema.parse(req.body);
      
      const deck = await storage.createDeck({
        userId,
        title: validatedData.title,
        source: validatedData.source || undefined,
        sourceContent: validatedData.sourceContent || undefined,
      });
      
      res.json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  // Generate flashcards from content
  app.post('/api/decks/:id/generate', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const { id: deckId } = req.params;
      const { content, count = 10 } = req.body;
      
      const user = await storage.getUser(userId);
      const model = user?.modelDefaults?.flashcards || 'gpt-4';
      
      const flashcards = await aiService.generateFlashcards(content, count, model);
      
      // Create flashcards in database
      for (const card of flashcards) {
        await storage.createFlashcard({
          deckId,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || 'medium',
        });
      }
      
      // Update deck stats
      const allCards = await storage.getFlashcards(deckId);
      await storage.updateDeck(deckId, {
        stats: { totalCards: allCards.length }
      });
      
      res.json(flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ message: "Failed to generate flashcards" });
    }
  });

  // Study flashcard and update spaced repetition
  app.post('/api/flashcards/:id/review', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const { id } = req.params;
      const { quality } = req.body; // 1=again, 2=hard, 3=good, 4=easy
      
      const updates = spacedRepetitionService.updateCard(quality);
      await storage.updateFlashcard(id, updates);
      
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
  app.get('/api/qa/history', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const history = await storage.getQaHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching Q&A history:", error);
      res.status(500).json({ message: "Failed to fetch Q&A history" });
    }
  });

  app.post('/api/qa/ask', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const validatedData = qaSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      const model = validatedData.model || user?.modelDefaults?.qa || 'gpt-4';
      
      const response = await aiService.generateAnswer(
        validatedData.prompt, 
        validatedData.mode as 'concise' | 'eli15' | 'exam_style', 
        model, 
        validatedData.sources
      );
      
      const qaRecord = await storage.createQaRecord({
        userId,
        prompt: validatedData.prompt,
        answer: response.answer,
        outline: response.outline || undefined,
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
  app.get('/api/points/history', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).claims.sub;
      const events = await storage.getPointsEvents(userId);
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
      
      // Check if we already have today's quote
      let quote = await storage.getDailyQuote(today);
      
      if (!quote) {
        // Generate new quote for today
        const quoteData = await quoteService.fetchDailyQuote();
        quote = await storage.createDailyQuote({
          text: quoteData.text,
          author: quoteData.author,
          sourceUrl: quoteData.sourceUrl,
          dayKey: today,
        });
      }
      
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
    await storage.createPointsEvent({
      userId,
      type,
      amount,
      meta,
    });
    
    // Update user points
    const user = await storage.getUser(userId);
    if (user) {
      await storage.updateUserPoints(userId, user.points + amount);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}