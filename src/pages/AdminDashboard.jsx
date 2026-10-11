import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Plus, Edit, Trash2, Layers, AlertTriangle, ClipboardList, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Verification for Admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        setLoading(true);
        // Load all products for inventory management
        const { data } = await axios.get('http://localhost:5000/api/products?pageSize=100');
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
      }
    };
    if (user && user.isAdmin) {
      fetchAdminProducts();
    }
  }, [user, deleteSuccess]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product from the database?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        setDeleteSuccess((prev) => !prev);
      } catch (err) {
        alert(err.response?.data?.message || 'Deletion failed');
      }
    }
  };

  // Calculations for stats dashboard
  const totalProducts = products.length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const lowStockCount = products.filter((p) => p.countInStock <= 3).length;

  if (!user || !user.isAdmin) {
    return (
      <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
        <ShieldAlert size={55} style={{ color: 'var(--danger)' }} />
        <h3 className="empty-state-title">Access Denied</h3>
        <p className="empty-state-text">You are not authorized as an administrator. Please log in with admin privileges.</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Admin header */}
      <div className="admin-header">
        <div>
          <h2 className="section-title">Admin Dashboard</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Store inventory, catalogs, and customer order management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/orders" className="btn btn-outline" style={{ display: 'flex', gap: '0.25rem' }}>
            <ClipboardList size={18} />
            <span>Manage Orders</span>
          </Link>
          <Link to="/admin/add-product" className="btn btn-primary" style={{ display: 'flex', gap: '0.25rem' }}>
            <Plus size={18} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
          <p>Loading catalog control statistics...</p>
        </div>
      ) : (
        <div>
          {/* Stats counters grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={26} />
              </div>
              <div className="stat-info">
                <div className="stat-val">{totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <Layers size={26} />
              </div>
              <div className="stat-info">
                <div className="stat-val">{categoriesCount}</div>
                <div className="stat-label">Product Categories</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                <AlertTriangle size={26} />
              </div>
              <div className="stat-info">
                <div className="stat-val">{lowStockCount}</div>
                <div className="stat-label">Low/Out of Stock</div>
              </div>
            </div>
          </div>

          {/* Catalog inventory table list */}
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Catalog Inventory</h3>
          
          {error && <div className="alert alert-danger">{error}</div>}

          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products exist in database yet.</p>
              <Link to="/admin/add-product" className="btn btn-primary">Add First Product</Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Stock Units</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--gray-200)', backgroundColor: 'var(--gray-100)' }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{product.name}</td>
                      <td>{product.category}</td>
                      <td style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge-status ${product.countInStock <= 3 ? 'badge-status-pending' : 'badge-status-delivered'}`}>
                          {product.countInStock} items
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.4rem', color: 'var(--primary)' }}
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.4rem', color: 'var(--danger)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminDashboard;
