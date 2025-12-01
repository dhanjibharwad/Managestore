// app/(technician)/profile/page.tsx
export default function TechnicianProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 max-w-xl space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className="w-full border rounded-lg px-3 py-2 mt-1" defaultValue="Arjun Mehta" />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="w-full border rounded-lg px-3 py-2 mt-1" defaultValue="arjun@example.com" />
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <input className="w-full border rounded-lg px-3 py-2 mt-1" defaultValue="9876543210" />
        </div>

        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Update Profile</button>
      </div>
    </div>
  );
}
