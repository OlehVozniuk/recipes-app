const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    image: { type: String, required: true }, // URL зображення
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
); // Прибирає __v

module.exports = mongoose.model("Recipe", RecipeSchema);
