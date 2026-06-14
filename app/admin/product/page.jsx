"use client";
import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'add', or 'edit'
  const [formData, setFormData] = useState({ productName: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (view === 'add') {
        await adminApi.post('/products', formData);
      } else {
        await adminApi.put(`/products?id=${editingId}`, formData);
      }
      alert(`Product ${view === 'add' ? 'added' : 'updated'}!`);
      setFormData({ productName: '', price: '' });
      setView('list');
      fetchProducts();
    } catch (err) { alert("Failed to save product"); }
  };

  const startEdit = (product) => {
    setFormData({ productName: product.productName, price: product.price });
    setEditingId(product._id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await adminApi.delete(`/products?id=${id}`);
      fetchProducts();
    }
  };

  // --- VIEW: ADD OR EDIT ---
  if (view === 'add' || view === 'edit') {
    return (
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <h1>{view === 'add' ? 'Add New Product' : 'Edit Product'}</h1>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Name" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} required />
          <input placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setView('list')}>Cancel</button>
        </form>
      </div>
    );
  }

  // --- VIEW: LIST ---
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Products</h1>
        <button onClick={() => { setFormData({ productName: '', price: '' }); setView('add'); }}>+ Add New</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>Name</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{p.productName}</td>
                <td style={{ padding: '8px' }}>{p.price}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => startEdit(p)} style={{ marginRight: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}