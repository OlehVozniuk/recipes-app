import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import CreateRecipe from "./pages/CreateRecipe"; // додано
import Header from "./components/Header";
import Footer from "./components/Footer";
import EditRecipe from "./pages/EditRecipe"; // імпортуй компонент

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/" element={<Home />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/recipes/new" element={<CreateRecipe />} />{" "}
        {/* нова сторінка */}
        <Route path="/about" element={<h1>About us</h1>} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
