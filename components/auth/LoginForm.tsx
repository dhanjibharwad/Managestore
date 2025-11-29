"use client"

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    // Simulated login - replace with your actual API call
    console.log("Login attempt with:", { email, password });
    
    // Example of actual API call (commented out):
    /*
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.role === "admin") window.location.href = "/admin/dashboard";
    if (data.role === "user") window.location.href = "/user/dashboard";
    if (data.role === "technician") window.location.href = "/technician/dashboard";
    */
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="flex bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Side - Illustration Area */}
        <div className="w-1/2 relative" style={{ backgroundColor: "#4A70A9" }}>
          <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full opacity-20"></div>
          <div className="h-full flex items-center justify-center p-12">
            {/* Placeholder for your animated image */}
            <div className="text-center">
              <div className="w-64 h-64 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center">
                <p className="text-white text-sm opacity-75">Your animated image here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-4xl font-bold mb-3" style={{ color: "#2C3E50" }}>
              Log in
            </h1>
            
            <p className="text-gray-500 text-sm mb-8">
              Hello, friend! I'm Smartime - task manager you<br />
              can trust everything. Let's get in touch!
            </p>

            {/* Email Input */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full text-white font-medium py-3 rounded-lg mb-6 transition-all hover:opacity-90 active:scale-98"
              style={{ backgroundColor: "#4A70A9" }}
            >
              Let's start!
            </button>

            {/* Social Login */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium hover:underline" style={{ color: "#4A70A9" }}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}