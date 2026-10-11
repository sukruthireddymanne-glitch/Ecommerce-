import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Plus, Minus, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (qty < product.countInStock) {
      setQty((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
        <p>Loading product details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
        <AlertCircle size={48} className="empty-state-icon" style={{ color: 'var(--danger)' }} />
        <h3 className="empty-state-title">Error Loading Product</h3>
        <p className="empty-state-text">{error || 'The requested product could not be found.'}</p>
        <Link to="/shop" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const inStock = product.countInStock > 0;

  return (
    <div>
      <Link to="/shop" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Gallery</span>
      </Link>

      {addedMessage && (
        <div className="alert alert-success">
          <ShoppingCart size={18} />
          <span>Added {qty} item(s) of "{product.name}" to your cart! <Link to="/cart" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>View Cart</Link></span>
        </div>
      )}

      <div className="product-details-container">
        {/* Left: Image Panel */}
        <div className="details-image-panel">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Right: Info Specs Panel */}
        <div className="details-info-panel">
          <span className="details-category">{product.category}</span>
          <h1 className="details-name">{product.name}</h1>
          
          <div className="details-price">${product.price.toFixed(2)}</div>

          <h4 className="details-desc-title">Availability</h4>
          <p style={{ marginBottom: '1.5rem' }}>
            <span className={`badge-status ${inStock ? 'badge-status-delivered' : 'badge-status-cancelled'}`}>
              {inStock ? `${product.countInStock} units in stock` : 'Out of Stock'}
            </span>
          </p>

          <h4 className="details-desc-title">Product Description</h4>
          <p className="details-desc">{product.description}</p>

          {inStock && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <h4 className="details-desc-title">Select Quantity</h4>
              <div className="details-actions">
                {/* Quantity Controls */}
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={decreaseQty} disabled={qty <= 1}>
                    <Minus size={16} />
                  </button>
                  <span className="quantity-val">{qty}</span>
                  <button className="quantity-btn" onClick={increaseQty} disabled={qty >= product.countInStock}>
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, padding: '0.9rem' }}
                >
                  <ShoppingCart size={20} />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>
            </div>
          )}

          {!inStock && (
            <button className="btn btn-dark" disabled style={{ padding: '0.9rem', marginTop: '1rem' }}>
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
