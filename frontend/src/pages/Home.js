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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 p-6">
      {/* 🔍 Пошук і фільтр */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <div className="relative w-full sm:w-2/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
          <input
            type="text"
            placeholder="Знайти смачний рецепт..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-orange-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        <div className="relative w-fit">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none px-4 py-4 pr-10 rounded-full bg-white border border-orange-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          >
            <option value="date">Сортувати за датою</option>
            <option value="rating">Сортувати за рейтингом</option>
          </select>
          {/* Стрілочка */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 🧾 Список рецептів */}
      <div className="flex flex-wrap justify-center gap-8">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="relative">
            <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow">
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
