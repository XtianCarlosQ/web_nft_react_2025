import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { GridProvider } from "./context/GridContext";
import Navbar from "./components/layout/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Products from "./components/sections/Products";
import Team from "./components/sections/Team";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import Partners from "./components/sections/Partners";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";
import GridOverlay from "./components/GridOverlay";

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GridProvider>
          <div className="min-h-screen bg-white transition-colors duration-300">
            <Navbar />
            <GridOverlay />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <main className="container-app pt-20">
                      <Hero />
                      <About resume />
                      <Products limit={3} />
                      <Services limit={3} />
                      <Team />
                      <Partners />
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
              <Route
                path="/productos"
                element={
                  <>
                    <main className="container-app pt-20">
                      <Products />
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
              <Route
                path="/servicios"
                element={
                  <>
                    <main className="container-app pt-20">
                      <Services />
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
              <Route
                path="/nosotros"
                element={
                  <>
                    <main className="container-app pt-20">
                      <About />
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
            </Routes>
            {/* Standalone Contact route uses the same shell (Navbar global, Footer + WhatsApp here) */}
            <Routes>
              <Route
                path="/contacto"
                element={
                  <>
                    <main className="container-app pt-20">
                      <Contact />
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
            </Routes>
          </div>
        </GridProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
