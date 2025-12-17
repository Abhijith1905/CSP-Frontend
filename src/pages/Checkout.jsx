import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Checkout.jsx (stores userId + userName + userEmail on every order)
 */

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const [errors, setErrors] = useState({});

  // Safely calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    const quantity = parseFloat(item.product?.quantity || 0);
    return sum + price * quantity;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add items to your cart to proceed.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const validatePayment = () => {
    const newErrors = {};
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length !== 16)
      newErrors.cardNumber = 'Enter valid card number';
    if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry))
      newErrors.expiry = 'Enter valid expiry MM/YY';
    if (!payment.cvv || payment.cvv.length !== 3) newErrors.cvv = 'Enter valid CVV';
    if (!payment.name) newErrors.name = 'Name on card required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // helper: decode JWT payload (used to extract sub / name / email if present)
  const decodeJwtPayload = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(b64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  // Try to derive user id / name / email from multiple places (context user, idToken)
  const getCurrentUserInfo = () => {
    // Try from context user object first (common Cognito shape)
    try {
      // If your AuthProvider stores Cognito user object with attributes
      const ctxAttrs = user?.attributes;
      const ctxSub = user?.signInUserSession?.idToken?.payload?.sub;
      const ctxName =
        (ctxAttrs && (ctxAttrs.given_name || ctxAttrs.name || `${ctxAttrs.given_name || ''} ${ctxAttrs.family_name || ''}`.trim())) ||
        user?.username ||
        ctxAttrs?.email ||
        null;
      const ctxEmail = ctxAttrs?.email || user?.email || null;

      if (ctxSub || ctxName || ctxEmail) {
        return {
          id: ctxSub || user?.username || null,
          name: ctxName || '',
          email: ctxEmail || '',
        };
      }
    } catch (e) {
      // ignore
    }

    // Fallback: try idToken in localStorage
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      const payload = decodeJwtPayload(idToken) || {};
      const sub = payload.sub || null;
      const name = payload.name || payload['cognito:username'] || payload.email || '';
      const email = payload.email || '';
      return { id: sub || null, name, email };
    }

    // Final fallback: username field on user object
    if (user?.username) {
      return { id: user.username, name: user.username, email: '' };
    }

    return { id: null, name: '', email: '' };
  };

  // Save order locally with attached userId, userName, userEmail
  const saveOrderLocally = (order) => {
    const userInfo = getCurrentUserInfo();
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    const withUser = {
      ...order,
      id: order.id || `order_${Date.now()}`,
      userId: userInfo.id,
      userName: userInfo.name,
      userEmail: userInfo.email,
      date: order.date || new Date().toISOString(),
    };
    existing.push(withUser);
    localStorage.setItem('orders', JSON.stringify(existing));
    return withUser;
  };

  // Place Order Function
  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    const userInfo = getCurrentUserInfo();

    const orderData = {
      items: items.map(item => ({
        productId: item.productId,
        name: item.product?.name,
        quantity: item.product?.quantity,
        price: item.product?.price,
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      payment: {
        cardNumber: payment.cardNumber,
        expiry: payment.expiry,
        name: payment.name,
      },
      // Attach user info to the payload so backend (if used) and local storage both get it
      userId: userInfo.id,
      userName: userInfo.name,
      userEmail: userInfo.email,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        'https://kwpiy5wux6.execute-api.us-east-1.amazonaws.com/dev1/order/add',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) throw new Error('Failed to place order');

      const data = await response.json();
      console.log('Order response:', data);

      // Store successful order locally, with user info
      const successOrder = {
        ...orderData,
        id: data.orderId || `order_${Date.now()}`,
        status: 'success',
      };
      saveOrderLocally(successOrder);

      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order API failed, saving locally:', error);

      // Fallback: store order locally with pending status and user info
      try {
        const failedOrder = {
          ...orderData,
          id: `order_local_${Date.now()}`,
          status: 'pending',
        };
        saveOrderLocally(failedOrder);

        alert('Order saved locally');
        clearCart();
        navigate('/order-success');
      } catch (localErr) {
        console.error('Error saving local order:', localErr);
        alert('Failed to save order locally.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex space-x-6 mb-8">
        <div className={currentStep === 1 ? 'font-bold text-blue-600' : 'text-gray-400'}>
          Order Summary
        </div>
        <div className={currentStep === 2 ? 'font-bold text-blue-600' : 'text-gray-400'}>
          Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Order Summary */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>Order Item</div>
                  <div>{item.product?.name} x {item.product?.quantity}</div>
                </div>
              ))}
              <hr />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={payment.cardNumber}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    val = val.match(/.{1,4}/g)?.join(' ') || '';
                    setPayment({ ...payment, cardNumber: val });
                    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full border px-3 py-2 rounded text-lg ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    name="expiry"
                    value={payment.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      setPayment({ ...payment, expiry: val });
                      if (errors.expiry) setErrors({ ...errors, expiry: '' });
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full border px-3 py-2 rounded text-lg ${
                      errors.expiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.expiry && (
                    <p className="text-red-600 text-sm mt-1">{errors.expiry}</p>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={payment.cvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setPayment({ ...payment, cvv: val });
                      if (errors.cvv) setErrors({ ...errors, cvv: '' });
                    }}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full border px-3 py-2 rounded text-lg ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name on Card</label>
                <input
                  type="text"
                  name="name"
                  value={payment.name}
                  onChange={(e) => {
                    setPayment({ ...payment, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full border px-3 py-2 rounded text-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
