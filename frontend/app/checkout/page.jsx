'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { customer } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('cod');
  const [form, setForm] = useState({
    fullName: customer?.name || '', phone: '', email: customer?.email || '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  });

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const shipping = total >= 10000 ? 0 : 499;

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer: customer?._id,
      guestInfo: !customer ? { name: form.fullName, email: form.email, phone: form.phone } : undefined,
      items: cart.map((i) => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.qty })),
      shippingAddress: { ...form },
      subtotal: total,
      shippingCharge: shipping,
      totalAmount: total + shipping,
      paymentMethod: payMethod,
    };

    try {
      const { data: { order } } = await API.post('/orders', orderData);

      if (payMethod === 'razorpay') {
        const { data: { razorpayOrder } } = await API.post('/payments/create-order', {
          amount: total + shipping,
          orderId: order._id,
        });

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: 'INR',
          name: 'FurniCraft',
          description: 'Furniture Purchase',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            await API.post('/payments/verify', {
              ...response,
              orderId: order._id,
            });
            clearCart();
            router.push(`/orders/${order._id}`);
          },
          prefill: { name: form.fullName, email: form.email, contact: form.phone },
          theme: { color: '#c8a96e' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        router.push(`/orders/${order._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section text-center">
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="section">
        <div className="container">
          <h1 style={{fontSize:32,fontWeight:800,marginBottom:32}}>Checkout</h1>
          <div className="cart-layout">
            <form onSubmit={handleOrder}>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:20}}>Shipping Address</h2>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label>
                  <input required value={form.fullName} onChange={f('fullName')} /></div>
                <div className="form-group"><label>Phone *</label>
                  <input required value={form.phone} onChange={f('phone')} /></div>
              </div>
              <div className="form-group"><label>Email</label>
                <input type="email" value={form.email} onChange={f('email')} /></div>
              <div className="form-group"><label>Address Line 1 *</label>
                <input required placeholder="House no, Street" value={form.line1} onChange={f('line1')} /></div>
              <div className="form-group"><label>Address Line 2</label>
                <input placeholder="Area, Landmark" value={form.line2} onChange={f('line2')} /></div>
              <div className="form-row">
                <div className="form-group"><label>City *</label>
                  <input required value={form.city} onChange={f('city')} /></div>
                <div className="form-group"><label>State *</label>
                  <input required value={form.state} onChange={f('state')} /></div>
              </div>
              <div className="form-group"><label>Pincode *</label>
                <input required value={form.pincode} onChange={f('pincode')} /></div>

              <h2 style={{fontSize:18,fontWeight:700,margin:'24px 0 16px'}}>Payment Method</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
                {[
                  { value:'cod',      label:'💵 Cash on Delivery' },
                  { value:'razorpay', label:'💳 Pay Online (Razorpay – UPI, Card, NetBanking)' },
                ].map(({ value, label }) => (
                  <label key={value} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',border:`2px solid ${payMethod===value?'var(--accent)':'var(--border)'}`,borderRadius:10,cursor:'pointer',background:payMethod===value?'rgba(200,169,110,0.05)':'var(--bg)'}}>
                    <input type="radio" name="pay" value={value} checked={payMethod===value} onChange={() => setPayMethod(value)} />
                    {label}
                  </label>
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order — ₹${(total+shipping).toLocaleString()}`}
              </button>
            </form>

            <div className="order-summary">
              <h2>Order Summary</h2>
              {cart.map((i) => (
                <div key={i._id} className="summary-row">
                  <span>{i.name} × {i.qty}</span>
                  <span>₹{(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              <div className="summary-total"><span>Total</span><span>₹{(total+shipping).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
