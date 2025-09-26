import React from "react";
import brochurePdf from "../../assets/images/products/CATALOGO 2025_NFT_1.pdf";
import { Brain, Clock, Award, Microscope } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-500 group">
      {/* Card Container */}
      <div className="flex flex-col h-[500px] p-6 rounded-2xl shadow-2xl">
        {/* Image Section - Fixed height */}
        <div className="h-52 bg-gradient-to-r from-transparent via-white to-transparent rounded-2xl overflow-hidden pb-4 pt-2">
          <div className="w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out group-hover:scale-120">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow px-3">
          {/* Header - Fixed height */}
          <div className="h-32">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>

          {/* Features List - Fixed height */}
          <div className="h-36">
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 mt-1.5"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Button Section - Fixed position at bottom */}
          <div className="mt-auto">
            <a
              href={`/productos/${product.id}`}
              className="block w-full text-center border border-red-600 text-red-600 py-2 px-4 rounded text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              Ver Detalles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// limit: cantidad máxima de productos a mostrar (undefined para todos)
const Products = ({ limit }) => {
  const products = [
    {
      id: "fiber-med",
      name: "FIBER MED V2.0",
      image: "/src/assets/images/products/FIBER MED V2.0.jpg",
      description:
        "Equipo electrónico portátil inteligente con IA para análisis de medulación en fibras.",
      features: [
        "Resultados en 40 segundos",
        "3,000+ fibras/muestra",
        "IA integrada",
        "Multi-color compatible",
      ],
    },
    {
      id: "fiber-ec",
      name: "FIBER EC",
      image: "/src/assets/images/products/FIBER EC.png",
      description:
        "Caracterizador electrónico integral que mide todas las propiedades físicas importantes de las fibras animales con precisión científica.",
      features: [
        "Análisis MDF completo",
        "Factor de Picazón",
        "Factor de confort",
        "Monitoreo ambiental",
      ],
    },
    {
      id: "fiber-tst",
      name: "FIBER TST",
      image: "/src/assets/images/products/FIBER TST.png",
      description:
        "Medidor especializado de resistencia a la tracción de fibras individuales.",
      features: [
        "Medición de tracción precisa",
        "Gráficos en tiempo real",
        "Alta precisión",
        "Datos para aplicaciones textiles",
      ],
    },
    {
      id: "fiber-med-v1",
      name: "FIBER MED V1.0",
      image: "/src/assets/images/products/FIBER MED V1.0.png",
      description:
        "Versión previa del FIBER MED orientada a fibras claras y análisis semi-automatizado.",
      features: [
        "Reconocimiento por tipo de medulación",
        "Resultados automatizados",
        "Diseño compacto",
      ],
    },

    {
      id: "s-fiber-ec",
      name: "S-FIBER EC",
      image: "/src/assets/images/products/S-FIBER EC.png",
      description:
        "Versión portátil del FIBER EC, diseñada para uso en campo. Perfecta para evaluaciones in-situ con la misma precisión.",
      features: [
        "Solo 3.8 kg",
        "Hasta 5,300 m.s.n.m.",
        "-7°C a 45°C",
        "Mochila incluida",
      ],
    },
    {
      id: "fiber-den",
      name: "FIBER DEN",
      image: "/src/assets/images/products/Fiber-Den-3.png",
      description:
        "Densímetro de fibras portátil para capturar imágenes y calcular densidad de fibras y conductos pilosos.",
      features: [
        "Mini microscopio digital",
        "Procesamiento en PC/Tablet/Smartphone",
        "Resultados rápidos",
      ],
    },
    {
      id: "mosiville",
      name: "MOSIVILLE",
      image: "/src/assets/images/products/Mosiville.png",
      description:
        "Sistema para monitoreo inalámbrico y en tiempo real de signos vitales en animales.",
      features: [
        "Smartphone/Tablet/PC",
        "Monitoreo en tiempo real",
        "Alertas configurables",
      ],
    },
    {
      id: "medulometro",
      name: "MEDULÓMETRO",
      image: "/src/assets/images/products/medulometro.png",
      description:
        "Versión básica del FIBER MED con microscopio de proyección computarizado y semi-automatizado.",
      features: [
        "Evaluación de calidad de fibra",
        "Mediciones de características físicas",
        "Interfaz amigable",
      ],
    },
  ];

  return (
    <section id="productos" className="py-8 bg-gray-0 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-3 tracking-tight">
            Nuestros <span className="text-red-600">Productos</span>
          </h2>
          <p className="text-center text-[15px] text-gray-600 max-w-4xl mx-auto leading-snug">
            Tecnología de vanguardia para análisis de fibras animales,
            desarrollada con los más altos estándares de precisión e innovación
          </p>
        </div>

        {/* Insights / Highlights - stacked layout */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 ">
          {[
            {
              icon: Brain,
              title: "IA Avanzada",
              description: "Algoritmos de machine learning propios",
            },
            {
              icon: Clock,
              title: "40 Segundos",
              description: "Resultados ultrarrápidos",
            },
            {
              icon: Award,
              title: "630K+ Fibras",
              description: "Analizadas mundialmente",
            },
            {
              icon: Microscope,
              title: "Precisión Científica",
              description: "Validado internacionalmente",
            },
          ].map(({ icon: Icon, title, description }, i) => (
            <div
              key={i}
              className="group text-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-red-100 group-hover:ring-red-200 group-hover:scale-[1.03] transition">
                <Icon className="h-8 w-8 text-red-600" strokeWidth={1.6} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-[15px] tracking-tight">
                {title}
              </h3>
              <p className="text-xs md:text-[13px] text-gray-600 leading-snug max-w-[22ch] mx-auto">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {(limit ? products.slice(0, limit) : products).map(
              (product, index) => (
                <ProductCard key={index} product={product} />
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            {limit && (
              <a
                href="/productos"
                className="bg-red-600 hover:bg-red-700 text-white 
                             font-semibold py-3 px-8 rounded-lg 
                             transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todos los Productos
              </a>
            )}
            <a
              href={brochurePdf}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white 
                           font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Descargar Folleto Empresarial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
