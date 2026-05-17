"use client";

import Image from "next/image";
import { useState } from "react";
import adminApi from "@/lib/adminApi";
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
      const res = await adminApi.post("/admin/login", { email, password });
      if (res.status === 200) {
        router.push("/admin"); // Push to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    // Background: Premium Full Cream (#F9F3EB)
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EB] px-4 py-8 relative overflow-hidden font-sans">
      
      {/* Main Login Card: Crisp White (bg-white) with Deep Maroon Border (#2A0005) */}
      <div className=" flex items-center flex-col w-full max-w-[420px] p-6 sm:p-10 bg-[#fff] shadow-[0_20px_50px_rgba(42,0,5,0.1)] rounded-2xl border border-[#2A0005] relative z-10 transition-all duration-300">
        
        {/* Header Section */}
<div className="relative w-[240px] h-[120px] overflow-hidden">
  <div className="relative w-full h-full scale-125"> {/* Zooms the image up by 125% */}
    <Image 
      src="/shagunratnalogo.png"            
      alt="Shagunratna Logo" 
      fill                       
      priority                   
      className="object-contain" 
    />
  </div>
</div>

<div className=" relative text-center h-0 w-[90%] mb-6 border-[1px] border-[#640a17]">
  <span className=" absolute text-start font-bold text-[#640a17] text-[0.6rem] top-[-1rem] left-0" >Administrator Login</span>
</div>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full">
          <div className="space-y-5">
            <div className="relative">
              <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">Email</label>
              {/* Added rounded-xl to inputs */}
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-[#FFFFFF] text-[#5C0612] border border-[#C5A059]/60 rounded-xl outline-none placeholder-[#C5A059]/65 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all duration-300 font-mono text-sm sm:text-base shadow-inner"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">Password</label>
              {/* Added rounded-xl to inputs */}
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-[#FFFFFF] text-[#5C0612] border border-[#C5A059]/60 rounded-xl outline-none placeholder-[#C5A059]/65 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all duration-300 font-mono text-sm sm:text-base tracking-[0.3em] shadow-inner"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#5C0612]/10 border border-[#5C0612]/30 rounded-xl text-center mt-4">
              <p className="text-[#5C0612] font-semibold text-xs tracking-wider uppercase">{error}</p>
            </div>
          )}

          {/* Solid Maroon Login Button - Changed to rounded-xl */}
          <button 
            type="submit"
            className="w-full mt-8 py-4 bg-[#5C0612] text-[#FFFFFF] rounded-xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-[#3A030B] hover:shadow-[0_8px_20px_rgba(42,0,5,0.4)] transition-all duration-300 flex items-center justify-center"
          >
            Login to Dashboard
          </button>
        </form>

        {/* Security Footer Removed Entirely */}

      </div>
    </div>
  );
}