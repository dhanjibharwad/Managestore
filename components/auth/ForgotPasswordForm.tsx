"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md w-full bg-white shadow p-6 rounded-lg space-y-4"
    >
      <h2 className="text-xl font-bold">Forgot Password</h2>

      <input
        type="email"
        className="border p-2 w-full rounded"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Send OTP
      </button>

      {msg && <p className="text-center text-sm text-green-600">{msg}</p>}
    </form>
  );
}
