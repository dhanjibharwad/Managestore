export default function CustomerJobsPage() {
  const jobs = [
    {
      id: "J-1024",
      job: "AC Cleaning",
      technician: "Ravi Kumar",
      status: "In Progress",
      date: "15 Nov 2025",
      amount: "₹600",
    },
    {
      id: "J-1021",
      job: "Washing Machine Repair",
      technician: "Amit Verma",
      status: "Scheduled",
      date: "18 Nov 2025",
      amount: "₹1,200",
    },
    {
      id: "J-1009",
      job: "Refrigerator Checkup",
      technician: "Suresh",
      status: "Pending",
      date: "20 Nov 2025",
      amount: "₹900",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Jobs</h1>

      <div className="bg-white shadow rounded-xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 text-left">Job</th>
              <th className="text-left">Technician</th>
              <th className="text-left">Status</th>
              <th className="text-left">Date</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b">
                <td className="py-2">{job.job}</td>
                <td>{job.technician}</td>
                <td
                  className={
                    job.status === "In Progress"
                      ? "text-blue-600 font-medium"
                      : job.status === "Pending"
                      ? "text-yellow-600 font-medium"
                      : "text-purple-600 font-medium"
                  }
                >
                  {job.status}
                </td>
                <td>{job.date}</td>
                <td>{job.amount}</td>
                <td className="space-x-2">
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs">
                    View
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-xs">
                    Cancel
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs">
                    Track
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
