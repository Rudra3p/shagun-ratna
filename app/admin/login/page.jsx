"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import adminApi from "@/lib/adminApi";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Magic Link & Security UI States ---
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // Countdown timer clock effect
  useEffect(() => {
    if (!showTimer || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showTimer, timeLeft]);

  // Format Milliseconds to MM:SS
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await adminApi.post("/admin/login", { email, password });
      
      // Check if backend intercepted the request to send a magic link
      if (res.data?.action === "TRIGGER_UI_TIMER") {
        setSuccess(res.data.message);
        setTimeLeft(res.data.timerDurationMs || 600000); // Sets the 10-minute window
        setShowTimer(true);
        setAttemptsLeft(0); // Update header status to locked
      } else if (res.status === 200) {
        router.push("/admin"); // Highway path direct redirect
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid Credentials";
      setError(errMsg);
      
      // Visually step down attempts remaining on failure
      setAttemptsLeft((prev) => (prev > 1 ? prev - 1 : 5));
    } finally {
      setLoading(false);
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
          <div className=" absolute w-full -top-[1rem] left-0 flex flex-row justify-between items-center bg-[#fff] px-1">
            <span className=" font-bold text-[#640a17] text-[0.6rem] w-auto" >Administrator Login</span>
            <span className=" font-bold text-[#640a17] text-[0.65rem] w-auto ">
              {showTimer ? "LOCKED" : `login attempt: ${attemptsLeft}`}
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full">
          {showTimer ? (
            /* Secure Countdown Presentation View */
            <div className="w-full text-center py-4 flex flex-col items-center">
              <p className="text-[#5C0612] font-bold text-[0.65rem] uppercase tracking-widest mb-2">
                Secure Link Active For
              </p>
              <div className="text-3xl font-bold tracking-[0.1em] text-[#5C0612] font-mono bg-[#F9F3EB] px-6 py-3 rounded-xl border border-[#c5a059] my-2">
                {formatTime(timeLeft)}
              </div>
              {timeLeft <= 0 ? (
                <button 
                  type="button"
                  onClick={() => { setShowTimer(false); setSuccess(""); setError(""); setAttemptsLeft(5); }}
                  className="w-full mt-4 py-3 bg-[#5C0612] text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#3A030B] transition-all duration-300"
                >
                  Request Fresh Session
                </button>
              ) : (
                <p className="text-[#c5a059] text-[0.65rem] font-bold uppercase tracking-widest mt-2 animate-pulse">
                  Check registered email inbox
                </p>
              )}
            </div>
          ) : (
            /* Normal Input Flow View */
            <>
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

              {/* Status Message Display Box (Handles both Errors and Link Success Alerts) */}
              {(error || success) && (
                <div className={`p-3 border rounded-xl text-center mt-4 ${success ? "bg-emerald-50 border-emerald-200" : "bg-[#5C0612]/10 border-[#5C0612]/30"}`}>
                  <p className={`font-semibold text-xs tracking-wider uppercase ${success ? "text-emerald-800" : "text-[#5C0612]"}`}>
                    {error || success}
                  </p>
                </div>
              )}

              {/* Solid Maroon Login Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 bg-[#5C0612] text-[#FFFFFF] rounded-xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-[#3A030B] hover:shadow-[0_8px_20px_rgba(42,0,5,0.4)] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? "Verifying Keys..." : "Login to Dashboard"}
              </button>
            </>
          )}
        </form>

      </div>
    </div>
  );
}