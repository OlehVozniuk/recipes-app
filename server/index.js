require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const recipeRoutes = require("./routes/recipesRouter");

// ✅ CORS (ДОБАВЛЯЄМО ПЕРШИМИ!)
app.use(
  cors({
    origin: "http://localhost:3000", // Дозволяємо React підключатись
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Додаємо ще заголовки (запасний варіант)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Парсимо JSON (ОБОВ'ЯЗКОВО)
app.use(express.json());

// ✅ Підключаємо маршрути
app.use("/api/recipes", recipeRoutes);

// ✅ Підключаємо MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Запускаємо сервер
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
