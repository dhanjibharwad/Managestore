// app/(admin)/settings/page.tsx
export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              defaultValue="TechFix Solutions"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Support Contact</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              defaultValue="+91 9876543210"
            />
          </div>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
