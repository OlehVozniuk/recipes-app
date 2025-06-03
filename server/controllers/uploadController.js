const cloudinary = require("../utils/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      console.log("Файл не передано");
      return res.status(400).json({ message: "Файл не передано" });
    }

    const file = req.file;

    console.log("Файл прийнято:", file.originalname);

    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "recipe_steps",
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Помилка при завантаженні зображення" });
  }
};
