import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];

const statusColor = (s) => ({
  pending:'warning', processing:'info', shipped:'info',
  delivered:'success', cancelled:'danger'
}[s] || 'gray');

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const url = filter ? `/orders?status=${filter}&limit=50` : '/orders?limit=50';
      const { data } = await API.get(url);
      setOrders(data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchAll();
      if (selected?._id === id) setSelected((prev) => ({ ...prev, status }));
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Orders</h1><p>{orders.length} orders found</p></div>
        <select className="status-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0
                  ? <tr><td colSpan={8} style={{textAlign:'center',color:'var(--text3)',padding:'32px'}}>No orders found</td></tr>
                  : orders.map((o) => (
                  <tr key={o._id} style={{cursor:'pointer'}} onClick={() => setSelected(o)}>
                    <td style={{fontFamily:'monospace',fontSize:12}}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{fontWeight:500}}>{o.customer?.name || o.guestInfo?.name || 'Guest'}</div>
                      <div style={{fontSize:12,color:'var(--text3)'}}>{o.customer?.email || o.guestInfo?.email}</div>
                    </td>
                    <td>{o.items.length} item(s)</td>
                    <td className="fw-bold">₹{o.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${o.paymentStatus==='paid'?'success':o.paymentStatus==='failed'?'danger':'warning'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td><span className={`badge badge-${statusColor(o.status)}`}>{o.status}</span></td>
                    <td style={{fontSize:13,color:'var(--text3)'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="status-select"
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setSelected(null)}>
          <div className="modal" style={{maxWidth:640}}>
            <div className="modal-header">
              <h3>Order #{selected._id.slice(-8).toUpperCase()}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
                <div>
                  <p style={{color:'var(--text3)',fontSize:12,marginBottom:4}}>CUSTOMER</p>
                  <p style={{fontWeight:600}}>{selected.customer?.name || selected.guestInfo?.name || 'Guest'}</p>
                  <p style={{fontSize:13,color:'var(--text3)'}}>{selected.customer?.email || selected.guestInfo?.email}</p>
                </div>
                <div>
                  <p style={{color:'var(--text3)',fontSize:12,marginBottom:4}}>SHIPPING ADDRESS</p>
                  {selected.shippingAddress ? (
                    <p style={{fontSize:13}}>{selected.shippingAddress.line1}, {selected.shippingAddress.city}, {selected.shippingAddress.state} — {selected.shippingAddress.pincode}</p>
                  ) : <p style={{color:'var(--text3)',fontSize:13}}>No address</p>}
                </div>
              </div>

              <table style={{marginBottom:16}}>
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  {selected.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price.toLocaleString()}</td>
                      <td className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{textAlign:'right',fontSize:15}}>
                <p>Subtotal: <strong>₹{selected.subtotal?.toLocaleString()}</strong></p>
                <p>Shipping: <strong>₹{selected.shippingCharge || 0}</strong></p>
                <p style={{fontSize:18,marginTop:8}}>Total: <strong style={{color:'var(--accent2)'}}>₹{selected.totalAmount.toLocaleString()}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
