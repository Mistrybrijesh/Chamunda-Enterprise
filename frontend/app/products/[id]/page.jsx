'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import API from '../../../lib/api';
import { useCart } from '../../../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!product) return <div className="empty"><h3>Product not found</h3></div>;

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/products">Products</Link><span>/</span>
          <span style={{color:'var(--text)'}}>{product.name}</span>
        </div>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={product.images?.[activeImg] || 'https://placehold.co/600x600/f1ede7/9e8f85?text=Furniture'}
                alt={product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, i) => (
                  <div key={i} className={`thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <span style={{background:'var(--bg3)',color:'var(--accent2)',padding:'4px 12px',borderRadius:50,fontSize:13,fontWeight:600}}>
              {product.category?.name}
            </span>
            <h1 style={{marginTop:12}}>{product.name}</h1>

            <div className="price-block">
              <span className="price">₹{product.price.toLocaleString()}</span>
              {product.mrp && <span className="mrp">₹{product.mrp.toLocaleString()}</span>}
              {discount && <span className="save">Save {discount}%</span>}
            </div>

            {product.description && <p className="desc">{product.description}</p>}

            {product.material && (
              <p style={{fontSize:14,color:'var(--text2)',marginBottom:8}}>
                <strong>Material:</strong> {product.material}
              </p>
            )}

            {(product.dimensions?.length || product.dimensions?.width) && (
              <p style={{fontSize:14,color:'var(--text2)',marginBottom:16}}>
                <strong>Dimensions:</strong> {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
              </p>
            )}

            <div className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`} style={{marginBottom:20}}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
            </div>

            {product.stock > 0 && (
              <>
                <div className="qty-row">
                  <div className="qty-ctrl">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                  </div>
                  <button className="btn btn-primary btn-lg" style={{flex:1,justifyContent:'center'}} onClick={handleAddToCart}>
                    {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                  </button>
                </div>
                <Link href="/cart" className="btn btn-dark" style={{width:'100%',justifyContent:'center',marginTop:8}}>
                  Buy Now →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
