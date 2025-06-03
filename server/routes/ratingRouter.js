const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  createRating,
  getRatingsByRecipeId,
} = require("../controllers/ratingController");

router.post("/", authController.protect, createRating);
router.get("/:recipeId", getRatingsByRecipeId);

module.exports = router;
