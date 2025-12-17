import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({
  product,
  onAddToWishlist,
  isInWishlist = false,
  viewMode = 'grid'
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [liked, setLiked] = useState(isInWishlist);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && product?.productId && user?.role !== 'admin') {
      (async () => {
        try {
          const wishlistItems = await wishlistAPI.getWishlist();
          const alreadyLiked = wishlistItems.some(
            (item) => item.productId === product.productId
          );
          setLiked(alreadyLiked);
        } catch (err) {
          console.error('Failed to check wishlist:', err);
        }
      })();
    }
  }, [isAuthenticated, product?.productId, user?.role]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to use wishlist');
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (liked) {
        await wishlistAPI.removeFromWishlist(product.productId);
        setLiked(false);
        if (onAddToWishlist) onAddToWishlist(product.productId, false);
      } else {
        await wishlistAPI.addToWishlist({
          productId: product.productId,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.imageUrls?.[0],
        });
        setLiked(true);
        if (onAddToWishlist) onAddToWishlist(product.productId, true);
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
      alert('Failed to update wishlist');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.productId,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.imageUrls?.[0],
        quantity: 1,
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isAdmin = user?.role === 'admin';

  return (
    <div
      className={`border rounded-2xl shadow-sm bg-white overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer ${
        viewMode === 'grid' ? 'w-full' : 'flex'
      }`}
    >
      {/* Image Section */}
      <div
        onClick={() => navigate(`/product/${product.productId}`)}
        className={`relative ${
          viewMode === 'grid'
            ? 'w-full h-64'
            : 'w-1/3 h-48 flex-shrink-0 border-r'
        }`}
      >
        <img
          src={product.imageUrls?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {!isAdmin && isAuthenticated && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            disabled={isProcessing}
            className={`absolute top-3 right-3 p-2 rounded-full border transition-colors ${
              liked
                ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          </button>
        )}

        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Content Section */}
      <div
        className={`p-4 ${
          viewMode === 'grid' ? '' : 'flex-1 flex flex-col justify-between'
        }`}
      >
        <div onClick={() => navigate(`/product/${product.productId}`)}>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">{product.brand}</p>

          {/* ⭐ REVIEW & STAR SECTION REMOVED */}

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.discountPrice || product.price}
            </span>

            {product.discountPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
            )}
          </div>
        </div>

        {!isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
