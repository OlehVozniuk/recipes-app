const express = require("express");
const mongoose = require("mongoose"); // Додай імпорт mongoose
const Recipe = require("../models/Recipe");
const router = express.Router();

// Отримати всі рецепти
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Отримати один рецепт за ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Перевіряємо, чи `id` є валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
