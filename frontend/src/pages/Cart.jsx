import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Plus, Minus, Trash2, ChevronLeft, CreditCard, AlertTriangle } from 'lucide-react';

const Cart = () => {
  const { cart, cartTotal, updateCartQty, removeFromCart } = useApp();
  const navigate = useNavigate();

  // Check if any item in the cart requires a prescription (Rx)
  const hasRxItem = cart.some(item => item.type === 'Rx');

  const deliveryFee = cartTotal > 500 || cartTotal === 0 ? 0 : 40; // Free delivery over 500
  const grandTotal = cartTotal + deliveryFee;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Your Shopping Cart</h2>
          <p>Review the list of medicines and healthcare essentials before confirming details.</p>
        </div>

        {cart.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingCart size={64} style={{ opacity: 0.4, marginBottom: '20px' }} />
            <h3>Your Cart is Empty</h3>
            <p style={{ marginTop: '8px' }}>You haven't added any products or medicines yet. Browse our store to find what you need.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="cart-page-wrapper">
            {/* Left side: Cart Items List */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--primary)' }}>
                  <ChevronLeft size={16} /> Continue Shopping
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {cart.length} item(s) in list
                </span>
              </div>

              {hasRxItem && (
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '16px', 
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', marginBottom: '2px' }}>
                      Prescription Required (Rx Items)
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                      One or more medicines in your cart require a valid doctor's prescription. Please make sure you have a physical copy or photo ready.
                    </p>
                  </div>
                </div>
              )}

              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-card-info">
                      <h4>{item.name}</h4>
                      <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>Manufacturer: {item.brand}</span>
                        <span>•</span>
                        <span className="product-badge badge-otc" style={{ position: 'static', padding: '2px 6px', fontSize: '0.65rem', textTransform: 'capitalize' }}>
                          {item.category.replace('-', ' ')}
                        </span>
                      </p>
                    </div>

                    <div className="cart-item-right">
                      {/* Quantity Controls */}
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)} aria-label="Decrease Quantity">
                          <Minus size={14} />
                        </button>
                        <span>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)} aria-label="Increase Quantity">
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="cart-item-card-price">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove Product">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Cart Summary Sticky Panel */}
            <aside className="glass-card cart-summary-card" style={{ textAlign: 'left' }}>
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Charges:</span>
                <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
              </div>

              {deliveryFee > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '-8px', marginBottom: '8px' }}>
                  Add ₹{(500 - cartTotal).toFixed(2)} more for FREE Delivery!
                </p>
              )}

              <div className="summary-row total">
                <span>Grand Total:</span>
                <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleProceedToCheckout} 
                style={{ width: '100%', marginTop: '16px' }}
              >
                <CreditCard size={18} /> Proceed to Checkout
              </button>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                Secure transaction processed by Laxmi Narsimha Pharmacy.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
