import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // If user is not signed in — show only a sign-in prompt (no cart listing)
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your cart</h2>
          <p className="text-gray-600 mb-8">
            You must be signed in to access your saved cart and proceed to checkout.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login?redirect=/cart"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ensure numeric values are safe (avoid NaN)
  const safeTotal = Number(total) || 0;
  const shippingValue = safeTotal > 50 ? 0 : 9.99;
  const taxValue = safeTotal * 0.08;
  const grandTotal = safeTotal + shippingValue + taxValue;

  const safeMoney = (n) => {
    const v = Number(n) || 0;
    // toFixed is safe because v is a number
    return `$${v.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border divide-y">
            {items.map((item) => {
              // item may look like { cartItemId, productId, quantity, product: { price, image, name, ... } }
              const product = item.product || {};
              const price = Number(product.price ?? 0);
              // Prefer item.quantity (cart quantity); fallback to product.quantity or 1
              const quantity = Number(item.quantity ?? product.quantity ?? 1);

              return (
                <div key={item.cartItemId ?? item.productId} className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image || ""}
                        alt={product.name || "Product"}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {product.name || "Product Name"}
                      </Link>

                      {product.color && (
                        <p className="mt-1 text-sm text-gray-500">
                          Color: {Array.isArray(product.color)
                            ? product.color.join(', ')
                            : String(product.color).replace(/[\[\]"]/g, '')}
                        </p>
                      )}

                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        {safeMoney(price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, quantity - 1))}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, quantity + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {safeMoney(price * quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{safeMoney(safeTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingValue === 0 ? 'Free' : safeMoney(shippingValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{safeMoney(taxValue)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">{safeMoney(grandTotal)}</span>
                </div>
              </div>
            </div>

            {safeTotal > 0 && safeTotal < 50 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-700">
                  Add {safeMoney(50 - safeTotal)} more for free shipping!
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center block transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium text-center block transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
