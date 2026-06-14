"use client";
import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/dashboard')
      .then((res) => {
        console.log("Data from Backend:", res.data); // <--- CHECK THIS
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Overview</h1>

      {/* KPI Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3>Total Products</h3>
          <p style={bigNumber}>{data.totalProducts}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <p style={bigNumber}>₹{data.totalOfflineRevenue}</p>
        </div>
      </div>

      {/* Low Stock & Inquiries Section */}
      <div style={{ marginTop: '40px' }}>
        <h2>Low Stock Alerts</h2>
        <ul>
          {data.lowStockItems.map((item) => (
            <li key={item._id}>{item.productName} ({item.stock} left)</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const cardStyle = { padding: '20px', border: '1px solid #ddd', borderRadius: '8px' };
const bigNumber = { fontSize: '2rem', fontWeight: 'bold' };