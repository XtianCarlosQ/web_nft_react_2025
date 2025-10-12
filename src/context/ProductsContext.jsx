import React, { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await fetch("/content/products.json");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
      setLoading(false);
    } catch (err) {
      console.warn("Failed to load products:", err);
      setProducts([]);
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Function to refresh products (called from admin after save)
  const refreshProducts = () => {
    console.log("🔄 Refreshing products...");
    loadProducts();
  };

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
