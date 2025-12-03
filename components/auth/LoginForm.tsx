"use client"

import { useState } from "react";
import { Menu, X, User, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState("");

  async function handleLogin() {
    console.log("Login attempt with:", { username, password });
  }

  async function handleSubscribe() {
    console.log("Subscribe with:", subscribeEmail);
  }

  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-3xl shadow-2xl flex overflow-hidden relative">
        
        {/* Left Side - Purple Subscription Area */}
        <div 
          className="w-[55%] p-12 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7C7EF5 0%, #6B6DE8 100%)"
          }}
        >
          {/* Curved Edge Overlay */}
          <div 
            className="absolute top-0 right-0 bottom-0 w-[200px] bg-white"
            style={{
              borderTopLeftRadius: "50% 50%",
              borderBottomLeftRadius: "50% 50%",
              transform: "translateX(50%)"
            }}
          />

          {/* Menu Icon */}
          <div className="relative z-10">
            <button className="text-white p-2 rounded-lg transition-all">
              <Menu size={24} />
            </button>
          </div>

          {/* Decorative Dots */}
          <div className="absolute left-8 bottom-8 w-20 h-20 opacity-30 z-10">
            <div className="grid grid-cols-6 gap-1.5">
              {[...Array(36)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-[45%] bg-white p-12 flex flex-col relative z-20">

          {/* Login Form Content */}
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-2" style={{ color: "#7C7EF5" }}>
                Hello there!
              </h1>
              <p className="text-xl font-medium" style={{ color: "#A5A6F6" }}>
                Welcome Back
              </p>
            </div>

            {/* Username Input */}
            <div className="mb-4">
              <div className="flex items-center border-b border-gray-300 pb-2">
                <User size={20} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 text-gray-600 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <div className="flex items-center border-b border-gray-300 pb-2">
                <Lock size={20} className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-gray-600 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              className="w-full text-white font-medium py-3 rounded-full mb-6 transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #7C7EF5 0%, #6B6DE8 100%)" }}
            >
              Sign In
            </button>

            {/* Bottom Links */}
            <div className="flex justify-between items-center text-xs">
              <a href="#" className="hover:underline" style={{ color: "#7C7EF5" }}>
                Don't have an account? <span className="font-medium">Register</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}