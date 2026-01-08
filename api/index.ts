import { storage } from "../server/storage";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ status: "ok", message: "Udvasito Pathshala API is running" });
}
