'use client';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import resolveImageUrl from '../lib/imageUrl';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80';

export default function ProductCard({ product }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = (product.images || [])
    .filter(Boolean)
    .map((src) => ({ src: resolveImageUrl(src), alt: product.name }));
  const visibleImages = images.length ? images : [{ src: FALLBACK_IMAGE, alt: product.name }];

  return (
    <>
      <button
        type="button"
        className="product-card"
        onClick={() => setLightboxOpen(true)}
        aria-label={`View ${product.name} photos`}
      >
        <div className="product-card-img">
          <img src={visibleImages[0].src} alt={product.name} loading="lazy" />
          <div className="card-overlay">
            <span className="quick-view-btn"><Eye size={16} /> View Photos</span>
          </div>
        </div>
      </button>
      {lightboxOpen && (
        <ImageLightbox
          images={visibleImages}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      <style>{`
        .product-card {
          display: block; width: 100%; padding: 0; border: 0;
          color: inherit; text-align: left; font: inherit;
        }
        .card-overlay {
          position:absolute; inset:0; background:rgba(26,20,16,.35);
          display:flex; align-items:center; justify-content:center;
          opacity:0; transition:opacity .3s;
        }
        .product-card:hover .card-overlay,
        .product-card:focus-visible .card-overlay { opacity:1; }
        .quick-view-btn {
          display:flex; align-items:center; gap:7px;
          background:rgba(255,255,255,.95); color:var(--dark);
          padding:10px 22px; border-radius:50px;
          font-size:13px; font-weight:700;
          transform:translateY(8px); transition:transform .3s;
        }
        .product-card:hover .quick-view-btn,
        .product-card:focus-visible .quick-view-btn { transform:translateY(0); }
      `}</style>
    </>
  );
}
