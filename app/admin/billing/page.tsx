// app/(admin)/billing/page.tsx
export default function BillingPage() {
  const bills = [
    { invoice: "INV001", amount: "₹850", status: "Paid" },
    { invoice: "INV002", amount: "₹1,200", status: "Pending" },
    { invoice: "INV003", amount: "₹650", status: "Paid" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Billing</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Invoice</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((b, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{b.invoice}</td>
                <td>{b.amount}</td>
                <td
                  className={
                    b.status === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
