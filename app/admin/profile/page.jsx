"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Calendar, Save, Pencil } from 'lucide-react';
import adminApi from '@/lib/adminApi'; // Adjust this path based on where your axios instance lives

export default function ProfileView() {
  // State variables for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); // Blank by default, server only updates if typed
  const [lastUpdated, setLastUpdated] = useState("");

  // UI behavior control states
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", isError: false });

  // 1. Fetch data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminApi.get('/profile');
        const data = response.data;
        
        setName(data.username || "");
        setEmail(data.email || "");
        setMobile(data.mobile !== undefined ? String(data.mobile) : "");
        
        if (data.updatedAt) {
          const date = new Date(data.updatedAt);
          setLastUpdated(date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setMessage({ text: "Failed to load profile data.", isError: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handle Profile Update Submission
  const handleSave = async () => {
    setMessage({ text: "", isError: false });
    try {
      const updateData = {
        username: name.trim(),
        email: email.trim(),
        mobile: Number(mobile), // Send strictly as a number data type
      };

      // Only pass password if the user intentionally filled it in
      if (password && password.trim() !== "") {
        updateData.password = password;
      }

      const response = await adminApi.put('/profile', updateData);
      
      setMessage({ text: response.data.message || "Profile updated successfully!", isError: false });
      setIsEditable(false); // Relock inputs
      setPassword(""); // Reset password field string reference safely
      
      if (response.data.admin?.updatedAt) {
        const date = new Date(response.data.admin.updatedAt);
        setLastUpdated(date.toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }));
      }
    } catch (error) {
      const serverError = error.response?.data?.error || "Failed to update profile.";
      setMessage({ text: serverError, isError: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-[#721c24] font-medium animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10 h-full">
      <div className="max-w-[800px] mx-auto space-y-8 pt-8">
        
        {/* Centered Header */}
        <div className="text-center space-y-2">
          <h2 className="text-[24px] font-sans font-medium text-[#721c24] tracking-tight">
            Account Profile
          </h2>
          {message.text && (
            <p className={`text-[14px] font-medium ${message.isError ? 'text-red-600' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Name */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditable}
                placeholder="Admin Executive"
                className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans transition-all ${
                  !isEditable ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed select-none' : 'bg-[#f8fafc]'
                }`} 
              />
            </div>

            {/* Email */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditable}
                placeholder="admin@corporate.com"
                className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans transition-all ${
                  !isEditable ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed select-none' : 'bg-[#f8fafc]'
                }`} 
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Mobile Number</label>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={!isEditable}
                placeholder="Mobile number string reference"
                className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans transition-all ${
                  !isEditable ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed select-none' : 'bg-[#f8fafc]'
                }`} 
              />
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEditable}
                  placeholder={isEditable ? "Leave blank to keep unchanged" : "••••••••"}
                  className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans transition-all ${
                    !isEditable ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed select-none tracking-normal' : 'bg-[#f8fafc] tracking-[0.1em]'
                  }`} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Last Updated */}
            <div className="space-y-2.5 md:col-span-2 pt-2">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Last Updated</label>
              <div className="w-full bg-[#f1f5f9] border border-gray-200/80 rounded-lg px-4 py-3 text-[14px] text-gray-400 flex items-center gap-2.5 font-sans cursor-not-allowed select-none">
                <Calendar size={16} className="text-gray-400" />
                {lastUpdated || "Not available yet"}
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className={`w-full border font-medium text-[15px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
              isEditable 
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' 
                : 'bg-[#f1f4f9] border border-gray-200 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Pencil size={16} strokeWidth={2} />
            {isEditable ? "Cancel Editing" : "Edit Profile"}
          </button>
          
          <button 
            type="button"
            onClick={handleSave}
            disabled={!isEditable}
            className={`w-full border font-medium text-[15px] py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${
              !isEditable 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-[#540411] border border-[#540411] text-white hover:bg-[#400009]'
            }`}
          >
            <Save size={16} strokeWidth={2} />
            Save Changes
          </button>
        </div>
        
      </div>
    </div>
  );
}