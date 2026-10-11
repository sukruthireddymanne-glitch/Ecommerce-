import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
        <div className="notfound-code">404</div>
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', color: 'var(--secondary)', backgroundColor: 'var(--secondary-light)', padding: '0.5rem', borderRadius: '50%' }}>
          <HelpCircle size={28} />
        </div>
      </div>
      <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', fontWeight: 800 }}>Page Not Found</h2>
      <p style={{ color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>
        We checked our warehouse, but couldn't find the page you are looking for. It might have been moved or deleted.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>Go to Home</span>
        </Link>
        <Link to="/shop" className="btn btn-outline">
          <ArrowLeft size={18} />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
