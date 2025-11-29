// app/(super-admin)/companies/page.tsx
import CompanyCard from "@/components/super-admin/CompanyCard";

const dummyCompanies = [
  {
    id: "1",
    name: "TechFix Solutions",
    owner: "Rahul Mehta",
    users: 28,
    plan: "Pro",
  },
  {
    id: "2",
    name: "HomeCare Plus",
    owner: "Ananya Sharma",
    users: 14,
    plan: "Basic",
  },
  {
    id: "3",
    name: "CoolTech Repairs",
    owner: "Vikas Patel",
    users: 42,
    plan: "Enterprise",
  },
];

export default function CompaniesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Companies</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dummyCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
