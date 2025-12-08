"use client"

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    console.log("Sign in attempt with:", form);
    setMessage("Signed in successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">


        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hey there, Welcome Back!
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm text-center">
            {message}
          </div>
        )}

        <div className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email or Phone Number
            </label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email or phone number"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-left">
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}