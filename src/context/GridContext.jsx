import React, { useState, useCallback, useMemo } from "react";
import { GridContext } from "./contexts/GridContext";

export const GridProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const toggleGrid = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const value = useMemo(() => ({ visible, toggleGrid }), [visible, toggleGrid]);

  return (
    <GridContext.Provider value={value}>
      {children}
    </GridContext.Provider>
  );
};

// Hook moved to src/context/hooks/useGrid.js to satisfy Fast Refresh lint rule.
