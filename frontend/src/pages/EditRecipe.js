import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Додаємо

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // 🔑 Отримуємо токен

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Fetch з авторизацією
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Помилка при отриманні рецепта");
        }

        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    if (token) {
      fetchRecipe();
    }
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = recipe.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadRes = await axios.post(
          "http://localhost:5001/api/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ⬅ тут токен!
            },
          }
        );
        imageUrl = uploadRes.data.url;
      }

      const res = await fetch(`http://localhost:5001/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅ тут токен!
        },
        body: JSON.stringify({ ...recipe, image: imageUrl }),
      });

      if (res.ok) {
        alert("Рецепт оновлено!");
        navigate(`/recipes/${id}`);
      } else {
        const data = await res.json();
        throw new Error(data.message || "Помилка при оновленні");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Помилка при оновленні рецепта");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Редагувати рецепт</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          placeholder="Назва"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          placeholder="Опис"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients.join(", ")}
          onChange={(e) =>
            setRecipe((prev) => ({
              ...prev,
              ingredients: e.target.value.split(",").map((i) => i.trim()),
            }))
          }
          placeholder="Інгредієнти (через кому)"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Інструкції"
          className="w-full p-2 border rounded"
        />

        {recipe.image ? (
          <div>
            <p className="font-semibold">Поточне зображення:</p>
            <img
              src={recipe.image}
              alt="recipe"
              className="w-48 rounded my-2"
            />
          </div>
        ) : (
          <p className="text-gray-500 italic">Зображення не додано</p>
        )}

        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="w-full"
          accept="image/*"
        />

        {previewImage && (
          <div>
            <p className="font-semibold">Нове зображення:</p>
            <img
              src={previewImage}
              alt="new preview"
              className="w-48 rounded my-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Зберегти зміни
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
