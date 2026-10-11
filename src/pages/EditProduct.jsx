import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit3, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Secure path
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  // Load product content
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !image || !category || countInStock === '' || !description) {
      setError('Please fill in all product fields.');
      return;
    }

    if (Number(price) < 0 || Number(countInStock) < 0) {
      setError('Price and Stock units cannot be negative.');
      return;
    }

    setSubmitting(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const productPayload = {
        name,
        price: Number(price),
        image,
        category,
        countInStock: Number(countInStock),
        description,
      };

      await axios.put(`http://localhost:5000/api/products/${id}`, productPayload, config);
      setSubmitting(false);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product. Try again.');
      setSubmitting(false);
    }
  };

  const categories = ['Electronics', 'Accessories', 'Footwear', 'Home Decor'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
        <p>Loading product details form...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '1rem auto' }}>
      <Link to="/admin" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>

      <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
          <Edit3 size={26} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Edit Store Product</h2>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Wireless Noise-Cancelling Earbuds"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g. 99.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inventory Units</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 15"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Product Image URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control form-control-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Preview Window if URL exists */}
          {image && (
            <div style={{ margin: '1rem 0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', display: 'block', marginBottom: '0.25rem' }}>Image Preview:</span>
              <img
                src={image}
                alt="Preview"
                style={{ maxHeight: '120px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)', display: 'inline-block' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description specs</label>
            <textarea
              rows="4"
              className="form-control"
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Describe the product details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1.5rem', padding: '0.9rem' }}
          >
            {submitting ? 'Updating Database...' : 'Save Product Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
