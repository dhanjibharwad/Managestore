"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.role === "admin") window.location.href = "/admin/dashboard";
    if (data.role === "user") window.location.href = "/user/dashboard";
    if (data.role === "technician") window.location.href = "/technician/dashboard";
  }

  return (
    <div className="p-6 border rounded-lg w-96 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>

      <input className="input" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password"
             onChange={(e)=>setPassword(e.target.value)} />

      <button onClick={handleLogin} className="btn-primary">Login</button>
    </div>
  );
}
