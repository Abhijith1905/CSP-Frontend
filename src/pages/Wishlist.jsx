import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const items = await wishlistAPI.getWishlist();
      console.log("WISHLIST ITEMS:", items);
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
    setIsLoading(false);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlistItems(items => items.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart({
        productId: item.productId,
        name: item.product?.name,
        price: item.product?.discountPrice || item.product?.price,
        image: item.product?.image,
        quantity: 1,
        size: 'One Size',
        color: 'Default',
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleMoveAllToCart = async () => {
    for (const item of wishlistItems) {
      try {
        await addToCart({
          productId: item.productId,
          name: item.product?.name,
          price: item.product?.discountPrice || item.product?.price,
          image: item.product?.image,
          quantity: 1,
          size: 'One Size',
          color: 'Default',
        });
      } catch (error) {
        console.error(`Failed to add ${item.product?.name} to cart:`, error);
      }
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
      for (const item of wishlistItems) {
        try {
          await wishlistAPI.removeFromWishlist(item.productId);
        } catch (error) {
          console.error(`Failed to remove ${item.product?.name} from wishlist:`, error);
        }
      }
      setWishlistItems([]);
    }
  };

  if (isLoading) {
    return <Loader text="Loading your wishlist..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleMoveAllToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add All to Cart
            </button>
            <button
              onClick={handleClearWishlist}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const mockProduct = {
              productId: item.productId,
              name: item.product?.name,
              description: '',
              price: item.product?.price,
              discountPrice: item.product?.discountPrice,
              category: '',
              brand: item.product?.brand,
              imageUrls: [item.product?.image],   // FIXED
              sizes: ['One Size'],
              colors: ['Default'],
              stock: 10,
              rating: item.product?.rating || 0,
              reviewCount: item.product?.reviewCount || 0,
              tags: [],
              createdAt: item.addedAt,
              updatedAt: item.addedAt,
            };

            return (
              <div key={item.wishlistItemId} className="relative group">
                <ProductCard 
                  product={mockProduct}
                  onAddToWishlist={() => handleRemoveFromWishlist(item.productId)}
                  isInWishlist={true}
                />
                
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Wishlist
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Discover more products based on your wishlist</p>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Browse All Products →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
