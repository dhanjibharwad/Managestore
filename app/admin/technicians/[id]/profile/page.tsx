import { notFound } from "next/navigation";

export default async function TechProfile({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/technicians?id=${id}`);
  const tech = await res.json();

  if (!tech) return notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Technician Profile</h1>
      <p>Name: {tech.name}</p>
      <p>Email: {tech.email}</p>
    </div>
  );
}
