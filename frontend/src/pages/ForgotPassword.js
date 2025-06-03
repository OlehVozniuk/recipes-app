import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(
        "http://localhost:5001/api/users/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Інструкції для скидання надіслані на вашу пошту.");
      } else {
        setError(data.message || "Помилка відновлення паролю.");
      }
    } catch (err) {
      setError("Помилка сервера.");
    }
  };

  return (
    <div className="flex justify-center items-start bg-[#fff3e0] px-4 pt-16 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Відновлення паролю
        </h2>

        {message && (
          <p className="text-green-600 text-center font-medium mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Ваша пошта"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Надіслати лінк для скидання
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
