'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '../../lib/api';
import CategoryProductGallery from '../../components/CategoryProductGallery';

function ProductsContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          API.get('/categories'),
          API.get('/products?limit=100'),
        ]);
        if (!active) return;

        const pageCount = productResponse.data.pagination?.pages || 1;
        const remainingPages = await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, index) =>
            API.get(`/products?page=${index + 2}&limit=100`)
          )
        );
        if (!active) return;

        setCategories(categoryResponse.data.categories || []);
        setProducts([
          ...(productResponse.data.products || []),
          ...remainingPages.flatMap((response) => response.data.products || []),
        ]);
      } catch {
        if (active) setError('Could not load product images. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => { active = false; };
  }, []);

  const filteredProducts = activeCategory
    ? products.filter((product) =>
        product.category?._id === activeCategory || product.category?.slug === activeCategory
      )
    : products;
  const filteredCategories = activeCategory
    ? categories.filter((category) =>
        category._id === activeCategory || category.slug === activeCategory
      )
    : categories;

  return (
    <div>
      <div className="page-band">
        <div className="container">
          <h1>Our Collection</h1>
          <p style={{ color: 'var(--text2)', marginTop: 6 }}>
            Browse furniture images by category
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="empty"><h3>{error}</h3></div>
        ) : (
          <CategoryProductGallery
            categories={filteredCategories}
            products={filteredProducts}
            activeCategory={activeCategory}
          />
        )}
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
