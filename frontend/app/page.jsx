'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import API from '../lib/api';
import ProductCard from '../components/ProductCard';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.classList.add('revealed'); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FALLBACK_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
    tag: 'New Collection 2026',
    title: 'Luxury Living\nRedefined',
    subtitle: 'Handcrafted furniture that transforms every room into a masterpiece.',
    btn: 'Shop Now',
    link: '/products',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1600&q=80',
    tag: 'Bedroom Collection',
    title: 'Sleep in\nStyle & Comfort',
    subtitle: 'Premium beds and bedroom furniture crafted for the perfect rest.',
    btn: 'Explore Beds',
    link: '/products?category=bed',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80',
    tag: 'Dining Collection',
    title: 'Gather Around\nBeautifully',
    subtitle: 'Elegant dining sets that bring family and warmth together.',
    btn: 'View Dining',
    link: '/products?category=table',
  },
];

const WHY_US = [
  { icon: '🚚', title: 'Free Delivery', desc: 'On all orders above ₹10,000 across India' },
  { icon: '🪵', title: 'Solid Wood Quality', desc: 'Premium seasoned wood & fabrics only' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: '🛡️', title: '5-Year Warranty', desc: 'Structural warranty on every piece' },
];

const FALLBACK_PROJECTS = [
  { id:1, title:'Modern Villa — Surat', category:'Residential', image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80' },
  { id:2, title:'Corporate Office — Ahmedabad', category:'Commercial', image:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80' },
  { id:3, title:'Luxury Penthouse — Mumbai', category:'Residential', image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80' },
  { id:4, title:'Boutique Hotel — Vadodara', category:'Hospitality', image:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80' },
  { id:5, title:'Family Home — Rajkot', category:'Residential', image:'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80' },
];

export default function HomePage() {
  const [banners, setBanners]     = useState([]);
  const [featured, setFeatured]   = useState([]);
  const [projects, setProjects]   = useState([]);
  const [slide, setSlide]         = useState(0);
  const [animKey, setAnimKey]     = useState(0);
  const [projIdx, setProjIdx]     = useState(0);
  const [projAnimDir, setProjAnimDir] = useState('left');
  const touchStartX = useRef(null);


  const featRef = useReveal();
  const whyRef  = useReveal();
  const projRef = useReveal();

  useEffect(() => {
    Promise.all([
      API.get('/banners'),
      API.get('/products?featured=true&limit=8'),
      API.get('/projects'),
    ]).then(([b, p, pr]) => {
      setBanners(b.data.banners || []);
      setFeatured(p.data.products || []);
      setProjects(pr.data.projects || []);
    }).catch(() => {});
  }, []);

  const slides = banners.length > 0 ? banners.map((b, i) => ({
    id: b._id || i,
    image: b.image,
    tag: 'Chamunda Enterprise',
    title: b.title || 'Premium Furniture',
    subtitle: b.subtitle || '',
    btn: b.buttonText || 'Shop Now',
    link: b.link || '/products',
  })) : FALLBACK_SLIDES;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => {
      setSlide(s => (s + 1) % slides.length);
      setAnimKey(k => k + 1);
    }, 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  // Projects auto-play every 5 seconds
  useEffect(() => {
    const total = projects.length || FALLBACK_PROJECTS.length;
    if (total < 2) return;
    const t = setInterval(() => {
      setProjAnimDir('left');
      setProjIdx(i => (i + 1) % total);
    }, 5000);
    return () => clearInterval(t);
  }, [projects.length]);

  const goSlide = (i) => { setSlide(i); setAnimKey(k => k + 1); };
  const prev = () => goSlide((slide - 1 + slides.length) % slides.length);
  const next = () => goSlide((slide + 1) % slides.length);


  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === slide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="hero-overlay" />
            <div className="hero-bottom-bar">
              <div className="hero-content" key={i === slide ? animKey : 'idle'}>
                <span className="hero-tag">{s.tag}</span>
                <h1>{s.title.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</h1>
                <p>{s.subtitle}</p>
                <div className="hero-cta">
                  <Link href={s.link} className="btn btn-primary btn-lg">{s.btn}</Link>
                  <Link href="/about" className="btn btn-outline-white btn-lg">Our Story</Link>
                </div>
              </div>

              {slides.length > 1 && (
                <div className="hero-nav">
                  <button className="hero-nav-btn" onClick={prev}><ArrowLeft size={18} /></button>
                  <span className="hero-counter">{slide + 1} / {slides.length}</span>
                  <button className="hero-nav-btn" onClick={next}><ArrowRight size={18} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {['Premium Furniture', 'Handcrafted Quality', 'Free Delivery', '5-Year Warranty', 'Easy Returns', 'Made in India',
            'Premium Furniture', 'Handcrafted Quality', 'Free Delivery', '5-Year Warranty', 'Easy Returns', 'Made in India'].map((t, i) => (
            <span key={i}>{t} <span className="marquee-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section reveal-section" ref={featRef}>
        <div className="container">
          <div className="section-header">
            <span className="tag">Best Sellers</span>
            <h2>Featured Collection</h2>
            <p>Handpicked furniture loved by thousands of happy customers across India</p>
          </div>
          {featured.length === 0 ? (
            <div className="empty">
              <h3>Products Coming Soon</h3>
              <p style={{marginTop:8,fontSize:14}}>We're adding our finest collection. Check back shortly.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => (
                <div key={p._id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/products" className="btn btn-dark btn-lg">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ── PROJECTS SWIPER ── */}
      {(() => {
        const projList = projects.length > 0 ? projects : FALLBACK_PROJECTS;
        const total = projList.length;
        const prevProj = () => { setProjAnimDir('right'); setProjIdx(i => (i - 1 + total) % total); };
        const nextProj = () => { setProjAnimDir('left');  setProjIdx(i => (i + 1) % total); };
        return (
          <section className="proj-section reveal-section" ref={projRef}>
            <div className="proj-header">
              <h2>PROJECTS</h2>
              <Link href="/projects" className="proj-discover">Discover more →</Link>
            </div>
            <div
              className="proj-swiper-wrap"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) nextProj();
                  else          prevProj();
                }
                touchStartX.current = null;
              }}

            >
              {/* Prev card (partial) */}
              <div className="proj-side proj-side-left" onClick={prevProj}>
                <img src={projList[(projIdx - 1 + total) % total].image} alt="" />
                <div className="proj-side-label">{projList[(projIdx - 1 + total) % total].title}</div>
              </div>
              {/* Main card — key forces re-mount = animation re-triggers */}
              <div className={`proj-main proj-anim-${projAnimDir}`} key={projIdx}>
                <img src={projList[projIdx].image} alt={projList[projIdx].title} />
                <div className="proj-main-info">
                  <span className="proj-cat">{projList[projIdx].category}</span>
                  <h3>{projList[projIdx].title}</h3>
                </div>
              </div>
              {/* Next card (partial) */}
              <div className="proj-side proj-side-right" onClick={nextProj}>
                <img src={projList[(projIdx + 1) % total].image} alt="" />
                <div className="proj-side-label">{projList[(projIdx + 1) % total].title}</div>
              </div>
            </div>
            {/* Nav arrows */}
            <div className="proj-nav">
              <button className="proj-nav-btn" onClick={prevProj}><ArrowLeft size={18} /></button>
              <span className="proj-counter">{projIdx + 1} / {total}</span>
              <button className="proj-nav-btn" onClick={nextProj}><ArrowRight size={18} /></button>
            </div>
          </section>
        );
      })()}

      <style>{`
        .hero-content { animation: heroIn 1s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes heroIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media(max-width:768px) { .hero-nav { display:none; } }

        /* Project slide animation */
        @keyframes projSlideLeft {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes projSlideRight {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .proj-anim-left  { animation: projSlideLeft  0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .proj-anim-right { animation: projSlideRight 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        /* Projects Swiper */
        .proj-section {
          background: var(--dark);
          padding: 56px 0 40px;
          overflow: hidden;
        }
        .proj-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; margin-bottom: 32px;
        }
        .proj-header h2 {
          font-family: var(--font-body); font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: .22em; text-transform: uppercase;
        }
        .proj-discover {
          font-size: 12px; font-weight: 400; color: rgba(255,255,255,.55);
          letter-spacing: .1em; text-transform: uppercase;
          text-decoration: underline; text-underline-offset: 4px;
          transition: color .2s;
        }
        .proj-discover:hover { color: #fff; }

        .proj-swiper-wrap {
          display: flex; align-items: center; gap: 16px;
          padding: 0 48px;
        }
        .proj-main {
          flex: 1; min-width: 0; position: relative;
          aspect-ratio: 16/9; overflow: hidden; cursor: pointer;
        }
        .proj-main img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .6s ease;
        }
        .proj-main:hover img { transform: scale(1.04); }
        .proj-main-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px 24px;
          background: linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 100%);
        }
        .proj-cat {
          display: block; font-size: 10px; color: rgba(255,255,255,.6);
          letter-spacing: .18em; text-transform: uppercase; margin-bottom: 6px;
        }
        .proj-main-info h3 {
          font-family: var(--font-head); font-size: 22px; font-weight: 400;
          color: #fff; letter-spacing: .02em;
        }

        .proj-side {
          width: 160px; flex-shrink: 0; position: relative;
          aspect-ratio: 3/4; overflow: hidden; cursor: pointer;
          opacity: .55; transition: opacity .3s;
        }
        .proj-side:hover { opacity: .75; }
        .proj-side img { width: 100%; height: 100%; object-fit: cover; }
        .proj-side-label {
          position: absolute; bottom: 10px; left: 10px; right: 10px;
          font-size: 10px; color: rgba(255,255,255,.7);
          letter-spacing: .06em; line-height: 1.4;
        }

        .proj-nav {
          display: flex; align-items: center; gap: 16px;
          justify-content: flex-end; padding: 20px 48px 0;
        }
        .proj-nav-btn {
          background: none; border: 1px solid rgba(255,255,255,.2);
          color: rgba(255,255,255,.7); cursor: pointer;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .proj-nav-btn:hover { border-color: #fff; color: #fff; }
        .proj-counter {
          font-size: 12px; color: rgba(255,255,255,.45);
          letter-spacing: .1em; min-width: 40px; text-align: center;
        }

        @media(max-width: 768px) {
          .proj-header, .proj-swiper-wrap, .proj-nav { padding-left: 20px; padding-right: 20px; }
          .proj-side { display: none; }
          .proj-main { aspect-ratio: 4/3; }
        }
      `}</style>

    </>
  );
}
