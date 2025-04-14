import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) => console.error("Error fetching recipe:", err));
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Ви точно хочете видалити цей рецепт?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5001/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Рецепт видалено успішно!");
        navigate("/");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Помилка при видаленні рецепта");
      }
    } catch (err) {
      console.error("Помилка:", err);
      alert("Помилка при видаленні рецепта");
    }
  };

  if (!recipe) return <p>Завантаження...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Редагувати
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Видалити
          </button>
        </div>
      </div>

      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-64 object-cover rounded-lg"
      />
      <p className="mt-4">{recipe.description}</p>

      <h2 className="text-lg font-semibold mt-6">Інгредієнти:</h2>
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mt-6">Інструкції:</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipePage;
