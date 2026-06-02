"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/nav';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // This will hide the Navbar on any route starting with /admin
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main>{children}</main>
    </>
  );
}