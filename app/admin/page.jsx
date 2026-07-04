"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  MessageSquare,
  Users,
  Clock,
  Eye,
  Settings,
  Star,
  Inbox
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const mockChartData = [
  { name: "1", value: 25 },
  { name: "2", value: 45 },
  { name: "3", value: 35 },
  { name: "4", value: 55 },
  { name: "5", value: 35 },
  { name: "6", value: 65 },
  { name: "7", value: 35 },
  { name: "8", value: 45 },
];

export default function DashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- MOCK API FOR PREVIEW ---
    setTimeout(() => {
      setData({
        totalProducts: 1,
        totalReviews: 482,
        totalUsers: 124,
        pendingInquiries: 12,
        liveVisitors: "15,420",
      });
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#721c24]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-[18px] font-sans font-bold text-[#721c24] tracking-tight leading-tight">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#721c24] text-white rounded-lg text-[13px] font-bold shadow-md hover:bg-[#540411] transition-all tracking-wide">
            <Calendar size={16} />
            Sept 2024
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[13px] font-bold text-gray-500 tracking-widest leading-relaxed font-sans uppercase">
              TOTAL<br />PRODUCTS
            </h3>
            <div className="w-10 h-10 rounded-[14px] bg-[#ffecec] flex items-center justify-center text-[#721c24]">
              <Package size={20} strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-[32px] font-sans font-bold text-gray-900 leading-none">
              {data?.totalProducts}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[12px] font-bold text-[#d32f2f]">
                0% <span className="font-medium text-gray-400 ml-1">vs last month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[13px] font-bold text-gray-500 tracking-widest leading-relaxed font-sans uppercase">
              TOTAL<br />REVIEWS
            </h3>
            <div className="w-10 h-10 rounded-[14px] bg-[#ffecec] flex items-center justify-center text-[#721c24]">
              <MessageSquare size={20} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[32px] font-sans font-bold text-gray-900 leading-none">
                {data?.totalReviews}
              </p>
              <div className="flex items-center text-[13px] font-bold text-gray-700">
                <Star size={14} className="mr-1 fill-transparent" /> 4.8
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[12px] font-bold text-emerald-600">
                +5% <span className="font-medium text-gray-400 ml-1">vs last month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[13px] font-bold text-gray-500 tracking-widest leading-relaxed font-sans uppercase">
              TOTAL USERS
            </h3>
            <div className="w-10 h-10 rounded-[14px] bg-[#ffecec] flex items-center justify-center text-[#721c24]">
              <Users size={20} strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-[32px] font-sans font-bold text-gray-900 leading-none">
              {data?.totalUsers}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[12px] font-bold text-emerald-600">
                +12% <span className="font-medium text-gray-400 ml-1">vs last month</span>
              </span>
            </div>
          </div>
        </div>
        {/* Card 4: Pending Inquiries */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[13px] font-bold text-gray-500 tracking-widest leading-relaxed font-sans uppercase">
              PENDING<br />INQUIRIES
            </h3>
            <div className="w-10 h-10 rounded-[14px] bg-[#ffecec] flex items-center justify-center text-[#721c24]">
              <Inbox size={20} strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-[32px] font-sans font-bold text-gray-900 leading-none">
              {data?.pendingInquiries || "0"}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[12px] font-bold text-[#d32f2f]">
                Action needed <span className="font-medium text-gray-400 ml-1">today</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Today's Live Visitors */}
        <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col relative h-[300px]">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              TODAY'S LIVE VISITORS
            </h3>
            <div className="w-10 h-10 rounded-[14px] bg-[#ffecec] flex items-center justify-center text-[#721c24]">
              <Eye size={20} strokeWidth={2} />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center mt-[-20px]">
            <div className="flex items-center justify-center">
              <p className="text-[48px] font-sans font-bold text-gray-900 leading-none">
                {data?.liveVisitors}
              </p>
              <div className="w-4 h-4 rounded-full bg-emerald-500 ml-3 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="mt-4">
              <span className="text-[13px] font-bold text-emerald-600">
                +8% <span className="font-medium text-gray-400 ml-1">vs last month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Visitors Chart */}
        <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-[#721c24] font-sans">
              Visitors
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#540411]"></span>
              <span className="text-[12px] text-gray-500 font-medium font-sans">
                Projected
              </span>
            </div>
          </div>

          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(value) => [value, "Visitors"]}
                  labelStyle={{ display: "none" }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                  {mockChartData.map((entry, index) => {
                    let fill = "#8b4f56"; // Lighter crimson for regular bars
                    if (index === 5) fill = "#540411"; // Dark crimson for peak
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live System Sync Banner */}
      <div className="mt-6 bg-[#721c24] rounded-[20px] p-8 relative overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
        {/* Subtle background circles for depth */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-white/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] border border-white/5 rounded-full translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] border border-white/5 rounded-full -translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-[28px] font-sans font-bold tracking-tight mb-3 text-white">
            Live System Sync
          </h2>
          <p className="text-[#dcc0bf] text-[15px] leading-relaxed font-sans font-medium">
            System parameters are fetched every minute to display active visitors while
            maintaining an optimal light server load.
          </p>
        </div>

        <div className="relative z-10 shrink-0 w-full lg:w-auto">
          <div className="bg-white/10 border border-white/20 px-6 py-5 rounded-[16px] flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <Settings size={22} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-bold text-white text-[16px] tracking-wide font-sans">
                Next Sync: 60s
              </h4>
              <p className="text-[13px] text-[#dcc0bf] mt-0.5 font-medium font-sans">
                Low Load Protocol
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
