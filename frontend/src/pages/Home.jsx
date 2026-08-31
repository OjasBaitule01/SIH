import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'formulation',
    ingredients: '',
    intendedUse: '',
    targetMarket: 'India'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.message === 'success') {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h2>Product Details Form</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product/Innovation Name</label>
            <input type="text" className="form-input" name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. AyurGlow Extract" required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">Product Type</label>
              <select className="form-select" name="productType" value={formData.productType} onChange={handleChange}>
                <option value="formulation">Formulation</option>
                <option value="extract">Extract</option>
                <option value="raw_material">Raw Material</option>
                <option value="cosmetic">Cosmetic</option>
                <option value="food">Ayurveda Aahara (Food)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Market</label>
              <select className="form-select" name="targetMarket" value={formData.targetMarket} onChange={handleChange}>
                <option value="India">India</option>
                <option value="International">International (Export)</option>
                <option value="Both">India & International</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Key Ingredients / Biological Resources</label>
            <textarea className="form-textarea" name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="e.g. Ashwagandha (Withania somnifera), Turmeric (Curcuma longa)" rows={3} required></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Claims & Intended Use</label>
            <textarea className="form-textarea" name="intendedUse" value={formData.intendedUse} onChange={handleChange} placeholder="e.g. Promotes immunity and skin radiance" rows={2} required></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Product to ERP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
