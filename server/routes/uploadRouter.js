const multer = require("multer");
const express = require("express");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
