import React, { useState } from "react";
import axios from "axios";

const ImageUploader = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = res.data.url;
      onUpload(imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="w-32" />}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Завантажити
      </button>
    </div>
  );
};

export default ImageUploader;
