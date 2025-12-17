import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART': {
      const items = action.payload.map(item => ({
        ...item,
        quantity: Number(item.product?.quantity || 1),
        price: Number(item.product?.price || 0),
      }));
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
      return { ...state, items, total, itemCount };
    }

    case 'ADD_ITEM': {
      const newItem = {
        ...action.payload,
        quantity: Number(action.payload.quantity || 1),
        price: Number(action.payload.product?.price || 0),
      };
      const items = [...state.items, newItem];
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
      return { ...state, items, total, itemCount };
    }

    case 'UPDATE_ITEM': {
      const items = state.items
        .map(i =>
          i.productId === action.payload.id
            ? { ...i, product: { ...i.product, quantity: Number(action.payload.quantity) } }
            : i
        )
        .filter(i => Number(i.product?.quantity) > 0);

      const total = items.reduce((sum, i) => sum + i.product.price * i.product.quantity, 0);
      const itemCount = items.reduce((sum, i) => sum + i.product.quantity, 0);
      return { ...state, items, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.productId !== action.payload);
      const total = items.reduce((sum, i) => sum + i.product.price * i.product.quantity, 0);
      const itemCount = items.reduce((sum, i) => sum + i.product.quantity, 0);
      return { ...state, items, total, itemCount };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
}

// Cart Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart();
    } else {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Sync cart from backend
  const syncCart = async () => {
    try {
      const cartItems = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: cartItems });
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  // Add to cart
  const addToCart = async (item) => {
    const guestItem = { ...item, cartItemId: Date.now().toString() };
    dispatch({ type: 'ADD_ITEM', payload: guestItem }); // instant frontend update

    try {
      if (isAuthenticated) {
        await cartAPI.addToCart(item);
        syncCart(); // optionally refresh from backend
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  // Remove item instantly (optimistic)
  const removeFromCart = async (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId }); // instant frontend update

    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(productId);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      syncCart(); // revert in case of failure
    }
  };

  // Update quantity (+1 / -1)
  const updateQuantity = async (productId, newQuantity) => {
    // instant frontend update
    dispatch({ type: 'UPDATE_ITEM', payload: { id: productId, quantity: newQuantity } });

    try {
      if (isAuthenticated) {
        await cartAPI.updateQuantity(productId, newQuantity);
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
      syncCart(); // revert in case of failure
    }
  };

  // Clear cart
  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' }); // instant frontend clear

    try {
      if (isAuthenticated) await cartAPI.clearCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      syncCart();
    }
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
