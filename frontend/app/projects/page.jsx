import Link from 'next/link';

export const metadata = {
  title: 'Projects — Chamunda Enterprise',
  description: 'Explore our interior design projects and furniture installations across India.',
};

const PROJECTS = [
  {
    id: 1,
    title: 'Modern Villa — Surat',
    category: 'Residential',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    desc: 'Full living room and bedroom setup with custom walnut furniture.',
  },
  {
    id: 2,
    title: 'Corporate Office — Ahmedabad',
    category: 'Commercial',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    desc: 'Premium office interiors with ergonomic and aesthetic furniture.',
  },
  {
    id: 3,
    title: 'Luxury Penthouse — Mumbai',
    category: 'Residential',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    desc: 'Bespoke dining and lounge furniture for a sea-facing penthouse.',
  },
  {
    id: 4,
    title: 'Boutique Hotel — Vadodara',
    category: 'Hospitality',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    desc: 'Complete room furnishing for a 40-room boutique hotel.',
  },
  {
    id: 5,
    title: 'Family Home — Rajkot',
    category: 'Residential',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    desc: 'Traditional teak furniture blended with modern minimal design.',
  },
  {
    id: 6,
    title: 'Restaurant — Gandhinagar',
    category: 'Hospitality',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    desc: 'Custom dining chairs, tables and bar furniture for a premium restaurant.',
  },
];

export default function ProjectsPage() {
  return (
    <>
      {/* Page Band */}
      <div className="page-band">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Projects</span>
          </div>
          <h1>Our Projects</h1>
          <p style={{ color: 'var(--text2)', marginTop: 10, fontSize: 14, fontWeight: 300, lineHeight: 1.7 }}>
            Real spaces, real people — furniture installations across India.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="section">
        <div className="container">
          <div className="projects-grid">
            {PROJECTS.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-card-img">
                  <img src={p.image} alt={p.title} />
                  <div className="project-card-overlay">
                    <span className="project-year">{p.year}</span>
                  </div>
                </div>
                <div className="project-card-body">
                  <span className="project-cat">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .project-card {
          background: var(--cream2);
          overflow: hidden;
          transition: transform .35s ease;
          cursor: pointer;
        }
        .project-card:hover { transform: translateY(-4px); }
        .project-card-img {
          aspect-ratio: 4/3;
          overflow: hidden;
          position: relative;
        }
        .project-card-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform .6s ease;
        }
        .project-card:hover .project-card-img img { transform: scale(1.06); }
        .project-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,20,16,.4) 0%, transparent 60%);
        }
        .project-year {
          position: absolute; bottom: 14px; right: 16px;
          font-size: 11px; color: rgba(255,255,255,.8);
          letter-spacing: .14em; text-transform: uppercase;
        }
        .project-card-body { padding: 22px 24px 28px; }
        .project-cat {
          display: block; font-size: 10px; font-weight: 500;
          color: var(--text3); letter-spacing: .18em;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .project-card-body h3 {
          font-family: var(--font-head); font-size: 22px;
          font-weight: 400; color: var(--dark); margin-bottom: 8px;
          letter-spacing: .01em;
        }
        .project-card-body p {
          font-size: 13px; color: var(--text2);
          line-height: 1.7; font-weight: 300;
        }
        @media(max-width: 768px) {
          .page-band { margin-top: 60px !important; }
        }
      `}</style>
    </>
  );
}
