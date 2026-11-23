'use client';
import { useState } from 'react';
import ImageLightbox from './ImageLightbox';
import resolveImageUrl from '../lib/imageUrl';

export default function CategoryProductGallery({ categories, products, activeCategory = '' }) {
  const visibleCategories = activeCategory
    ? categories.filter((category) => category._id === activeCategory || category.slug === activeCategory)
    : categories;
  const groups = visibleCategories.map((category) => ({
    ...category,
    products: products.filter((product) =>
      product.category?._id === category._id || product.category?.slug === category.slug
    ),
  })).filter((category) => category.products.length > 0);
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      {groups.length === 0 ? (
        <div className="empty"><h3>No product images found</h3></div>
      ) : (
        <div className="category-image-groups">
          {groups.map((category) => (
            <section className="category-image-group" id={category.slug} key={category._id}>
              <h2>{category.name}</h2>
              <div className="category-image-grid">
                {category.products.map((product) => {
                  const images = (product.images || []).filter(Boolean)
                    .map((src) => ({ src: resolveImageUrl(src), alt: product.name }));
                  if (images.length === 0) return null;
                  return (
                    <button
                      className="category-product-image"
                      key={product._id}
                      type="button"
                      onClick={() => setLightbox({ images, initialIndex: 0 })}
                      aria-label={`View ${product.name} photos`}
                    >
                      <img src={images[0].src} alt={product.name} loading="lazy" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.initialIndex}
          onClose={() => setLightbox(null)}
        />
      )}
      <style>{`
        .category-image-group { margin-bottom: 56px; }
        .category-image-group h2 {
          font-family: var(--font-head); font-size: 32px; font-weight: 400;
          color: var(--dark); margin-bottom: 20px; text-transform: capitalize;
        }
        .category-image-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .category-product-image {
          display: block; border: 0; padding: 0; overflow: hidden;
          aspect-ratio: 4 / 3; background: var(--cream3); cursor: zoom-in;
        }
        .category-product-image img {
          width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease;
        }
        .category-product-image:hover img { transform: scale(1.04); }
        @media (max-width: 600px) {
          .category-image-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        }
      `}</style>
    </>
  );
}
