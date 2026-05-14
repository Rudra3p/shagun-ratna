// This goes in: app/admin/layout.js
export const metadata = {
  title: 'Admin Dashboard', // Becomes "Admin Dashboard | Shagun Ratna"
  description: 'Internal business management system for Shagun Ratna.',
  robots: {
    index: false, // CRITICAL: This hides your admin login from Google search
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <section>{children}</section>;
}