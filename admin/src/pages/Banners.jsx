import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EMPTY = { title: '', subtitle: '', image: '', link: '', buttonText: 'Shop Now', isActive: true, order: 0 };

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const fileRef               = useRef();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/banners?all=true');
      setBanners(data.banners);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title||'', subtitle: b.subtitle||'', image: b.image||'',
              link: b.link||'', buttonText: b.buttonText||'Shop Now',
              isActive: b.isActive, order: b.order });
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
    if (!form.image) { toast.error('Please upload a banner image'); return; }
    setSaving(true);
    try {
      editing
        ? await API.put(`/banners/${editing}`, form)
        : await API.post('/banners', form);
      toast.success(editing ? 'Banner updated' : 'Banner added');
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await API.delete(`/banners/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (b) => {
    try {
      await API.put(`/banners/${b._id}`, { ...b, isActive: !b.isActive });
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Banners</h1><p>Manage homepage slider banners</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Banner</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
        {loading ? <div className="loading"><div className="spinner" /></div>
          : banners.length === 0
            ? <div className="empty-state"><p>No banners yet. Add your first banner!</p></div>
            : banners.map((b) => (
          <div key={b._id} className="card">
            <img src={b.image} alt={b.title}
              style={{width:'100%',height:160,objectFit:'cover',display:'block'}} />
            <div className="card-body" style={{padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                <h3 style={{fontSize:15,fontWeight:600}}>{b.title || 'Untitled Banner'}</h3>
                <span className={`badge badge-${b.isActive?'success':'gray'}`}>{b.isActive?'Active':'Hidden'}</span>
              </div>
              {b.subtitle && <p style={{fontSize:13,color:'var(--text3)',marginBottom:10}}>{b.subtitle}</p>}
              <div className="flex gap-2" style={{marginTop:8}}>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(b)}>
                  {b.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(b)}><Pencil size={14} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(b._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Banner' : 'Add Banner'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Banner Image *</label>
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} />
                    {form.image
                      ? <img src={form.image} alt="" style={{width:'100%',height:140,objectFit:'cover',borderRadius:8}} />
                      : <><Upload size={28} color="var(--text3)" /><p>{uploading ? 'Uploading...' : 'Click to upload banner image (recommended: 1920×600)'}</p></>
                    }
                  </div>
                </div>
                <div className="form-group"><label>Title</label>
                  <input placeholder="e.g. Summer Sale — Up to 50% Off" value={form.title} onChange={f('title')} /></div>
                <div className="form-group"><label>Subtitle</label>
                  <input placeholder="e.g. Premium furniture at unbeatable prices" value={form.subtitle} onChange={f('subtitle')} /></div>
                <div className="form-row">
                  <div className="form-group"><label>Button Text</label>
                    <input placeholder="Shop Now" value={form.buttonText} onChange={f('buttonText')} /></div>
                  <div className="form-group"><label>Link URL</label>
                    <input placeholder="/products" value={form.link} onChange={f('link')} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Display Order</label>
                    <input type="number" min="0" value={form.order} onChange={f('order')} /></div>
                  <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:26}}>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:0}}>
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                      Active
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving||uploading}>
                  {saving ? 'Saving...' : editing ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
