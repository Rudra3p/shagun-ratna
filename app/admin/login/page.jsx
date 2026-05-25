"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import adminApi from "@/lib/adminApi";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); // Stores user input code (e.g. R45DS9)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Step Tracking & Security UI States ---
  const [currentStep, setCurrentStep] = useState("CREDENTIALS"); // "CREDENTIALS" or "OTP"
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // Clear message statuses instantly when user hops back to try again
  const resetAuthFlow = () => {
    setCurrentStep("CREDENTIALS");
    setToken("");
    setError("");
    setSuccess("");
    setAttemptsLeft(5);
  };

  // --- STEP 1: CREDENTIAL SUBMISSION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await adminApi.post("/login", { email, password });
      
      // Look for the "AWAITING_OTP" flag we set up in our backend controller
      if (res.data?.step === "AWAITING_OTP") {
        setSuccess(res.data.message);
        setCurrentStep("OTP"); // Shift view over to input the alphanumeric code
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid Credentials";
      setError(errMsg);
      
      // Update attemptsRemaining dynamically from backend data payload if available
      if (err.response?.data?.attemptsRemaining !== undefined) {
        setAttemptsLeft(err.response.data.attemptsRemaining);
      } else {
        setAttemptsLeft((prev) => (prev > 1 ? prev - 1 : 5));
      }
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: OTP VERIFICATION SUBMISSION ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await adminApi.post("/verify-otp", { 
        email, 
        token: token.toUpperCase().trim() 
      });

      if (res.status === 200) {
        setSuccess("Access Granted. Welcome back, Boss.");
        // Short timeout allows the user to see the success state before transition
        setTimeout(() => {
          router.push("/admin"); 
        }, 1000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid Credentials";
      setError(errMsg);
      
      if (err.response?.data?.attemptsRemaining !== undefined) {
        setAttemptsLeft(err.response.data.attemptsRemaining);
      } else {
        setAttemptsLeft((prev) => (prev > 1 ? prev - 1 : 5));
      }
    } finally {
      setLoading(false); // ✅ Kept this, it handles your spinner state perfectly
    }
  };

  return (
    // Background: Premium Full Cream (#F9F3EB)
    <div className="min-h-screen flex items-center justify-center bg-[#F9F3EB] px-4 py-8 relative overflow-hidden font-sans">
      
      {/* Main Login Card: Crisp White with Deep Maroon Border (#2A0005) */}
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
              {currentStep === "OTP" ? "SECURITY CODE" : `login attempt: ${attemptsLeft}`}
            </span>
          </div>
        </div>

        {currentStep === "OTP" ? (
          /* ==========================================
             🔒 VIEW B: DIRECT ALPHANUMERIC OTP INPUT FORM
             ========================================== */
          <form onSubmit={handleVerifyOTP} className="w-full">
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2 ml-1">
                  Enter 6-Digit Verification Code
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

            {/* Status Messages for OTP validation step */}
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
              {loading ? "Authorizing Profile..." : "Verify & Unlock"}
            </button>

            <button
              type="button"
              onClick={resetAuthFlow}
              className="w-full mt-3 text-center text-[#c5a059] hover:text-[#5C0612] font-bold uppercase tracking-widest text-[0.6rem] transition-colors duration-200"
            >
              ← Back to login details
            </button>
          </form>
        ) : (
          /* ==========================================
             🔑 VIEW A: INITIAL ACCOUNT DETAILS CREDENTIAL INPUTS
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

            {/* Status Messages for credentials check step */}
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
              {loading ? "Verifying Keys..." : "Login to Dashboard"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}