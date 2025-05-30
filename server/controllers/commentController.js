const Comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  try {
    const { text, recipeId } = req.body;

    const comment = await Comment.create({
      text,
      recipe: recipeId,
      user: req.user._id,
    });

    await comment.populate("user", "name");

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Не вдалося створити коментар" });
  }
};

exports.getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate("user", "name")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Не вдалося отримати коментарі" });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ status: "fail", message: "Коментар не знайдено" });
    }

    // Перевірка: або автор коментаря, або адмін
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Ви не маєте прав на видалення цього коментаря",
      });
    }

    await comment.deleteOne();

    res.status(204).json(null);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Коментар не знайдено" });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Ви не маєте прав на редагування цього коментаря",
      });
    }

    comment.text = text;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Помилка при редагуванні коментаря" });
  }
};
