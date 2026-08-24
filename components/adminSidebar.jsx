"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import {
  LayoutDashboard, UserCircle, Package, History, MessageSquare, LogOut, GitMerge,
  Menu, Workflow, X, Inbox, Image as ImageIcon, LayoutGrid, TrendingUp,
  ChevronDown, Gem, Palette, Users2, Settings
} from 'lucide-react';

// Grouped nav, in the shape of the MongoDB Atlas sidebar: one standalone entry at
// the top, then collapsible sections so the list reads as a few short groups
// rather than ten flat links.
const NAV_GROUPS = [
  {
    id: 'catalogue',
    label: 'Catalogue',
    icon: Gem,
    items: [
      { label: 'Products', href: '/admin/product', icon: Package },
      { label: 'Metal Rates', href: '/admin/metal-rates', icon: TrendingUp },
      { label: 'Collections', href: '/admin/product-mapping', icon: GitMerge },
    ],
  },
  {
    id: 'storefront',
    label: 'Storefront',
    icon: Palette,
    items: [
      { label: 'Homepage Grid', href: '/admin/homepage-grid', icon: LayoutGrid },
      { label: 'Site Images', href: '/admin/site-images', icon: ImageIcon },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users2,
    items: [
      { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
      { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
      { label: 'History', href: '/admin/history', icon: History },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    icon: Settings,
    items: [
      { label: 'Profile', href: '/admin/profile', icon: UserCircle },
    ],
  },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const currentPath = usePathname();

  // Any group holding the current page starts open, so a deep link never lands the
  // admin on a page whose section is collapsed.
  const [openGroups, setOpenGroups] = useState(() =>
    NAV_GROUPS.reduce((acc, group) => {
      acc[group.id] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    const active = NAV_GROUPS.find((g) => g.items.some((i) => currentPath === i.href || currentPath.startsWith(`${i.href}/`)));
    if (active) setOpenGroups((prev) => ({ ...prev, [active.id]: true }));
  }, [currentPath]);

  useEffect(() => {
    let cancelled = false;
    adminApi.get('/profile')
      .then((res) => {
        if (!cancelled) setAdminEmail(res.data?.email || '');
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      // Hits your app/api/admin/logout/route.ts route
      await adminApi.post('/logout');
    } catch (error) {
      console.error("Backend logout failed, clearing local session anyway:", error);
    } finally {
      // Always clear local data and redirect, even if the server check fails
      window.location.href = '/admin/login'; // Redirect to login page
    }
  };

  const toggleGroup = (id) => setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  const closeDrawer = () => setIsOpen(false);

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
        onClick={closeDrawer}
      />

      {/* Sidebar Drawer (z-50: slides out from left to right OVER everything else) */}
      <aside className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[#f1f4f9] flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        {/* Top Profile / Close Area */}
        <div className="p-6 pb-4 relative">
          {/* Mobile Close Button */}
          <button
            onClick={closeDrawer}
            className="lg:hidden absolute top-5 right-4 p-1.5 rounded-lg text-[#5c5f60] hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 pr-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#721c24] to-[#540411] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <LayoutDashboard size={20} className="opacity-90" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-sans font-bold text-[#540411] truncate text-[20px] leading-tight">Admin</h3>
              <p className="text-[12px] text-[#5c5f60] truncate font-medium">{adminEmail || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-2 mt-2 flex-grow overflow-y-auto pb-4">
          {/* Standalone entry, above the groups */}
          <SidebarItem
            active={currentPath === '/admin'}
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            href="/admin"
            onClick={closeDrawer}
          />

          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isGroupOpen = openGroups[group.id];
            const hasActiveChild = group.items.some((i) => currentPath === i.href || currentPath.startsWith(`${i.href}/`));

            return (
              <div key={group.id} className="mt-4">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isGroupOpen}
                  className="w-full flex items-center gap-2.5 px-4 py-1.5 text-[#5c5f60] hover:text-[#181c20] transition-colors group/header focus:outline-none focus-visible:ring-2 focus-visible:ring-[#540411]/40 rounded-md"
                >
                  <GroupIcon size={14} className={hasActiveChild ? 'text-[#540411]' : 'text-[#8a8d8e]'} />
                  <span className={`text-[11px] font-sans font-bold uppercase tracking-[0.1em] ${hasActiveChild ? 'text-[#540411]' : ''}`}>
                    {group.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`ml-auto text-[#8a8d8e] transition-transform duration-200 ${isGroupOpen ? '' : '-rotate-90'}`}
                  />
                </button>

                {isGroupOpen && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {group.items.map((item) => (
                      <SidebarItem
                        key={item.href}
                        active={currentPath === item.href || currentPath.startsWith(`${item.href}/`)}
                        icon={<item.icon size={17} />}
                        label={item.label}
                        href={item.href}
                        onClick={closeDrawer}
                        nested
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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

const SidebarItem = ({ active, icon, label, href, onClick, nested = false }) => (
  <Link
    href={href}
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`flex items-center gap-3 py-2.5 rounded-lg transition-all w-full text-left relative ${
      nested ? 'pl-9 pr-4' : 'px-4'
    } ${
      active
        ? 'bg-[#ffdad9] text-[#80272e] font-semibold rounded-l-none'
        : 'text-[#5c5f60] hover:bg-[#e0e3e8] hover:text-[#181c20]'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#540411] rounded-r-md" />
    )}
    <div className={active ? 'text-[#540411]' : 'text-[#5c5f60]'}>
      {icon}
    </div>
    <span className="text-[13.5px]">{label}</span>
  </Link>
);
