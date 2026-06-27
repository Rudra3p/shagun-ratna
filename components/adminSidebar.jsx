"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import { 
  LayoutDashboard, UserCircle, Package, History, MessageSquare, LogOut, GitMerge, Menu, Workflow, X
} from 'lucide-react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

const handleLogout = async () => {
    try {
      // Hits your app/api/admin/logout/route.ts route
      await adminApi.post('/logout'); 
    } catch (error) {
      console.error("Backend logout failed, clearing local session anyway:", error);
    } finally {
      // Always clear local data and redirect, even if the server check fails
      sessionStorage.clear();
      localStorage.removeItem('token'); // Clear token if you are storing it here
      router.push('/admin/login');
    }
  };

  return (
    <>
      {/* Mobile Header (Fixed at the top, leaves main content completely alone) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-30 bg-[#f1f4f9] border-b border-gray-200/50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-[#540411]"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#721c24] to-[#540411] flex items-center justify-center text-white">
              <Workflow size={18} />
            </div>
            <span className="text-xl text-[#540411] font-bold">Admin</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#ffdad9] flex items-center justify-center text-[#80272e]">
          <UserCircle size={20} />
        </div>
      </header>

      {/* Backdrop Overlay (z-40: sits on top of everything except the actual drawer) */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Drawer (z-50: slides out from left to right OVER everything else) */}
      <aside className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[#f1f4f9] flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Top Profile / Close Area */}
        <div className="p-6 pb-4 relative">
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-5 right-4 p-1.5 rounded-lg text-[#5c5f60] hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-6 pr-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#721c24] to-[#540411] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <LayoutDashboard size={20} className="opacity-90" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-sans font-bold text-[#540411] truncate text-[20px] leading-tight">Admin</h3>
              <p className="text-[12px] text-[#5c5f60] truncate font-medium">admin@corporate.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-2 mt-4 flex-grow overflow-y-auto">
          <SidebarItem 
            active={currentPath === '/admin'} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            href="/admin" 
            onClick={() => setIsOpen(false)}
          />
          <SidebarItem 
            active={currentPath === '/admin/profile'} 
            icon={<UserCircle size={20} />} 
            label="Profile" 
            href="/admin/profile" 
            onClick={() => setIsOpen(false)}
          />
          <SidebarItem 
            active={currentPath === '/admin/product'} 
            icon={<Package size={20} />} 
            label="Products" 
            href="/admin/product" 
            onClick={() => setIsOpen(false)}
          />
          <SidebarItem 
            active={currentPath === '/admin/product-mapping'} 
            icon={<GitMerge size={20} />} 
            label="Product Mapping" 
            href="/admin/product-mapping" 
            onClick={() => setIsOpen(false)}
          />
          <SidebarItem 
            active={currentPath === '/admin/history'} 
            icon={<History size={20} />} 
            label="History" 
            href="/admin/history" 
            onClick={() => setIsOpen(false)}
          />
          <SidebarItem 
            active={currentPath === '/admin/reviews'} 
            icon={<MessageSquare size={20} />} 
            label="Reviews" 
            href="/admin/reviews" 
            onClick={() => setIsOpen(false)}
          />
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#dcc0bf]/30 pb-6 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg hover:bg-[#e0e3e8] text-[#5c5f60] transition-colors group"
          >
            <LogOut size={20} className="text-[#5c5f60] group-hover:text-[#181c20] transition-colors" />
            <span className="text-[14px] font-sans font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

const SidebarItem = ({ active, icon, label, href, onClick }) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all w-full text-left relative ${
      active 
        ? 'bg-[#ffdad9] text-[#80272e] font-semibold rounded-l-none' 
        : 'text-[#5c5f60] hover:bg-[#e0e3e8] hover:text-[#181c20]'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#540411] rounded-r-md"></div>
    )}
    <div className={active ? 'text-[#540411]' : 'text-[#5c5f60]'}>
      {icon}
    </div>
    <span className="text-[14px]">{label}</span>
  </Link>
);