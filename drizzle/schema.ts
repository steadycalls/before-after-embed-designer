import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Embeds table storing before/after embed configurations
 */
export const embeds = mysqlTable("embeds", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  beforeImageUrl: text("beforeImageUrl").notNull(),
  beforeImageKey: varchar("beforeImageKey", { length: 512 }).notNull(),
  afterImageUrl: text("afterImageUrl").notNull(),
  afterImageKey: varchar("afterImageKey", { length: 512 }).notNull(),
  websiteUrl: text("websiteUrl"),
  colors: json("colors").$type<string[]>().notNull(),
  fonts: json("fonts").$type<string[]>().notNull(),
  toggleStyle: varchar("toggleStyle", { length: 50 }).default("switch").notNull(),
  width: int("width").default(600).notNull(),
  height: int("height").default(400).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Embed = typeof embeds.$inferSelect;
export type InsertEmbed = typeof embeds.$inferInsert;

