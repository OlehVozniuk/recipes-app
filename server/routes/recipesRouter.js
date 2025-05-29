const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");

// Усі рецепти (тільки авторизовані бачать список)
router
  .route("/")
  .get(authController.protect, recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

// Всі рецепти, створені поточним користувачем
router.get(
  "/mine",
  authController.protect,
  recipeController.getMyRecipes // ❗ Не забудь додати цю функцію в контролер
);

// Окремий рецепт
router
  .route("/:id")
  .get(recipeController.getRecipe)
  .put(authController.protect, recipeController.updateRecipe)
  .patch(authController.protect, recipeController.updateRecipe)
  .delete(authController.protect, recipeController.deleteRecipe); // ❗ не обмежуємо тільки admin

module.exports = router;
