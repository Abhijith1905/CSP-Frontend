import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI, wishlistAPI } from '../services/api'; 
import Loader from '../components/Loader';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlistItem, setIsWishlistItem] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin'; // Check for Admin

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId) => {
    setIsLoading(true);
    try {
      const productData = await productAPI.getProduct(productId);
      const formattedProduct = {
        id: productData.productId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discountPrice: productData.discountPrice,
        stock: productData.stock,
        brand: productData.brand,
        category: productData.category,
        colors: productData.colors || [],
        tags: productData.tags || [],
        imageUrls: productData.imageUrls || [],
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
      };

      setProduct(formattedProduct);
      setSelectedColor(formattedProduct.colors[0] || '');

      // Check wishlist only if not Admin
      if (isAuthenticated && !isAdmin) {
        try {
          const wishlistItems = await wishlistAPI.getWishlist();
          const alreadyLiked = wishlistItems.some(
            (item) => item.productId === productData.productId
          );
          setIsWishlistItem(alreadyLiked);
        } catch (err) {
          console.error("Failed to check wishlist:", err);
        }
      }

    } catch (error) {
      console.error('Failed to load product:', error);
      navigate('/products');
    }
    setIsLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product || isAdmin) return; // Prevent Admin
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.imageUrls[0],
        quantity,
        color: selectedColor,
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!product || isAdmin) return; // Prevent Admin
    try {
      if (isWishlistItem) {
        await wishlistAPI.removeFromWishlist(product.id);
        setIsWishlistItem(false);
        alert('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.imageUrls[0],
          color: selectedColor,
        });
        setIsWishlistItem(true);
        alert('Added to wishlist!');
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
      alert('Failed to update wishlist');
    }
  };

  if (isLoading) return <Loader text="Loading product details..." />;
  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-blue-600">Products</button>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={product.imageUrls[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">${product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">${product.price}</span>
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">-{discountPercentage}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Quantity */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quantity</h4>
              {isAdmin ? (
                <p className="text-gray-700">{product.stock} available</p> // Admin sees only stock
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-4">{product.stock} available</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isAdmin && (
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-3 rounded-lg font-medium border transition-colors flex items-center justify-center ${
                    isWishlistItem
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlistItem ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
