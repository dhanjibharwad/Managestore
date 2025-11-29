export default function CustomerServiceHistoryPage() {
  const history = [
    {
      id: "H-991",
      job: "AC Gas Refilling",
      technician: "Ravi Kumar",
      date: "05 Nov 2025",
      amount: "₹1,450",
      status: "Completed",
    },
    {
      id: "H-982",
      job: "Water Purifier Cleaning",
      technician: "Amit Verma",
      date: "29 Oct 2025",
      amount: "₹500",
      status: "Completed",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Service History</h1>

      <div className="bg-white shadow rounded-xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 text-left">Job</th>
              <th className="text-left">Technician</th>
              <th className="text-left">Date</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.job}</td>
                <td>{item.technician}</td>
                <td>{item.date}</td>
                <td>{item.amount}</td>
                <td>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs">
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
