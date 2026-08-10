import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Tag, Image, ShoppingCart, LogOut, FolderOpen
} from 'lucide-react';

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/products',   label: 'Products',   icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/banners',    label: 'Banners',    icon: Image },
  { to: '/projects',   label: 'Projects',   icon: FolderOpen },
  { to: '/orders',     label: 'Orders',     icon: ShoppingCart },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    '/':           'Dashboard',
    '/products':   'Products',
    '/categories': 'Categories',
    '/banners':    'Banners',
    '/projects':   'Projects',
    '/orders':     'Orders',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🪑 FurniAdmin</h2>
          <p>Management Panel</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <h1>
            {pageTitles[location.pathname] ||
              (location.pathname.startsWith('/projects/') ? 'Project Details' : 'Admin')}
          </h1>
          <div className="topbar-right">
            <span className="admin-badge">👤 {admin?.name || 'Admin'}</span>
          </div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
