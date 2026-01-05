import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  isbn: text("isbn"),
  pages: integer("pages"),
  publishedYear: integer("published_year"),
  inStock: boolean("in_stock").default(true),
});

export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  year: integer("year"),
});

export const insertBookSchema = createInsertSchema(books);
export const insertPortfolioSchema = createInsertSchema(portfolio);

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
