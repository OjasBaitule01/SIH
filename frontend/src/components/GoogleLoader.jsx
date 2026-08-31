import React from 'react';

const GoogleLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '20px' }}>
    <div className="google-loader">
      <div></div><div></div><div></div><div></div>
    </div>
    <h3 style={{ color: 'var(--text-muted)' }}>Processing...</h3>
  </div>
);

export default GoogleLoader;
