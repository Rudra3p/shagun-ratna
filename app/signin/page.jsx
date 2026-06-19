"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Calendar, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// Zodiac & birthstone calculator
const getGemstoneAndZodiac = (dobString) => {
  if (!dobString) return null;
  const date = new Date(dobString);
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();

  let zodiac = "";
  let gemstone = "";
  let description = "";

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    zodiac = "Aries";
    gemstone = "Diamond";
    description = "Symbolizes strength, clarity, and eternal love. Amplifies energy and focus.";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    zodiac = "Taurus";
    gemstone = "Emerald";
    description = "The stone of wisdom, growth, and patience. Nurtures the heart and brings prosperity.";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    zodiac = "Gemini";
    gemstone = "Pearl";
    description = "Represents purity, balance, and wisdom. Calms the mind and enhances intuition.";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    zodiac = "Cancer";
    gemstone = "Ruby";
    description = "Stone of passion, courage, and vitality. Ignites enthusiasm and protects the heart.";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    zodiac = "Leo";
    gemstone = "Peridot";
    description = "Brings light, joy, and spiritual protection. Instills confidence and attracts good fortune.";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    zodiac = "Virgo";
    gemstone = "Blue Sapphire";
    description = "Symbolizes loyalty, truth, and mental clarity. Brings inner peace and spiritual insight.";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    zodiac = "Libra";
    gemstone = "Opal";
    description = "Stone of inspiration, hope, and love. Enhances creativity and amplifies emotions.";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    zodiac = "Scorpio";
    gemstone = "Topaz";
    description = "Brings healing, strength, and manifestation. Calms anger and promotes forgiveness.";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    zodiac = "Sagittarius";
    gemstone = "Tanzanite";
    description = "Promotes spiritual growth, truth, and transformation. Stimulates intuition.";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    zodiac = "Capricorn";
    gemstone = "Garnet";
    description = "Brings grounding energy, security, and vitality. Ignites passion and dedication.";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    zodiac = "Aquarius";
    gemstone = "Amethyst";
    description = "A powerful meditative stone. Promotes spiritual wisdom, sobriety, and tranquility.";
  } else {
    zodiac = "Pisces";
    gemstone = "Aquamarine";
    description = "The stone of the sea. Calms fears, enhances communication, and brings eternal youth.";
  }

  return { zodiac, gemstone, description };
};

