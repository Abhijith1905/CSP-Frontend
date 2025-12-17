import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download } from 'lucide-react';

import Loader from '../components/Loader';

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is a new order from checkout
  const isNewOrder = location.state?.isNewOrder;
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (isNewOrder && orderData) {
      setOrder(orderData);
      setIsLoading(false);
    } else if (id) {
      loadOrder(id);
    }
  }, [id, isNewOrder, orderData]);

  const loadOrder = async (orderId) => {
    setIsLoading(true);
    try {
      const orderData = await orderAPI.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusSteps = () => {
    if (!order) return [];

    const steps = [
      { 
        id: 'pending', 
        name: 'Order Placed', 
        icon: Package,
        completed: ['pending', 'processing', 'shipped', 'delivered'].includes(order.status),
        current: order.status === 'pending'
      },
      { 
        id: 'processing', 
        name: 'Processing', 
        icon: Clock,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        current: order.status === 'processing'
      },
      { 
        id: 'shipped', 
        name: 'Shipped', 
        icon: Truck,
        completed: ['shipped', 'delivered'].includes(order.status),
        current: order.status === 'shipped'
      },
      { 
        id: 'delivered', 
        name: 'Delivered', 
        icon: CheckCircle,
        completed: order.status === 'delivered',
        current: order.status === 'delivered'
      },
    ];

    return steps;
  };

  if (isLoading) {
    return <Loader text="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link
            to="/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <span className="capitalize">{order.status}</span>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Success Message for New Orders */}
      {isNewOrder && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-green-900">Order Placed Successfully!</h2>
              <p className="text-green-700">
                Thank you for your order. We'll send you updates about your order status via email.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
            
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 text-green-600' :
                      step.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </h3>
                        {step.completed && (
                          <span className="text-xs text-gray-500">
                            {step.id === 'pending' && new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {index < statusSteps.length - 1 && (
                      <div className={`absolute left-5 mt-10 w-px h-6 ${
                        step.completed ? 'bg-green-200' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Tracking Information</h4>
                <p className="text-sm text-blue-700">
                  Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                </p>
                {order.estimatedDelivery && (
                  <p className="text-sm text-blue-700 mt-1">
                    Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>
            
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 text-sm text-gray-500 space-x-4">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h3>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Method
            </h3>
            
            <div className="text-sm text-gray-600">
              <p>Credit Card ending in •••• 1234</p>
              <p className="text-xs text-gray-500 mt-1">
                Charged on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                Contact Support
              </button>
              
              {order.status === 'delivered' && (
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                  Return Items
                </button>
              )}
              
              {(order.status === 'pending' || order.status === 'processing') && (
                <button className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}