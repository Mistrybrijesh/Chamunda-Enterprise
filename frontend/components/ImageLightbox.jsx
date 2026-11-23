'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);

  const clampOffset = (x, y, scale) => {
    const stage = stageRef.current;
    const imageElement = imageRef.current;
    if (!stage || !imageElement) return { x, y };

    const maxX = Math.max(0, (imageElement.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (imageElement.offsetHeight * scale - stage.clientHeight) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const goToImage = (index) => {
    setActiveIndex((index + images.length) % images.length);
    resetZoom();
  };

  const zoomAt = (nextZoom, clientX, clientY) => {
    const boundedZoom = Math.max(1, Math.min(4, nextZoom));
    const stage = stageRef.current;
    const rect = stage?.getBoundingClientRect();
    const pointX = rect && Number.isFinite(clientX) ? clientX - (rect.left + rect.width / 2) : 0;
    const pointY = rect && Number.isFinite(clientY) ? clientY - (rect.top + rect.height / 2) : 0;
    const zoomFactor = boundedZoom / zoom;

    setOffset((current) => clampOffset(
      current.x - pointX * (zoomFactor - 1),
      current.y - pointY * (zoomFactor - 1),
      boundedZoom
    ));
    setZoom(boundedZoom);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        type: 'pan',
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startOffset: offset,
        startZoom: zoom,
      };
    } else if (pointersRef.current.size === 2) {
      const [first, second] = pointersRef.current.values();
      gestureRef.current = {
        type: 'pinch',
        distance: Math.hypot(first.x - second.x, first.y - second.y),
        startZoom: zoom,
      };
    }
  };

  const handlePointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = gestureRef.current;

    if (gesture?.type === 'pinch' && pointersRef.current.size >= 2) {
      const [first, second] = pointersRef.current.values();
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      const nextZoom = Math.max(1, Math.min(4, gesture.startZoom * distance / gesture.distance));
      setZoom(nextZoom);
      setOffset((current) => clampOffset(current.x, current.y, nextZoom));
    } else if (gesture?.type === 'pan' && gesture.startZoom > 1) {
      setOffset(clampOffset(
        gesture.startOffset.x + event.clientX - gesture.startX,
        gesture.startOffset.y + event.clientY - gesture.startY,
        zoom
      ));
    }
  };

  const handlePointerUp = (event) => {
    const gesture = gestureRef.current;
    if (gesture?.type === 'pan' && gesture.startZoom === 1 && images.length > 1) {
      const swipeDistance = event.clientX - gesture.startX;
      if (Math.abs(swipeDistance) > 60) {
        goToImage(activeIndex + (swipeDistance < 0 ? 1 : -1));
      }
    }
    pointersRef.current.delete(event.pointerId);
    gestureRef.current = null;
  };

  const handleWheel = (event) => {
    event.preventDefault();
    zoomAt(zoom * (event.deltaY < 0 ? 1.2 : 1 / 1.2), event.clientX, event.clientY);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && images.length > 1) goToImage(activeIndex - 1);
      if (event.key === 'ArrowRight' && images.length > 1) goToImage(activeIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, images.length, onClose]);

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
            goToImage(activeIndex - 1);
          }}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      <div className="lightbox-content" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div
          className="lightbox-stage"
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={(event) => {
            if (zoom === 1) zoomAt(2.5, event.clientX, event.clientY);
            else resetZoom();
          }}
          style={{ cursor: zoom > 1 ? 'grab' : 'zoom-in' }}
        >
          <img
            ref={imageRef}
            className="lightbox-image"
            src={image.src}
            alt={image.alt || ''}
            draggable="false"
            style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}
          />
        </div>
        <div className="lightbox-controls">
          <button type="button" onClick={() => zoomAt(zoom / 1.25)} disabled={zoom <= 1} aria-label="Zoom out">
            <Minus size={18} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => zoomAt(zoom * 1.25)} disabled={zoom >= 4} aria-label="Zoom in">
            <Plus size={18} />
          </button>
          <button type="button" onClick={resetZoom} disabled={zoom === 1} aria-label="Reset zoom">
            <RotateCcw size={16} />
          </button>
        </div>
        {images.length > 1 && (
          <span className="lightbox-count">{activeIndex + 1} / {images.length}</span>
        )}
        <span className="lightbox-hint">Scroll or pinch to zoom · Drag to move</span>
      </div>
      {images.length > 1 && (
        <button
          className="lightbox-arrow lightbox-next"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goToImage(activeIndex + 1);
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
          position: relative; display: flex; flex-direction: column; align-items: center;
          width: min(1100px, 100%); height: 100%; min-height: 0;
        }
        .lightbox-stage {
          display: flex; flex: 1; align-items: center; justify-content: center;
          width: 100%; min-height: 0; overflow: hidden; touch-action: none;
        }
        .lightbox-image {
          display: block; max-width: 100%; max-height: 100%;
          width: auto; height: auto; object-fit: contain;
          transform-origin: center; user-select: none; -webkit-user-drag: none;
        }
        .lightbox-controls {
          display: flex; align-items: center; gap: 12px; height: 48px;
          padding: 5px 12px; color: #fff; background: rgba(255,255,255,.12);
          border-radius: 24px; flex-shrink: 0;
        }
        .lightbox-controls button {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border: 0; border-radius: 50%;
          color: #fff; background: transparent;
        }
        .lightbox-controls button:hover:not(:disabled) { background: rgba(255,255,255,.18); }
        .lightbox-controls button:disabled { opacity: .4; cursor: default; }
        .lightbox-controls span { min-width: 42px; text-align: center; font-size: 12px; }
        .lightbox-count {
          position: absolute; bottom: 14px; left: 0; color: #fff; font-size: 13px;
        }
        .lightbox-hint {
          position: absolute; right: 0; bottom: 14px;
          color: rgba(255,255,255,.65); font-size: 11px;
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
        @media (max-width: 600px) {
          .image-lightbox { padding: 24px 16px; }
          .lightbox-close { top: 12px; right: 12px; }
          .lightbox-arrow { width: 40px; height: 40px; }
          .lightbox-prev { left: 8px; }
          .lightbox-next { right: 8px; }
          .lightbox-count { left: 50%; transform: translateX(-50%); bottom: -24px; }
          .lightbox-hint { display: none; }
        }
      `}</style>
    </div>
  );
}
