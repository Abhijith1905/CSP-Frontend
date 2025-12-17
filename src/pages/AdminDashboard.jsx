import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { adminAPI } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px'
  },
  mainWrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '30px',
    alignItems: 'start'
  },
  sidebar: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: '20px'
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '25px',
    letterSpacing: '-0.5px'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  navItem: {
    marginBottom: '10px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  navLinkInactive: {
    color: '#4a5568',
    background: 'transparent'
  },
  navLinkInactiveHover: {
    background: '#f7fafc',
    color: '#2d3748'
  },
  navIcon: {
    marginRight: '12px',
    width: '20px',
    height: '20px'
  },
  content: {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    minHeight: '600px'
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#1a202c',
    marginBottom: '30px',
    letterSpacing: '-1px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  statCard: {
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    padding: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  statCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
    borderColor: '#cbd5e0'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#1a202c',
    marginBottom: '5px'
  },
  statSubtext: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#48bb78'
  },
  statIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '15px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  primaryButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
  },
  searchBar: {
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '25px'
  },
  searchWrapper: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  searchInputWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '250px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 45px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  searchInputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#a0aec0',
    width: '18px',
    height: '18px'
  },
  filterButtons: {
    display: 'flex',
    gap: '10px'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    transition: 'all 0.3s ease'
  },
  filterButtonHover: {
    background: '#f7fafc',
    borderColor: '#cbd5e0'
  },
  tableContainer: {
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHead: {
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
  },
  tableHeaderCell: {
    padding: '18px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '800',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e2e8f0'
  },
  tableRow: {
    transition: 'all 0.2s ease'
  },
  tableRowHover: {
    background: '#f7fafc'
  },
  tableCell: {
    padding: '18px 20px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#2d3748'
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  productImage: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '2px solid #e2e8f0'
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  productName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '3px'
  },
  productBrand: {
    fontSize: '12px',
    color: '#718096'
  },
  priceWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  price: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a202c'
  },
  oldPrice: {
    fontSize: '12px',
    color: '#a0aec0',
    textDecoration: 'line-through'
  },
  badge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },
  badgeSuccess: {
    background: '#c6f6d5',
    color: '#22543d'
  },
  badgeDanger: {
    background: '#fed7d7',
    color: '#742a2a'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  actionButton: {
    padding: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtonView: {
    color: '#3182ce'
  },
  actionButtonEdit: {
    color: '#805ad5'
  },
  actionButtonDelete: {
    color: '#e53e3e'
  },
  actionButtonHover: {
    background: '#f7fafc'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    padding: '25px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroupFull: {
    gridColumn: '1 / -1'
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  formInput: {
    padding: '12px 15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },
  formInputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  formTextarea: {
    resize: 'vertical',
    minHeight: '100px'
  },
  imagePreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginTop: '15px'
  },
  imagePreviewItem: {
    position: 'relative',
    paddingTop: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid #e2e8f0'
  },
  imagePreviewImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  removeImageButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: '#e53e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
    paddingTop: '25px',
    borderTop: '2px solid #e2e8f0',
    gridColumn: '1 / -1'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  submitButtonDisabled: {
    background: '#cbd5e0',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  cancelButton: {
    background: '#e2e8f0',
    color: '#2d3748',
    padding: '14px 32px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cancelButtonHover: {
    background: '#cbd5e0'
  },
  loaderWrapper: {
    padding: '60px',
    textAlign: 'center'
  },
  paginationWrapper: {
    padding: '20px',
    borderTop: '2px solid #e2e8f0'
  },
  '@media (max-width: 1024px)': {
    layoutGrid: {
      gridTemplateColumns: '1fr'
    },
    sidebar: {
      position: 'static'
    }
  },
  '@media (max-width: 768px)': {
    formGrid: {
      gridTemplateColumns: '1fr'
    },
    imagePreviewGrid: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    statsGrid: {
      gridTemplateColumns: '1fr'
    }
  }
};

function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await adminAPI.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={styles.loaderWrapper}><Loader text="Loading dashboard..." /></div>;

  const statCards = [
    {
      id: 'orders',
      label: 'Order Volume',
      value: stats?.totalOrders || 0,
      subtext: `+${stats?.recentOrders || 0} this week`,
      icon: ShoppingCart,
      color: '#667eea'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      subtext: `+${stats?.monthlyGrowth || 0}% growth`,
      icon: TrendingUp,
      color: '#48bb78'
    },
    {
      id: 'products',
      label: 'Inventory',
      value: stats?.totalProducts || 0,
      subtext: 'Active listings',
      icon: Package,
      color: '#ed8936'
    },
    {
      id: 'users',
      label: 'Users',
      value: stats?.totalCustomers || 0,
      subtext: 'Registered accounts',
      icon: Users,
      color: '#3182ce'
    }
  ];

  
}

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await adminAPI.getProducts({
        page: currentPage,
        search: searchQuery,
        limit: 10
      });

      const normalized = (result.products || []).map((p) => ({
        ...p,
        id: p.id ?? p._id ?? p.productId ?? p.uuid
      }));

      setProducts(normalized);
      setTotalPages(result.totalPages ?? 1);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      console.warn('No product id provided to delete.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. See console for details.');
      }
    }
  };

  const handleEditProduct = (product) => {
    const pid = product.id ?? product._id ?? product.productId ?? product.uuid;
    setSelectedProduct({ ...product, id: pid });
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Inventory Control</h1>
        <button
          style={{
            ...styles.primaryButton,
            ...(hoveredButton === 'add' ? styles.primaryButtonHover : {})
          }}
          onMouseEnter={() => setHoveredButton('add')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus style={{ width: '20px', height: '20px' }} />
          New Item
        </button>
      </div>

      

      <div style={styles.tableContainer}>
        {isLoading ? (
          <div style={styles.loaderWrapper}>
            <Loader text="Loading products..." />
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeaderCell}>Product</th>
                  <th style={styles.tableHeaderCell}>Category</th>
                  <th style={styles.tableHeaderCell}>Price</th>
                  <th style={styles.tableHeaderCell}>Stock</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const pid = product.id ?? product._id ?? product.productId ?? product.uuid;
                  const isHovered = hoveredRow === pid;
                  return (
                    <tr
                      key={pid ?? product.name}
                      style={{
                        ...styles.tableRow,
                        ...(isHovered ? styles.tableRowHover : {})
                      }}
                      onMouseEnter={() => setHoveredRow(pid)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.tableCell}>
                        <div style={styles.productCell}>
                          <img
                            src={product.imageUrls?.[0] ?? product.existingImages?.[0] ?? ''}
                            alt={product.name}
                            style={styles.productImage}
                          />
                          <div style={styles.productInfo}>
                            <div style={styles.productName}>{product.name}</div>
                            <div style={styles.productBrand}>{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>{product.category}</td>
                      <td style={styles.tableCell}>
                        <div style={styles.priceWrapper}>
                          <span style={styles.price}>${product.discountPrice ?? product.price}</span>
                          {product.discountPrice && (
                            <span style={styles.oldPrice}>${product.price}</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.tableCell}>{product.stock}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.badge,
                            ...(product.stock > 0 ? styles.badgeSuccess : styles.badgeDanger)
                          }}
                        >
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <Link to={`/product/${pid}`}>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.actionButtonView,
                                ...(hoveredButton === `view-${pid}` ? styles.actionButtonHover : {})
                              }}
                              onMouseEnter={() => setHoveredButton(`view-${pid}`)}
                              onMouseLeave={() => setHoveredButton(null)}
                              title="View Product"
                            >
                              <Eye style={{ width: '18px', height: '18px' }} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              ...styles.actionButton,
                              ...styles.actionButtonEdit,
                              ...(hoveredButton === `edit-${pid}` ? styles.actionButtonHover : {})
                            }}
                            onMouseEnter={() => setHoveredButton(`edit-${pid}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                            title="Edit Product"
                          >
                            <Edit style={{ width: '18px', height: '18px' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(pid)}
                            style={{
                              ...styles.actionButton,
                              ...styles.actionButtonDelete,
                              ...(hoveredButton === `delete-${pid}` ? styles.actionButtonHover : {})
                            }}
                            onMouseEnter={() => setHoveredButton(`delete-${pid}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                            title="Delete Product"
                          >
                            <Trash2 style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={styles.paginationWrapper}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product" maxWidth="2xl">
        <ProductForm
          onSubmit={() => {
            setIsAddModalOpen(false);
            loadProducts();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product" maxWidth="2xl">
        <ProductForm
          product={selectedProduct}
          onSubmit={() => {
            setIsEditModalOpen(false);
            loadProducts();
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    discountPrice: product?.discountPrice ?? '',
    category: product?.category || '',
    brand: product?.brand || '',
    stock: product?.stock ?? '',
    images: [],
    existingImages: product?.images ?? product?.imageUrls ?? [],
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    tags: product?.tags?.join(', ') || ''
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(formData.existingImages || []);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const objectUrlRefs = useRef([]);

  useEffect(() => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ?? '',
      discountPrice: product?.discountPrice ?? '',
      category: product?.category || '',
      brand: product?.brand || '',
      stock: product?.stock ?? '',
      images: [],
      existingImages: product?.images ?? product?.imageUrls ?? [],
      sizes: product?.sizes?.join(', ') || '',
      colors: product?.colors?.join(', ') || '',
      tags: product?.tags?.join(', ') || ''
    });
    setImagePreview(product?.images ?? product?.imageUrls ?? []);
    objectUrlRefs.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlRefs.current = [];
  }, [product]);

  useEffect(() => {
    return () => {
      objectUrlRefs.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlRefs.current = [];
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previewUrls = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlRefs.current.push(url);
      return url;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    setImagePreview((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const existingCount = prev.existingImages.length;
      if (index < existingCount) {
        const newExistingImages = prev.existingImages.filter((_, i) => i !== index);
        return { ...prev, existingImages: newExistingImages };
      } else {
        const newImageIndex = index - existingCount;
        const newImages = prev.images.filter((_, i) => i !== newImageIndex);
        return { ...prev, images: newImages };
      }
    });

    setImagePreview((prev) => {
      const removed = prev[index];
      if (objectUrlRefs.current.includes(removed)) {
        URL.revokeObjectURL(removed);
        objectUrlRefs.current = objectUrlRefs.current.filter((u) => u !== removed);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock, 10) || 0,
        images: [...formData.existingImages, ...formData.images],
        sizes: (formData.sizes || '').split(',').map((s) => s.trim()).filter(Boolean),
        colors: (formData.colors || '').split(',').map((c) => c.trim()).filter(Boolean),
        tags: (formData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        category: formData.category,
        brand: formData.brand
      };

      if (product && product.id) {
        await adminAPI.updateProduct(product.id, productData);
      } else {
        await adminAPI.createProduct(productData);
      }

      onSubmit();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formGrid}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            ...styles.formInput,
            ...(focusedField === 'name' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Brand *</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          style={{
            ...styles.formInput,
            ...(focusedField === 'brand' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('brand')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
        <label style={styles.formLabel}>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            ...styles.formInput,
            ...styles.formTextarea,
            ...(focusedField === 'description' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('description')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{
            ...styles.formInput,
            ...(focusedField === 'category' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('category')}
          onBlur={() => setFocusedField(null)}
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Beauty & Health">Beauty & Health</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Stock *</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          style={{
            ...styles.formInput,
            ...(focusedField === 'stock' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('stock')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Price *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          style={{
            ...styles.formInput,
            ...(focusedField === 'price' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('price')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Discount Price</label>
        <input
          type="number"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          style={{
            ...styles.formInput,
            ...(focusedField === 'discountPrice' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('discountPrice')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
        <label style={styles.formLabel}>Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={styles.formInput}
        />

        {imagePreview.length > 0 && (
          <div style={styles.imagePreviewGrid}>
            {imagePreview.map((url, index) => (
              <div key={url + index} style={styles.imagePreviewItem}>
                <img src={url} alt={`Preview ${index + 1}`} style={styles.imagePreviewImg} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Sizes (comma separated)</label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          placeholder="S, M, L, XL"
          style={{
            ...styles.formInput,
            ...(focusedField === 'sizes' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('sizes')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Colors (comma separated)</label>
        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          placeholder="Red, Blue, Green"
          style={{
            ...styles.formInput,
            ...(focusedField === 'colors' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('colors')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
        <label style={styles.formLabel}>Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="wireless, premium, bestseller"
          style={{
            ...styles.formInput,
            ...(focusedField === 'tags' ? styles.formInputFocus : {})
          }}
          onFocus={() => setFocusedField('tags')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.formActions}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            ...(isLoading ? styles.submitButtonDisabled : {}),
            ...(hoveredButton === 'submit' && !isLoading ? styles.primaryButtonHover : {})
          }}
          onMouseEnter={() => setHoveredButton('submit')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            ...styles.cancelButton,
            ...(hoveredButton === 'cancel' ? styles.cancelButtonHover : {})
          }}
          onMouseEnter={() => setHoveredButton('cancel')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [hoveredNav, setHoveredNav] = useState(null);

  const navigation = [
   
    { name: 'Products', href: '/admin/products', icon: Package, current: currentPath === 'products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: currentPath === 'orders' },
   
  ];

  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        <div style={styles.layoutGrid}>
          <aside style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Control Center</h2>
            <nav>
              <ul style={styles.navList}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isHovered = hoveredNav === item.name;
                  return (
                    <li key={item.name} style={styles.navItem}>
                      <Link
                        to={item.href}
                        style={{
                          ...styles.navLink,
                          ...(item.current ? styles.navLinkActive : styles.navLinkInactive),
                          ...(isHovered && !item.current ? styles.navLinkInactiveHover : {})
                        }}
                        onMouseEnter={() => setHoveredNav(item.name)}
                        onMouseLeave={() => setHoveredNav(null)}
                      >
                        <Icon style={styles.navIcon} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main style={styles.content}>
            <Routes>
              <Route path="/" element={<DashboardStats />} />
              <Route path="/products" element={<ProductManagement />} />
               <Route path="/orders" element={<Navigate to="/orders" />} />
              <Route path="/customers" element={<div>Customer Management (Coming Soon)</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
