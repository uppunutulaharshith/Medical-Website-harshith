import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { Plus, Minus, ShoppingCart, CreditCard, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import ProductImage from '../components/ProductImage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          showToast(data.message || 'Product details not found.', 'error');
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        showToast('Server is offline. Unable to fetch details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, showToast]);

  const handleQtyChange = (delta) => {
    setQuantity(prev => {
      const newVal = prev + delta;
      return newVal > 0 ? newVal : 1;
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <div style={{ 
          border: '4px solid var(--border)', 
          borderTop: '4px solid var(--primary)', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          animation: 'spin 1s linear infinite', 
          margin: '0 auto' 
        }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '60px', maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '20px' }} />
          <h3>Product Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The medicine or product you are looking for does not exist or has been removed from our catalog.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '24px' }}>
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb Back Link */}
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--primary)' }}>
            <ChevronLeft size={16} /> Back to Browse
          </Link>
        </div>

        <div className="details-grid">
          {/* Visual Container */}
          <div className="details-visual">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <ProductImage category={product.category} type={product.type} name={product.name} size={180} imgUrl={product.image} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Store Code: LN-{product.id}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="details-content" style={{ textAlign: 'left' }}>
            <span className="product-badge badge-otc" style={{ position: 'static', display: 'inline-block', textTransform: 'capitalize' }}>
              Category: {product.category.replace('-', ' ')}
            </span>

            <h1 style={{ marginTop: '16px' }}>{product.name}</h1>
            <p className="details-brand">Manufacturer: {product.brand}</p>
            
            <div className="details-price">
              ₹{product.price.toFixed(2)}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '8px' }}>(incl. of all taxes)</span>
            </div>

            <div className="details-desc">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>Product Description</h3>
              <p>{product.desc}</p>
            </div>

            {/* Quantity Selector */}
            <div className="qty-selector-wrapper">
              <span className="qty-label">Quantity:</span>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => handleQtyChange(-1)}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button className="qty-btn" onClick={() => handleQtyChange(1)}><Plus size={16} /></button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="details-action-btns">
              <button className="btn btn-secondary" onClick={handleAddToCart}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-primary" onClick={handleBuyNow}>
                <CreditCard size={18} /> Buy Now
              </button>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} color="var(--primary)" /> 100% Genuine Guarantee
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} color="var(--primary)" /> Packaged Hygienically
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
