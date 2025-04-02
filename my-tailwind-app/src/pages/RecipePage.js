import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) => console.error("Error fetching recipe:", err));
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{recipe.name}</h1>
      <p className="mt-2">{recipe.description}</p>
    </div>
  );
};
export default RecipePage;
