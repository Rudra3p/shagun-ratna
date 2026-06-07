"use client";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? "pt-0" : "pt-16"}> {/* Adjust top padding for admin */}
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}