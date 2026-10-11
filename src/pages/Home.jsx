import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        // Get the first 4 products for featured section
        setFeaturedProducts(data.products.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', image: '💻' },
    { name: 'Accessories', image: '⌚' },
    { name: 'Footwear', image: '👟' },
    { name: 'Home Decor', image: '🏺' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <Sparkles size={14} />
            <span>Elevate Your Standard</span>
          </div>
          <h1>Define Your Lifestyle Experience</h1>
          <p>
            Explore our curated catalog of modern electronics, minimalist accessories, and premium footwear designed for daily sophistication.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/shop" className="btn btn-primary">
              <span>Shop Collection</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#featured" className="btn btn-outline">Explore Featured</a>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60"
            alt="Shopez Premium Hero Display"
          />
        </div>
      </header>

      {/* Feature Badges */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
          <div style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Free Express Shipping</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>On all domestic orders above $100</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
          <div style={{ color: 'var(--secondary)', backgroundColor: 'var(--secondary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Secure Payments</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>100% encrypted, secure transactions</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
          <div style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>30-Day Easy Return</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Hassle-free size & refund changes</p>
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section>
        <div className="section-title-wrapper">
          <h2 className="section-title">Browse Categories</h2>
        </div>
        <div className="categories-row">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.image}</div>
              <div>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" style={{ marginTop: '2rem' }}>
        <div className="section-title-wrapper">
          <h2 className="section-title">Featured Creations</h2>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p>Loading featured creations...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No Products Found</h3>
            <p className="empty-state-text">Populate the database via the seeding script or the Admin panel to view products.</p>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
