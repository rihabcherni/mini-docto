import { useState, useContext } from "react";
import { login } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaBriefcaseMedical } from "react-icons/fa";
import PasswordInput from "../components/PasswordInput";
import { logEvent } from "../analytics"; 

const Loader = () => <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const showAlert = (title, message, icon = "error") => {
    Swal.fire({
      title,
      text: message,
      icon,
      confirmButtonColor: "#2563eb", 
      confirmButtonText: "OK",
      customClass: {
        title: "text-center",
        content: "text-center",
      },
      buttonsStyling: true,
      timer: icon === "success" ? 1500 : undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return showAlert("Erreur", "Veuillez remplir tous les champs");
    }
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      setIsLoading(false);

      if (res.data.role !== "pro") {
        return showAlert("Accès refusé", "Seuls les professionnels peuvent se connecter");
      }

      localStorage.setItem("token", res.data.token);
      showAlert("Connexion réussie", "Bienvenue dans Mini Docto+!", "success");
      logEvent("Authentication", "login", res.data.email);

      setTimeout(() => {
        loginUser(res.data);
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setIsLoading(false);
      logEvent("Authentication", "login_failed", email);
      showAlert(
        "Erreur de connexion",
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    }
  };

  return (
    <div className="min-h-[90vh] bg-gray-50 flex flex-col md:flex-row">
      <div className="md:w-1/2 flex flex-col justify-center items-center bg-blue-100">
        <div className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-md text-center">
          <div className="w-20 h-20 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="text-blue-600 text-4xl">
                <FaBriefcaseMedical />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Mini Docto+</h1>
          <p className="text-gray-700">Espace professionnel pour gérer vos rendez-vous et disponibilités facilement.</p>
        </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Connexion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Votre email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center"
            >
              {isLoading ? <Loader /> : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
