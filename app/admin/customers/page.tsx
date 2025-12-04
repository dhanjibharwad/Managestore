// app/(admin)/customers/page.tsx

import Link from "next/link";
export default function CustomersPage() {
  const customers = [
    { 
      name: "Ravi Mahto", 
      type: "End User",
      paymentReceived: "0.00",
      paymentRemaining: "0.00",
      phone: "7030989898",
      email: "example@gmail.com",
      lastLogin: "",
      createdOn: "29-Nov-2025 11:21 AM",
      active: true,
      initials: "RM",
      bgColor: "bg-[#4A70A9]"
    },
    { 
      name: "Uday", 
      type: "End User",
      paymentReceived: "0.00",
      paymentRemaining: "0.00",
      phone: "7676767676",
      email: "hrjashviro@gmail.com",
      lastLogin: "",
      createdOn: "25-Nov-2025 12:06 PM",
      active: true,
      initials: "U",
      bgColor: "bg-[#4A70A9]"
    },
    { 
      name: "Vishwanth", 
      type: "Corporate User",
      paymentReceived: "0.00",
      paymentRemaining: "0.00",
      phone: "",
      email: "",
      lastLogin: "27-Nov-2025 02:16 PM",
      createdOn: "27-Nov-2025 02:14 PM",
      active: true,
      initials: "V",
      bgColor: "bg-[#4A70A9]"
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Customer name, mobile number, email"
              className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            All Filters
          </button>
          <Link href="/admin/customers/add">
          <button className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg text-sm font-medium hover:bg-[#3d5c8a]">
            + Add
          </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">
                <div className="flex items-center gap-1">
                  Customer
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Type</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Payment Received</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Payment Remaining</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Phone Number</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Last Login</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Created On</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="border-b border-zinc-200 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${customer.bgColor} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {customer.initials}
                    </div>
                    <span className="font-medium text-zinc-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{customer.type}</td>
                <td className="px-4 py-3 text-zinc-600">{customer.paymentReceived}</td>
                <td className="px-4 py-3 text-zinc-600">{customer.paymentRemaining}</td>
                <td className="px-4 py-3">
                  {customer.phone && (
                    <span className="text-[#4A70A9]">{customer.phone}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {customer.email && (
                    <span className="text-[#4A70A9]">{customer.email}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{customer.lastLogin}</td>
                <td className="px-4 py-3 text-zinc-600">{customer.createdOn}</td>
                <td className="px-4 py-3">
                  {customer.active && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button className="text-zinc-400 hover:text-zinc-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}