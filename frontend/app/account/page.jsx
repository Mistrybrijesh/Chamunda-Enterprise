'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';

export default function AccountPage() {
  const { customer, login, register, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab]       = useState('login');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ name:'', email:'', password:'', phone:'' });
  const [error, setError]   = useState('');

  useEffect(() => {
    if (customer) {
      setLoading(true);
      API.get('/orders/my').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
    }
  }, [customer]);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!customer) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'calc(68px + 40px)',
        paddingBottom: 80,
        background: 'var(--cream)',
      }}>
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{
              fontFamily: 'var(--font-head)',
              fontSize: 36, fontWeight: 400,
              color: 'var(--dark)', letterSpacing: '.02em',
              marginBottom: 8,
            }}>
              {tab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 300, letterSpacing: '.04em' }}>
              {tab === 'login' ? 'Sign in to your account' : 'Join Chamunda Enterprise'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 28,
            borderBottom: '1px solid var(--border)',
          }}>
            {['login', 'register'].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                fontSize: 12, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase',
                color: tab === t ? 'var(--dark)' : 'var(--text3)',
                borderBottom: tab === t ? '2px solid var(--dark)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all .2s', marginBottom: -1,
              }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <p style={{
              color: 'var(--danger)', fontSize: 13,
              marginBottom: 16, padding: '10px 14px',
              background: 'rgba(239,68,68,.06)',
              border: '1px solid rgba(239,68,68,.15)',
            }}>{error}</p>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {tab === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input required value={form.name} onChange={f('name')} />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={f('email')} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input required type="password" value={form.password} onChange={f('password')} />
            </div>
            {tab === 'register' && (
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={f('phone')} />
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }


  const statusColor = (s) => ({pending:'warning',processing:'info',shipped:'info',delivered:'success',cancelled:'danger'}[s]||'gray');

  return (
    <div className="section">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <div>
            <h1 style={{fontSize:28,fontWeight:800}}>My Account</h1>
            <p style={{color:'var(--text2)',marginTop:4}}>Welcome back, {customer.name}!</p>
          </div>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>

        <h2 style={{fontSize:20,fontWeight:700,marginBottom:16}}>My Orders</h2>
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty">
            <h3>No orders yet</h3>
            <p style={{marginBottom:20}}>You haven't placed any orders yet.</p>
            <Link href="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {orders.map((o) => (
              <Link key={o._id} href={`/orders/${o._id}`} style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'18px 24px',border:'1px solid var(--border)',borderRadius:16,
                transition:'box-shadow 0.2s',background:'var(--bg)',
              }}>
                <div>
                  <p style={{fontFamily:'monospace',fontSize:13,color:'var(--text3)',marginBottom:4}}>#{o._id.slice(-10).toUpperCase()}</p>
                  <p style={{fontWeight:600}}>{o.items.length} item(s) · ₹{o.totalAmount.toLocaleString()}</p>
                  <p style={{fontSize:12,color:'var(--text3)',marginTop:4}}>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
                <span className={`badge badge-${statusColor(o.status)}`} style={{textTransform:'capitalize'}}>{o.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
