require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const recipeRouter = require("./routes/recipesRouter");
const userRouter = require("./routes/userRouter");
const uploadRouter = require("./routes/uploadRouter");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/recipes", recipeRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/users", userRouter);

app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Запускаємо сервер
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
