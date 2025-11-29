// app/(customer)/dashboard/page.tsx
import CustomerStatsCard from "@/components/customer/CustomerStatsCard";

export default function CustomerDashboard() {
  const stats = [
    { title: "Active Jobs", value: 4 },
    { title: "Completed Jobs", value: 28 },
    { title: "Pending Payments", value: 2 },
    { title: "Total Spent", value: "₹12,450" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <CustomerStatsCard
            key={i}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      {/* Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>

        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Job</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
                <th className="text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">AC Service</td>
                <td className="text-blue-500 font-medium">Completed</td>
                <td>12 Nov 2025</td>
                <td>₹850</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Water Purifier Repair</td>
                <td className="text-yellow-500 font-medium">Pending</td>
                <td>09 Nov 2025</td>
                <td>₹1,200</td>
              </tr>
              <tr>
                <td className="py-2">Refrigerator Checkup</td>
                <td className="text-green-600 font-medium">In Progress</td>
                <td>05 Nov 2025</td>
                <td>₹650</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
