import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log("user:", user);

  // Показати завантаження, якщо user ще не готовий
  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Завантаження профілю...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Профіль користувача</h2>

      <div className="flex items-center space-x-6 mb-6">
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
          }
          alt="User avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400">
            Зареєстрований:{" "}
            {new Date(user.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>

      {/* Тут згодом: популярні рецепти, відгуки тощо */}
    </div>
  );
};

export default Profile;
