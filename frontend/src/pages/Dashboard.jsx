import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Globe, AlertTriangle, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeJurisdiction, setActiveJurisdiction] = useState('India');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Mock a slight delay to simulate AI processing/RAG engine
        setTimeout(async () => {
          const res = await fetch(`http://localhost:5000/api/products/${id}/analysis`);
          if (res.ok) {
            const result = await res.json();
            setData(result);
          } else {
            console.error("Failed to fetch analysis");
          }
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-light)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h3 style={{ color: 'var(--text-muted)' }}>AI RAG Engine: Analyzing Pathway...</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return <div style={{ color: 'var(--danger-color)' }}>Error loading analysis. Product might not exist.</div>;

  const { product, analysis } = data;

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/products')} className="btn-secondary" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}>
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>{product.productName}</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="badge badge-primary">{product.productType.toUpperCase()}</span>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>Market: {product.targetMarket}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: #{product.id}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveJurisdiction('India')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeJurisdiction === 'India' ? 'var(--primary-color)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}
          >
            India
          </button>
          <button 
            onClick={() => setActiveJurisdiction('International')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeJurisdiction === 'International' ? 'var(--primary-color)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: '600' }}
          >
            International
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ borderLeft: '4px solid var(--success-color)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <CheckCircle2 color="var(--success-color)" />
              <h3 style={{ margin: 0 }}>Likely Classification</h3>
            </div>
            <p>Based on the provided facts, this product is classified as an <strong>{analysis.classification}</strong> under Section 3(a) of the Drugs and Cosmetics Act, 1940.</p>
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong>AI Confidence: {analysis.confidence}.</strong> The combination of biological extracts ({product.ingredients.substring(0, 30)}...) aligns with official guidelines.
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <Shield color="var(--accent-color)" />
              <h3 style={{ margin: 0 }}>Intellectual Property (IP) Route</h3>
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', marginBottom: '16px' }}>
              {analysis.pathways.ip.map((ip, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{ip}</li>)}
            </ul>
            <div style={{ borderLeft: '3px solid var(--border-color)', paddingLeft: '12px', marginTop: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Source Citations</div>
              <a href="https://ipindia.gov.in/resource/patents-resources-guidelines" target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> IP India Guidelines for Examination of CRIs & Pharmaceuticals
              </a>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <Globe color="var(--primary-light)" />
              <h3 style={{ margin: 0 }}>Biodiversity & ABS Obligations</h3>
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', marginBottom: '16px' }}>
              {analysis.pathways.abs.map((abs, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{abs}</li>)}
            </ul>
            <div style={{ marginTop: '12px' }}>
              <span className="badge badge-warning">FORM REQUIRED</span>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <BookOpen color="var(--text-main)" />
              <h4 style={{ margin: 0 }}>Traditional Knowledge Check</h4>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              The ingredients mentioned have documented uses in classical texts. A prior-art check on the TKDL is highly recommended.
            </p>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>View TKDL Guidance</button>
          </div>

          <div className="card" style={{ padding: '24px', border: '1px solid rgba(244, 67, 54, 0.3)', backgroundColor: 'rgba(244, 67, 54, 0.05)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <AlertTriangle color="var(--danger-color)" />
              <h4 style={{ margin: 0, color: 'var(--danger-color)' }}>Need Expert Review?</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              If your export target involves conflicting international treaties, this case should be escalated.
            </p>
            <button className="btn-primary" style={{ width: '100%', fontSize: '0.9rem', background: 'var(--danger-color)' }}>
              Escalate to Facilitator
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
