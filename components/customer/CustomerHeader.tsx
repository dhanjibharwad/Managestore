// components/customer/CustomerHeader.tsx
export default function CustomerHeader() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Welcome, Customer</h2>

      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm">
          Logout
        </button>
      </div>
    </header>
  );
}
