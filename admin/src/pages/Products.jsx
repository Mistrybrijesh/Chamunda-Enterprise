import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, X, Upload, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EMPTY = {
  name: '', price: '', mrp: '', stock: '', description: '',
  category: '', material: '', isFeatured: false, isActive: true, images: [],
  dimensions: { length: '', width: '', height: '', unit: 'cm' },
};

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const fileRef                     = useRef();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories'),
      ]);
      setProducts(p.data.products);
      setCategories(c.data.categories);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, price: p.price, mrp: p.mrp || '',
      stock: p.stock, description: p.description || '',
      category: p.category?._id || '', material: p.material || '',
      isFeatured: p.isFeatured, isActive: p.isActive,
      images: p.images || [],
      dimensions: p.dimensions || { length: '', width: '', height: '', unit: 'cm' },
    });
    setModal(true);
  };

  const handleUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));
      const { data } = await API.post('/upload/multiple', formData);
      const urls = data.images.map((i) => i.url);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded`);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp:   form.mrp ? Number(form.mrp) : undefined,
        stock: Number(form.stock),
        dimensions: {
          length: Number(form.dimensions.length),
          width:  Number(form.dimensions.width),
          height: Number(form.dimensions.height),
          unit:   form.dimensions.unit,
        },
      };
      if (editing) {
        await API.put(`/products/${editing}`, payload);
        toast.success('Product updated');
      } else {
        await API.post('/products', payload);
        toast.success('Product added');
      }
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const toggleFeatured = async (p) => {
    try {
      await API.put(`/products/${p._id}`, { ...p, category: p.category?._id || p.category, isFeatured: !p.isFeatured });
      toast.success(p.isFeatured ? 'Removed from Featured' : '⭐ Added to Featured');
      fetchAll();
    } catch { toast.error('Could not update'); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const f = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));
  const fd = (k) => (e) =>
    setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [k]: e.target.value } }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} products in your store</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <Search size={16} />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-muted" style={{fontSize:13}}>{filtered.length} results</span>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Package size={40} />
              <p>No products found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        className="product-thumb"
                        src={p.images?.[0] || 'https://placehold.co/40x40/222/666?text=📦'}
                        alt={p.name}
                      />
                    </td>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td><span className="badge badge-info">{p.category?.name || '—'}</span></td>
                    <td className="fw-bold">₹{p.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${p.stock > 5 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        title={p.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                        onClick={() => toggleFeatured(p)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 20, lineHeight: 1, padding: '2px 4px',
                          opacity: p.isFeatured ? 1 : 0.25,
                          filter: p.isFeatured ? 'none' : 'grayscale(1)',
                          transition: 'opacity 0.2s',
                        }}
                      >⭐</button>
                    </td>
                    <td>
                      <span className={`badge badge-${p.isActive ? 'success' : 'gray'}`}>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input required placeholder="e.g. Royal Sofa Set" value={form.name} onChange={f('name')} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input required type="number" min="0" placeholder="15000" value={form.price} onChange={f('price')} />
                  </div>
                  <div className="form-group">
                    <label>MRP / Original Price (₹)</label>
                    <input type="number" min="0" placeholder="20000" value={form.mrp} onChange={f('mrp')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input required type="number" min="0" placeholder="10" value={form.stock} onChange={f('stock')} />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select required value={form.category} onChange={f('category')}>
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <input placeholder="e.g. Sheesham Wood, Fabric" value={form.material} onChange={f('material')} />
                </div>
                <div className="form-group">
                  <label>Dimensions (L × W × H)</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 80px',gap:8}}>
                    <input type="number" placeholder="L" value={form.dimensions.length} onChange={fd('length')} />
                    <input type="number" placeholder="W" value={form.dimensions.width}  onChange={fd('width')} />
                    <input type="number" placeholder="H" value={form.dimensions.height} onChange={fd('height')} />
                    <select value={form.dimensions.unit} onChange={fd('unit')}>
                      <option value="cm">cm</option>
                      <option value="inch">inch</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Describe this product..." value={form.description} onChange={f('description')} />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label>Product Images</label>
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <input ref={fileRef} type="file" multiple accept="image/*"
                      onChange={(e) => handleUpload(e.target.files)} />
                    <Upload size={28} color="var(--text3)" />
                    <p>{uploading ? 'Uploading...' : 'Click to upload images (max 5MB each)'}</p>
                  </div>
                  {form.images.length > 0 && (
                    <div className="image-preview-grid">
                      {form.images.map((url, idx) => (
                        <div key={idx} className="image-preview">
                          <img src={url} alt="" />
                          <button type="button" className="remove-img" onClick={() => removeImage(idx)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{display:'flex',gap:24}}>
                  <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,cursor:'pointer'}}>
                    <input type="checkbox" checked={form.isFeatured}
                      onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
                    Mark as Featured
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,cursor:'pointer'}}>
                    <input type="checkbox" checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                    Active (visible on site)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? 'Saving...' : (editing ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
