import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { GridToggleButton } from "../GridOverlay";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile panel when route changes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const productItems = [
    { id: "fiber-med-2", name: "FIBER MED" },
    { id: "fiber-med", name: "FIBER MED V2.0" },
    { id: "fiber-ec", name: "FIBER EC" },
    { id: "s-fiber-ec", name: "S-FIBER EC" },
    { id: "fiber-den", name: "FIBER DEN" },
    { id: "fiber-tst", name: "FIBER TST" },
    { id: "mosiville", name: "MOSIVILLE" },
    { id: "medulometro", name: "MEDULÓMETRO" },
  ];

  const { pathname } = location;
  const isActive = (matcher) => matcher(pathname);
  const navClass = (active) =>
    `px-3 py-1 rounded-lg font-semibold text-lg transition-colors ${
      active
        ? "text-gray-900 bg-gray-200"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
    }`;

  const activeInicio = pathname === "/";
  const activeProductos = pathname.startsWith("/productos");
  const activeServicios = pathname.startsWith("/servicios");
  const activeInvestigacion = pathname.startsWith("/investigacion");
  const activeNosotros = pathname.startsWith("/nosotros");
  const activeContacto = pathname.startsWith("/contacto");
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/images/logo/logo_NFT.png"
                alt="Fiberstech Logo"
                className="h-16"
              />
            </Link>
          </div>

          {/* Navigation Links - Desktop (lg+) */}
          <div className="hidden lg:flex space-x-2 ml-auto">
            <Link to="/" className={navClass(activeInicio)}>
              Inicio
            </Link>
            {/* Productos dropdown (desktop) */}
            <div className="relative group">
              <Link
                to="/productos"
                className={`${navClass(
                  activeProductos
                )} flex items-center gap-1`}
              >
                Productos
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <div className="menu-panel invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 absolute left-0 top-full w-72 rounded-xl border border-gray-200 bg-white shadow-xl z-[70] p-2">
                <div className="grid grid-cols-1 gap-1 py-1">
                  {productItems.map((p) => {
                    const isItemActive = pathname === `/productos/${p.id}`;
                    return (
                      <Link
                        key={p.id}
                        to={`/productos/${p.id}`}
                        className={`menu-item px-3 py-2 rounded-lg text-sm hover:bg-gray-100 ${
                          isItemActive ? "bg-gray-200/60 dark:bg-white/5" : ""
                        }`}
                      >
                        {p.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link to="/servicios" className={navClass(activeServicios)}>
              Servicios
            </Link>
            <Link to="/investigacion" className={navClass(activeInvestigacion)}>
              Investigación
            </Link>
            <Link to="/nosotros" className={navClass(activeNosotros)}>
              Nosotros
            </Link>
            <Link to="/contacto" className={navClass(activeContacto)}>
              Contacto
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4 ml-auto justify-end">
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

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                // Close icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Grid Toggle */}
            <GridToggleButton />
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 pb-3 space-y-1 border-t pt-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Inicio
            </Link>
            {/* Productos accordion */}
            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              <span>Productos</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  mobileProductsOpen ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {mobileProductsOpen && (
              <div className="pl-4">
                <Link
                  to="/productos"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Ver todos los productos
                </Link>
                {productItems.map((p) => {
                  const isItemActive = pathname === `/productos/${p.id}`;
                  return (
                    <Link
                      key={p.id}
                      to={`/productos/${p.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                        isItemActive
                          ? "bg-gray-200/60 dark:bg-white/5 text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {p.name}
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              to="/servicios"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Servicios
            </Link>
            <Link
              to="/investigacion"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Investigación
            </Link>
            <Link
              to="/nosotros"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
