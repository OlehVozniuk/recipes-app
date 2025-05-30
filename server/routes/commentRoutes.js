const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

// Отримати всі коментарі до рецепта
router.get("/recipe/:recipeId", commentController.getCommentsByRecipe);

// Створити коментар (авторизований користувач)
router.post("/", authController.protect, commentController.createComment);

router.delete("/:id", authController.protect, commentController.deleteComment);

router.patch("/:id", authController.protect, commentController.updateComment);

module.exports = router;
