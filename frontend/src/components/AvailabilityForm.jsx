import { useState } from "react";
import { addAvailability } from "../api/api";
import Swal from "sweetalert2";
import { logEvent } from "../analytics"; 

export default function AvailabilityForm({ onAdded }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slotsArray = slots
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!date || slotsArray.length === 0) {
      Swal.fire("Erreur", "Veuillez renseigner la date et au moins un créneau", "error");
      setLoading(false);
      return;
    }

    try {
      await addAvailability({ date, slots: slotsArray });
      setDate("");
      setSlots("");
      onAdded();
      Swal.fire("Succès", "Disponibilité ajoutée", "success");
      logEvent("Disponibilités", "Ajout", `Date: ${date}, Créneaux: ${slotsArray.join(", ")}`);
      
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Impossible d’ajouter la disponibilité", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h3 className="text-lg font-semibold">Ajouter Disponibilité</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        value={slots}
        onChange={(e) => setSlots(e.target.value)}
        placeholder="Ex: 09:00,10:00,14:00"
        required
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
}
