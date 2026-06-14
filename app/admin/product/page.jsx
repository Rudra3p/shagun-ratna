"use client";
import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'add', or 'edit'
  
  // Initial state matches your Mongoose model schema
  const [formData, setFormData] = useState({ 
    productName: '', 
    price: '', 
    category: 'General', 
    discount: 0, 
    offerPrice: 0 
  });
  
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
    
    // Crucial: Convert string inputs to Numbers for Zod/Mongoose validation
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      offerPrice: parseFloat(formData.offerPrice)
    };

    try {
      if (view === 'add') {
        await adminApi.post('/products', payload);
      } else {
        await adminApi.put(`/products?id=${editingId}`, payload);
      }
      alert(`Product ${view === 'add' ? 'added' : 'updated'}!`);
      setView('list');
      fetchProducts();
    } catch (err) { 
      alert(err.response?.data?.error || "Failed to save product"); 
    }
  };

  const startEdit = (product) => {
    setFormData({ 
      productName: product.productName, 
      price: product.price,
      category: product.category,
      discount: product.discount,
      offerPrice: product.offerPrice
    });
    setEditingId(product._id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await adminApi.delete(`/products?id=${id}`);
      fetchProducts();
    }
  };

  // --- FORM VIEW (Add/Edit) ---
  if (view === 'add' || view === 'edit') {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <h1>{view === 'add' ? 'Add New Product' : 'Edit Product'}</h1>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Product Name" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} required />
          <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <input placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <input type="number" placeholder="Discount" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
          <input type="number" placeholder="Offer Price" value={formData.offerPrice} onChange={(e) => setFormData({...formData, offerPrice: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Product Management</h1>
        <button onClick={() => { 
          setFormData({ productName: '', price: '', category: 'General', discount: 0, offerPrice: 0 }); 
          setView('add'); 
        }}>+ Add New</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th>Name</th><th>Price</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{p.productName}</td>
                <td style={{ padding: '8px' }}>{p.price}</td>
                <td style={{ padding: '8px' }}>{p.category}</td>
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