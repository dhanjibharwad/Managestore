// app/(admin)/reports/page.tsx
export default function ReportsPage() {
  const reports = [
    { title: "Monthly Jobs Report", date: "Nov 2025" },
    { title: "Revenue Summary", date: "Nov 2025" },
    { title: "Technician Performance", date: "Oct 2025" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div
            key={i}
            className="p-6 bg-white shadow rounded-xl border hover:border-purple-600 cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <p className="text-sm text-gray-500">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
