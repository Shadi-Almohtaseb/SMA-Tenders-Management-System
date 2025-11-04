import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../db";
import { attachments } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", authenticate, upload.single("file"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tenderId = parseInt(req.body.tenderId);
    if (!tenderId) {
      return res.status(400).json({ error: "Tender ID is required" });
    }

    const [attachment] = await db
      .insert(attachments)
      .values({
        tenderId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: req.userId,
      })
      .returning();

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

router.get("/tender/:tenderId", authenticate, async (req: AuthRequest, res) => {
  try {
    const tenderId = parseInt(req.params.tenderId);
    const files = await db.select().from(attachments).where(eq(attachments.tenderId, tenderId));
    res.json(files);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
});

router.get("/:id/download", authenticate, async (req: AuthRequest, res) => {
  try {
    const [attachment] = await db
      .select()
      .from(attachments)
      .where(eq(attachments.id, parseInt(req.params.id)))
      .limit(1);

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(attachment.filePath, attachment.fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const [attachment] = await db
      .select()
      .from(attachments)
      .where(eq(attachments.id, parseInt(req.params.id)))
      .limit(1);

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    if (fs.existsSync(attachment.filePath)) {
      fs.unlinkSync(attachment.filePath);
    }

    await db.delete(attachments).where(eq(attachments.id, parseInt(req.params.id)));

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export { router as attachmentsRouter };
