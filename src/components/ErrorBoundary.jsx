import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Auto refresh after small delay
    setTimeout(() => {
      window.location.reload();
    }, 100); 
  }

  render() {
    if (this.state.hasError) {
      // Return null (nothing) while refreshing
      return null;
    }
    return this.props.children;
  }
}
