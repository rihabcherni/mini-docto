import { useEffect, useState } from "react";
import { getMe, updateProfile } from "../api/api";
import Swal from "sweetalert2";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Impossible de récupérer le profil", "error");
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name: user.name, email: user.email };

      await updateProfile(data);
      Swal.fire("Succès", "Profil mis à jour", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", err.response?.data?.message || "Erreur lors de la mise à jour", "error");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Mon Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Nom</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          {loading ? "En cours..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
