import Link from 'next/link';

export const metadata = {
  title: 'About Us — Chamunda Enterprise',
  description: 'The story of Chamunda Enterprise — handcrafted furniture built with passion, quality wood, and over a decade of artisan craftsmanship.',
};

const STATS = [
  { n: '1000+', l: 'Happy Homes' },
  { n: '15+',    l: 'Years Experience' },
];

const VALUES = [
  {
    icon: '🌲',
    title: 'Sustainable Materials',
    desc: 'We source only responsibly harvested solid wood and eco-friendly fabrics — because beautiful furniture should not cost the earth.',
  },
  {
    icon: '🔨',
    title: 'Master Craftsmanship',
    desc: 'Every joint, every finish, every detail is handled by skilled artisans who take pride in their work and never cut corners.',
  },
  {
    icon: '❤️',
    title: 'Customer First',
    desc: 'From the first browse to the final delivery, your complete satisfaction is the measure of our success.',
  },
];

const MILESTONES = [
  { year: '2009', text: 'Founded in a small Surat workshop with three craftsmen and one dream — furniture for every home.' },
  { year: '2013', text: 'Expanded to our first showroom and launched the award-winning Royal Solid Wood Collection.' },
  { year: '2018', text: 'Reached 1,000 happy customers and opened our second production facility.' },
  { year: '2022', text: 'Launched our online store, bringing Chamunda craftsmanship to 50+ cities across India.' },
  { year: '2026', text: 'Serving 5,000+ homes and still crafting every piece with the same passion as day one.' },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO BAND ── */}
      <div className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
          alt="Chamunda Enterprise workshop"
          className="about-hero-img"
        />
        <div className="about-hero-overlay" />
        <div className="about-hero-content container">
          <span className="about-tag">Our Story</span>
          <h1>Built on Wood.<br />Built on Trust.</h1>
          <p>Handcrafted furniture that has graced over 5,000 homes across India since 2009.</p>
        </div>
      </div>

      {/* ── STORY + STATS ── */}
      <section className="about-story-section">
        <div className="container about-story-grid">
          <div className="about-story-text">
            <span className="section-eyebrow">Who We Are</span>
            <h2>Chamunda Enterprise</h2>
            <p>
              Born in a small Surat workshop in 2009, Chamunda Enterprise was founded on a simple belief —
              that exceptional furniture should be accessible to every Indian home. What began with
              three craftsmen and a passion for solid wood has grown into a trusted brand serving thousands
              of happy families across the country.
            </p>
            <p>
              Every piece we create balances timeless aesthetics, structural durability, and everyday comfort.
              We use only premium seasoned hardwood, handpicked fabrics, and traditional joinery techniques
              refined over 15 years of practice.
            </p>
            <Link href="/products" className="btn btn-dark btn-lg" style={{ marginTop: 28, display: 'inline-flex' }}>
              Explore Our Collection →
            </Link>
          </div>

          <div className="about-stats-grid">
            {STATS.map(({ n, l }) => (
              <div key={l} className="about-stat-card">
                <p className="about-stat-num">{n}</p>
                <p className="about-stat-label">{l}</p>
              </div>
            ))}
            <div className="about-stat-image">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                alt="Chamunda showroom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP FULL-BLEED ── */}
      <section className="about-craft-section">
        <div className="about-craft-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&q=80"
            alt="Wood craftsmanship"
          />
        </div>
        <div className="about-craft-text">
          <span className="section-eyebrow light">Our Craft</span>
          <h2>Where Every Joint<br />Tells a Story</h2>
          <p>
            We believe furniture is not just functional — it is a reflection of the people who create it
            and the families who live with it. Our artisans hand-select each plank, hand-sand every surface,
            and apply finishes that deepen with age rather than fade.
          </p>
          <p>
            No particle board. No shortcuts. Just solid wood, honest joinery, and pride in the craft.
          </p>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-values-header">
            <span className="section-eyebrow">Why Choose Us</span>
            <h2>Our Commitments</h2>
            <p>Six promises we keep for every customer, every order, every day.</p>
          </div>
          <div className="about-values-grid">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="about-value-card">
                <span className="about-value-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="about-timeline-section">
        <div className="container">
          <div className="about-values-header" style={{ marginBottom: 56 }}>
            <span className="section-eyebrow light">Our Journey</span>
            <h2 style={{ color: '#fff' }}>15 Years of Crafting Comfort</h2>
          </div>
          <div className="about-timeline">
            {MILESTONES.map(({ year, text }, i) => (
              <div key={year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <span className="timeline-year">{year}</span>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <div>
            <h2>Ready to Find Your Perfect Piece?</h2>
            <p>Browse our full collection — from statement sofas to handcrafted dining sets.</p>
          </div>
          <div className="about-cta-btns">
            <Link href="/products" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link href="/contact"  className="btn btn-outline btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>

      <style>{`
        /* ── HERO ── */
        .about-hero {
          position: relative;
          height: 70vh; min-height: 480px;
          display: flex; align-items: flex-end;
          overflow: hidden;
        }
        .about-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
        }
        .about-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,20,16,.75) 0%, rgba(26,20,16,.2) 60%, transparent 100%);
        }
        .about-hero-content {
          position: relative; z-index: 2;
          padding-bottom: 60px;
          padding-top: calc(68px + 32px);
        }
        .about-tag {
          display: inline-block;
          font-size: 11px; font-weight: 500;
          color: var(--accent); letter-spacing: .22em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .about-hero-content h1 {
          font-family: var(--font-head);
          font-size: clamp(36px, 5vw, 72px);
          font-weight: 300; color: #fff; line-height: 1.1;
          margin-bottom: 16px; letter-spacing: .02em;
        }
        .about-hero-content p {
          font-size: 15px; color: rgba(255,255,255,.65);
          font-weight: 300; line-height: 1.7; max-width: 480px;
        }

        /* ── STORY ── */
        .about-story-section { padding: 96px 0; background: var(--cream); }
        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: start;
        }
        .section-eyebrow {
          display: block;
          font-size: 11px; font-weight: 500;
          color: var(--text3); letter-spacing: .22em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .section-eyebrow.light { color: rgba(255,255,255,.45); }
        .about-story-text h2 {
          font-family: var(--font-head);
          font-size: clamp(28px, 3vw, 48px);
          font-weight: 400; color: var(--dark);
          margin-bottom: 24px; letter-spacing: .02em; line-height: 1.15;
        }
        .about-story-text p {
          font-size: 14px; color: var(--text2);
          line-height: 1.85; font-weight: 300; margin-bottom: 14px;
        }

        /* Stats grid */
        .about-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 4px;
        }
        .about-stat-card {
          background: var(--cream2);
          padding: 32px 24px; text-align: center;
          transition: background .25s;
        }
        .about-stat-card:hover { background: var(--cream3); }
        .about-stat-num {
          font-family: var(--font-head);
          font-size: 38px; font-weight: 400;
          color: var(--dark); letter-spacing: .02em;
        }
        .about-stat-label {
          font-size: 11px; color: var(--text3);
          letter-spacing: .14em; text-transform: uppercase;
          margin-top: 6px; font-weight: 500;
        }
        .about-stat-image {
          grid-column: 1 / -1;
          height: 220px; overflow: hidden;
        }
        .about-stat-image img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .6s ease;
        }
        .about-stat-image:hover img { transform: scale(1.04); }

        /* ── CRAFT FULL-BLEED ── */
        .about-craft-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
        }
        .about-craft-img-wrap { overflow: hidden; }
        .about-craft-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .8s ease;
        }
        .about-craft-img-wrap:hover img { transform: scale(1.03); }
        .about-craft-text {
          background: var(--dark);
          padding: 80px 64px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .about-craft-text h2 {
          font-family: var(--font-head);
          font-size: clamp(28px, 2.5vw, 44px);
          font-weight: 300; color: #fff;
          line-height: 1.15; letter-spacing: .02em;
          margin: 14px 0 24px;
        }
        .about-craft-text p {
          font-size: 14px; color: rgba(255,255,255,.55);
          line-height: 1.85; font-weight: 300; margin-bottom: 14px;
        }

        /* ── VALUES ── */
        .about-values-section { padding: 96px 0; background: var(--cream2); }
        .about-values-header { text-align: center; margin-bottom: 64px; }
        .about-values-header h2 {
          font-family: var(--font-head);
          font-size: clamp(28px, 3vw, 48px);
          font-weight: 400; color: var(--dark);
          margin: 12px 0; letter-spacing: .02em;
        }
        .about-values-header p {
          font-size: 14px; color: var(--text2);
          font-weight: 300; line-height: 1.7; margin-top: 10px;
        }
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .about-value-card {
          background: var(--cream);
          padding: 40px 32px;
          transition: background .25s, transform .25s;
        }
        .about-value-card:hover {
          background: #fff;
          transform: translateY(-4px);
        }
        .about-value-icon {
          display: block; font-size: 32px; margin-bottom: 18px;
        }
        .about-value-card h3 {
          font-family: var(--font-head);
          font-size: 20px; font-weight: 400;
          color: var(--dark); margin-bottom: 10px;
          letter-spacing: .02em;
        }
        .about-value-card p {
          font-size: 13px; color: var(--text2);
          line-height: 1.8; font-weight: 300;
        }

        /* ── TIMELINE ── */
        .about-timeline-section { padding: 96px 0; background: var(--dark2); }
        .about-timeline {
          position: relative;
          max-width: 800px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 0;
        }
        .about-timeline::before {
          content: '';
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 1px; background: rgba(255,255,255,.12);
          transform: translateX(-50%);
        }
        .timeline-item {
          display: flex;
          position: relative; padding: 0 0 48px;
        }
        .timeline-item.left  { justify-content: flex-end; padding-right: calc(50% + 32px); }
        .timeline-item.right { justify-content: flex-start; padding-left:  calc(50% + 32px); }
        .timeline-dot {
          position: absolute; left: 50%; top: 6px;
          width: 10px; height: 10px;
          background: var(--accent);
          border-radius: 50%;
          transform: translateX(-50%);
        }
        .timeline-card { max-width: 320px; }
        .timeline-year {
          display: block;
          font-family: var(--font-head);
          font-size: 28px; font-weight: 300;
          color: var(--accent); margin-bottom: 8px;
          letter-spacing: .04em;
        }
        .timeline-card p {
          font-size: 13px; color: rgba(255,255,255,.5);
          line-height: 1.8; font-weight: 300;
        }
        .timeline-item.right .timeline-card { text-align: left; }
        .timeline-item.left  .timeline-card { text-align: right; }

        /* ── CTA STRIP ── */
        .about-cta-section {
          background: var(--cream3);
          border-top: 1px solid var(--border);
          padding: 72px 0;
        }
        .about-cta-inner {
          display: flex; align-items: center;
          justify-content: space-between; gap: 40px; flex-wrap: wrap;
        }
        .about-cta-inner h2 {
          font-family: var(--font-head);
          font-size: clamp(24px, 2.5vw, 38px);
          font-weight: 400; color: var(--dark);
          margin-bottom: 8px; letter-spacing: .02em;
        }
        .about-cta-inner p {
          font-size: 14px; color: var(--text2);
          font-weight: 300; line-height: 1.7;
        }
        .about-cta-btns { display: flex; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .about-craft-section { grid-template-columns: 1fr; }
          .about-craft-img-wrap { height: 320px; }
          .about-craft-text { padding: 56px 32px; }
          .about-values-grid { grid-template-columns: 1fr 1fr; }
          .about-story-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 600px) {
          .about-values-grid { grid-template-columns: 1fr; }
          .about-timeline::before { left: 16px; }
          .timeline-item.left,
          .timeline-item.right { justify-content: flex-start; padding-left: 48px; padding-right: 0; }
          .timeline-dot { left: 16px; }
          .timeline-item.left .timeline-card { text-align: left; }
          .about-cta-inner { flex-direction: column; align-items: flex-start; }
          .about-craft-text { padding: 40px 24px; }
        }
      `}</style>
    </>
  );
}
