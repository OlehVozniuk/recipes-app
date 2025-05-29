const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A recipe must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A recipe name must have less or equal then 30 characters",
      ],
      minlength: [5, "A recipe name must have more or equal then 5 characters"],
    },
    description: {
      type: String,
      required: [true, "A recipe must have a description"],
    },
    ingredients: {
      type: [String],
      required: [true, "A recipe must have ingredients"],
      minlength: [1, "A recipe must have more or equal than 1 ingredient"],
    },

    instructions: {
      type: String,
      required: [true, "A recipe must have instructions"],
    },
    image: { type: String, required: [true, "A recipe must have an image"] }, // URL зображення
    createdAt: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { versionKey: false }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
