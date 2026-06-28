import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, Tag, TrendingUp, Clock } from 'lucide-react';
import API from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [orderStats, products, customers, categories, orders] = await Promise.all([
          API.get('/orders/admin/stats'),
          API.get('/products?limit=1'),
          API.get('/customers?limit=1'),
          API.get('/categories'),
          API.get('/orders?limit=5'),
        ]);
        setStats({
          totalOrders: orderStats.data.stats.totalOrders,
          pendingOrders: orderStats.data.stats.pendingOrders,
          revenue: orderStats.data.stats.revenue,
          totalProducts: products.data.pagination?.total || 0,
          totalCustomers: customers.data.pagination?.total || 0,
          totalCategories: categories.data.categories.length,
        });
        setRecentOrders(orders.data.orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Total Orders',  value: stats.totalOrders,  icon: ShoppingCart, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
    { label: 'Pending Orders',value: stats.pendingOrders,icon: Clock,        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Products',      value: stats.totalProducts, icon: Package,     color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { label: 'Customers',     value: stats.totalCustomers,icon: Users,       color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
    { label: 'Categories',    value: stats.totalCategories,icon: Tag,        color: '#fb7185', bg: 'rgba(251,113,133,0.1)' },
  ] : [];

  const statusColor = (s) => ({
    pending:'warning', processing:'info', shipped:'info',
    delivered:'success', cancelled:'danger'
  }[s] || 'gray');

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening.</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div className="stat-info">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Orders</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text3)',padding:'32px'}}>No orders yet</td></tr>
              ) : recentOrders.map((o) => (
                <tr key={o._id}>
                  <td style={{fontFamily:'monospace',fontSize:12}}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.customer?.name || o.guestInfo?.name || 'Guest'}</td>
                  <td className="fw-bold">₹{o.totalAmount.toLocaleString()}</td>
                  <td><span className={`badge badge-${statusColor(o.status)}`}>{o.status}</span></td>
                  <td className="text-muted">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
