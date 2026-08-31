import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Package, Globe, ShieldCheck } from 'lucide-react';

const MainDashboard = () => {
  const [stats, setStats] = useState({ total: 0, international: 0, formulations: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        
        const products = data.data || [];
        setStats({
          total: products.length,
          international: products.filter(p => p.targetMarket.includes('International')).length,
          formulations: products.filter(p => p.productType === 'formulation').length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Platform Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Welcome back. Here is the current state of your Ayurvedic portfolio.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(46, 125, 50, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Package color="var(--primary-color)" size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.total}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Total Products</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 179, 0, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Activity color="var(--accent-color)" size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.formulations}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Formulations</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(66, 133, 244, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Globe color="#4285f4" size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.international}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Export Targets</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(52, 168, 83, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <ShieldCheck color="#34a853" size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>100%</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>IP Assessed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button onClick={() => navigate('/products/new')} className="btn-primary">Add New Product</button>
          <button onClick={() => navigate('/products')} className="btn-secondary">View Full Inventory</button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
