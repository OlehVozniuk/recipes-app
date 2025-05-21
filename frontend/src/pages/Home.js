import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // слухаємо токен

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipes();
  }, [token, navigate]); // 👈 важливо слухати token!

  return (
    <div className="p-6 flex flex-wrap justify-center">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default Home;
