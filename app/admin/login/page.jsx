"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/admin/login", { email, password });
      if (res.status === 200) {
        router.push("/admin"); // Push to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">SHAGUN RATNA</h1>
          <p className="text-gray-500 text-sm mt-2">ADMINISTRATION ACCESS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}