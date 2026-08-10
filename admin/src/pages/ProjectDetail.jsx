import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Plus, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [images, setImages]     = useState([]);   // gallery images array
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // ─── Fetch project ────────────────────────────────────────────
  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/projects?all=true`);
      const found = data.projects.find((p) => p._id === id);
      if (!found) { toast.error('Project not found'); navigate('/projects'); return; }
      setProject(found);
      setImages(found.images || []);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  // ─── Upload new images — each file via single /upload endpoint ──
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fileArr = Array.from(files);
      const results = await Promise.all(
        fileArr.map((file) => {
          const fd = new FormData();
          fd.append('image', file);
          return API.post('/upload', fd);
        })
      );
      const newUrls = results.map((r) => r.data.url);
      const updated = [...images, ...newUrls];
      setImages(updated);
      await API.patch(`/projects/${id}/images`, { images: updated });
      toast.success(`${newUrls.length} image(s) uploaded!`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      toast.error(msg);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ─── Remove a single image ────────────────────────────────────
  const removeImage = async (idx) => {
    if (!confirm('Delete this image?')) return;
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    try {
      await API.patch(`/projects/${id}/images`, { images: updated });
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
      setImages(images); // revert
    }
  };

  // ─── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading" style={{ marginTop: 80 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      {/* ── Back + Header ── */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => navigate('/projects')}
            title="Back to Projects"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0 }}>{project.title}</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text3)' }}>
              {project.category}
              {project.location && ` — ${project.location}`}
              {project.year && ` (${project.year})`}
            </p>
          </div>
        </div>

        {/* Upload button */}
        <label
          htmlFor="gallery-upload"
          className="btn btn-primary"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {uploading ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Uploading...
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Images
            </>
          )}
        </label>
        <input
          id="gallery-upload"
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* ── Cover Image Card ── */}
      <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cover Image</h3>
        </div>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
          />
          <span
            style={{
              position: 'absolute', top: 8, left: 8,
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              fontSize: 11, padding: '3px 8px', borderRadius: 6,
            }}
          >
            Cover
          </span>
        </div>
      </div>

      {/* ── Gallery Images ── */}
      <div className="card">
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            Gallery Images
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>
              ({images.length} photo{images.length !== 1 ? 's' : ''})
            </span>
          </h3>
        </div>

        <div style={{ padding: 16 }}>
          {images.length === 0 ? (
            /* ── Empty state ── */
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '60px 24px', gap: 12,
                background: 'var(--bg2)', borderRadius: 10, border: '2px dashed var(--border)',
              }}
            >
              <ImageIcon size={40} color="var(--text3)" />
              <p style={{ color: 'var(--text3)', margin: 0, fontSize: 14 }}>
                No gallery images yet
              </p>
              <label
                htmlFor="gallery-upload-empty"
                className="btn btn-primary btn-sm"
                style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Upload size={14} />
                Upload Images
              </label>
              <input
                id="gallery-upload-empty"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleUpload(e.target.files)}
                disabled={uploading}
              />
            </div>
          ) : (
            /* ── Image Grid ── */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
              }}
            >
              {images.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'var(--bg2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    aspectRatio: '4/3',
                  }}
                >
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Image number badge */}
                  <span
                    style={{
                      position: 'absolute', bottom: 6, left: 6,
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    }}
                  >
                    #{idx + 1}
                  </span>

                  {/* Delete button */}
                  <button
                    className="btn btn-danger btn-icon btn-sm"
                    onClick={() => removeImage(idx)}
                    title="Delete image"
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      padding: '4px 6px',
                      borderRadius: 6,
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {/* Add more — inline upload tile */}
              <label
                htmlFor="gallery-upload-more"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  borderRadius: 8, border: '2px dashed var(--border)',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  background: 'var(--bg2)', aspectRatio: '4/3',
                  transition: 'border-color 0.2s, background 0.2s',
                  minHeight: 120,
                }}
                className="upload-tile"
              >
                {uploading ? (
                  <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
                ) : (
                  <>
                    <Plus size={24} color="var(--text3)" />
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>Add More</span>
                  </>
                )}
                <input
                  id="gallery-upload-more"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
