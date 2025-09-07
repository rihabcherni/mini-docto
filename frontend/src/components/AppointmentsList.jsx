export default function AppointmentsList({ appointments }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const grouped = appointments.reduce((acc, appt) => {
    const patientId = appt.patient?._id || "unknown";
    if (!acc[patientId]) {
      acc[patientId] = {
        patient: appt.patient || { name: "Patient inconnu", email: "-" },
        appointments: [],
      };
    }
    acc[patientId].appointments.push(appt);
    return acc;
  }, {});

  const groupedArray = Object.values(grouped).map((g) => ({
    ...g,
    appointments: g.appointments.sort((a, b) => new Date(a.date) - new Date(b.date)),
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Mes Rendez-vous</h3>
      {groupedArray.length === 0 ? (
        <p className="text-gray-500">Aucun rendez-vous</p>
      ) : (
        <ul className="space-y-2 max-h-[10rem] overflow-y-auto"> 
          {groupedArray.map(({ patient, appointments }) => (
            <li
              key={patient._id || patient.email}
              className="border p-2 rounded hover:bg-gray-50 transition"
            >
              <div className="mb-2">
                <strong>{patient.name}</strong> ({patient.email})
              </div>
              <div className="flex flex-wrap gap-1 max-h-14 overflow-y-auto">
                {appointments.map((appt) => (
                  <span
                    key={appt._id}
                    className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm whitespace-nowrap"
                  >
                    {formatDate(appt.date)} → {appt.slot}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
