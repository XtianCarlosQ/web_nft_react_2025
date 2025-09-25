import React from "react";
import brochurePdf from "../../assets/images/products/CATALOGO 2025_NFT_1.pdf";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-500 group">
      {/* Card Container */}
      <div className="flex flex-col h-[500px] p-8">
        {/* Image Section - Fixed height */}
        <div className="h-52 bg-gradient-to-r from-transparent via-white to-transparent rounded-xl overflow-hidden mb-6">
          <div className="w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out group-hover:scale-120">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow">
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
            <ul className="space-y-2">
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

const Products = () => {
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
  ];

  return (
    <section id="productos" className="py-8 bg-gray-0 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Nuestros <span className="text-red-600">Productos</span>
          </h2>
          <p className="text-gray-600 text-center text-sm">
            Tecnología de vanguardia en análisis y caracterización de fibras
            textiles
          </p>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a
              href="#nosotros-completo"
              className="bg-red-600 hover:bg-red-700 text-white 
                           font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver Todos los Productos
            </a>
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
