const path = require("path");
const Recipe = require("../models/recipeModel");
const { deleteImage } = require("./uploadController");
const Rating = require("../models/ratingModel");

exports.getAllRecipes = async (req, res) => {
  try {
    const { search, sortBy } = req.query;

    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    let recipes = await Recipe.find(filter);

    if (sortBy === "date") {
      recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "rating") {
      const ratings = await Rating.aggregate([
        {
          $group: {
            _id: "$recipe",
            avgRating: { $avg: "$rating" },
          },
        },
      ]);

      const ratingMap = {};
      ratings.forEach((r) => {
        ratingMap[r._id.toString()] = r.avgRating;
      });

      recipes.sort((a, b) => {
        const rA = ratingMap[a._id.toString()] || 0;
        const rB = ratingMap[b._id.toString()] || 0;
        return rB - rA;
      });
    }

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Помилка при отриманні рецептів:", err);
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
      user: req.user._id,
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

    if (req.body.image && req.body.image !== recipe.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(recipe.image)
      );

      if (req.body.image && req.body.image !== recipe.image) {
        try {
          await deleteImage(recipe.image);
        } catch (err) {
          console.error(
            "Помилка при видаленні старого зображення:",
            err.message
          );
        }
      }
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

    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(recipe.image)
    );

    try {
      await deleteImage(recipe.image);
    } catch (err) {
      console.error(
        "Помилка при видаленні зображення з Cloudinary:",
        err.message
      );
    }

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
