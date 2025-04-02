//TODO: controller for recipe, GET, POST, PUT, DELETE
const Recipe = require("../models/recipeModel");

// Отримати всі рецепти
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes); // Повертаємо масив рецептів
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Отримати один рецепт за ID
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ status: "fail", message: "Рецепт не знайдено" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Створити новий рецепт
exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Оновити рецепт
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res
        .status(404)
        .json({ status: "fail", message: "Рецепт не знайдено" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Видалити рецепт
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ status: "fail", message: "Рецепт не знайдено" });
    }
    res.status(204).json(null);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
