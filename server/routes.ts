import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertPortfolioSchema } from "../shared/schema";
import multer from "multer";
import path from "path";
import express from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/books", async (_req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.post("/api/books", async (req, res) => {
    const parsed = insertBookSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const book = await storage.createBook(parsed.data);
    res.json(book);
  });

  app.patch("/api/books/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await storage.updateBook(id, req.body);
    res.json(book);
  });

  app.delete("/api/books/:id", async (req, res) => {
    await storage.deleteBook(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.get("/api/portfolio", async (_req, res) => {
    const items = await storage.getPortfolio();
    res.json(items);
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      console.log("Portfolio POST request body:", req.body);
      const parsed = insertPortfolioSchema.safeParse(req.body);
      if (!parsed.success) {
        console.error("Portfolio validation error:", parsed.error);
        return res.status(400).json(parsed.error);
      }
      const item = await storage.createPortfolio(parsed.data);
      console.log("Portfolio item created:", item);
      res.json(item);
    } catch (error) {
      console.error("Portfolio creation failed:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    await storage.deletePortfolio(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");
    
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const response = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      res.json({ url: response.secure_url });
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
