import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Додатковий захист: перевіряємо, що parsedUser — об'єкт
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        } else {
          throw new Error("Invalid user object");
        }
      }
    } catch (err) {
      console.error("❌ AuthContext: помилка при читанні з localStorage:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
