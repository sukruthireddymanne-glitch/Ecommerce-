import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, ShoppingCart, User, RefreshCw, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ManageOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected Order for updating
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusVal, setStatusVal] = useState('Pending');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer orders.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchAllOrders();
    }
  }, [user]);

  const handleUpdateStatusSubmit = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: statusVal }, config);
      
      // Update local state list
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === orderId ? { ...o, status: statusVal, isDelivered: statusVal === 'Delivered', deliveredAt: statusVal === 'Delivered' ? Date.now() : o.deliveredAt } : o))
      );
      
      setSelectedOrder(null);
      setUpdatingId(null);
    } catch (err) {
      alert('Failed to update status. Check console.');
      setUpdatingId(null);
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

  return (
    <div>
      <Link to="/admin" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>

      <div className="admin-header">
        <div>
          <h2 className="section-title">Manage Customer Orders</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Full history of orders registered across the application
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
          <p>Loading customer orders ledger...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No orders placed</h3>
          <p className="empty-state-text">Customers haven't checked out any items in the store yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1.2fr 0.8fr' : '1fr', gap: '2rem' }}>
          
          {/* Orders Log Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date Placed</th>
                  <th>Total Cost</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{order._id.substring(18)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} style={{ color: 'var(--gray-400)' }} />
                        <span>{order.user ? order.user.name : 'Unknown User'}</span>
                      </div>
                    </td>
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
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusVal(order.status);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', gap: '0.25rem', padding: '0.4rem 0.6rem' }}
                      >
                        <RefreshCw size={12} />
                        <span>Update Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sidebar Status Updater Panel */}
          {selectedOrder && (
            <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', height: 'fit-content', position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>Fulfillment Manager</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--gray-400)' }}
                >
                  &times;
                </button>
              </div>

              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>ORDER REFERENCE ID</span>
                  <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }}>#{selectedOrder._id}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 700 }}>CURRENT CUSTOMER</span>
                  <p style={{ fontWeight: 600 }}>{selectedOrder.user ? selectedOrder.user.name : 'Unknown User'}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Total Paid: <strong>${selectedOrder.totalPrice.toFixed(2)}</strong></p>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Set Order Status</label>
                  <select
                    className="form-control form-control-select"
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => handleUpdateStatusSubmit(selectedOrder._id)}
                  disabled={updatingId !== null}
                  className="btn btn-primary btn-block"
                  style={{ padding: '0.75rem' }}
                >
                  {updatingId ? 'Saving Status...' : 'Save Fulfillment Status'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ManageOrders;
