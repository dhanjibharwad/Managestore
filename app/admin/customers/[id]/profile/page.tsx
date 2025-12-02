export default async function CustomerProfile({ params }: { params: { id: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/customers?id=${params.id}`,
    { cache: "no-store" }
  );

  const customer = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Customer Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
      </div>
    </div>
  );
}
