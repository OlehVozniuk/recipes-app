const mongoose = require("mongoose");
//TODO: Додати валідацію для поля `image` (URL зображення), sтворити схему для рецепту
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  image: { type: String, required: true }, // URL зображення
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
