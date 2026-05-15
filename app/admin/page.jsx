"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
          <p className="text-gray-400 text-sm">Inventory</p>
          <h2 className="text-2xl font-bold">0 Items</h2>
        </div>
        {/* Add more stats here */}
      </div>
    </div>
  );
}