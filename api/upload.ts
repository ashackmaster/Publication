import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to run middleware
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await runMiddleware(req, res, upload.single("file"));
    const file = (req as any).file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;

    const response = await cloudinary.uploader.upload(dataURI, {
      folder: "udvasito_pathshala",
      resource_type: "auto",
    });

    return res.status(200).json({ url: response.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
}
