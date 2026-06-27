"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, UserCircle, Package, History, MessageSquare, LogOut, GitMerge, Menu, Workflow
} from 'lucide-react';

// --- VITE PREVIEW MOCKS ---
// Uncomment the Next.js imports above when moving to your Next.js app.
// const Link = ({ href, className, children, onClick }) => (
//   <a href={href} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
// );
// // --------------------------

const AdminSidebar = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- VITE PREVIEW MOCK PATHNAME ---
  const currentPath = usePathname();
  
  const handleNavigate = (view) => {
    if (onChangeView) onChangeView(view);
    setIsOpen(false);
  };
  // ---------------------------------

  const handleLogout = async () => {
    // Mock forced reload to clear state
    alert("Logging out...");
  };

  return (
    <>
      {/* Mobile Header (rendered at the top, only visible on small screens) */}
      <header className="lg:hidden sticky top-0 z-[70] bg-[#f1f4f9] shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-[#540411]"
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

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[75] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar with dynamic translate-x based on isOpen */}
      <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-[#f1f4f9] flex flex-col z-[80] shadow-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Top Profile Area matching Stitch AI Theme */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#721c24] to-[#540411] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <LayoutDashboard size={20} className="opacity-90" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-sans font-bold text-[#540411] truncate text-[20px] leading-tight">Admin Executive</h3>
              <p className="text-[12px] text-[#5c5f60] truncate font-medium">admin@corporate.com</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#ffdad9] text-[#80272e] text-[10px] font-bold tracking-wider rounded-full uppercase shadow-sm">
              Premium Access
            </span>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-1 px-2 mt-4 flex-grow overflow-y-auto">
          <SidebarItem 
            active={currentPath === '/admin'} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            href="/admin" 
            onClick={() => handleNavigate('dashboard')}
          />
          <SidebarItem 
            active={currentPath === '/admin/profile'} 
            icon={<UserCircle size={20} />} 
            label="Profile" 
            href="/admin/profile" 
            onClick={() => handleNavigate('profile')}
          />
          <SidebarItem 
            active={currentPath === '/admin/product'} 
            icon={<Package size={20} />} 
            label="Products" 
            href="/admin/product" 
            onClick={() => handleNavigate('products')}
          />
          <SidebarItem 
            active={currentPath === '/admin/product-mapping'} 
            icon={<GitMerge size={20} />} 
            label="Product Mapping" 
            href="/admin/product-mapping" 
            onClick={() => handleNavigate('products')} // Reuse products
          />
          <SidebarItem 
            active={currentPath === '/admin/history'} 
            icon={<History size={20} />} 
            label="History" 
            href="/admin/history" 
            onClick={() => handleNavigate('history')}
          />
          <SidebarItem 
            active={currentPath === '/admin/reviews'} 
            icon={<MessageSquare size={20} />} 
            label="Reviews" 
            href="/admin/reviews" 
            onClick={() => handleNavigate('reviews')}
          />
        </nav>

        {/* Footer Auth */}
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