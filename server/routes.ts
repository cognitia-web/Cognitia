import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTaskSchema, insertDeckSchema, insertFlashcardSchema, insertQaSchema, insertRevisionTopicSchema } from "@shared/schema";
import { aiService } from "./services/aiService";
import { quoteService } from "./services/quoteService";
import { spacedRepetitionService } from "./services/spacedRepetition";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task gate check
  app.get('/api/tasks/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await storage.getTasksForDate(userId, today);
      res.json(todayTasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      res.status(500).json({ message: "Failed to fetch today's tasks" });
    }
  });

  // Task operations
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.query.date as string;
      const tasks = await storage.getTasks(userId, date);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({ ...validatedData, userId });
      
      // Award points for creating task
      const points = await calculateTaskPoints(validatedData.intensity, validatedData.estimateMin);
      await awardPoints(userId, 'task_created', points, { taskId: task.id });
      
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      // If task is being completed, award points
      if (updates.status === 'completed' && updates.completedAt) {
        const task = await storage.updateTask(id, updates);
        if (task) {
          const points = await calculateTaskPoints(task.intensity, task.estimateMin);
          await awardPoints(userId, 'task_completed', points, { taskId: task.id });
          await storage.updateTask(id, { pointsAwarded: points });
        }
        res.json(task);
      } else {
        const task = await storage.updateTask(id, updates);
        res.json(task);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const decks = await storage.getDecks(userId);
      res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ message: "Failed to fetch decks" });
    }
  });

  app.get('/api/decks/:id', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/decks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertDeckSchema.parse(req.body);
      const deck = await storage.createDeck({ ...validatedData, userId });
      res.json(deck);
    } catch (error) {
      console.error("Error creating deck:", error);
      res.status(500).json({ message: "Failed to create deck" });
    }
  });

  // Generate flashcards from content
  app.post('/api/decks/:id/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id: deckId } = req.params;
      const { content, count = 10 } = req.body;
      
      const user = await storage.getUser(userId);
      const model = user?.modelDefaults?.flashcards || 'gpt-4';
      
      const flashcards = await aiService.generateFlashcards(content, count, model);
      
      // Create flashcards in database
      const createdCards = [];
      for (const card of flashcards) {
        const flashcard = await storage.createFlashcard({
          deckId,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || 'medium',
        });
        createdCards.push(flashcard);
      }
      
      // Update deck stats
      await storage.updateDeck(deckId, {
        stats: { totalCards: createdCards.length }
      });
      
      res.json(createdCards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ message: "Failed to generate flashcards" });
    }
  });

  // Study flashcard and update spaced repetition
  app.post('/api/flashcards/:id/review', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { quality } = req.body; // 1=again, 2=hard, 3=good, 4=easy
      
      const flashcard = await storage.updateFlashcard(id, 
        spacedRepetitionService.updateCard(quality)
      );
      
      if (quality >= 3) {
        await awardPoints(userId, 'flashcard_correct', 10, { flashcardId: id });
      }
      
      res.json(flashcard);
    } catch (error) {
      console.error("Error reviewing flashcard:", error);
      res.status(500).json({ message: "Failed to review flashcard" });
    }
  });

  // Q&A operations
  app.get('/api/qa/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getQaHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching Q&A history:", error);
      res.status(500).json({ message: "Failed to fetch Q&A history" });
    }
  });

  app.post('/api/qa/ask', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt, mode, model: requestedModel, sources } = req.body;
      
      const user = await storage.getUser(userId);
      const model = requestedModel || user?.modelDefaults?.qa || 'gpt-4';
      
      const response = await aiService.generateAnswer(prompt, mode, model, sources);
      
      const qaRecord = await storage.createQaRecord({
        userId,
        prompt,
        mode,
        model,
        answer: response.answer,
        outline: response.outline,
        sources: sources || [],
      });
      
      res.json({ ...response, id: qaRecord.id });
    } catch (error) {
      console.error("Error generating answer:", error);
      res.status(500).json({ message: "Failed to generate answer" });
    }
  });

  // Revision operations
  app.get('/api/revision/topics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const topics = await storage.getRevisionTopics(userId);
      res.json(topics);
    } catch (error) {
      console.error("Error fetching revision topics:", error);
      res.status(500).json({ message: "Failed to fetch revision topics" });
    }
  });

  app.get('/api/revision/due', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const topics = await storage.getRevisionTopicsDue(userId, date);
      res.json(topics);
    } catch (error) {
      console.error("Error fetching due topics:", error);
      res.status(500).json({ message: "Failed to fetch due topics" });
    }
  });

  app.post('/api/revision/topics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRevisionTopicSchema.parse(req.body);
      const nextDate = spacedRepetitionService.calculateNextReview(new Date(), 1);
      const topic = await storage.createRevisionTopic({ 
        ...validatedData, 
        userId, 
        nextDate: nextDate.toISOString().split('T')[0] 
      });
      res.json(topic);
    } catch (error) {
      console.error("Error creating revision topic:", error);
      res.status(500).json({ message: "Failed to create revision topic" });
    }
  });

  app.post('/api/revision/topics/:id/review', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { quality, timeSpent } = req.body;
      
      const updates = spacedRepetitionService.updateTopic(quality, timeSpent);
      const topic = await storage.updateRevisionTopic(id, updates);
      
      await awardPoints(userId, 'revision_completed', 100, { topicId: id });
      
      res.json(topic);
    } catch (error) {
      console.error("Error reviewing topic:", error);
      res.status(500).json({ message: "Failed to review topic" });
    }
  });

  // Points and rewards
  app.get('/api/points/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 100;
      const events = await storage.getPointsEvents(userId, limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching points history:", error);
      res.status(500).json({ message: "Failed to fetch points history" });
    }
  });

  // Daily quote
  app.get('/api/quote/daily', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let quote = await storage.getDailyQuote(today);
      
      if (!quote) {
        const newQuote = await quoteService.fetchDailyQuote();
        quote = await storage.createDailyQuote({
          ...newQuote,
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
    const intensityMultiplier = { Low: 1, Medium: 1.5, High: 2 };
    const timeBonus = Math.floor(estimateMin / 30) * 10;
    return Math.floor(basePoints * intensityMultiplier[intensity as keyof typeof intensityMultiplier] + timeBonus);
  }

  async function awardPoints(userId: string, type: string, amount: number, meta: any = {}): Promise<void> {
    await storage.createPointsEvent({ userId, type, amount, meta });
    
    const user = await storage.getUser(userId);
    if (user) {
      const newPoints = user.points + amount;
      await storage.updateUserPoints(userId, newPoints);
      
      // Check for level up
      const newLevel = calculateLevel(newPoints);
      if (newLevel !== user.level) {
        await storage.updateUserLevel(userId, newLevel);
      }
    }
  }

  function calculateLevel(points: number): string {
    const levels = [
      { name: "Bronze", threshold: 100 },
      { name: "Silver", threshold: 250 },
      { name: "Gold", threshold: 500 },
      { name: "Platinum", threshold: 1500 },
      { name: "Diamond", threshold: 2500 },
      { name: "Obsidian", threshold: 3500 },
      { name: "Titanium", threshold: 4500 },
      { name: "Quantum", threshold: 5500 },
      { name: "Omega", threshold: 6500 },
      { name: "Energon", threshold: 7500 },
    ];
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].threshold) {
        return levels[i].name;
      }
    }
    return "Bronze";
  }

  const httpServer = createServer(app);
  return httpServer;
}
