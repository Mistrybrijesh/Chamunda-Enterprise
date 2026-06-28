'use client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 'calc(68px + 56px)', paddingBottom: 80, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <div style={{ fontSize: 56, marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 400, marginBottom: 10, color: 'var(--dark)' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 14, fontWeight: 300 }}>Looks like you haven't added anything yet.</p>
          <Link href="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 10000 ? 0 : 499;

  return (
    <div style={{ paddingTop: 'calc(68px + 48px)', paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text3)', letterSpacing: '.2em', textTransform: 'uppercase' }}>Your Cart</span>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px,3vw,44px)', fontWeight: 400, color: 'var(--dark)', marginTop: 8, letterSpacing: '.02em' }}>
            Shopping Cart <span style={{ fontSize: '60%', color: 'var(--text3)', fontWeight: 300 }}>({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>
        <div className="cart-layout">
          {/* Cart Items */}
          <div>
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.images?.[0] || 'https://placehold.co/90x90/f1ede7/9e8f85?text=📦'}
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cat">{item.category?.name}</p>
                  <div style={{display:'flex',alignItems:'center',gap:16}}>
                    <div className="qty-ctrl">
                      <button onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <span style={{fontWeight:700,fontSize:16}}>₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  style={{background:'none',border:'none',color:'var(--text3)',padding:8,borderRadius:8,transition:'color 0.2s'}}
                  onMouseOver={(e) => e.currentTarget.style.color='var(--danger)'}
                  onMouseOut={(e)  => e.currentTarget.style.color='var(--text3)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button onClick={clearCart} style={{fontSize:13,color:'var(--text3)',background:'none',border:'none',cursor:'pointer',marginTop:8}}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{color:'var(--success)'}}>FREE</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p style={{fontSize:12,color:'var(--text3)',marginBottom:8}}>
                Add ₹{(10000 - total).toLocaleString()} more for free shipping
              </p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>₹{(total + shipping).toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:20,padding:'14px'}}>
              Proceed to Checkout →
            </Link>
            <Link href="/products" className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginTop:10}}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
