// app/(technician)/assigned-jobs/page.tsx
import TechnicianJobCard from "@/components/technician/TechnicianJobCard";

export default function AssignedJobsPage() {
  const jobs = [
    { title: "AC Service", customer: "Ritika", status: "In Progress", date: "Nov 22" },
    { title: "Water Purifier Repair", customer: "Anand", status: "Pending", date: "Nov 23" },
    { title: "Washing Machine Check", customer: "Karan", status: "Pending", date: "Nov 24" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Assigned Jobs</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, i) => (
          <TechnicianJobCard key={i} job={job} />
        ))}
      </div>
    </div>
  );
}
