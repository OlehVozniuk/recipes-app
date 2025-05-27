import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

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
      const res = await fetch("http://localhost:5001/api/users/updateMe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

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
        "http://localhost:5001/api/users/updateMyPassword",
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
      const res = await fetch("http://localhost:5001/api/users/deleteMe", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Налаштування профілю</h2>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Ім’я</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Оновити профіль
        </button>

        {profileMessage && <p className="text-green-600">{profileMessage}</p>}
        {profileError && <p className="text-red-600">{profileError}</p>}
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-4">Змінити пароль</h3>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Поточний пароль</label>
          <input
            type="password"
            value={passwordCurrent}
            onChange={(e) => setPasswordCurrent(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Новий пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Підтвердження нового паролю
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Зберегти новий пароль
        </button>

        {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}
        {passwordError && <p className="text-red-600">{passwordError}</p>}
      </form>

      <hr className="my-6" />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-red-600">
          Видалити акаунт
        </h3>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Видалити акаунт
        </button>
      </div>
    </div>
  );
};

export default Settings;
