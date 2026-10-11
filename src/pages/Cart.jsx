import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, shippingPrice, taxPrice, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-state" style={{ margin: '3rem auto', maxWidth: '600px' }}>
        <ShoppingBag size={55} className="empty-state-icon" style={{ color: 'var(--primary)' }} />
        <h3 className="empty-state-title">Your shopping cart is empty</h3>
        <p className="empty-state-text">Explore our catalogs and find products to add to your cart.</p>
        <Link to="/shop" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '2rem' }}>Shopping Cart</h2>

      <div className="cart-layout">
        {/* Left Side: Cart Items List */}
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-info">
                <span className="cart-item-category">{item.category}</span>
                <Link to={`/product/${item._id}`}>
                  <h3 className="cart-item-name nav-item">{item.name}</h3>
                </Link>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
              </div>

              {/* Action columns: Quantity Controls & Delete */}
              <div className="cart-item-actions">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                    disabled={item.qty <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="quantity-val" style={{ minWidth: '35px', padding: '0.5rem' }}>{item.qty}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, Math.min(item.countInStock, item.qty + 1))}
                    disabled={item.qty >= item.countInStock}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item._id)}
                  title="Remove from Cart"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping Cost</span>
            <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>Est. Tax (15%)</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleCheckout}
            style={{ marginTop: '2rem', padding: '0.9rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <Link
            to="/shop"
            className="btn btn-outline btn-block"
            style={{ marginTop: '1rem', padding: '0.85rem' }}
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
