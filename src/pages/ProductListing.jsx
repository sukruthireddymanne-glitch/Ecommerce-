import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse search params
  const searchParams = new URLSearchParams(location.search);
  const keywordQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || 'All';

  useEffect(() => {
    setActiveCategory(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products?pageSize=100';
        if (keywordQuery) {
          url += `&keyword=${encodeURIComponent(keywordQuery)}`;
        }
        if (activeCategory && activeCategory !== 'All') {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }

        const { data } = await axios.get(url);
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keywordQuery, activeCategory]);

  const categories = ['All', 'Electronics', 'Accessories', 'Footwear', 'Home Decor'];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Sync category selection with route search param
    if (category === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
  };

  // Sort logic on clientside
  const getSortedProducts = () => {
    const items = [...products];
    if (sortBy === 'price-low') {
      return items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'alpha-asc') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'latest' default (sort by database ID/created date descending)
    return items.reverse();
  };

  const sortedProducts = getSortedProducts();

  return (
    <div>
      <div className="section-title-wrapper" style={{ margin: '1rem 0 2rem' }}>
        <div>
          <h2 className="section-title">
            {keywordQuery ? `Search Results for "${keywordQuery}"` : 'Shop Collection'}
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Showing {sortedProducts.length} premium products
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-500)' }}>Sort By:</span>
          <select
            className="form-control form-control-select"
            style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.9rem', width: '180px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="alpha-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filters */}
      <div className="categories-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '2rem' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`category-card ${activeCategory === category ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', border: '1px solid var(--gray-200)' }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main product display grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
          <p style={{ fontWeight: 600 }}>Loading collection catalog...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No products found</h3>
          <p className="empty-state-text">We couldn't find matches for your current category or search filters. Try resetting the criteria.</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary">Reset Filters</button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductListing;
