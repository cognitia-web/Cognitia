import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  date,
  real,
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  streak: integer("streak").default(0),
  level: varchar("level").default("Bronze"),
  points: integer("points").default(0),
  modelDefaults: jsonb("model_defaults").$type<{
    flashcards?: string;
    qa?: string;
  }>().default({}),
  settings: jsonb("settings").$type<{
    theme?: string;
    notifications?: boolean;
    reducedMotion?: boolean;
  }>().default({}),
  lastActiveDate: date("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  subject: varchar("subject").notNull(),
  intensity: varchar("intensity").notNull(), // Low, Medium, High
  estimateMin: integer("estimate_min").notNull(),
  date: date("date").notNull(),
  status: varchar("status").default("pending"), // pending, in_progress, completed
  completedAt: timestamp("completed_at"),
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decks = pgTable("decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  source: text("source"), // text, pdf, url
  sourceContent: text("source_content"),
  stats: jsonb("stats").$type<{
    totalCards?: number;
    masteredCards?: number;
    averageAccuracy?: number;
    lastStudied?: string;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deckId: varchar("deck_id").notNull().references(() => decks.id, { onDelete: 'cascade' }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  nextReview: date("next_review"),
  intervalDays: integer("interval_days").default(1),
  ease: real("ease").default(2.5),
  reviewCount: integer("review_count").default(0),
  correctCount: integer("correct_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qaHistory = pgTable("qa_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text("prompt").notNull(),
  mode: varchar("mode").notNull(), // concise, eli15, exam_style
  model: varchar("model").notNull(),
  answer: text("answer").notNull(),
  outline: text("outline"),
  sources: text("sources").array(),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const revisionTopics = pgTable("revision_topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  subject: varchar("subject").notNull(),
  nextDate: date("next_date").notNull(),
  intervalDays: integer("interval_days").default(1),
  ease: real("ease").default(2.5),
  reviewHistory: jsonb("review_history").$type<Array<{
    date: string;
    quality: number; // 1-4 (again, hard, good, easy)
    timeSpent: number;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pointsEvents = pgTable("points_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type").notNull(), // task_completed, streak_bonus, deck_mastered, revision_completed
  amount: integer("amount").notNull(),
  meta: jsonb("meta").$type<{
    taskId?: string;
    deckId?: string;
    topicId?: string;
    streakDay?: number;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyQuotes = pgTable("daily_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  author: varchar("author").notNull(),
  sourceUrl: varchar("source_url"),
  dayKey: varchar("day_key").notNull().unique(), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  decks: many(decks),
  qaHistory: many(qaHistory),
  revisionTopics: many(revisionTopics),
  pointsEvents: many(pointsEvents),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
  flashcards: many(flashcards),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  deck: one(decks, {
    fields: [flashcards.deckId],
    references: [decks.id],
  }),
}));

export const qaHistoryRelations = relations(qaHistory, ({ one }) => ({
  user: one(users, {
    fields: [qaHistory.userId],
    references: [users.id],
  }),
}));

export const revisionTopicsRelations = relations(revisionTopics, ({ one }) => ({
  user: one(users, {
    fields: [revisionTopics.userId],
    references: [users.id],
  }),
}));

export const pointsEventsRelations = relations(pointsEvents, ({ one }) => ({
  user: one(users, {
    fields: [pointsEvents.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  userId: true,
  completedAt: true,
  pointsAwarded: true,
  createdAt: true,
});

export const insertDeckSchema = createInsertSchema(decks).omit({
  id: true,
  userId: true,
  stats: true,
  createdAt: true,
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
  nextReview: true,
  intervalDays: true,
  ease: true,
  reviewCount: true,
  correctCount: true,
  createdAt: true,
});

export const insertQaSchema = createInsertSchema(qaHistory).omit({
  id: true,
  userId: true,
  savedAt: true,
});

export const insertRevisionTopicSchema = createInsertSchema(revisionTopics).omit({
  id: true,
  userId: true,
  nextDate: true,
  intervalDays: true,
  ease: true,
  reviewHistory: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Deck = typeof decks.$inferSelect;
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type QaHistory = typeof qaHistory.$inferSelect;
export type InsertQa = z.infer<typeof insertQaSchema>;
export type RevisionTopic = typeof revisionTopics.$inferSelect;
export type InsertRevisionTopic = z.infer<typeof insertRevisionTopicSchema>;
export type PointsEvent = typeof pointsEvents.$inferSelect;
export type DailyQuote = typeof dailyQuotes.$inferSelect;
