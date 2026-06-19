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
      <main className="flex-grow ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}