// routes/uploadRouter.js
const express = require("express");
const multer = require("multer");

const router = express.Router();

// Налаштування зберігання
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка для зберігання файлів
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Унікальне ім'я файлу
  },
});

const upload = multer({ storage });

// Завантаження зображення
router.post("/", upload.single("image"), (req, res) => {
  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
