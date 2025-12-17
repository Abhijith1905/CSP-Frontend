import React, { useEffect, useState, useMemo } from 'react';
import { Grid2x2 as Grid, List, Package } from 'lucide-react';
import { useWishlist } from "../context/WishListContext";
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

/**
 * Products.jsx
 * - Client-side sorting for: name (A-Z, Z-A) and price (low->high, high->low)
 * - Robust numeric parsing for prices (removes $ / commas / text)
 * - Controlled select value even when `sort` from context is undefined or uses other fields
 *
 * Debug image path (uploaded file): /mnt/data/5676c887-e67e-43e0-9b23-1870146144bc.png
 * (kept as debugImageUrl for quick visual checks during development)
 */

export default function Products() {
  const {
    products = [],
    isLoading,
    sort,
    currentPage,
    totalPages,
    loadProducts,
    setSort,
  } = useProducts();

  // Debug image path (from your uploaded screenshot)
  const debugImageUrl = '/mnt/data/5676c887-e67e-43e0-9b23-1870146144bc.png';

  // view mode
  const [viewMode, setViewMode] = useState('grid');

  // local selectedSort state to keep the <select> controlled and resilient
  // initialize from context.sort if available, otherwise default to name-asc
  const initialSortField = sort?.field ?? 'name';
  const initialSortDir = sort?.direction ?? 'asc';
  const [selectedSort, setSelectedSort] = useState(`${initialSortField}-${initialSortDir}`);

  // load products on mount and whenever context sort changes (keeps server flow)
  useEffect(() => {
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // when user changes select: update local selectedSort AND call setSort so context can react
  const handleSelectChange = (value) => {
    setSelectedSort(value);
    const [field, direction] = value.split('-');
    // keep context aware: setSort so server-side sorting can work if implemented
    if (typeof setSort === 'function') {
      setSort({ field, direction });
    }
  };

  // Helper: robust numeric price extractor
  // Accepts numbers or strings like "$1,600.00" or "1600" or "INR 1,600"
  const parsePrice = (p) => {
    const raw = p ?? 0;
    // If it's already a number, return it
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    // Otherwise stringify and strip all non-numeric except minus and dot
    const cleaned = String(raw).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Helper: name getter with fallbacks
  const getName = (p) => (p?.name ?? p?.title ?? '').toString().trim();

  // Client-side displayedProducts that actually does the sorting in the UI
  // (doesn't mutate original products array)
  const displayedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Use sort from context as source of truth if available, otherwise use selectedSort
    const activeSort = sort && sort.field && sort.direction
      ? `${sort.field}-${sort.direction}`
      : selectedSort;

    const [field, direction] = activeSort.split('-');

    // Only apply client-side sorts for name or price.
    // For other fields, return products as-is (server-side may handle those).
    if (field === 'name' || field === 'price') {
      const copy = [...products];
      copy.sort((a, b) => {
        if (field === 'name') {
          // localeCompare with case-insensitive behavior
          const ra = getName(a);
          const rb = getName(b);
          const cmp = ra.localeCompare(rb, undefined, { sensitivity: 'base', numeric: false });
          return direction === 'asc' ? cmp : -cmp;
        } else {
          // price numeric comparison
          const pa = parsePrice(a?.price ?? a?.cost ?? a?.amount);
          const pb = parsePrice(b?.price ?? b?.cost ?? b?.amount);
          const diff = pa - pb;
          return direction === 'asc' ? diff : -diff;
        }
      });
      return copy;
    }

    // default: return original order (or your server-sorted order)
    return products;
  }, [products, sort, selectedSort]);

  // Ensure the select remains synchronized if context.sort changes externally
  useEffect(() => {
    if (sort && sort.field && sort.direction) {
      const combined = `${sort.field}-${sort.direction}`;
      if (combined !== selectedSort) {
        setSelectedSort(combined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Our Collection
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                {displayedProducts && displayedProducts.length > 0 ? `${displayedProducts.length} premium items` : 'No items available'}
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {/* View Toggle */}
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort - simplified */}
              <select
                value={selectedSort}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-white transition-all duration-200 hover:border-teal-300 cursor-pointer"
              >
                <option value="name-asc">A — Z</option>
                <option value="name-desc">Z — A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <div>
            {isLoading ? (
              <Loader text="Loading products..." />
            ) : displayedProducts && displayedProducts.length > 0 ? (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in'
                  : 'space-y-6 animate-fade-in'
                }>
                  {displayedProducts.map((product, index) => (
                    <div
                      key={product.id ?? product.productId ?? index}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard
                        product={product}
                        viewMode={viewMode}
                        onAddToWishlist={() => toggleWishlist(product.productId || product.id)}
                        isInWishlist={() => isInWishlist(product.productId || product.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={loadProducts}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg animate-fade-in">
                <div className="text-gray-300 mb-6 animate-bounce">
                  <Package className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 text-lg">Browse our full collection</p>

                {/* Debug image preview (optional) */}
                {/* <img src={debugImageUrl} alt="debug screenshot" className="mx-auto mt-4 w-1/2 rounded-lg shadow" /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
