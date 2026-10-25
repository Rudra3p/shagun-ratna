"use client";
import AdminSidebar from "@/components/adminSidebar";
import AdminLogin from "@/app/admin/login/page";
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminLogin = pathname === '/admin/login';
  const isWideLayoutPage = pathname === '/admin/home-page' || pathname === '/admin/about-page';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const shouldCollapseSidebar = isWideLayoutPage && isSidebarCollapsed;

  // 1. If at login page, render only the login component
  if (isAdminLogin) {
    return <AdminLogin />;
  }

  // 2. Otherwise, render the Sidebar and the Content area
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar collapsed={shouldCollapseSidebar} />

      {isWideLayoutPage && (
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          className="hidden lg:inline-flex fixed top-6 right-8 z-40 h-10 w-10 items-center justify-center rounded-md bg-black/70 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label={shouldCollapseSidebar ? 'Show admin sidebar' : 'Hide admin sidebar'}
          title={shouldCollapseSidebar ? 'Show admin sidebar' : 'Hide admin sidebar'}
        >
          {shouldCollapseSidebar ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      )}

      <main className={`grow transition-[margin] duration-300 w-full ${isWideLayoutPage ? 'p-0 pt-0' : 'pt-20 pb-8 px-4 sm:px-6 lg:pt-8 lg:p-8'} ${shouldCollapseSidebar ? 'lg:ml-0' : 'lg:ml-65'}`}>
        <div className={isWideLayoutPage ? 'w-full' : 'max-w-7xl mx-auto'}>
          {children}
        </div>
      </main>
    </div>
  );
}
