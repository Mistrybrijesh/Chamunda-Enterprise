import Link from 'next/link';

export const metadata = {
  title: 'Projects — Chamunda Enterprise',
  description: 'Explore our interior design projects and furniture installations across India.',
};

export const revalidate = 0;

async function getProjects() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://chamunda-enterprise-gamma.vercel.app/api';

  try {
    const response = await fetch(`${apiUrl}/projects`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return data.projects || [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

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
            {projects.length === 0 ? (
              <div className="empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                <h3>Projects Coming Soon</h3>
              </div>
            ) : projects.map((p) => (
              <div key={p._id} className="project-card">
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
