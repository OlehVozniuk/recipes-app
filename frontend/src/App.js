import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import CreateRecipe from "./pages/CreateRecipe";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EditRecipe from "./pages/EditRecipe";
import About from "./pages/About";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          <Route path="/recipes/new" element={<CreateRecipe />} />
          <Route path="/edit/:id" element={<EditRecipe />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
