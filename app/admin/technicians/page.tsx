// app/(admin)/technicians/page.tsx
export default function TechniciansPage() {
  const techs = [
    { name: "Arjun", phone: "9876543210", jobs: 22 },
    { name: "Rohit", phone: "9871112233", jobs: 14 },
    { name: "Aman", phone: "9988776655", jobs: 18 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Technicians</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Name</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Jobs</th>
            </tr>
          </thead>

          <tbody>
            {techs.map((t, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{t.name}</td>
                <td>{t.phone}</td>
                <td>{t.jobs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
