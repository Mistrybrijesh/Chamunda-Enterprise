import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EMPTY = { name: '', isActive: true, order: 0, image: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const fileRef                     = useRef();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/categories');
      setCategories(data.categories);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, isActive: c.isActive, order: c.order, image: c.image || '' });
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
    setSaving(true);
    try {
      editing
        ? await API.put(`/categories/${editing}`, form)
        : await API.post('/categories', form);
      toast.success(editing ? 'Category updated' : 'Category added');
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div><h1>Categories</h1><p>Manage product categories</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <table>
              <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.length === 0
                  ? <tr><td colSpan={6} style={{textAlign:'center',color:'var(--text3)',padding:'32px'}}>No categories yet</td></tr>
                  : categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      {c.image
                        ? <img className="product-thumb" src={c.image} alt={c.name} />
                        : <div className="product-thumb" style={{background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center'}}>🏷️</div>}
                    </td>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td style={{fontFamily:'monospace',fontSize:12,color:'var(--text3)'}}>{c.slug}</td>
                    <td>{c.order}</td>
                    <td><span className={`badge badge-${c.isActive?'success':'gray'}`}>{c.isActive?'Active':'Hidden'}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(c._id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input required placeholder="e.g. Sofa, Bed, Table..." value={form.name} onChange={f('name')} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" min="0" value={form.order} onChange={f('order')} />
                  </div>
                  <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:26}}>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:0}}>
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                      Active
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Category Image</label>
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} />
                    {form.image
                      ? <img src={form.image} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:8}} />
                      : <><Upload size={28} color="var(--text3)" /><p>{uploading ? 'Uploading...' : 'Click to upload'}</p></>
                    }
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving||uploading}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
