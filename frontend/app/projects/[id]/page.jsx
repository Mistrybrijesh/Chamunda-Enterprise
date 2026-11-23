import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectGallery from '../../../components/ProjectGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: project ? `${project.title} — Chamunda Enterprise` : 'Project — Chamunda Enterprise',
  };
}

async function getProject(id) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://chamunda-enterprise-gamma.vercel.app/api';

  try {
    const response = await fetch(`${apiUrl}/projects/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.project || null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <>
      <div className="page-band">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/projects">Projects</Link>
            <span>/</span>
            <span>{project.title}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="project-detail-meta">
            {[project.category, project.location, project.year].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {project.desc && <p className="project-detail-description">{project.desc}</p>}
          <ProjectGallery project={project} />
          <Link className="project-back-link" href="/projects">← Back to projects</Link>
        </div>
      </section>
      <style>{`
        .project-detail-meta { margin-top: 10px; color: var(--text2); }
        .project-detail-description {
          max-width: 760px; margin: 0 auto; color: var(--text2);
          line-height: 1.8; text-align: center;
        }
        .project-back-link {
          display: inline-block; margin-top: 36px; font-size: 13px;
          letter-spacing: .06em; color: var(--text2);
        }
        .project-back-link:hover { color: var(--dark); }
      `}</style>
    </>
  );
}
