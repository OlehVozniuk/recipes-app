const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .put(authController.protect, recipeController.updateRecipe)
  .patch(authController.protect, recipeController.updateRecipe)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    recipeController.deleteRecipe
  );

// router.get("/", recipeController.getAllRecipes);
// router.get("/:id", recipeController.getRecipe);
// router.post("/", recipeController.createRecipe);
// router.put("/:id", recipeController.updateRecipe);
// router.patch("/:id", recipeController.updateRecipe);
// router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
