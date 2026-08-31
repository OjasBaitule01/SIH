import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, PlusCircle, List } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Leaf color="var(--primary-light)" size={28} />
          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>
            IP-SAKTI <span style={{ color: 'var(--primary-light)' }}>Sahayak</span>
          </span>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/products" className={`sidebar-link ${location.pathname === '/products' ? 'active' : ''}`}>
            <List size={20} /> Inventory
          </Link>
          <Link to="/products/new" className={`sidebar-link ${location.pathname === '/products/new' ? 'active' : ''}`}>
            <PlusCircle size={20} /> New Product
          </Link>
          <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.2)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '600', marginBottom: '8px' }}>ERP Mode Active</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manage your portfolio and analyze IP pathways securely.</p>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
            {location.pathname === '/products' ? 'Product Inventory' : 
             location.pathname === '/products/new' ? 'Create New Product' : 
             location.pathname.includes('/analysis') ? 'Product Analysis Dashboard' : 'IP-SAKTI ERP'}
          </h2>
        </header>
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </main>
      
      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.05);
          color: white;
        }
        .sidebar-link.active {
          background-color: rgba(46, 125, 50, 0.15);
          color: var(--primary-light);
          border: 1px solid rgba(46, 125, 50, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Layout;
