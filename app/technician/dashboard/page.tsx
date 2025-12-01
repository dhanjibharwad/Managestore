// app/(technician)/dashboard/page.tsx
import TechnicianJobCard from "@/components/technician/TechnicianJobCard";

export default function TechnicianDashboard() {
  const assignedJobs = [
    { title: "AC Repair", customer: "Ritu", status: "In Progress", date: "Nov 20" },
    { title: "Fridge Service", customer: "Mohan", status: "Pending", date: "Nov 21" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Technician Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignedJobs.map((job, i) => (
          <TechnicianJobCard key={i} job={job} />
        ))}
      </div>
    </div>
  );
}
