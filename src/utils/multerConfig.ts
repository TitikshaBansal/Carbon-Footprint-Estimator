import multer from "multer";
import path from "path";

const storage = multer.memoryStorage(); // keep in memory for quick processing
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (_req, file, cb) => {
    // Prefer MIME type, fall back to extension; Postman sets proper mime.
    const mimeOk = ["image/jpeg", "image/png"].includes(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    const extOk = [".jpg", ".jpeg", ".png"].includes(ext);
    if (mimeOk || extOk) return cb(null, true);
    cb(new Error("Only JPG/PNG images are allowed"));
  }
});

export default upload;