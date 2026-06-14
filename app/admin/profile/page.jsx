"use client";
import { useState, useEffect } from 'react';
import adminApi from '@/lib/adminApi';

export default function Profile() {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [name, setName] = useState('');
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  // 1. Initial Fetch
  useEffect(() => {
    adminApi.get('/profile')
      .then((res) => {
        setAdmin(res.data);
        setName(res.data.name);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // 2. Update Name (PUT)
  const handleUpdateName = async () => {
    try {
      const res = await adminApi.put('/profile', { name });
      setAdmin(res.data.admin);
      alert("Name updated successfully!");
    } catch (err) { alert(err.response?.data?.error || "Update failed"); }
  };

  // 3. Update Password (PATCH)
  const handleUpdatePass = async () => {
    try {
      await adminApi.patch('/profile', passData);
      alert("Password updated successfully!");
      setPassData({ currentPassword: '', newPassword: '' }); // Reset fields
    } catch (err) { alert(err.response?.data?.error || "Password update failed"); }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>My Profile</h1>
      <p><strong>Email:</strong> {admin.email} (Fixed)</p>

      <hr style={{ margin: '20px 0' }} />

      {/* Name Update Form */}
      <div>
        <label>Display Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <button onClick={handleUpdateName}>Save Name</button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* Password Update Form */}
      <div>
        <h3>Change Password</h3>
        <input 
          type="password" 
          placeholder="Current Password" 
          onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
          style={{ display: 'block', margin: '5px 0', padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="New Password" 
          onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
          style={{ display: 'block', margin: '5px 0', padding: '8px' }}
        />
        <button onClick={handleUpdatePass}>Update Password</button>
      </div>
    </div>
  );
}