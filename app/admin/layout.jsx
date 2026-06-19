// app/admin/layout.js
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

export const metadata = {
  title: 'Admin Dashboard | Shagun Ratna',
  description: 'Internal business management system for Shagun Ratna.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    // You must pass 'children' to the wrapper so they appear in the main area
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  );
}