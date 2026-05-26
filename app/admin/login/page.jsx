"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import adminApi from "@/lib/adminApi";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Step Tracking & Security UI States ---
  const [currentStep, setCurrentStep] = useState("CREDENTIALS"); 
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const resetAuthFlow = () => {
    setCurrentStep("CREDENTIALS");
    setToken("");
    setError("");
    setSuccess("");
    setAttemptsLeft(5);
  };

  // --- STEP 1: INITIAL PASSWORD LOGIN OR LOCKOUT TRIGGER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminApi.post("/login", { email, password });
      
      if (res.status === 200) {
        setCurrentStep("OTP");
        setSuccess("OTP sent to your email.");
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 423) {
        setError("Account locked. Please wait 15 minutes.");
        setAttemptsLeft(0);
      } else {
        setError(data?.error || "Invalid Credentials");
        // Update attempts left if provided by backend, otherwise decrement
        setAttemptsLeft((prev) => (prev > 1 ? prev - 1 : 0));
      }
    } finally {
      setLoading(false);
    }
  };
  // --- STEP 2: BACKUP OTP LOGIN METHOD ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Form submits directly to your dedicated verify file path
      const res = await adminApi.post("/verify", { 
        email, 
        token: token.toUpperCase().trim() 
      });

      if (res.status === 200) {
        setSuccess("Backup validation successful. Welcome back.");
        setTimeout(() => {
          router.push("/admin"); 
        }, 1000);
      }
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || "Invalid or Expired Verification Code");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EB] px-4 py-8 relative overflow-hidden font-sans">
      
      <div className="flex items-center flex-col w-full max-w-[420px] p-6 sm:p-10 bg-[#fff] shadow-[0_20px_50px_rgba(42,0,5,0.1)] rounded-2xl border border-[#2A0005] relative z-10 transition-all duration-300">
        
        {/* Header Section */}
        <div className="relative w-[240px] h-[120px] overflow-hidden">
          <div className="relative w-full h-full scale-125">
            <Image 
              src="/shagunratnalogo.png"            
              alt="Shagunratna Logo" 
              fill                                              
              priority                                   
              className="object-contain" 
            />
          </div>
        </div>

        <div className="relative text-center h-0 w-[90%] mb-6 border-[1px] border-[#640a17]">
          <div className="absolute w-full -top-[1rem] left-0 flex flex-row justify-between items-center bg-[#fff] px-1">
            <span className="font-bold text-[#640a17] text-[0.6rem] w-auto">Administrator Login</span>
            <span className="font-bold text-[#640a17] text-[0.65rem] w-auto">
              {currentStep === "OTP" ? "ALTERNATIVE OTP ACCESS" : `login attempt: ${attemptsLeft}`}
            </span>
          </div>
        </div>

        {currentStep === "OTP" ? (
          /* ==========================================
              🔒 VIEW B: BACKUP OTP LOGIN METHOD
             ========================================== */
          <form onSubmit={handleVerifyOTP} className="w-full">
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">
                  Enter Account Login Code
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  disabled={loading}
                  value={token}
                  className="w-full px-4 py-3 bg-[#FFFFFF] text-[#5C0612] border border-[#c5a059] rounded-xl outline-none placeholder-[#c5a059] focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all duration-300 font-mono text-center text-xl font-bold tracking-[0.4em] uppercase shadow-inner"
                  placeholder="X48YT2"
                  onChange={(e) => setToken(e.target.value.toUpperCase().trim())}
                  required
                />
              </div>
            </div>

            {(error || success) && (
              <div className={`p-3 border rounded-xl text-center mt-4 ${success ? "bg-emerald-50 border-emerald-200" : "bg-[#5C0612]/10 border-[#5C0612]/30"}`}>
                <p className={`font-semibold text-xs tracking-wider uppercase ${success ? "text-emerald-800" : "text-[#5C0612]"}`}>
                  {error || success}
                </p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-[#5C0612] text-[#FFFFFF] rounded-xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-[#3A030B] hover:shadow-[0_8px_20px_rgba(42,0,5,0.4)] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Authenticating Code..." : "Verify & Log In"}
            </button>

            <button
              type="button"
              onClick={resetAuthFlow}
              className="w-full mt-3 text-center text-[#c5a059] hover:text-[#5C0612] font-bold uppercase tracking-widest text-[0.6rem] transition-colors duration-200"
            >
              ← Back to password details
            </button>
          </form>
        ) : (
          /* ==========================================
              🔑 VIEW A: INITIAL PASSWORD CREDENTIAL INPUTS
             ========================================== */
          <form onSubmit={handleLogin} className="w-full">
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">Email</label>
                <input 
                  type="email" 
                  disabled={loading}
                  value={email}
                  className="w-full px-4 py-3 bg-[#FFFFFF] text-[#5C0612] border border-[#c5a059] rounded-xl outline-none placeholder-[#c5a059] focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all duration-300 font-mono text-sm sm:text-base shadow-inner"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">Password</label>
                <input 
                  type="password" 
                  disabled={loading}
                  value={password}
                  className="w-full px-4 py-3 bg-[#FFFFFF] text-[#5C0612] border border-[#c5a059] rounded-xl outline-none placeholder-[#c5a059] focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all duration-300 font-mono text-sm sm:text-base tracking-[0.3em] shadow-inner"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 border rounded-xl text-center mt-4 bg-[#5C0612]/10 border-[#5C0612]/30">
                <p className="font-semibold text-xs tracking-wider uppercase text-[#5C0612]">
                  {error}
                </p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-[#5C0612] text-[#FFFFFF] rounded-xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-[#3A030B] hover:shadow-[0_8px_20px_rgba(42,0,5,0.4)] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Verifying Credentials..." : "Login to Dashboard"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}