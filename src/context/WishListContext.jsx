import React, { createContext, useContext, useState } from "react";

const WishListContext = createContext();

export const WishListProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishListContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishListContext.Provider>
  );
};

export const useWishlist = () => useContext(WishListContext);
