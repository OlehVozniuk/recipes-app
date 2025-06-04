import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.token && data.user) {
        login(data.token, data.user);
        navigate("/");
      } else {
        setError(data.message || "Не вдалося увійти");
      }
    } catch (err) {
      setError("Помилка сервера");
    }
  };

  return (
    <div className="flex justify-center items-start bg-[#fff3e0] px-4 pt-20 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вхід до акаунту
        </h2>

        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
          >
            Увійти
          </button>

          <div className="flex justify-between text-sm mt-2">
            <Link
              to="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Забули пароль?
            </Link>
            <a
              href={`${process.env.REACT_APP_API_URL}/signup`}
              className="text-orange-600 hover:underline"
            >
              Зареєструватися
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
