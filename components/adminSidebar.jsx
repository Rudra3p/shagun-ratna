"use client";

import { useState, useEffect } from 'react';
import { 
  ClipboardList, User, LayoutGrid, History, Package, 
  Home, LogOut 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#C5A059]/20 flex flex-col py-10 px-6 text-[#90060c] z-50">
      
      {/* Logo */}
      <Link href="/admin" className="h-[60px] w-full relative block mb-12">
        <Image src="/shagunratnalogo.png" alt="Logo" fill className="object-contain" priority />
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-col gap-8 flex-grow">
        <SidebarItem href="/admin" label="Dashboard" icon={<Home size={18} />} active={pathname === '/admin'} />
        <SidebarItem href="/admin/profile" label="Profile" icon={<User size={18} />} active={pathname.includes('/profile')} />
        <SidebarItem href="/admin/product" label="Products" icon={<Package size={18} />} active={pathname.includes('/product')} />
        <SidebarItem href="/admin/history" label="History" icon={<History size={18} />} active={pathname.includes('/history')} />
        <SidebarItem href="/admin/inquiry" label="Inquiries" icon={<ClipboardList size={18} />} active={pathname.includes('/inquiry')} />
      </nav>

      {/* Footer Auth */}
      <div className="pt-8 border-t border-[#C5A059]/10">
          <SidebarItem href="/admin/logout" label="Logout" icon={<LogOut size={18} />} />
      </div>
    </aside>
  );
};

const SidebarItem = ({ href, label, icon, active }) => (
  <Link 
    href={href} 
    className={`flex items-center gap-4 transition-all duration-300 px-3 py-2 rounded-lg ${
      active ? 'bg-[#90060c]/5 text-[#90060c]' : 'hover:text-[#C5A059] hover:bg-[#faf3e5]'
    }`}
  >
    {icon}
    <span className="tracking-[0.2em] uppercase text-xs font-semibold">{label}</span>
  </Link>
);

export default AdminSidebar;