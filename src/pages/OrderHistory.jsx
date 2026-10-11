import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Clock, Eye, MapPin, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDetailsLoading, setViewDetailsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  const handleViewOrder = async (orderId) => {
    setViewDetailsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
      setSelectedOrder(data);
      setViewDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setViewDetailsLoading(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge-status-pending';
      case 'Processing': return 'badge-status-processing';
      case 'Shipped': return 'badge-status-shipped';
      case 'Delivered': return 'badge-status-delivered';
      default: return 'badge-status-cancelled';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
        <p>Loading order ledger...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '2rem' }}>Order History</h2>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state" style={{ margin: '2rem auto', maxWidth: '600px' }}>
          <Package size={55} className="empty-state-icon" style={{ color: 'var(--gray-400)' }} />
          <h3 className="empty-state-title">No orders registered</h3>
          <p className="empty-state-text">You haven't placed any orders with SHOPEZ yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1.2fr 0.8fr' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
          
          {/* Orders Table List */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date Placed</th>
                  <th>Total Cost</th>
                  <th>Payment Status</th>
                  <th>Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{order._id.substring(18)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 800 }}>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className="badge-status badge-status-delivered">
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${getBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', gap: '0.25rem', padding: '0.4rem 0.6rem' }}
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sidebar Panel: Selected Order Details */}
          {selectedOrder && (
            <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', height: 'fit-content', position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--gray-400)' }}
                >
                  &times;
                </button>
              </div>

              {viewDetailsLoading ? (
                <p>Loading invoice records...</p>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>ORDER REFERENCE ID</span>
                    <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>#{selectedOrder._id}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>STATUS</span>
                      <p><span className={`badge-status ${getBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>DATE PLACED</span>
                      <p style={{ fontWeight: 600 }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                    <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--gray-600)' }}>Delivery Address:</span>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>ORDER ITEMS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.5rem 0 1.5rem' }}>
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--gray-100)', paddingBottom: '0.5rem' }}>
                        <span style={{ flexGrow: 1 }}>{item.name} <strong>x {item.qty}</strong></span>
                        <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-row" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>Subtotal</span>
                    <span>${selectedOrder.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>Shipping Fees</span>
                    <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>Tax (15%)</span>
                    <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total" style={{ fontSize: '1.1rem', marginTop: '1rem', paddingTop: '1rem' }}>
                    <span>Grand Total Paid</span>
                    <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default OrderHistory;
