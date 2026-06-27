import { Eye, Calendar, Save, Pencil } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="animate-in fade-in duration-500 pb-10 h-full">
      <div className="max-w-[800px] mx-auto space-y-8 pt-8">
        
        {/* Centered Header */}
        <div className="text-center space-y-2">
          <h2 className="text-[24px] font-sans font-medium text-[#721c24] tracking-tight">
            Account Profile
          </h2>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Name */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Name</label>
              <input 
                type="text" 
                defaultValue="Admin Executive"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans" 
              />
            </div>

            {/* Email */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@corporate.com"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans" 
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Mobile Number</label>
              <input 
                type="tel" 
                defaultValue="+1 (555) 012-3456"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans" 
              />
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-800 outline-none font-sans tracking-[0.2em]" 
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Eye size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Last Updated */}
            <div className="space-y-2.5 md:col-span-2 pt-2">
              <label className="text-[13px] font-medium text-gray-600 font-sans">Last Updated</label>
              <div className="w-full bg-[#f1f5f9] border border-gray-200/80 rounded-lg px-4 py-3 text-[14px] text-gray-400 flex items-center gap-2.5 font-sans cursor-not-allowed">
                <Calendar size={16} className="text-gray-400" />
                October 24, 2023 at 02:45 PM
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="w-full bg-[#f1f4f9] border border-gray-200 text-gray-800 font-medium text-[15px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-gray-200 shadow-sm">
            <Pencil size={16} strokeWidth={2} />
            Edit Profile
          </button>
          <button className="w-full bg-[#540411] border border-[#540411] text-white font-medium text-[15px] py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:bg-[#400009]">
            <Save size={16} strokeWidth={2} />
            Save Changes
          </button>
        </div>
        
      </div>
    </div>
  );
}