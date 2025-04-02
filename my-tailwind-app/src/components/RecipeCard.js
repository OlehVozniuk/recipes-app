import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64 m-4">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{recipe.name}</h2>
        <Link to={`/recipes/${recipe._id}`}>Переглянути рецепт</Link>
      </div>
    </div>
  );
};
export default RecipeCard;
