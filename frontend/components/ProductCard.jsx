'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="product-card-badge">-{discount}%</span>}
        {/* Quick view overlay */}
        <div className="card-overlay">
          <span className="quick-view-btn"><Eye size={16} /> Quick View</span>
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-card-category">{product.category?.name || 'Furniture'}</p>
        {/* <h3 className="product-card-name">{product.name}</h3> */}
        {/* <div className="product-card-price">
          <span className="current">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.mrp && <span className="original">₹{product.mrp?.toLocaleString('en-IN')}</span>}
          {discount > 0 && <span className="discount">Save {discount}%</span>}
        </div> */}
        {/* <button
          className={`add-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Added to Cart!' : <><ShoppingCart size={15} /> Add to Cart</>}
        </button> */}
      </div>

      <style>{`
        .card-overlay {
          position:absolute; inset:0; background:rgba(26,20,16,.35);
          display:flex; align-items:center; justify-content:center;
          opacity:0; transition:opacity .3s;
        }
        .product-card:hover .card-overlay { opacity:1; }
        .quick-view-btn {
          display:flex; align-items:center; gap:7px;
          background:rgba(255,255,255,.95); color:var(--dark);
          padding:10px 22px; border-radius:50px;
          font-size:13px; font-weight:700;
          transform:translateY(8px); transition:transform .3s;
        }
        .product-card:hover .quick-view-btn { transform:translateY(0); }
        .add-cart-btn.added {
          background:var(--success) !important;
          transform:translateY(-1px);
        }
      `}</style>
    </Link>
  );
}
