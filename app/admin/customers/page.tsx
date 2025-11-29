// app/(admin)/customers/page.tsx
export default function CustomersPage() {
  const customers = [
    { name: "Ritu Singh", email: "ritu@example.com", jobs: 8 },
    { name: "Dev Patel", email: "dev@example.com", jobs: 3 },
    { name: "Mira Shah", email: "mira@example.com", jobs: 5 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Customers</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Jobs</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.jobs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
