// app/(super-admin)/admins/page.tsx
export default function AdminsPage() {
  const admins = [
    {
      company: "TechFix Solutions",
      name: "Rahul Mehta",
      email: "rahul@techfix.com",
    },
    {
      company: "HomeCare Plus",
      name: "Ananya Sharma",
      email: "ananya@homecare.com",
    },
    {
      company: "CoolTech Repairs",
      name: "Vikas Patel",
      email: "vikas@cooltech.com",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Company Admins</h1>

      <div className="bg-white shadow rounded-xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Company</th>
              <th className="text-left">Admin Name</th>
              <th className="text-left">Email</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((a, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{a.company}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
