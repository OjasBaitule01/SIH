import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import MainDashboard from './pages/MainDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<Home />} />
          <Route path="/products/:id/analysis" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
