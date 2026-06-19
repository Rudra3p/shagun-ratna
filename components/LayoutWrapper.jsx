// components/LayoutWrapper.js
"use client";

import Navbar from "@/components/nav";
import FeedbackForm from "@/components/Feedback";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  // If we are in the admin section, render ONLY children.
  // The AdminLayoutWrapper will handle the Sidebar and its own <main> tag.
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Otherwise, render the standard public site layout
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <FeedbackForm />
    </>
  );
}