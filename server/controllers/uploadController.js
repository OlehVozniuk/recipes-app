const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.uploadImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Завантаження на Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "recipe_steps", // можеш змінити назву папки
    });

    // Видаляємо файл після завантаження
    fs.unlinkSync(filePath);

    res
      .status(200)
      .json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Помилка при завантаженні зображення" });
  }
};
exports.deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  const parts = imageUrl.split("/");
  const fileNameWithExt = parts.pop();
  const folder = parts.slice(-1)[0]; // Наприклад, "recipe_steps"
  const publicId = `${folder}/${fileNameWithExt.split(".")[0]}`; // повний шлях
  await cloudinary.uploader.destroy(publicId);
};
