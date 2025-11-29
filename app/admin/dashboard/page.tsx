// app/(admin)/dashboard/page.tsx
import AdminStatsCard from "@/components/admin/AdminStatsCard";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Jobs", value: 128 },
    { title: "Active Technicians", value: 5 },
    { title: "Total Customers", value: 42 },
    { title: "Monthly Revenue", value: "₹48,200" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <AdminStatsCard key={i} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="mt-8 bg-white p-6 shadow rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Recent Jobs</h3>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="py-2 text-left">Job</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Technician</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2">AC Service</td>
              <td>Ritu Singh</td>
              <td>Arjun</td>
              <td className="text-green-600">Completed</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Washing Machine Repair</td>
              <td>Dev Patel</td>
              <td>Rohit</td>
              <td className="text-yellow-600">Pending</td>
            </tr>
            <tr>
              <td className="py-2">Water Purifier Checkup</td>
              <td>Mira</td>
              <td>Aman</td>
              <td className="text-blue-600">In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
