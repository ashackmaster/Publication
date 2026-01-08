import { storage } from "../server/storage";
import { insertPortfolioSchema } from "../shared/schema";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    if (method === "GET") {
      const items = await storage.getPortfolio();
      return res.status(200).json(items);
    }

    if (method === "POST") {
      const parsed = insertPortfolioSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const item = await storage.createPortfolio(parsed.data);
      return res.status(200).json(item);
    }

    if (method === "DELETE") {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deletePortfolio(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
