"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Calendar, ArrowRight, CheckCircle2, Eye, EyeOff, Users } from 'lucide-react';
import { setAuthRedirect, consumeAuthRedirect } from '@/lib/authRedirect';

export default function SigninPage() {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'register'
  const [error, setError] = useState('');

  // Success states
  const [isRegistered, setIsRegistered] = useState(false);
  const [successUser, setSuccessUser] = useState('');

  // Whichever gated page most recently sent the user here — the freshest
  // attempt always wins, even if an earlier one was abandoned without signing in.
  useEffect(() => {
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    if (redirectParam) setAuthRedirect(redirectParam);
  }, []);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regGender, setRegGender] = useState('Male'); 

  // Show/Hide password states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/user/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }
      if (data.user) {
        localStorage.setItem("shagun_user_name", data.user.name);
        localStorage.setItem("shagun_user_dob", data.user.birthdate);
      }
      window.location.href = consumeAuthRedirect('/collection');
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
          birthdate: regDob,
          gender: regGender
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      
      setIsRegistered(true);
      setSuccessUser(regName);
      localStorage.setItem("shagun_user_name", regName);
      localStorage.setItem("shagun_user_dob", regDob);
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#C5A059]/10 to-transparent blur-3xl -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#90060c]/5 to-transparent blur-3xl -bottom-40 -right-40 pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        <AnimatePresence mode="wait">
          {isRegistered ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059] p-8 md:p-10 rounded-2xl shadow-xl text-center relative overflow-hidden"
            >
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
              <h2 className="font-brand text-3xl text-[#1a1a1a] tracking-[0.1em] font-light uppercase mb-8">
                Welcome, {successUser}
              </h2>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { window.location.href = consumeAuthRedirect('/collection'); }}
                  className="relative w-full font-sans py-4 text-xs tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.25)] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Go To My Collection <ArrowRight size={14} />
                  </span>
                  <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059]/30 p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C5A059]/30" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C5A059]/30" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C5A059]/30" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C5A059]/30" />

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
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <User size={11} /> Full Name
                    </label>
                    <input 
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Rudra Patel"
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

                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-sans text-[9px] tracking-[0.2em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Users size={11} /> Identifiable Gender Selection
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-transparent border-b border-[#C5A059]/40 py-2 px-1 text-sm text-[#1a1a1a]/80 focus:text-[#1a1a1a] focus:border-[#90060c] outline-none transition-colors duration-500 font-sans cursor-pointer bg-[#FDFBF7]"
                      required
                    >
                      <option value="Male" className="text-[#1a1a1a]">Male</option>
                      <option value="Female" className="text-[#1a1a1a]">Female</option>
                      <option value="Other" className="text-[#1a1a1a]">Other</option>
                    </select>
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
                      Create Account <ArrowRight size={12} />
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