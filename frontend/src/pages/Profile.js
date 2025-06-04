import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import StarRating from "../components/StarRating";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!user) return;

    const fetchUserRecipes = async () => {
      try {
        setLoadingRecipes(true);
        // Запитуємо рецепти, створені поточним користувачем
        const res = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/api/recipes/mine`,
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

        // Запитуємо рейтинги для цих рецептів
        const ratingPromises = data.map((recipe) =>
          fetch(
            `${import.meta.env.REACT_APP_API_URL}/api/ratings/${recipe._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ).then((res) => res.json())
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
        console.error("Error fetching user's recipes or ratings:", err);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchUserRecipes();
  }, [user, token, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-600 text-lg">Завантаження профілю...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-8 drop-shadow-md">
          Профіль користувача
        </h2>

        <div className="flex items-center space-x-8 mb-8">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=F97316&color=fff&size=128`
            }
            alt="User avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-md"
            loading="lazy"
          />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h3>
            <p className="text-gray-500 text-lg">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Зареєстрований:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("uk-UA")
                : "Невідомо"}
            </p>
          </div>
        </div>

        {/* Секція з рецептами користувача */}
        <section>
          <h3 className="text-2xl font-semibold text-orange-600 mb-6">
            Мої рецепти
          </h3>

          {loadingRecipes ? (
            <p className="text-gray-600">Завантаження рецептів...</p>
          ) : recipes.length === 0 ? (
            <p className="text-gray-600">У вас поки немає рецептів.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="relative w-64">
                  <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow">
                    <StarRating
                      rating={ratings[recipe._id] || 0}
                      editable={false}
                    />
                  </div>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
