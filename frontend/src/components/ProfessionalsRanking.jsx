export default function ProfessionalsRanking({ professionals }) {
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Classement des Pros</h3>
      {professionals.length === 0 ? (
        <p className="text-gray-500">Aucun professionnel disponible</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Nom</th>
              <th className="px-4 py-2 text-left border-b">Score</th>
              <th className="px-4 py-2 text-left border-b">Nb de créneaux</th>
              <th className="px-4 py-2 text-left border-b">Nb de rendez-vous</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((pro) => {
              const totalSlots = pro.availabilities?.reduce(
                (sum, a) => sum + (a.slots?.length || 0),
                0
              );
              return (
                <tr key={pro._id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{pro.name}</td>
                  <td className="px-4 py-2">{pro.score} / 100</td>
                  <td className="px-4 py-2">{totalSlots || 0}</td>
                  <td className="px-4 py-2">{pro.appointmentsCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
