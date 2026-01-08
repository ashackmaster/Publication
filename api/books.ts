import { storage } from "../server/storage";
import { insertBookSchema } from "../shared/schema";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    if (method === "GET") {
      const books = await storage.getBooks();
      return res.status(200).json(books);
    }

    if (method === "POST") {
      const parsed = insertBookSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const book = await storage.createBook(parsed.data);
      return res.status(200).json(book);
    }

    if (method === "PATCH") {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const book = await storage.updateBook(id, req.body);
      if (!book) return res.status(404).json({ message: "Book not found" });
      return res.status(200).json(book);
    }

    if (method === "DELETE") {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteBook(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
