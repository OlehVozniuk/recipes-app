import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import CreateRecipe from "./pages/CreateRecipe";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EditRecipe from "./pages/EditRecipe";
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/" element={<Home />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/about" element={<About />} /> {/* отут про нас */}
        <Route path="/recipes/new" element={<CreateRecipe />} />{" "}
        {/* нова сторінка */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
