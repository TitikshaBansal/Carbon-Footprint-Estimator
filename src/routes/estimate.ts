import express from "express";
import upload from "../utils/multerConfig";
import { estimateFromDish, estimateFromImage } from "../controllers/estimateController";

const router = express.Router();

// Accept JSON or x-www-form-urlencoded for convenience in Postman
router.post("/estimate", estimateFromDish);

// Accept file under key "image" or "file"
router.post("/estimate/image", (req, res, next) => {
  const handler = upload.single("image");
  handler(req as any, res as any, (err) => {
    if (err) return next(err);
    if (!req.file) {
      const fallback = upload.single("file");
      return fallback(req as any, res as any, next);
    }
    next();
  });
}, estimateFromImage);

export default router;