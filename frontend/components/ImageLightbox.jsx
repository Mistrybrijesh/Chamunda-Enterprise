'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, onClose]);

  if (!images.length) return null;

  const image = images[activeIndex];

  return (
    <div className="image-lightbox" onClick={onClose}>
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close image viewer">
        <X size={24} />
      </button>
      {images.length > 1 && (
        <button
          className="lightbox-arrow lightbox-prev"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex((index) => (index - 1 + images.length) % images.length);
          }}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      <div className="lightbox-content" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <img src={image.src} alt={image.alt || ''} />
        {images.length > 1 && (
          <span className="lightbox-count">{activeIndex + 1} / {images.length}</span>
        )}
      </div>
      {images.length > 1 && (
        <button
          className="lightbox-arrow lightbox-next"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex((index) => (index + 1) % images.length);
          }}
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      )}
      <style>{`
        .image-lightbox {
          position: fixed; inset: 68px 0 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 48px; background: rgba(15, 12, 10, .94);
        }
        .lightbox-content {
          display: flex; flex-direction: column; align-items: center;
          max-width: min(1100px, 100%); max-height: 100%;
        }
        .lightbox-content img {
          max-width: 100%; max-height: calc(100vh - 168px);
          width: auto; height: auto; object-fit: contain;
        }
        .lightbox-close, .lightbox-arrow {
          position: absolute; display: flex; align-items: center; justify-content: center;
          border: 0; color: #fff; background: rgba(255,255,255,.12);
          border-radius: 50%; width: 48px; height: 48px; transition: background .2s;
        }
        .lightbox-close:hover, .lightbox-arrow:hover { background: rgba(255,255,255,.25); }
        .lightbox-close { top: 16px; right: 24px; }
        .lightbox-arrow { top: 50%; transform: translateY(-50%); }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }
        .lightbox-count { color: #fff; font-size: 13px; padding-top: 12px; }
        @media (max-width: 600px) {
          .image-lightbox { padding: 24px 16px; }
          .lightbox-content img { max-height: calc(100vh - 140px); }
          .lightbox-close { top: 12px; right: 12px; }
          .lightbox-arrow { width: 40px; height: 40px; }
          .lightbox-prev { left: 8px; }
          .lightbox-next { right: 8px; }
        }
      `}</style>
    </div>
  );
}
