const path = require("path");
const fs = require("fs");
const Recipe = require("../models/recipeModel");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

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

exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = await Recipe.create({
      ...req.body,
      user: req.user._id, // прив’язка до автора
    });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res
        .status(404)
        .json({ status: "fail", message: "Рецепт не знайдено" });
    }

    // ⛔ Перевірка прав (автор або адмін)
    if (
      !recipe.user ||
      (recipe.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({
        status: "fail",
        message: "У вас немає прав на редагування цього рецепту",
      });
    }

    // Якщо передали нову картинку — видаляємо стару
    if (req.body.image && req.body.image !== recipe.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(recipe.image)
      );

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(
            "Помилка при видаленні старого зображення:",
            err.message
          );
        } else {
          console.log("Старе зображення успішно видалено:", oldImagePath);
        }
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res
        .status(404)
        .json({ status: "fail", message: "Рецепт не знайдено" });
    }

    // ⛔ Перевірка прав (автор або адмін)
    if (
      !recipe.user ||
      (recipe.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({
        status: "fail",
        message: "У вас немає прав на видалення цього рецепту",
      });
    }

    await recipe.deleteOne();

    // Видалення картинки з сервера
    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(recipe.image)
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Помилка при видаленні зображення:", err.message);
      } else {
        console.log("Зображення успішно видалено:", imagePath);
      }
    });

    res.status(204).json(null);
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
