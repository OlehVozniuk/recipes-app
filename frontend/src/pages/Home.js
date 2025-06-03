import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import StarRating from "../components/StarRating";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (sortBy) queryParams.append("sortBy", sortBy);

        const res = await fetch(
          `http://localhost:5001/api/recipes?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setRecipes(data);

        // Середні рейтинги
        const ratingPromises = data.map((recipe) =>
          fetch(`http://localhost:5001/api/ratings/${recipe._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json())
        );

        const ratingsData = await Promise.all(ratingPromises);
        const ratingsMap = {};
        data.forEach((recipe, index) => {
          const rData = ratingsData[index];
          if (Array.isArray(rData) && rData.length > 0) {
            const average =
              rData.reduce((sum, r) => sum + r.rating, 0) / rData.length;
            ratingsMap[recipe._id] = average;
          } else {
            ratingsMap[recipe._id] = 0;
          }
        });

        setRatings(ratingsMap);
      } catch (err) {
        console.error("Error fetching recipes or ratings:", err);
      }
    };

    fetchRecipes();
  }, [token, navigate, searchQuery, sortBy]);

  return (
    <div className="p-6">
      {/* 🔍 Пошук і фільтр */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Пошук рецептів..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="date">Сортувати за датою</option>
          <option value="rating">Сортувати за рейтингом</option>
        </select>
      </div>

      {/* 🧾 Список рецептів */}
      <div className="flex flex-wrap justify-center gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="relative">
            <div className="absolute top-4 right-3 z-10 bg-white/70 rounded-full px-2 py-1">
              <StarRating rating={ratings[recipe._id] || 0} editable={false} />
            </div>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
