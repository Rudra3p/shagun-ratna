"use client";
import AdminSidebar from "@/components/adminSidebar";
import AdminLogin from "@/app/admin/login/page";
import { usePathname } from 'next/navigation';

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminLogin = pathname === '/admin/login';

  // 1. If at login page, render only the login component
  if (isAdminLogin) {
    return <AdminLogin />;
  }

  // 2. Otherwise, render the Sidebar and the Content area
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />      
      
      {/* CHANGES MADE HERE:
        - Removed hardcoded `ml-64`.
        - Added `pt-20` to give space for the fixed mobile header.
        - Added `lg:pt-8` and `lg:ml-64` so it switches beautifully on desktop layout.
      */}
      <main className="flex-grow pt-20 pb-8 px-4 sm:px-6 lg:ml-64 lg:pt-8 lg:p-8 transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}