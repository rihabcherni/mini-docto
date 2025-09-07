import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    Swal.fire({
      icon: "success",
      title: "Déconnexion réussie",
      text: "Vous avez été déconnecté avec succès",
      timer: 3000,
      showConfirmButton: false,
    });
    navigate("/"); 
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const links = user
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profil", path: "/profile" },
      ]
    : [];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200">
            Mini Docto+
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-blue-200"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-2 pt-2 pb-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2 rounded hover:bg-blue-500"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded hover:bg-blue-500"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
