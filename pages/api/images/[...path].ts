import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { path: imagePath } = req.query;

  try {
    if (!imagePath || Array.isArray(imagePath)) {
      throw new Error("Invalid image path");
    }

    const filePath = path.join(process.cwd(), "public", "uploads", imagePath);
    const imageBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
          ? "image/png"
          : "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(404).json({ message: "Image not found" });
  }
}
