import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitial = () => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("nft-theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // fallback to system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };

  const [darkMode, setDarkMode] = useState(getInitial);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nft-theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`${darkMode ? "dark" : ""} app-theme`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
