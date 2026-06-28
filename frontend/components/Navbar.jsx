'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User, LogOut, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { count } = useCart();
  const { customer, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/',         label: 'Home'     },
    { href: '/products', label: 'Products' },
    { href: '/projects', label: 'Projects' },
    { href: '/about',    label: 'About'    },
    { href: '/contact',  label: 'Contact'  },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${!isHome ? 'navbar-light' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-main"
            style={{ color: (!isHome && !scrolled) ? 'var(--dark)' : '#fff' }}>
            Chamunda Enterprise
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-nav">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`nav-link ${pathname === href ? 'active' : ''}`}
              style={{ color: (!isHome && !scrolled) ? 'var(--text2)' : undefined }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {customer ? (
            <>
              <Link href="/account" className="nav-user-btn"
                style={{ color: (!isHome && !scrolled) ? 'var(--text2)' : undefined }}>
                <User size={14} /> {customer.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="nav-logout-btn"><LogOut size={14} /></button>
            </>
          ) : (
            <Link href="/account" className="nav-user-btn"
              style={{ color: (!isHome && !scrolled) ? 'var(--text2)' : undefined }}>
              Login
            </Link>
          )}
          <Link href="/cart" className="cart-btn"
            style={{ color: (!isHome && !scrolled) ? 'var(--dark)' : undefined }}>
            <ShoppingBag size={16} />
            {count > 0 && <span className="cart-count"
              style={{ background: (!isHome && !scrolled) ? 'var(--dark)' : '#fff',
                       color: (!isHome && !scrolled) ? '#fff' : 'var(--dark)' }}>
              {count}
            </span>}
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: (!isHome && !scrolled) ? 'var(--dark)' : undefined }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={`mobile-link ${pathname === href ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}
        <div className="mobile-menu-footer">
          {customer ? (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-outline btn-sm">Logout</button>
          ) : (
            <Link href="/account" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
