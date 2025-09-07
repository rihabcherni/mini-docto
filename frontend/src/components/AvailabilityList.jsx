import { useState } from "react";
import { deleteAvailability, updateAvailability } from "../api/api";
import Swal from "sweetalert2";

export default function AvailabilityList({ availabilities, onUpdated, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Supprimer cette disponibilité ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteAvailability(id);
      if (onDeleted) onDeleted();
      Swal.fire("Supprimé", "Disponibilité supprimée", "success");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de supprimer",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (availability) => {
    const { value: formValues } = await Swal.fire({
      title: "Modifier la disponibilité",
      html:
        `<input type="date" id="swal-date" class="swal2-input" value="${availability.date.split('T')[0]}">` +
        `<input type="text" id="swal-slots" class="swal2-input" value="${availability.slots.join(
          ", "
        )}" placeholder="Ex: 09:00,10:00">`,
      focusConfirm: false,
      preConfirm: () => {
        const date = document.getElementById("swal-date").value;
        const slots = document
          .getElementById("swal-slots")
          .value.split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .sort();
        return { date, slots };
      },
    });

    if (!formValues) return;

    try {
      await updateAvailability(availability._id, formValues);
      if (onUpdated) onUpdated();
      Swal.fire("Modifié", "Disponibilité mise à jour", "success");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de modifier",
        "error"
      );
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const sortedAvailabilities = [...availabilities].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Mes Disponibilités</h3>
      {sortedAvailabilities.length === 0 ? (
        <p>Aucune disponibilité</p>
      ) : (
        <ul className="space-y-2 max-h-[10rem] overflow-y-auto"> 
          {sortedAvailabilities.map((av) => {
            const sortedSlots = av.slots?.slice().sort() || [];
            return (
              <li
                key={av._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-2 rounded"
              >
                <div className="mb-2 sm:mb-0 font-semibold">
                  {formatDate(av.date)}
                </div>
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-0">
                  {sortedSlots.length
                    ? sortedSlots.map((slot) => (
                        <span
                          key={slot}
                          className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                        >
                          {slot}
                        </span>
                      ))
                    : "Pas de créneaux"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(av)}
                    className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(av._id)}
                    disabled={deletingId === av._id}
                    className={`px-2 py-1 rounded text-white ${
                      deletingId === av._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === av._id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
