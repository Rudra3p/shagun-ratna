"use client";
import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Unified fetcher for loading all or searching
  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      let res;
      if (query.trim() !== '') {
        res = await adminApi.post('/products', { search: query });
      } else {
        res = await adminApi.get('/products');
      }
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product handler
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await adminApi.delete(`/products?id=${id}`);
        fetchProducts(); // Refresh list after deletion
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  // Search input change handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchProducts(value); // Search trigger
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Product Management</h1>
        <button onClick={() => alert("Open Add Modal")}>+ Add New Product</button>
      </div>

      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchQuery}
        onChange={handleSearch}
        style={{ padding: '10px', width: '100%', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Price</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{product.productName}</td>
                  <td style={{ padding: '10px' }}>{product.price}</td>
                  <td style={{ padding: '10px' }}>
                    <button style={{ marginRight: '10px' }} onClick={() => console.log("Edit", product._id)}>Edit</button>
                    <button style={{ color: 'red' }} onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}