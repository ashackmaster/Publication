import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertPortfolioSchema } from "../shared/schema";
import multer from "multer";
import path from "path";
import express from "express";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/books", async (_req, res) => {
    try {
      const books = await storage.getBooks();
      res.json(books);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const parsed = insertBookSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const book = await storage.createBook(parsed.data);
      res.json(book);
    } catch (error) {
      console.error("Failed to create book:", error);
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  app.patch("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const book = await storage.updateBook(id, req.body);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (error) {
      console.error("Failed to update book:", error);
      res.status(500).json({ message: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteBook(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Failed to delete book:", error);
      res.status(500).json({ message: "Failed to delete book" });
    }
  });

  app.get("/api/portfolio", async (_req, res) => {
    try {
      const items = await storage.getPortfolio();
      res.json(items);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const parsed = insertPortfolioSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json(parsed.error);
      }
      const item = await storage.createPortfolio(parsed.data);
      res.json(item);
    } catch (error) {
      console.error("Portfolio creation failed:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deletePortfolio(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "udvasito_pathshala",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      const response = await uploadPromise as any;
      res.json({ url: response.secure_url });
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ 
        message: "Upload failed", 
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
