import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const inStock = product.countInStock > 0;

  return (
    <div className="product-card">
      <div className="product-img-container">
        <img src={product.image} alt={product.name} />
        <span className={`product-badge ${inStock ? 'badge-instock' : 'badge-outofstock'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-footer">
          <div className="product-card-price">${product.price.toFixed(2)}</div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-outline btn-sm"
              title="View Details"
              style={{ padding: '0.5rem' }}
            >
              <Eye size={16} />
            </Link>

            <button
              onClick={() => addToCart(product, 1)}
              disabled={!inStock}
              className="btn btn-primary btn-sm"
              title="Add to Cart"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              <Plus size={16} />
              <span style={{ marginLeft: '0.25rem', fontSize: '0.85rem' }}>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
