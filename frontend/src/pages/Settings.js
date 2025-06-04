import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaTrashAlt } from "react-icons/fa";

const Settings = () => {
  const { user, token, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/api/users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Не вдалося оновити профіль");
      }

      setUser(data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setProfileMessage("Профіль успішно оновлено ✅");
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (password !== passwordConfirm) {
      setPasswordError("Новий пароль не співпадає з підтвердженням.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/api/users/updateMyPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            passwordCurrent,
            password,
            passwordConfirm,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Щось пішло не так при оновленні паролю"
        );
      }

      setPasswordMessage("Пароль успішно оновлено ✅");
      setPasswordCurrent("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити свій акаунт? Цю дію неможливо скасувати."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/api/users/deleteMe`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Не вдалося видалити акаунт");
      }

      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Налаштування профілю
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Ім’я
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-orange-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-orange-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition"
          >
            Оновити профіль
          </button>

          {profileMessage && (
            <p className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
              {profileMessage}
            </p>
          )}
          {profileError && (
            <p className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
              {profileError}
            </p>
          )}
        </form>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">
          Змінити пароль
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Поточний пароль
            </label>
            <input
              type="password"
              value={passwordCurrent}
              onChange={(e) => setPasswordCurrent(e.target.value)}
              className="w-full border border-orange-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Новий пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-orange-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Підтвердження нового паролю
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full border border-orange-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition"
          >
            Зберегти новий пароль
          </button>

          {passwordMessage && (
            <p className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
              {passwordMessage}
            </p>
          )}
          {passwordError && (
            <p className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
              {passwordError}
            </p>
          )}
        </form>

        <hr className="my-10 border-orange-200" />

        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Видалити акаунт
          </h3>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl font-semibold transition"
          >
            <FaTrashAlt /> Видалити акаунт
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
