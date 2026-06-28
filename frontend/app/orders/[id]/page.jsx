'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '../../../lib/api';

const STATUS_STEPS = ['pending','processing','shipped','delivered'];
const statusColor  = (s) => ({pending:'warning',processing:'info',shipped:'info',delivered:'success',cancelled:'danger'}[s]||'gray');

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!order)  return <div className="empty"><h3>Order not found</h3></div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="section">
      <div className="container-sm">
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:56}}>✅</div>
          <h1 style={{fontSize:28,fontWeight:800,margin:'12px 0 8px'}}>Order Confirmed!</h1>
          <p style={{color:'var(--text2)'}}>Thank you for your purchase. We'll deliver it soon.</p>
          <p style={{fontFamily:'monospace',background:'var(--bg3)',display:'inline-block',padding:'6px 16px',borderRadius:8,marginTop:10,fontSize:14}}>
            Order #{order._id.slice(-10).toUpperCase()}
          </p>
        </div>

        {/* Progress Bar */}
        {order.status !== 'cancelled' && (
          <div style={{marginBottom:40}}>
            <div style={{display:'flex',justifyContent:'space-between',position:'relative',marginBottom:8}}>
              <div style={{position:'absolute',top:16,left:'10%',right:'10%',height:2,background:'var(--border)',zIndex:0}} />
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',zIndex:1}}>
                  <div style={{
                    width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                    fontWeight:700,fontSize:13,
                    background: i<=stepIdx ? 'var(--accent)' : 'var(--bg3)',
                    color: i<=stepIdx ? 'var(--dark)' : 'var(--text3)',
                    border: `2px solid ${i<=stepIdx?'var(--accent)':'var(--border)'}`,
                  }}>{i<=stepIdx?'✓':(i+1)}</div>
                  <span style={{fontSize:12,marginTop:6,color:i<=stepIdx?'var(--accent2)':'var(--text3)',textTransform:'capitalize'}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="card" style={{marginBottom:24}}>
          <div className="card-header"><h2>Items Ordered</h2><span className={`badge badge-${statusColor(order.status)}`}>{order.status}</span></div>
          <div style={{padding:'0 20px'}}>
            {order.items.map((item, i) => (
              <div key={i} style={{display:'flex',gap:16,alignItems:'center',padding:'16px 0',borderBottom:'1px solid var(--border)'}}>
                <img src={item.image||'https://placehold.co/60/f1ede7/9e8f85?text=📦'} alt="" style={{width:60,height:60,borderRadius:10,objectFit:'cover'}} />
                <div style={{flex:1}}>
                  <p style={{fontWeight:600}}>{item.name}</p>
                  <p style={{fontSize:13,color:'var(--text3)'}}>Qty: {item.quantity}</p>
                </div>
                <p style={{fontWeight:700}}>₹{(item.price*item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div style={{padding:'16px 0',textAlign:'right'}}>
              <p style={{color:'var(--text2)',fontSize:14}}>Shipping: {order.shippingCharge===0?'FREE':`₹${order.shippingCharge}`}</p>
              <p style={{fontSize:20,fontWeight:800,marginTop:4}}>Total: ₹{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="card" style={{marginBottom:32}}>
            <div className="card-header"><h2>Delivery Address</h2></div>
            <div style={{padding:'16px 20px',fontSize:14,color:'var(--text2)',lineHeight:1.8}}>
              <p style={{fontWeight:600,color:'var(--text)'}}>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}{order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>
        )}

        <div style={{textAlign:'center',display:'flex',gap:12,justifyContent:'center'}}>
          <Link href="/products" className="btn btn-primary">Shop More</Link>
          <Link href="/account" className="btn btn-outline">My Orders</Link>
        </div>
      </div>
    </div>
  );
}
