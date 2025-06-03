const Rating = require("../models/ratingModel");

exports.createRating = async (req, res) => {
  const { recipeId, rating } = req.body;

  try {
    let existing = await Rating.findOne({
      user: req.user.id,
      recipe: recipeId,
    });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json(existing);
    }

    const newRating = await Rating.create({
      user: req.user.id,
      recipe: recipeId,
      rating,
    });

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRatingsByRecipeId = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipe: req.params.recipeId }).populate(
      "user"
    );
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
