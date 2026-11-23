"use client";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function ProjectGallery({ project }) {
  const images = [
    ...new Set([project.image, ...(project.images || [])].filter(Boolean)),
  ].map((src) => ({ src, alt: project.title }));
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <>
      <div className="project-gallery-grid">
        {images.map((image, index) => (
          <button
            className="project-gallery-image"
            key={image.src}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`View project photo ${index + 1}`}
          >
            <img
              src={image.src}
              alt={`${project.title} — photo ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <style>{`
        .project-gallery-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px; margin-top: 32px;
        }
        .project-gallery-image {
          border: 0; padding: 0; overflow: hidden; background: var(--cream3);
          aspect-ratio: 4 / 3; cursor:  poiter;
        }
        .project-gallery-image img {
          width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease;
        }
        .project-gallery-image:hover img { transform: scale(1.04); }
        @media (max-width: 600px) {
          .project-gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        }
      `}</style>
    </>
  );
}
