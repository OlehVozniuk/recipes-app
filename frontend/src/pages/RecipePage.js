import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipeAndComments = async () => {
      try {
        const [recipeRes, commentsRes] = await Promise.all([
          fetch(`http://localhost:5001/api/recipes/${id}`),
          fetch(`http://localhost:5001/api/comments/recipe/${id}`),
        ]);
        const recipeData = await recipeRes.json();
        const commentsData = await commentsRes.json();

        setRecipe(recipeData);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchRecipeAndComments();
  }, [id]);

  const handleDeleteRecipe = async () => {
    if (!window.confirm("Ви точно хочете видалити цей рецепт?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const res = await fetch("http://localhost:5001/api/comments", {
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
        `http://localhost:5001/api/comments/${commentId}`,
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
        `http://localhost:5001/api/comments/${commentId}`,
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

  if (!recipe) return <p>Завантаження...</p>;

  const isOwnerOrAdmin =
    user && (user._id === recipe.user || user.role === "admin");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        {isOwnerOrAdmin && (
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Редагувати
            </button>
            <button
              onClick={handleDeleteRecipe}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Видалити
            </button>
          </div>
        )}
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

      <h2 className="text-lg font-semibold mt-8">Коментарі:</h2>
      <ul className="space-y-2 mt-2">
        {comments.map((comment) => {
          const canEdit =
            user && (user._id === comment.user?._id || user.role === "admin");
          const isEditing = editingCommentId === comment._id;

          return (
            <li key={comment._id} className="bg-gray-100 p-3 rounded relative">
              <p className="text-sm text-gray-600 mb-1">
                {comment.user?.name || "Користувач"}
              </p>

              {isEditing ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="text-white bg-blue-500 px-3 py-1 rounded"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Зберегти
                    </button>
                    <button
                      className="text-gray-600 bg-gray-200 px-3 py-1 rounded"
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
                <p>{comment.text}</p>
              )}

              {canEdit && !isEditing && (
                <div className="flex gap-2 mt-2 text-sm">
                  <button
                    className="text-blue-500"
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditedText(comment.text);
                    }}
                  >
                    Редагувати
                  </button>
                  <button
                    className="text-red-500"
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
          className="mt-6 flex flex-col gap-2"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border p-2 rounded"
            placeholder="Залишити коментар..."
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Надіслати
          </button>
        </form>
      )}
    </div>
  );
};

export default RecipePage;
