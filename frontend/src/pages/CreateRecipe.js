import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateRecipe = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Будь ласка, додайте зображення!");
      return;
    }

    setLoading(true);
    try {
      const imageData = new FormData();
      imageData.append("image", form.image);

      const uploadRes = await axios.post(
        "http://localhost:5001/api/upload",
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageUrl = uploadRes.data.url;
      if (!imageUrl) throw new Error("Не вдалося отримати URL зображення");

      await axios.post(
        "http://localhost:5001/api/recipes",
        { ...form, image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
      console.error("Помилка при створенні рецепту", err);
      alert("Сталася помилка. Спробуйте ще раз!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Створити новий рецепт
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            onChange={handleChange}
            value={form.name}
            placeholder="Назва рецепту"
            className="w-full border border-orange-300 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            required
          />

          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            placeholder="Короткий опис"
            className="w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            rows="3"
          />

          <textarea
            name="ingredients"
            value={form.ingredients.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                ingredients: e.target.value.split(",").map((i) => i.trim()),
              }))
            }
            placeholder="Інгредієнти (через кому)"
            className="w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            rows="3"
          />

          <textarea
            name="instructions"
            onChange={handleChange}
            value={form.instructions}
            placeholder="Покрокова інструкція"
            className="w-full border border-orange-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            rows="5"
          />

          <div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-full h-64 object-cover rounded-xl shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white text-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-orange-300 cursor-wait animate-pulse"
                : "bg-orange-500 hover:bg-orange-600 shadow-md"
            }`}
            disabled={loading}
          >
            {loading ? "Завантаження..." : "Зберегти рецепт"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
