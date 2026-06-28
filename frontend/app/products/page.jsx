'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '../../lib/api';
import ProductCard from '../../components/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('newest');

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 50, sort });
    if (activeCategory) params.append('category', activeCategory);
    if (search)         params.append('search', search);
    API.get(`/products?${params}`)
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [activeCategory, sort, search]);

  return (
    <div>
      <div className="page-band">
        <div className="container">
          <h1>Our Collection</h1>
          <p style={{color:'var(--text2)',marginTop:6}}>{products.length} products available</p>
        </div>
      </div>

      <div className="container products-top-container" style={{paddingTop:40, paddingBottom:80}}>
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filter-sidebar">
            <h3>Filter</h3>
            <div className="filter-group">
              <h3>Category</h3>
              <div
                className={`filter-item ${activeCategory === '' ? 'active' : ''}`}
                onClick={() => setActiveCategory('')}
              >All</div>
              {categories.map((c) => (
                <div
                  key={c._id}
                  className={`filter-item ${activeCategory === c._id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c._id)}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Search + Sort bar */}
            <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:24,alignItems:'center'}}>
              <input
                style={{flex:1,padding:'10px 16px',border:'1px solid var(--border)',borderRadius:10,fontSize:14}}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                style={{padding:'10px 16px',border:'1px solid var(--border)',borderRadius:10,fontSize:14,background:'var(--bg)',color:'var(--text)'}}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty"><h3>No products found</h3><p>Try a different category or search term</p></div>
            ) : (
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="loading-wrap"><div className="spinner" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
