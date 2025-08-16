import multer from "multer";
import path from "path";

const storage = multer.memoryStorage(); // keep in memory for quick processing
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png"].includes(ext)) return cb(null, true);
    cb(new Error("Only images are allowed"));
  }
});

export default upload;