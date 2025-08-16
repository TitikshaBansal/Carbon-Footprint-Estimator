import express from "express";
import upload from "../utils/multerConfig";
import { estimateFromDish, estimateFromImage } from "../controllers/estimateController";

const router = express.Router();

router.post("/estimate", express.json(), estimateFromDish);
router.post("/estimate/image", upload.single("image"), estimateFromImage);

export default router;