export default function SigninPage() {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'register'
  const [error, setError] = useState('');
  const [successGemstone, setSuccessGemstone] = useState(null);
  const [successUser, setSuccessUser] = useState('');

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDob, setRegDob] = useState('');

  // OTP states
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState(''); // 'signin' or 'register'

  // Show/Hide password states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }
      if (data.step === 'AWAITING_OTP') {
        setOtpEmail(data.email);
        setOtpType('signin');
        setOtpCode('');
        setCurrentStep('otp');
        return;
      }
      // Successful Login (Fallback)
      if (data.user) {
        localStorage.setItem("shagun_user_name", data.user.name);
        localStorage.setItem("shagun_user_dob", data.user.birthdate);
      }
      window.location.href = '/my-collection';
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          birthdate: regDob
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      if (data.step === 'AWAITING_OTP') {
        setOtpEmail(data.email);
        setOtpType('register');
        setOtpCode('');
        setCurrentStep('otp');
        return;
      }
      // Successful registration (Fallback)
      const alignment = getGemstoneAndZodiac(regDob);
      setSuccessGemstone(alignment);
      setSuccessUser(regName);
      localStorage.setItem("shagun_user_name", regName);
      localStorage.setItem("shagun_user_dob", regDob);
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, token: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }
      if (data.user) {
        localStorage.setItem("shagun_user_name", data.user.name);
        localStorage.setItem("shagun_user_dob", data.user.birthdate);
      }
      if (otpType === 'register') {
        const userDob = regDob || data.user?.birthdate || '';
        const alignment = getGemstoneAndZodiac(userDob);
        setSuccessGemstone(alignment);
        setSuccessUser(data.user?.name || regName);
      } else {
        window.location.href = '/my-collection';
      }
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Luxury Background Circles */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#C5A059]/10 to-transparent blur-3xl -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#90060c]/5 to-transparent blur-3xl -bottom-40 -right-40 pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        <AnimatePresence mode="wait">
          {successGemstone ? (
            // Astrological Gemstone suggestion card on signup success
            <motion.div
              key="suggestion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059] p-8 md:p-10 rounded-2xl shadow-xl text-center relative overflow-hidden"
            >
              {/* Gold corners */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C5A059]" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C5A059]" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C5A059]" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C5A059]" />

              <div className="flex justify-center mb-6">
                <CheckCircle2 size={48} className="text-[#90060c]" />
              </div>

              <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] block mb-2">
                Registration Successful
              </span>
              <h2 className="font-brand text-3xl text-[#1a1a1a] tracking-[0.1em] font-light uppercase">
                Welcome, {successUser}
              </h2>

              <div className="w-16 h-[1px] bg-[#C5A059] mx-auto my-6" />

              <div className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-xl p-6 py-8 mb-8 relative">
                <Sparkles size={16} className="text-[#C5A059] absolute top-3 right-3 animate-pulse" />
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] font-bold">
                  Zodiac Alignment: {successGemstone.zodiac}
                </span>
                <h3 className="font-brand text-4xl text-[#90060c] tracking-[0.1em] font-normal uppercase mt-3">
                  {successGemstone.gemstone}
                </h3>
                <p className="font-sans text-xs leading-relaxed text-[#1a1a1a]/80 mt-4 tracking-[0.05em]">
                  {successGemstone.description}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/my-collection">
                  <button className="relative w-full font-sans py-4 text-xs tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.25)] active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Acquire {successGemstone.gemstone} <ArrowRight size={14} />
                    </span>
                    <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </button>
                </Link>

                <button 
                  onClick={() => {
                    setSuccessGemstone(null);
                    setSuccessUser('');
                    setActiveTab('signin');
                    setCurrentStep('form');
                  }}
                  className="font-sans text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold hover:text-[#90060c] transition-colors duration-300"
                >
                  Continue to Sign In
                </button>
              </div>
            </motion.div>
          ) : currentStep === 'otp' ? (
            // OTP Verification Form
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059]/30 p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden"
            >
              {/* Gold frame corners */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C5A059]/30" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C5A059]/30" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C5A059]/30" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C5A059]/30" />

              <div className="text-center mb-6">
                <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] block mb-2">
                  Security Verification
                </span>
                <h2 className="font-brand text-2xl text-[#1a1a1a] tracking-[0.1em] font-light uppercase text-center">
                  Verify Your Account
                </h2>
                <p className="font-sans text-xs text-[#1a1a1a]/60 mt-2 text-center">
                  A 6-digit verification code has been sent to <span className="font-bold text-[#90060c]">{otpEmail}</span>.
                </p>
              </div>

              {error && (
                <div className="bg-[#90060c]/10 border border-[#90060c]/30 text-[#90060c] px-4 py-3 rounded-lg text-xs tracking-[0.05em] mb-6 text-center font-sans">
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 items-start w-full">
                  <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5 w-full">
                    <Lock size={11} /> Verification Code
                  </label>
                  <input 
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-transparent border-b border-[#C5A059]/40 py-2.5 px-1 text-center text-lg tracking-[0.5em] font-mono text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500"
                    maxLength={6}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="relative w-full font-sans py-4 mt-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.2)] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Verify & Continue <ArrowRight size={12} />
                  </span>
                  <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setCurrentStep('form');
                    setError('');
                  }}
                  className="font-sans text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-bold hover:text-[#90060c] transition-colors duration-300 mt-2 text-center"
                >
                  Back to {otpType === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          ) : (
            // Sign In & Registration form
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059]/30 p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden"
            >
              {/* Gold frame corners */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C5A059]/30" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C5A059]/30" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C5A059]/30" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C5A059]/30" />

              {/* Tab Selector */}
              <div className="flex border-b border-[#C5A059]/20 mb-8 font-sans text-xs tracking-[0.25em] uppercase font-bold">
                <button 
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className={`flex-1 pb-4 transition-colors duration-500 ${activeTab === 'signin' ? 'text-[#90060c] border-b-2 border-[#90060c]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`flex-1 pb-4 transition-colors duration-500 ${activeTab === 'register' ? 'text-[#90060c] border-b-2 border-[#90060c]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'}`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="bg-[#90060c]/10 border border-[#90060c]/30 text-[#90060c] px-4 py-3 rounded-lg text-xs tracking-[0.05em] mb-6 text-center font-sans">
                  {error}
                </div>
              )}

              {activeTab === 'signin' ? (
                // Sign In Form
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Mail size={11} /> Email Address
                    </label>
                    <input 
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2.5 px-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-start w-full">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Lock size={11} /> Password
                    </label>
                    <div className="relative w-full flex items-center">
                      <input 
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#C5A059]/40 py-2.5 pr-8 pl-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-1 text-[#C5A059] hover:text-[#90060c] transition-colors duration-300 pb-1"
                      >
                        {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="relative w-full font-sans py-4 mt-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.2)] active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Sign In <ArrowRight size={12} />
                    </span>
                    <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </button>
                </form>
              ) : (
                // Registration Form
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <User size={11} /> Full Name
                    </label>
                    <input 
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Rudra Shah"
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 px-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Mail size={11} /> Email Address
                    </label>
                    <input 
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rudra@example.com"
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 px-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Phone size={11} /> Phone Number
                    </label>
                    <input 
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 px-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Calendar size={11} /> Date of Birth
                    </label>
                    <input 
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 px-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-start w-full">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Lock size={11} /> Password (Min. 8 characters)
                    </label>
                    <div className="relative w-full flex items-center">
                      <input 
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 pr-8 pl-1 text-sm text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-1 text-[#C5A059] hover:text-[#90060c] transition-colors duration-300 pb-1"
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="relative w-full font-sans py-4 mt-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.2)] active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Register & Consult <Sparkles size={12} className="animate-pulse" />
                    </span>
                    <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}