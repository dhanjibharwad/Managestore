// app/(super-admin)/subscriptions/page.tsx
export default function SubscriptionsPage() {
  const plans = [
    { name: "Basic", price: "₹499/mo", companies: 12 },
    { name: "Pro", price: "₹999/mo", companies: 25 },
    { name: "Enterprise", price: "₹1999/mo", companies: 5 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Subscriptions</h1>

      <div className="bg-white shadow rounded-xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Plan</th>
              <th className="text-left">Price</th>
              <th className="text-left">Companies Using</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{p.name}</td>
                <td>{p.price}</td>
                <td>{p.companies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
