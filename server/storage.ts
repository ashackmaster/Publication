import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

// Load environment variables explicitly
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export interface IStorage {
  getBooks(): Promise<schema.Book[]>;
  getBook(id: number): Promise<schema.Book | undefined>;
  createBook(book: schema.InsertBook): Promise<schema.Book>;
  updateBook(id: number, book: Partial<schema.InsertBook>): Promise<schema.Book>;
  deleteBook(id: number): Promise<void>;

  getPortfolio(): Promise<schema.Portfolio[]>;
  createPortfolio(item: schema.InsertPortfolio): Promise<schema.Portfolio>;
  updatePortfolio(id: number, item: Partial<schema.InsertPortfolio>): Promise<schema.Portfolio>;
  deletePortfolio(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getBooks(): Promise<schema.Book[]> {
    return await db.select().from(schema.books);
  }

  async getBook(id: number): Promise<schema.Book | undefined> {
    const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id));
    return book;
  }

  async createBook(insertBook: schema.InsertBook): Promise<schema.Book> {
    const [book] = await db.insert(schema.books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, book: Partial<schema.InsertBook>): Promise<schema.Book> {
    const [updated] = await db.update(schema.books).set(book).where(eq(schema.books.id, id)).returning();
    return updated;
  }

  async deleteBook(id: number): Promise<void> {
    await db.delete(schema.books).where(eq(schema.books.id, id));
  }

  async getPortfolio(): Promise<schema.Portfolio[]> {
    return await db.select().from(schema.portfolio);
  }

  async createPortfolio(item: schema.InsertPortfolio): Promise<schema.Portfolio> {
    const [newItem] = await db.insert(schema.portfolio).values(item).returning();
    return newItem;
  }

  async updatePortfolio(id: number, item: Partial<schema.InsertPortfolio>): Promise<schema.Portfolio> {
    const [updated] = await db.update(schema.portfolio).set(item).where(eq(schema.portfolio.id, id)).returning();
    return updated;
  }

  async deletePortfolio(id: number): Promise<void> {
    await db.delete(schema.portfolio).where(eq(schema.portfolio.id, id));
  }
}

export const storage = new DatabaseStorage();
