// Mock data for development and testing
// This will be replaced with real API calls to your AWS backend

export const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Features 30-hour battery life, quick charging, and comfortable over-ear design.',
    price: 299.99,
    discountPrice: 249.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'AudioTech',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Silver'],
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    tags: ['wireless', 'noise-cancellation', 'premium'],
    isNew: true,
    isFeatured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    name: 'Stylish Sneakers',
    description: 'Comfortable and stylish sneakers perfect for everyday wear and light exercise.',
    price: 129.99,
    category: 'Footwear',
    subcategory: 'Sneakers',
    brand: 'StyleStep',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy', 'Red'],
    stock: 75,
    rating: 4.2,
    reviewCount: 89,
    tags: ['comfortable', 'casual', 'trendy'],
    isNew: false,
    isFeatured: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    id: '3',
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket made from premium quality denim fabric.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'Clothing',
    subcategory: 'Outerwear',
    brand: 'DenimCo',
    images: [
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
      'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Light Blue', 'Dark Blue'],
    stock: 30,
    rating: 4.7,
    reviewCount: 156,
    tags: ['classic', 'denim', 'versatile'],
    isNew: false,
    isFeatured: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    name: 'Luxury Watch',
    description: 'Elegant luxury watch with leather strap and precision movement.',
    price: 599.99,
    category: 'Accessories',
    subcategory: 'Watches',
    brand: 'TimeCore',
    images: [
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
      'https://images.pexels.com/photos/364673/pexels-photo-364673.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
    ],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    stock: 15,
    rating: 4.8,
    reviewCount: 67,
    tags: ['luxury', 'elegant', 'timepiece'],
    isNew: true,
    isFeatured: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];

export const mockUsers = [
  {
    id: '1',
    email: 'user@demo.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockOrders = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Premium Wireless Headphones',
        price: 249.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
        size: 'One Size',
        color: 'Black',
      }
    ],
    total: 249.99,
    status: 'delivered',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '1234',
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-25T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

export const mockCategories = [
  'Electronics',
  'Clothing',
  'Footwear',
  'Accessories',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Health',
  'Books & Media',
];

export const mockBrands = [
  'AudioTech',
  'StyleStep',
  'DenimCo',
  'TimeCore',
  'TechGear',
  'FashionForward',
  'SportsPro',
  'HomeComfort',
];

export const mockDashboardStats = {
  totalOrders: 1234,
  totalRevenue: 45678.90,
  totalProducts: 156,
  totalCustomers: 2890,
  recentOrders: 45,
  monthlyGrowth: 12.5,
  topProducts: [
    { id: '1', name: 'Premium Wireless Headphones', sales: 89 },
    { id: '2', name: 'Stylish Sneakers', sales: 67 },
    { id: '3', name: 'Classic Denim Jacket', sales: 54 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'order',
      message: 'New order #1234 received',
      timestamp: '2024-01-22T10:30:00Z',
    },
    {
      id: '2',
      type: 'product',
      message: 'Product "Wireless Headphones" updated',
      timestamp: '2024-01-22T10:25:00Z',
    },
    {
      id: '3',
      type: 'user',
      message: 'New customer registered',
      timestamp: '2024-01-22T10:20:00Z',
    },
  ],
};

// Helper functions for mock API responses
export const getMockProducts = (filters = {}) => {
  let filteredProducts = [...mockProducts];

  // Apply filters
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  if (filters.brand) {
    filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
  }
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(p => (p.discountPrice || p.price) >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(p => (p.discountPrice || p.price) <= filters.maxPrice);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }

  // Apply sorting
  if (filters.field && filters.direction) {
    filteredProducts.sort((a, b) => {
      let aValue = a[filters.field];
      let bValue = b[filters.field];

      if (filters.field === 'price') {
        aValue = a.discountPrice || a.price;
        bValue = b.discountPrice || b.price;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return filteredProducts;
};

export const getMockProduct = (id) => {
  return mockProducts.find(p => p.id === id);
};

export const getMockUser = (email, password) => {
  // Simple mock authentication
  if (email === 'user@demo.com' && password === 'password123') {
    return mockUsers[0];
  }
  if (email === 'admin@demo.com' && password === 'password123') {
    return mockUsers[1];
  }
  return null;
};

export const getMockOrders = (userId) => {
  return mockOrders.filter(order => order.userId === userId);
};

export const getMockOrder = (orderId) => {
  return mockOrders.find(order => order.id === orderId);
};