import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    image: null,
  });
  const [loading, setLoading] = useState(false); // Статус завантаження
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Будь ласка, додайте зображення!");
      return;
    }

    setLoading(true); // Включаємо статус завантаження
    try {
      // 🔼 Крок 1: Завантажити зображення
      const imageData = new FormData();
      imageData.append("image", form.image);
      const uploadRes = await axios.post(
        "http://localhost:5001/api/upload",
        imageData
      );
      const imageUrl = uploadRes.data.imageUrl;

      // 🔼 Крок 2: Створити рецепт
      await axios.post("http://localhost:5001/api/recipes", {
        ...form,
        image: imageUrl,
      });

      // Повертаємось на головну після успішного створення
      navigate("/");
    } catch (err) {
      console.error("Помилка при створенні рецепту", err);
      alert("Сталася помилка при створенні рецепту. Спробуйте ще раз!");
    } finally {
      setLoading(false); // Вимикаємо статус завантаження
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Створити новий рецепт</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          placeholder="Назва"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description}
          placeholder="Опис"
          className="w-full border p-2"
        />
        <textarea
          name="ingredients"
          onChange={handleChange}
          value={form.ingredients}
          placeholder="Інгредієнти"
          className="w-full border p-2"
        />
        <textarea
          name="instructions"
          onChange={handleChange}
          value={form.instructions}
          placeholder="Інструкція"
          className="w-full border p-2"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full"
          accept="image/*"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading} // Вимкнути кнопку під час завантаження
        >
          {loading ? "Завантаження..." : "Зберегти"}{" "}
          {/* Покажемо статус завантаження */}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
