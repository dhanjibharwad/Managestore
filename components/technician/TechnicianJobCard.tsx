interface Props {
  job: {
    title: string;
    customer: string;
    status: string;
    date: string;
  };
}

export default function TechnicianJobCard({ job }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-gray-500 text-sm">Customer: {job.customer}</p>
      <p className="text-sm mt-2">
        Status: <span className="font-medium text-purple-600">{job.status}</span>
      </p>
      <p className="text-sm">Date: {job.date}</p>
    </div>
  );
}
