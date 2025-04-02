import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Recipefy</h1>
      <nav>
        <Link to="/" className="mr-4 hover:underline">
          Home
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
      </nav>
    </header>
  );
}

export default Header;
