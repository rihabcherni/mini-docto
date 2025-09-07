import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { getAvailabilities, getAppointments, getProfessionals } from "../api/api";
import AvailabilityForm from "../components/AvailabilityForm";
import AvailabilityList from "../components/AvailabilityList";
import AppointmentsList from "../components/AppointmentsList";
import ProfessionalsRanking from "../components/ProfessionalsRanking";

export default function DashboardPro() {
  const [availabilities, setAvailabilities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
const fetchAvailabilities = async () => {
  const res = await getAvailabilities();
  setAvailabilities(res.data);
};

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [avRes, apptRes, proRes] = await Promise.all([
        getAvailabilities(),
        getAppointments(),
        getProfessionals(),
      ]);
      setAvailabilities(avRes.data);
      setAppointments(apptRes.data);
      setProfessionals(proRes.data.sort((a, b) => b.score - a.score));
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Impossible de charger les données", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-blue-600 font-semibold">
        Chargement du dashboard...
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Professionnel</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <AvailabilityForm onAdded={fetchAll} />
        <AvailabilityList availabilities={availabilities}  onUpdated={fetchAvailabilities} onDeleted={fetchAll} />
        <AppointmentsList appointments={appointments} />
        <ProfessionalsRanking professionals={professionals} />
      </div>
    </div>
  );
}
