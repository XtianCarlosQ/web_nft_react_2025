import React from "react";
import { Link } from "react-router-dom";
import brochurePdf from "../../assets/images/products/CATALOGO 2025_NFT_1.pdf";
import { Brain, Clock, Award, Microscope } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const raw = t(`products.cards.${product.id}`);
  const cardT = raw && typeof raw === "object" ? raw : {};
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
              {cardT.description || product.description}
            </p>
          </div>

          {/* Features List - Fixed height */}
          <div className="h-36">
            <ul className="space-y-1">
              {(cardT.features || product.features).map((feature, index) => (
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
            <Link
              to={`/productos/${product.id}`}
              className="block w-full text-center btn-cta py-2 px-4 text-sm font-medium cursor-pointer"
            >
              {t("products.viewDetails")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// limit: cantidad máxima de productos a mostrar (undefined para todos)
const Products = ({ limit }) => {
  const { t } = useLanguage();
  const products = [
    {
      id: "fiber-med-2",
      name: "FIBER MED",
      image: "/assets/images/products/FIBER MED V1.0.png",
      description:
        t("products.cards.fiber-med-2.description") ||
        "Medulador inteligente de fibras con IA para análisis automático de medulación en fibras de origen animal.",
      features: [
        ...(t("products.cards.fiber-med-2.features") || [
          "Análisis con IA integrada",
          "8 kg, portátil",
          "Fibras blancas y claras",
          "Reportes automáticos",
        ]),
      ],
    },
    {
      id: "fiber-med",
      name: "FIBER MED V2.0",
      image: "/assets/images/products/FIBER MED V2.0.jpg",
      description:
        t("products.cards.fiber-med.description") ||
        "Versión mejorada que analiza fibras de diferentes colores en 40 segundos caracterizando más de 3000 fibras por muestra.",
      features: [
        ...(t("products.cards.fiber-med.features") || [
          "Múltiples colores de fibra",
          "40 segundos/muestra",
          "3000+ fibras analizadas",
          "Cámara infrarroja",
        ]),
      ],
    },
    {
      id: "fiber-ec",
      name: "FIBER EC",
      image: "/assets/images/products/FIBER EC.png",
      description:
        t("products.cards.fiber-ec.description") ||
        "Caracterizador electrónico que evalúa calidad de fibras mediante interpretación de imágenes digitales.",
      features: [
        ...(t("products.cards.fiber-ec.features") || [
          "MDF, CVMDF, DEMDF",
          "Factor de Picazón/Confort",
          "Multi-especie",
          "Carcasa fibra de carbono",
        ]),
      ],
    },
    {
      id: "s-fiber-ec",
      name: "S-FIBER EC",
      image: "/assets/images/products/S-FIBER EC.png",
      description:
        t("products.cards.s-fiber-ec.description") ||
        "Versión portátil del FIBER EC, diseñada para uso en campo. Perfecta para evaluaciones in-situ con la misma precisión.",
      features: [
        ...(t("products.cards.s-fiber-ec.features") || [
          "Solo 3.8 kg",
          "Hasta 5,300 m.s.n.m.",
          "-7°C a 45°C",
          "Mochila incluida",
        ]),
      ],
    },
    {
      id: "fiber-den",
      name: "FIBER DEN",
      image: "/assets/images/products/Fiber-Den-3.png",
      description:
        t("products.cards.fiber-den.description") ||
        "Densímetro portátil con mini microscopio para análisis de densidad de fibras y conductos pilosos.",
      features: [
        ...(t("products.cards.fiber-den.features") || [
          "Solo 200g de peso",
          "Sensor 2MP",
          "Área 0.25-9.0 mm²",
          "Software incluido",
        ]),
      ],
    },
    {
      id: "fiber-tst",
      name: "FIBER TST",
      image: "/assets/images/products/FIBER TST.png",
      description:
        t("products.cards.fiber-tst.description") ||
        "Medidor de esfuerzo a la tracción con tecnología de muestreo en tiempo real y graficado automático.",
      features: [
        ...(t("products.cards.fiber-tst.features") || [
          "Velocidad 6-64 mm/s",
          "Gráficos en tiempo real",
          "Máximo 30 kg",
          "Sistema neumático",
        ]),
      ],
    },
    {
      id: "mosiville",
      name: "MOSIVILLE",
      image: "/assets/images/products/Mosiville.png",
      description:
        t("products.cards.mosiville.description") ||
        "Sistema para monitoreo inalámbrico y en tiempo real de signos vitales en diversos animales.",
      features: [
        ...(t("products.cards.mosiville.features") || [
          "Solo 80g de peso",
          "Monitoreo inalámbrico",
          "Múltiples especies",
          "Detección de arritmias",
        ]),
      ],
    },
    {
      id: "medulometro",
      name: "MEDULÓMETRO",
      image: "/assets/images/products/medulometro.png",
      description:
        t("products.cards.medulometro.description") ||
        "Versión básica del FIBER MED. Microscopio de proyección computarizado para análisis de medulación.",
      features: [
        ...(t("products.cards.medulometro.features") || [
          "Microscopio digital",
          "Semi-automatizado",
          "10 kg de peso",
          "Multi-especie",
        ]),
      ],
    },
  ];

  return (
    <section id="productos" className="py-8 bg-gray-0 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-3 tracking-tight">
            {t("products.title").split(" ")[0]}{" "}
            <span className="text-red-600">
              {t("products.title").split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-center text-[15px] text-gray-600 max-w-4xl mx-auto leading-snug">
            {t("products.lead")}
          </p>
        </div>

        {/* Insights / Highlights - stacked layout */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 ">
          {[
            { icon: Brain, ...t("products.highlights.0") },
            { icon: Clock, ...t("products.highlights.1") },
            { icon: Award, ...t("products.highlights.2") },
            { icon: Microscope, ...t("products.highlights.3") },
          ].map(({ icon: Icon, title, description }, i) => (
            <div
              key={i}
              className="group text-center p-4 rounded-2xl border border-gray-200 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg bg-white dark:bg-transparent"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)), var(--glass-bg)",
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(10px) saturate(150%)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 group-hover:scale-[1.03] transition"
                style={{
                  background:
                    "radial-gradient(120px 120px at 30% 30%, rgba(240,82,82,0.18), rgba(240,82,82,0.06) 60%), rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Icon className="h-8 w-8 text-red-600" strokeWidth={1.6} />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-[15px] tracking-tight text-gray-900">
                {title}
              </h3>
              <p className="text-xs md:text-[13px] leading-snug max-w-[22ch] mx-auto text-gray-600">
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
              <Link
                to="/productos"
                className="bg-red-600 hover:bg-red-700 text-white 
                             font-semibold py-3 px-8 rounded-lg 
                             transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t("products.viewAll")}
              </Link>
            )}
            <a
              href={brochurePdf}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white 
                           font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              {t("products.brochureLong")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
