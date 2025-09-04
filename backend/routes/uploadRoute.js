import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import authenticate from "../middleware/authentication.js";

const router = express.Router();

// Multer (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${uuidv4()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const result = await pool.query(
      "INSERT INTO images (filename, url) VALUES ($1, $2) RETURNING *",
      [fileName, fileUrl]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get Images
router.get("/images", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM images ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

export default router;
