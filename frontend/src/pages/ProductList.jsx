import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Trash2, Edit } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading inventory...</div>;

  return (
    <div className="animate-fade-in">
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '500' }}>ID</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '500' }}>Product Name</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '500' }}>Type</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '500' }}>Market</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No products in inventory. <span style={{ color: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => navigate('/products/new')}>Create one now.</span>
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>#{p.id}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600' }}>{p.productName}</td>
                  <td style={{ padding: '16px 24px' }}><span className="badge badge-primary">{p.productType}</span></td>
                  <td style={{ padding: '16px 24px' }}>{p.targetMarket}</td>
                  <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => navigate(`/products/${p.id}/analysis`)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileSearch size={16} /> Analyze IP
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="btn-secondary" style={{ padding: '8px', borderColor: 'rgba(244, 67, 54, 0.3)', color: 'var(--danger-color)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
