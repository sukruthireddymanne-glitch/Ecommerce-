import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate, success]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!address || !city || !postalCode || !country) {
      setError('Please provide complete shipping details.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      setSuccess(true);
      clearCart();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
        <CheckCircle size={55} className="empty-state-icon" style={{ color: 'var(--secondary)' }} />
        <h3 className="empty-state-title">Order Placed Successfully!</h3>
        <p className="empty-state-text">
          Thank you for shopping with SHOPEZ. Your order has been registered and is being processed by our fulfillment team.
        </p>
        <Link to="/orders" className="btn btn-primary">
          <span>View Order History</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/cart" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        <span>Return to Cart</span>
      </Link>

      <h2 className="section-title" style={{ marginBottom: '2rem' }}>Secure Checkout</h2>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="cart-layout">
        {/* Left Form Panel: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Details */}
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              <Truck size={22} style={{ color: 'var(--primary)' }} />
              <span>1. Shipping Details</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="123 Main St, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              <CreditCard size={22} style={{ color: 'var(--primary)' }} />
              <span>2. Payment Option</span>
            </h3>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ flexGrow: 1, padding: '1rem', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', backgroundColor: 'var(--primary-light)' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Credit Card</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Simulated Checkout Gate</p>
                </div>
              </label>

              <label style={{ flexGrow: 1, padding: '1rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'PayPal'}
                  onChange={() => setPaymentMethod('PayPal')}
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <span style={{ fontWeight: 700 }}>PayPal</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Simulated PayPal Sandbox</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Checkout Bill Summary */}
        <div className="summary-card">
          <h3 className="summary-title">Summary Review</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ flexGrow: 1 }}>{item.name} <strong>x {item.qty}</strong></span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Items Cost</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping Fees</span>
            <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>Taxes (15%)</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total to Pay</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '2rem', padding: '0.9rem' }}
          >
            {loading ? 'Processing Transaction...' : `Pay & Place Order`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
