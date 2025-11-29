// app/(admin)/jobs/page.tsx
export default function JobsPage() {
  const jobs = [
    { job: "AC Service", customer: "Ritu", tech: "Arjun", status: "Completed" },
    { job: "Fridge Repair", customer: "Mona", tech: "Rohit", status: "Pending" },
    { job: "RO Checkup", customer: "Tejas", tech: "Aman", status: "In Progress" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Jobs</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Job</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Technician</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{j.job}</td>
                <td>{j.customer}</td>
                <td>{j.tech}</td>
                <td className="text-purple-600">{j.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
