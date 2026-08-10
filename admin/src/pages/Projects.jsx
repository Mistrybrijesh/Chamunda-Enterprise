import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Upload, Images, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EMPTY = {
  title: '', category: 'Residential', location: '',
  year: '', image: '', images: [], desc: '', isActive: true, order: 0,
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [uploading, setUploading] = useState(false);   // cover upload
  const [gallUpload, setGallUpload] = useState(false); // gallery upload
  const [saving, setSaving]       = useState(false);

  const coverRef   = useRef();
  const galleryRef = useRef();

  // ─── Fetch ────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/projects?all=true');
      setProjects(data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // ─── Open modal ───────────────────────────────────────────────
  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '', category: p.category || 'Residential',
      location: p.location || '', year: p.year || '',
      image: p.image || '', images: p.images || [],
      desc: p.desc || '', isActive: p.isActive, order: p.order,
    });
    setModal(true);
  };

  // ─── Upload cover image (single) ─────────────────────────────
  const handleCoverUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await API.post('/upload', fd);
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Cover image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); coverRef.current.value = ''; }
  };

  // ─── Upload gallery images — each file via single /upload endpoint ──
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    setGallUpload(true);
    try {
      const fileArr = Array.from(files);
      // Upload all files in parallel using the single-image endpoint
      const results = await Promise.all(
        fileArr.map((file) => {
          const fd = new FormData();
          fd.append('image', file);
          return API.post('/upload', fd);
        })
      );
      const newUrls = results.map((r) => r.data.url);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
      toast.success(`${newUrls.length} image(s) added`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gallery upload failed';
      toast.error(msg);
      console.error('Gallery upload error:', err);
    } finally {
      setGallUpload(false);
      if (galleryRef.current) galleryRef.current.value = '';
    }
  };

  // ─── Remove one gallery image ─────────────────────────────────
  const removeGalleryImg = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // ─── Save project ─────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image) { toast.error('Please upload a cover image'); return; }
    setSaving(true);
    try {
      editing
        ? await API.put(`/projects/${editing}`, form)
        : await API.post('/projects', form);
      toast.success(editing ? 'Project updated' : 'Project added');
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div><h1>Projects</h1><p>Manage homepage project showcase</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Project</button>
      </div>

      {/* ── Project Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {loading
          ? <div className="loading"><div className="spinner" /></div>
          : projects.length === 0
            ? <div className="empty-state"><p>No projects yet. Add your first project!</p></div>
            : projects.map((p) => (
          <div key={p._id} className="card"
            style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            onClick={() => navigate(`/projects/${p._id}`)}
          >
            <img src={p.image} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
            <div className="card-body" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
                <span className={`badge badge-${p.isActive ? 'success' : 'gray'}`}>{p.isActive ? 'Active' : 'Hidden'}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>
                {p.category}{p.location && ` — ${p.location}`}{p.year && ` (${p.year})`}
              </p>
              {p.desc && <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>{p.desc}</p>}
              {(p.images?.length > 0) && (
                <p style={{ fontSize: 11, color: 'var(--primary)', marginBottom: 6, fontWeight: 500 }}>
                  📷 {p.images.length} gallery photo{p.images.length !== 1 ? 's' : ''}
                </p>
              )}
              <div className="flex gap-2" style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/projects/${p._id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Images size={13} /> Manage Images
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 580, width: '95%' }}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">

                {/* ── Cover Image ── */}
                <div className="form-group">
                  <label>Cover Image * <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400 }}>(main photo)</span></label>
                  <div className="upload-zone" onClick={() => coverRef.current.click()}>
                    <input ref={coverRef} type="file" accept="image/*"
                      onChange={(e) => handleCoverUpload(e.target.files[0])} />
                    {form.image
                      ? <img src={form.image} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8 }} />
                      : <><Upload size={26} color="var(--text3)" /><p>{uploading ? 'Uploading...' : 'Click to upload cover image'}</p></>
                    }
                  </div>
                </div>

                {/* ── Gallery Images (multiple) ── */}
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      Gallery Images
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400, marginLeft: 6 }}>
                        ({form.images.length} added)
                      </span>
                    </span>
                    <label
                      htmlFor="gall-upload"
                      className="btn btn-ghost btn-sm"
                      style={{ cursor: gallUpload ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 0 }}
                    >
                      {gallUpload
                        ? <><div className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Uploading...</>
                        : <><ImagePlus size={14} /> Add Photos</>
                      }
                    </label>
                    <input
                      id="gall-upload"
                      ref={galleryRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => handleGalleryUpload(e.target.files)}
                      disabled={gallUpload}
                    />
                  </label>

                  {/* Gallery grid preview */}
                  {form.images.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                      gap: 8, marginTop: 8,
                    }}>
                      {form.images.map((url, idx) => (
                        <div key={idx} style={{
                          position: 'relative', borderRadius: 6, overflow: 'hidden',
                          aspectRatio: '1', background: 'var(--bg2)',
                        }}>
                          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <button
                            type="button"
                            onClick={() => removeGalleryImg(idx)}
                            style={{
                              position: 'absolute', top: 3, right: 3,
                              background: 'rgba(220,38,38,0.85)', border: 'none',
                              borderRadius: 4, cursor: 'pointer', padding: '2px 4px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff',
                            }}
                            title="Remove"
                          >
                            <X size={11} />
                          </button>
                          <span style={{
                            position: 'absolute', bottom: 2, left: 3,
                            fontSize: 9, color: '#fff',
                            background: 'rgba(0,0,0,0.5)', padding: '1px 4px', borderRadius: 3,
                          }}>#{idx + 1}</span>
                        </div>
                      ))}

                      {/* Add more tile */}
                      <label
                        htmlFor="gall-upload-more"
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', gap: 4, borderRadius: 6,
                          border: '2px dashed var(--border)', cursor: gallUpload ? 'not-allowed' : 'pointer',
                          background: 'var(--bg2)', aspectRatio: '1', minHeight: 70,
                        }}
                      >
                        {gallUpload
                          ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                          : <><Plus size={18} color="var(--text3)" /><span style={{ fontSize: 10, color: 'var(--text3)' }}>More</span></>
                        }
                        <input
                          id="gall-upload-more"
                          type="file" accept="image/*" multiple
                          style={{ display: 'none' }}
                          onChange={(e) => handleGalleryUpload(e.target.files)}
                          disabled={gallUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    /* Empty gallery drop zone */
                    <label
                      htmlFor="gall-upload-empty"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 6, padding: '20px 16px',
                        border: '2px dashed var(--border)', borderRadius: 8,
                        cursor: gallUpload ? 'not-allowed' : 'pointer',
                        background: 'var(--bg2)', marginTop: 6,
                      }}
                    >
                      <ImagePlus size={28} color="var(--text3)" />
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                        {gallUpload ? 'Uploading...' : 'Click to add multiple gallery photos'}
                      </span>
                      <input
                        id="gall-upload-empty"
                        type="file" accept="image/*" multiple
                        style={{ display: 'none' }}
                        onChange={(e) => handleGalleryUpload(e.target.files)}
                        disabled={gallUpload}
                      />
                    </label>
                  )}
                </div>

                {/* ── Text fields ── */}
                <div className="form-group"><label>Title *</label>
                  <input placeholder="e.g. Modern Villa — Surat" value={form.title} onChange={f('title')} required />
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Category</label>
                    <select value={form.category} onChange={f('category')}>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Hospitality</option>
                      <option>Office</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Location</label>
                    <input placeholder="e.g. Surat, Gujarat" value={form.location} onChange={f('location')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Year</label>
                    <input placeholder="e.g. 2025" value={form.year} onChange={f('year')} />
                  </div>
                  <div className="form-group"><label>Display Order</label>
                    <input type="number" min="0" value={form.order} onChange={f('order')} />
                  </div>
                </div>
                <div className="form-group"><label>Description</label>
                  <textarea rows={3} placeholder="Brief description of the project..." value={form.desc} onChange={f('desc')} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="proj-active" checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                  <label htmlFor="proj-active" style={{ margin: 0, cursor: 'pointer' }}>Active (show on homepage)</label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading || gallUpload}>
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
