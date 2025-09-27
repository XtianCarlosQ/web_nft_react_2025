import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { GridToggleButton } from "../GridOverlay";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/src/assets/images/logo/logo_NFT.png"
                alt="Fiberstech Logo"
                className="h-16"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-2">
            <Link
              to="/"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Productos
            </Link>
            <Link
              to="/servicios"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Servicios
            </Link>
            <a
              href="#investigacion"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Investigación
            </a>
            <Link
              to="/nosotros"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              className="px-3 py-1 rounded-lg font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Language and Theme Toggles */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex space-x-2 border rounded-lg p-1">
              <button
                onClick={() => toggleLanguage("es")}
                className={`px-2 py-1 rounded ${
                  language === "es"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => toggleLanguage("en")}
                className={`px-2 py-1 rounded ${
                  language === "en"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {darkMode ? (
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Grid Toggle */}
            <GridToggleButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
