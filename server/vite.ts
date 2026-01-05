import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function log(message: string) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  console.log(`[${time}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteServer = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(viteServer.middlewares);
  app.use("/", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientIndex = path.resolve(__dirname, "..", "index.html");
      const template = fs.readFileSync(clientIndex, "utf-8");
      const html = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find build; have you run \`npm run build\`?`);
  }
  app.use(express.static(distPath));
  app.use("/", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
