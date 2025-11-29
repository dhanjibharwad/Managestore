// app/(super-admin)/usage/page.tsx
export default function UsagePage() {
  const usage = [
    { company: "TechFix Solutions", jobs: 120, storage: "1.2GB" },
    { company: "HomeCare Plus", jobs: 55, storage: "890MB" },
    { company: "CoolTech Repairs", jobs: 210, storage: "2.5GB" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">System Usage</h1>

      <div className="bg-white rounded-xl shadow p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Company</th>
              <th className="text-left">Jobs Created</th>
              <th className="text-left">Storage Used</th>
            </tr>
          </thead>

          <tbody>
            {usage.map((u, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{u.company}</td>
                <td>{u.jobs}</td>
                <td>{u.storage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
