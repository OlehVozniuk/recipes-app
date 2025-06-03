const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router.get("/mine", authController.protect, recipeController.getMyRecipes);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .put(authController.protect, recipeController.updateRecipe)
  .patch(authController.protect, recipeController.updateRecipe)
  .delete(authController.protect, recipeController.deleteRecipe);

module.exports = router;
