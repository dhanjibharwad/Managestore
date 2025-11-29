interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    owner: string;
    users: number;
    plan: string;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white p-5 shadow rounded-xl">
      <h3 className="text-lg font-semibold">{company.name}</h3>
      <p className="text-sm text-gray-500">Owner: {company.owner}</p>

      <div className="mt-4">
        <p className="text-sm">
          Users: <span className="font-medium">{company.users}</span>
        </p>
        <p className="text-sm">
          Plan: <span className="font-medium">{company.plan}</span>
        </p>
      </div>

      <button className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg text-sm">
        View Details
      </button>
    </div>
  );
}
