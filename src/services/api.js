const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  console.log(`${API_BASE_URL}${endpoint}`);
  console.log(options);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API call failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    if (typeof data.body === "string") {
      try {
        return JSON.parse(data.body);
      } catch (err) {
        console.error("Failed to parse response body:", err);
        return data;
      }
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Product API
export const productAPI = {
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products?${queryString}`);
  },

  async getProduct(id) {
    return apiCall(`/products/${id}`);
  },
};

// Cart API
export const cartAPI = {
  async getCart() {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return apiCall("/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async addToCart(item) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },

  async updateQuantity(productId, quantity) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },

  async removeFromCart(productId) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },
};

// Wishlist API (new)
export const wishlistAPI = {
  async getWishlist() {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return apiCall("/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async addToWishlist(item) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },

  async removeFromWishlist(productId) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized: No token");

    return fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });
  },
};

// Admin API
// --- Admin API (continued) ---
export const adminAPI = {
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products?${queryString}`);
  },

  async createProduct(productData) {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key === "images" && Array.isArray(productData[key])) {
        productData[key].forEach((file) => {
          if (file instanceof File) formData.append("images", file);
        });
      } else if (Array.isArray(productData[key])) {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/products/add`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errText}`);
    }

    return response.json();
  },

  // --- New: Update product ---
  async updateProduct(id, updateData) {
    return apiCall(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },

  // --- New: Delete product ---
  async deleteProduct(id) {
    return apiCall(`/products/${id}`, {
      method: "DELETE",
    });
  },
};
