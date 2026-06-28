import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EMPTY = { title: '', category: 'Residential', location: '', year: '', image: '', desc: '', isActive: true, order: 0 };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const fileRef                 = useRef();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/projects?all=true');
      setProjects(data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ title: p.title||'', category: p.category||'Residential', location: p.location||'',
              year: p.year||'', image: p.image||'', desc: p.desc||'', isActive: p.isActive, order: p.order });
    setModal(true);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await API.post('/upload', fd);
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image) { toast.error('Please upload a project image'); return; }
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

  const toggleActive = async (p) => {
    try {
      await API.put(`/projects/${p._id}`, { ...p, isActive: !p.isActive });
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Projects</h1><p>Manage homepage project showcase</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Project</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
        {loading ? <div className="loading"><div className="spinner" /></div>
          : projects.length === 0
            ? <div className="empty-state"><p>No projects yet. Add your first project!</p></div>
            : projects.map((p) => (
          <div key={p._id} className="card">
            <img src={p.image} alt={p.title}
              style={{width:'100%',height:160,objectFit:'cover',display:'block'}} />
            <div className="card-body" style={{padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                <h3 style={{fontSize:15,fontWeight:600}}>{p.title}</h3>
                <span className={`badge badge-${p.isActive?'success':'gray'}`}>{p.isActive?'Active':'Hidden'}</span>
              </div>
              <p style={{fontSize:12,color:'var(--text3)',marginBottom:4}}>{p.category} {p.location && `— ${p.location}`} {p.year && `(${p.year})`}</p>
              {p.desc && <p style={{fontSize:13,color:'var(--text3)',marginBottom:10}}>{p.desc}</p>}
              <div className="flex gap-2" style={{marginTop:8}}>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(p)}>
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Project Image *</label>
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} />
                    {form.image
                      ? <img src={form.image} alt="" style={{width:'100%',height:140,objectFit:'cover',borderRadius:8}} />
                      : <><Upload size={28} color="var(--text3)" /><p>{uploading ? 'Uploading...' : 'Click to upload project image'}</p></>
                    }
                  </div>
                </div>
                <div className="form-group"><label>Title *</label>
                  <input placeholder="e.g. Modern Villa — Surat" value={form.title} onChange={f('title')} required /></div>
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
                    <input placeholder="e.g. Surat, Gujarat" value={form.location} onChange={f('location')} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Year</label>
                    <input placeholder="e.g. 2025" value={form.year} onChange={f('year')} /></div>
                  <div className="form-group"><label>Display Order</label>
                    <input type="number" min="0" value={form.order} onChange={f('order')} /></div>
                </div>
                <div className="form-group"><label>Description</label>
                  <textarea rows={3} placeholder="Brief description of the project..." value={form.desc} onChange={f('desc')} /></div>
                <div className="form-group" style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="checkbox" id="proj-active" checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                  <label htmlFor="proj-active" style={{margin:0,cursor:'pointer'}}>Active (show on homepage)</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving||uploading}>
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
