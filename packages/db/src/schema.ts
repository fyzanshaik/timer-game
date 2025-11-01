import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  scores: many(scores),
}));

export const scores = sqliteTable("scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  timer1Score: integer("timer1_score").notNull().default(0),
  timer5Score: integer("timer5_score").notNull().default(0),
  timer10Score: integer("timer10_score").notNull().default(0),
  timer15Score: integer("timer15_score").notNull().default(0),
  timer30Score: integer("timer30_score").notNull().default(0),
});

export const scoresRelations = relations(scores, ({ one }) => ({
  user: one(users, {
    fields: [scores.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Score = typeof scores.$inferSelect;
export type NewScore = typeof scores.$inferInsert;
