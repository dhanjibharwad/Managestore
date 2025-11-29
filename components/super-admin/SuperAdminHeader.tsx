export default function SuperAdminHeader() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Super Admin Dashboard</h2>

      <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm">
        Logout
      </button>
    </header>
  );
}
