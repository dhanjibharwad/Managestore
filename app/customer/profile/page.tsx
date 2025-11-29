"use client";

import { useState } from "react";

export default function CustomerProfilePage() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    address: "Hyderabad, India",
  });

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-6">

        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Address</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">
            Update Profile
          </button>
        </div>

        {/* Change Password Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="New Password"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />
          </div>

          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
