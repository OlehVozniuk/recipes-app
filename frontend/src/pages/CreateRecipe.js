import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ⬅ Додаємо

const CreateRecipe = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // ⬅ Отримуємо токен

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

    setLoading(true);
    try {
      const imageData = new FormData();
      imageData.append("image", form.image);

      const uploadRes = await axios.post(
        "http://localhost:5001/api/upload",
        imageData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ⬅ Авторизація
          },
        }
      );

      const imageUrl = uploadRes.data.imageUrl;

      await axios.post(
        "http://localhost:5001/api/recipes",
        {
          ...form,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ⬅ Авторизація
          },
        }
      );

      navigate("/");
    } catch (err) {
      console.error("Помилка при створенні рецепту", err);
      alert("Сталася помилка при створенні рецепту. Спробуйте ще раз!");
    } finally {
      setLoading(false);
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
          value={form.ingredients.join(", ")}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              ingredients: e.target.value.split(",").map((i) => i.trim()),
            }))
          }
          placeholder="Інгредієнти (через кому)"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
          disabled={loading}
        >
          {loading ? "Завантаження..." : "Зберегти"}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
