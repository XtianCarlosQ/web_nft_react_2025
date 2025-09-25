import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { GridProvider } from "./context/GridContext";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Products from "./components/sections/Products";
import Team from "./components/sections/Team";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import Partners from "./components/sections/Partners";
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
            <main className="container-app pt-20">
              <Hero />
              <About />
              <Products />
              <Services />
              <Team />
              <Partners />
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </GridProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
