"use client";
import AdminSidebar from "@/components/adminSidebar";
import AdminLogin from "@/app/admin/login/page";
import { usePathname } from 'next/navigation';

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminLogin = pathname === '/admin/login';

  if (isAdminLogin) {
    return <AdminLogin />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />      
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}