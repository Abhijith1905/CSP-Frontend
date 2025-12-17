import React, { createContext, useContext, useReducer } from 'react';
import { productAPI } from '../services/api';

const ProductContext = createContext();

const initialState = {
  products: [],
  categories: [],
  brands: [],
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

function productReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products,
        totalPages: action.payload.totalPages,
        isLoading: false,
        error: null,
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, currentPage: 1 };
    case 'SET_SORT':
      return { ...state, sort: action.payload, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {}, currentPage: 1 };
    default:
      return state;
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const loadProducts = async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await productAPI.getProducts({
        ...state.filters,
        sortBy: state.sort.field,
        sortOrder: state.sort.direction,
        page,
        limit: 12,
      });
      dispatch({ type: 'SET_PRODUCTS', payload: result });
      dispatch({ type: 'SET_PAGE', payload: page });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
    }
  };

  const loadProduct = async (id) => {
    try {
      return await productAPI.getProduct(id);
    } catch (error) {
      throw new Error('Failed to load product');
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSort = (sort) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  const searchProducts = async (query) => {
    dispatch({ type: 'SET_FILTERS', payload: { search: query } });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const value = {
    ...state,
    loadProducts,
    loadProduct,
    setFilters,
    setSort,
    searchProducts,
    clearFilters,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}