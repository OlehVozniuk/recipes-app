import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, commentsRes, ratingsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/comments/recipe/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/ratings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const recipeData = await recipeRes.json();
        const commentsData = await commentsRes.json();
        const ratingsData = await ratingsRes.json();

        setRecipe(recipeData);
        setComments(commentsData);
        setRatings(ratingsData);

        if (user) {
          const existing = ratingsData.find((r) => r.user === user._id);
          setUserRating(existing?.rating || null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id, token, user]);

  const handleRate = async (rating) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId: id, rating }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      const updated = await res.json();
      const newRatings = ratings.filter((r) => r.user !== user._id);
      setRatings([...newRatings, updated]);
      setUserRating(rating);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm("Ви точно хочете видалити цей рецепт?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recipes/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 403) {
        alert("У вас немає прав для видалення цього рецепта!");
        return;
      }

      if (res.ok) {
        alert("Рецепт видалено успішно!");
        navigate("/");
      } else {
        throw new Error((await res.json()).message || "Помилка при видаленні");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment, recipeId: id }),
      });

      if (!res.ok) throw new Error("Помилка при надсиланні коментаря");

      const comment = await res.json();
      setComments((prev) => [
        ...prev,
        { ...comment, user: { name: user.name, _id: user._id } },
      ]);
      setNewComment("");
    } catch (err) {
      alert("Не вдалося залишити коментар");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Ви дійсно хочете видалити цей коментар?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Помилка при видаленні коментаря");

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedText.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editedText }),
        }
      );

      if (!res.ok) throw new Error("Помилка при оновленні коментаря");

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, text: editedText } : comment
        )
      );
      setEditingCommentId(null);
      setEditedText("");
    } catch (err) {
      alert("Не вдалося оновити коментар");
    }
  };

  if (!recipe)
    return <p className="text-center mt-8 text-gray-500">Завантаження...</p>;

  const isOwnerOrAdmin =
    user && (user._id === recipe.user || user.role === "admin");

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-orange-700">{recipe.name}</h1>
          {isOwnerOrAdmin && (
            <div className="space-x-3">
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition"
              >
                Редагувати
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
              >
                Видалити
              </button>
            </div>
          )}
        </div>

        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-[450px] object-cover rounded-xl shadow mb-8"
        />

        <p className="text-lg text-gray-800 leading-relaxed mb-6">
          {recipe.description}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">
            Рейтинг
          </h2>
          <StarRating rating={averageRating} editable={false} />
          <p className="text-sm text-gray-600 mt-1">
            на основі {ratings.length} оцінок
          </p>
          {user && user._id !== recipe.user && (
            <div className="mt-3">
              <p className="text-sm font-semibold mb-1">Ваша оцінка:</p>
              <StarRating
                rating={userRating || 0}
                editable={true}
                onRate={handleRate}
              />
            </div>
          )}
        </section>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-3">
              Інгредієнти
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-orange-600 mb-3">
              Інструкції
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {recipe.instructions}
            </p>
          </section>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Коментарі
          </h2>
          <ul className="space-y-3">
            {comments.map((comment) => {
              const canEdit =
                user &&
                (user._id === comment.user?._id || user.role === "admin");
              const isEditing = editingCommentId === comment._id;

              return (
                <li
                  key={comment._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {comment.user?.name || "Користувач"}
                  </p>

                  {isEditing ? (
                    <>
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        rows={2}
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                          onClick={() => handleEditComment(comment._id)}
                        >
                          Зберегти
                        </button>
                        <button
                          className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400 transition"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditedText("");
                          }}
                        >
                          Скасувати
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-800">{comment.text}</p>
                  )}

                  {canEdit && !isEditing && (
                    <div className="flex gap-4 mt-3 text-sm absolute right-4 bottom-4">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedText(comment.text);
                        }}
                      >
                        Редагувати
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {user && (
            <form
              onSubmit={handleCommentSubmit}
              className="mt-6 flex flex-col gap-3"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Залишити коментар..."
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="self-end bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition"
              >
                Надіслати
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecipePage;
