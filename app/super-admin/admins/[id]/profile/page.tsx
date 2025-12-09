interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function AdminProfilePage({ params }: ProfilePageProps) {
  const { id } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-700">
          <span className="font-semibold">Admin ID:</span> {id}
        </p>

        <p className="text-gray-700 mt-2">
          This is a dynamic profile page for the selected admin.
        </p>
      </div>
    </div>
  );
}
