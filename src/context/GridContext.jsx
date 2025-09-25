import React, { createContext, useContext, useState } from "react";

const GridContext = createContext();

export const GridProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const toggleGrid = () => setVisible((prev) => !prev);

  return (
    <GridContext.Provider value={{ visible, toggleGrid }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
};
