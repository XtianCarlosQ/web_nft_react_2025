import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Zap,
  Monitor,
  Shield,
  BarChart3,
  Settings,
  Camera,
  Microscope,
  Weight,
  Ruler,
  Activity,
  ChevronRight,
  SquarePlay,
} from "lucide-react";

// Product data extracted from the scraped websites - 8 Products Complete
const productsData = {
  "fiber-med-2": {
    id: "fiber-med-2",
    name: "FIBER MED",
    tagline: "Medulador Inteligente de Fibras",
    description:
      "Equipo portátil que determina la incidencia de medulación en fibras de origen animal usando inteligencia artificial para interpretar imágenes digitales.",
    image: "/assets/images/products/FIBER MED V1.0.png",
    category: "Análisis de Medulación",
    features: [
      {
        icon: BarChart3,
        title: "Evaluación de Medulación",
        description:
          "Evalúa el porcentaje total y por tipo de fibras según su medulación (alpaca, llama, oveja, mohair)",
      },
      {
        icon: Ruler,
        title: "Medición de Diámetro",
        description:
          "Mide el diámetro de fibra total y por tipo de medulación con alta precisión",
      },
      {
        icon: Activity,
        title: "Análisis Estadístico",
        description:
          "Calcula desviación estándar y visualiza distribución de diámetros",
      },
      {
        icon: Monitor,
        title: "IA Integrada",
        description:
          "Tecnología de inteligencia artificial para interpretación automática de imágenes",
      },
    ],
    specifications: {
      Tipo: "Equipo automático de sobremesa/portátil",
      Peso: "8 kg",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Componentes: "4 sistemas: Electrónico, Mecánico, Óptico, Software",
      Cámara: "Cámara óptica integrada",
      Software: "Software propietario FIBER MED",
    },
    capabilities: [
      "Determinar cantidad de fibras por tipo de medulación y sin médula",
      "Evaluación en fibras blancas y color claro",
      "Clasificación automática por tipo de animal",
      "Reportes detallados con gráficos estadísticos",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-content/uploads/2024/06/Ficha_FIBER_MED.-V1.-docx.pdf",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_FIBER_MED-1.pdf",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=35Yf4dK-hyI&t=1s", // Video OK
    additionalImages: ["/assets/images/products/FIBER MED V1.0.png"], // Foto OK
  },
  "fiber-med": {
    id: "fiber-med",
    name: "FIBER MED V2.0",
    tagline: "Medulador Inteligente Avanzado",
    description:
      "Versión mejorada del FIBER MED que determina medulación en fibras de diferentes colores, incluyendo fibras oscuras con decoloración. Evalúa cada muestra en 40 segundos caracterizando más de 3000 fibras.",
    image: "/assets/images/products/FIBER MED V2.0.jpg",
    category: "Análisis de Medulación Avanzado",
    features: [
      {
        icon: BarChart3,
        title: "Múltiples Colores",
        description:
          "Analiza fibras desde blanco hasta café claro sin decoloración, y fibras oscuras con decoloración",
      },
      {
        icon: Activity,
        title: "Procesamiento Rápido",
        description:
          "Evalúa cada muestra en 40 segundos caracterizando más de 3000 fibras por muestra",
      },
      {
        icon: Microscope,
        title: "Análisis Detallado",
        description:
          "Clasifica fibras por tipo de medulación: no medulada, fragmentada, discontinua, continua",
      },
      {
        icon: Monitor,
        title: "IA Avanzada",
        description:
          "Moderna tecnología de inteligencia artificial para interpretación automática",
      },
    ],
    specifications: {
      Tipo: "Equipo portátil",
      Peso: "11 kg",
      Carcasa: "Aluminio",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Componentes: "4 sistemas: Electrónico, Mecánico, Óptico, Programación",
      Cámara: "Cámara infrarroja",
    },
    capabilities: [
      "Porcentaje de medulación total (PMT)",
      "Porcentaje de la media de diámetro de fibras total (%MDFT)",
      "Análisis por tipos de medulación (fragmentada, discontinua, continua)",
      "Histograma del diámetro de fibras meduladas y no meduladas",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-admin/upload.php?item=3142",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_FIBER_MED-V2.0.pdf",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-RJHbgvkm5M", // video OK
    additionalImages: ["/assets/images/products/FIBER MED V2.0.jpg"], // Foto OK
  },
  "fiber-ec": {
    id: "fiber-ec",
    name: "FIBER EC",
    tagline: "Caracterizador Electrónico de Fibras",
    description:
      "Caracterizador electrónico que evalúa la calidad de fibras de origen animal mediante tecnología de interpretación de imágenes digitales.",
    image: "/assets/images/products/FIBER EC.png",
    category: "Caracterización de Fibras",
    features: [
      {
        icon: Microscope,
        title: "Análisis Completo",
        description:
          "Evalúa mechas completas obteniendo perfil de fibras y miles de datos por muestra",
      },
      {
        icon: BarChart3,
        title: "Múltiples Parámetros",
        description:
          "Mide MDF, CVMDF, DEMDF, Factor de Picazón, Factor de Confort y Finura al hilado",
      },
      {
        icon: Shield,
        title: "Multi-especie",
        description:
          "Funciona con camélidos, ovinos, cabras, conejos, camellos y más especies",
      },
      {
        icon: Monitor,
        title: "Monitoreo Ambiental",
        description:
          "Controla temperatura y humedad ambiental durante las mediciones",
      },
    ],
    specifications: {
      Peso: "8 kg",
      Carcasa: "Fibra de carbono",
      Dimensiones: "34 cm x 23.4 cm x 29 cm",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Garantía: "12 meses",
      Componentes: "4 sistemas: Electrónico, Mecánico, Óptico, Software",
    },
    capabilities: [
      "Transmisión y almacenamiento de base de datos",
      "Generación de gráficos automáticos",
      "Impresión de reportes detallados",
      "Incorporación de procedimientos para nuevos tipos de fibras",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-content/uploads/2021/11/Ficha-Te%CC%81cnica_S-FIBER-EC.pdf",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_S_FIBER_EC.pdf",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=VzxlbyXc_0Y", // Video OK
    additionalImages: ["/assets/images/products/FIBER EC.png"], // Foto OK
  },
  "s-fiber-ec": {
    id: "s-fiber-ec",
    name: "S-FIBER EC",
    tagline: "Caracterizador Portátil de Campo",
    description:
      "Versión básica y portátil del FIBER EC, diseñada para evaluaciones en campo con mochila de transporte incluida. Trabaja en altitudes hasta 5,300 m.s.n.m.",
    image: "/assets/images/products/S-FIBER EC.png",
    category: "Caracterización Portátil",
    features: [
      {
        icon: Weight,
        title: "Ultra Portátil",
        description:
          "Solo 3.8 kg con mochila de transporte incluida para trabajo en campo",
      },
      {
        icon: Settings,
        title: "Condiciones Extremas",
        description:
          "Funciona hasta 5,300 m.s.n.m. y temperaturas de -7°C a 45°C",
      },
      {
        icon: BarChart3,
        title: "Parámetros Básicos",
        description:
          "Determina Media de diámetro de fibra (MDF) y Desviación Estándar (DEMDF)",
      },
      {
        icon: Monitor,
        title: "Tecnología Digital",
        description:
          "Interpretación de imágenes digitales con almacenamiento de datos",
      },
    ],
    specifications: {
      Peso: "3.8 kg",
      Carcasa: "Acrílico",
      Dimensiones: "22.5 cm x 22.4 cm x 28.5 cm",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Componentes: "4 sistemas: Electrónico, Mecánico, Óptico, Software",
      Accesorios: "Mochila de transporte incluida",
    },
    capabilities: [
      "Media de diámetro de fibra (MDF)",
      "Desviación Estándar de la MDF (DEMDF)",
      "Trabajo en condiciones de altitud extrema",
      "Transmisión y almacenamiento de datos",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-content/uploads/2021/11/Ficha-Te%CC%81cnica_S-FIBER-EC.pdf",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_S_FIBER_EC.pdf",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=HW_8GKVgmdw", // Video OK
    additionalImages: ["/assets/images/products/S-FIBER EC.png"], // Foto OK
  },
  "fiber-den": {
    id: "fiber-den",
    name: "FIBER DEN",
    tagline: "Densímetro de Fibras Portátil",
    description:
      "Mini microscopio digital portátil que captura imágenes de fibras en piel rasurada para determinar densidad de fibras y conductos pilosos.",
    image: "/assets/images/products/Fiber-Den-3.png",
    category: "Análisis de Densidad",
    features: [
      {
        icon: Camera,
        title: "Captura Digital",
        description:
          "Mini microscopio con sensor de 2MP para imágenes de alta calidad",
      },
      {
        icon: Weight,
        title: "Ultra Portátil",
        description: "Solo 200g de peso en dimensiones compactas de 11x5x5 cm",
      },
      {
        icon: BarChart3,
        title: "Análisis Completo",
        description:
          "Densidad de fibras, conductos pilosos y relaciones estadísticas",
      },
      {
        icon: Settings,
        title: "Área Variable",
        description: "Captura imágenes en áreas desde 0.25 hasta 9.0 mm²",
      },
    ],
    specifications: {
      Peso: "200 g",
      Dimensiones: "11 cm x 5 cm x 5 cm",
      Alimentación: "3.5VDC",
      Sensor: "LENS & CMO 2 MP",
      Resolución: "1600 x 1200 píxeles, BMP/JPEG",
      Iluminación: "4 focos de luz blanca",
    },
    capabilities: [
      "Densidad de conductos pilosos (Nº/mm²)",
      "Densidad de fibras (Nº/mm²)",
      "Relación fibras/conductos pilosos",
      "Análisis estadístico con desviación estándar y coeficiente de variación",
    ],
    software: [
      "Den 1: Calibración y captura de imágenes",
      "Den 2: Evaluación y análisis con exportación a Excel",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-content/uploads/2021/11/Ficha-Te%CC%81cnica_FIBER_DEN.pdf",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_FIBER_DEN.pdf",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=2lgmUXohYIE", // Video OK
    additionalImages: ["/assets/images/products/Fiber-Den-1.png"], // Fotos OK
  },
  "fiber-tst": {
    id: "fiber-tst",
    name: "FIBER TST",
    tagline: "Medidor de Esfuerzo a la Tracción",
    description:
      "Medidor de esfuerzo a la tracción de fibras (Tensile Strength Tester) que utiliza tecnología de muestreo de datos en tiempo real con almacenamiento y graficado automático.",
    image: "/assets/images/products/FIBER TST.png",
    category: "Análisis de Resistencia",
    features: [
      {
        icon: Activity,
        title: "Tiempo Real",
        description:
          "Muestreo de datos y graficado en tiempo real durante las pruebas",
      },
      {
        icon: BarChart3,
        title: "Análisis Completo",
        description:
          "Esfuerzo máximo, media, coeficiente de variación y punto de ruptura",
      },
      {
        icon: Settings,
        title: "Velocidad Variable",
        description:
          "Opciones de velocidad desde 6 hasta 64 mm/s para diferentes tipos de fibra",
      },
      {
        icon: Shield,
        title: "Seguridad",
        description:
          "Mecanismo de seguridad integrado con accesorios especializados",
      },
    ],
    specifications: {
      Tipo: "Equipo de sobremesa",
      Peso: "Máximo 30 kg",
      Dimensiones: "80 cm x 40 cm x 36 cm",
      Consumo: "150 W",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Velocidad: "6 a 64 mm/s",
    },
    capabilities: [
      "Esfuerzo a la tracción máxima (N/Ktex)",
      "Media del esfuerzo a la tracción máxima (MET)",
      "Fuerza máxima a la rotura (N)",
      "Coeficiente de Variación y Desviación Estándar",
    ],
    components: [
      "Sistema Electrónico",
      "Sistema Mecánico",
      "Sistema Neumático",
      "Interfaz Gráfica de Usuario",
    ],
    accessories: ["Balanza de precisión", "Compresora", "Regla metálica"],
    technicalSheets: {
      es: "https://fiberstech.com/fiber-tst/",
      en: "https://fiberstech.com/fiber-tst/",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw", // Video Genérico
    additionalImages: ["/assets/images/products/FIBER TST.png"], // Foto OK
  },
  mosiville: {
    id: "mosiville",
    name: "MOSIVILLE",
    tagline: "Monitor de Signos Vitales Animal",
    description:
      "Sistema de monitoreo inalámbrico en tiempo real de signos vitales de diversos animales mediante smartphone, tablet o PC, utilizando algoritmos avanzados de procesamiento digital.",
    image: "/assets/images/products/Mosiville.png",
    category: "Monitoreo Veterinario",
    features: [
      {
        icon: Monitor,
        title: "Monitoreo Remoto",
        description:
          "Visualización en tiempo real mediante smartphone, tablet o PC",
      },
      {
        icon: Activity,
        title: "Signos Vitales",
        description:
          "Ritmo y frecuencia cardíaca, frecuencia respiratoria, temperatura",
      },
      {
        icon: Shield,
        title: "Detección Avanzada",
        description:
          "Detecta arritmias, apneas, fiebre y variabilidad cardíaca",
      },
      {
        icon: Weight,
        title: "Ultra Liviano",
        description: "Solo 80g de peso en dimensiones ultracompactas",
      },
    ],
    specifications: {
      Peso: "80 g",
      Dimensiones: "7.8 cm x 1.98 cm x 4.1 cm",
      Alimentación: "3.7 VDC",
      Conectividad: "Inalámbrica",
      Compatibilidad: "Smartphone, Tablet, PC",
      Componentes: "3 sistemas: Electrónico, Mecánico, Software",
    },
    capabilities: [
      "Ritmo cardíaco en tiempo real",
      "Frecuencia cardíaca (HR) y variabilidad (HRV)",
      "Frecuencia respiratoria (FR)",
      "Temperatura superficial y movimiento",
    ],
    animalTypes: ["Vacunos", "Equinos", "Camélidos", "Caninos", "Felinos"],
    technicalSheets: {
      es: "https://fiberstech.com/mosiville/",
      en: "https://fiberstech.com/mosiville/",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw", // Video Genérico
    additionalImages: ["/assets/images/products/Mosiville.png"], // Foto OK
  },
  medulometro: {
    id: "medulometro",
    name: "MEDULÓMETRO",
    tagline: "Microscopio de Proyección Computarizado",
    description:
      "Versión básica del FIBER MED. Microscopio de proyección computarizado y semi-automatizado para evaluar la calidad de fibras mediante interpretación de imágenes digitales.",
    image: "/assets/images/products/medulometro.png",
    category: "Análisis Básico de Medulación",
    features: [
      {
        icon: Microscope,
        title: "Microscopio Digital",
        description:
          "Microscopio de proyección computarizado y semi-automatizado",
      },
      {
        icon: BarChart3,
        title: "Análisis por Tipo",
        description:
          "Media del diámetro por tipo de medulación y desviación estándar",
      },
      {
        icon: Shield,
        title: "Multi-especie",
        description:
          "Camélidos, ovinos, cabras, conejos, camellos, vacunos y más",
      },
      {
        icon: Monitor,
        title: "Almacenamiento Digital",
        description: "Transmisión y almacenamiento de base de datos y gráficos",
      },
    ],
    specifications: {
      Peso: "10 kg",
      Dimensiones: "25.3 cm x 18.8 cm x 38.5 cm",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Componentes: "4 sistemas: Electrónico, Mecánico, Óptico, Software",
    },
    capabilities: [
      "Media del diámetro de fibra (MDF) por tipo de medulación",
      "Desviación estándar por tipo de medulación",
      "Clasificación: no medulada, fragmentada, discontinua, continua",
      "Transmisión y almacenamiento de datos",
    ],
    fiberTypes: [
      "Fibras no meduladas",
      "Fibras no meduladas IWTO",
      "Medulación fragmentada",
      "Medulación discontinua",
      "Medulación continua",
      "Fibras fuertemente meduladas",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/medulometro/",
      en: "https://fiberstech.com/medulometro/",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw", // Video Genérico
    additionalImages: ["/assets/images/products/medulometro.png"], // Foto OK
  },
};

// Feature card component with compact design - Icon and Title on same line
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-white p-3 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-2 mb-2 justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
        <Icon className="h-4 w-4 text-red-600" />
      </div>
    </div>
    <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
  </div>
);

// Specification row component
const SpecRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900 text-right max-w-xs">{value}</span>
  </div>
);

// Capability item component
const CapabilityItem = ({ children }) => (
  <div className="flex items-start space-x-3">
    <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700 leading-relaxed">{children}</span>
  </div>
);

// Product Media Carousel Component
const ProductMediaCarousel = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get media items (video first, then images)
  const getMediaItems = () => {
    const items = [];

    // Add YouTube video if available
    if (product.youtubeVideo) {
      items.push({
        type: "video",
        url: product.youtubeVideo,
        title: `Video de ${product.name}`,
      });
    }

    // Add main product image
    items.push({
      type: "image",
      url: product.image,
      title: product.name,
      alt: product.name,
    });

    // Add additional images if available
    if (product.additionalImages) {
      product.additionalImages.forEach((img, index) => {
        items.push({
          type: "image",
          url: img,
          title: `${product.name} - Vista ${index + 2}`,
          alt: `${product.name} vista ${index + 2}`,
        });
      });
    }

    return items;
  };

  const mediaItems = getMediaItems();
  const totalItems = mediaItems.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="relative h-full flex flex-col">
      {/* Main Media Display with spotlight background */}
      <div
        className="flex-grow flex items-center justify-center mb-4 min-h-80 rounded-2xl overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.02) 80%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -20px 60px rgba(0,0,0,0.25)",
          border: "1px solid var(--glass-border)",
          WebkitBackdropFilter: "blur(8px) saturate(140%)",
          backdropFilter: "blur(8px) saturate(140%)",
        }}
      >
        {currentItem.type === "video" ? (
          <div className="w-full h-full max-h-80 rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                currentItem.url
              )}`}
              title={currentItem.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <img
            src={currentItem.url}
            alt={currentItem.alt}
            className="w-full h-auto rounded-xl max-h-80 object-contain"
            onError={(e) => {
              e.target.src = "/assets/images/logo/logo_NFT.png";
            }}
          />
        )}
      </div>

      {/* Navigation Controls */}
      {totalItems > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 rotate-180" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-0">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-red-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Media Type Indicator */}
          <div className="text-center mt-3">
            <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
              {currentItem.type === "video" ? (
                <SquarePlay className="h-6 w-6" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
              {currentItem.type === "video" ? "Video" : "Imagen"} -{" "}
              {currentIndex + 1} de {totalItems}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

// Main ProductDetail component
const ProductDetail = () => {
  const { productId } = useParams();
  const product = productsData[productId];

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en obtener más información sobre el ${product.name}. ¿Podrían enviarme detalles sobre precios, disponibilidad y especificaciones técnicas?`
    );
    const phoneNumber = "51988496839";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app pt-4 pb-12">
        {/* Breadcrumb */}
        <div className="grid-ctx mb-4">
          <div className="span-12">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-red-600 transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                to="/productos"
                className="hover:text-red-600 transition-colors"
              >
                Productos
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid-ctx mb-6">
          <div className="span-12">
            <div className="mb-4">
              <div className="flex items-center justify-left mb-3 gap-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <p className="text-lg text-red-600 font-medium mb-3">
                {product.tagline}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Zap className="h-5 w-5" />
                Solicitar Cotización
              </button>
              <div className="flex gap-2">
                <a
                  href={product.technicalSheets.es}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Ficha ES
                </a>
                <a
                  href={product.technicalSheets.en}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Ficha EN
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid-ctx mb-6">
          <div className="span-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Características Principales
            </h2>
          </div>
          <div className="span-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Specifications with Product Image Section - Two Separate Cards */}
        <div className="grid-ctx mb-6">
          <div className="span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {/* Specifications Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Especificaciones Técnicas
                </h3>
                <div className="space-y-1">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <SpecRow key={key} label={key} value={value} />
                    )
                  )}
                </div>
              </div>

              {/* Product Media Carousel */}
              <div className="bg-white rounded-2xl p-6 pb-3 shadow-lg h-full">
                <ProductMediaCarousel product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="grid-ctx mb-8">
          <div className="span-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Capacidades
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {product.capabilities.map((capability, index) => (
                  <CapabilityItem key={index}>{capability}</CapabilityItem>
                ))}
              </div>

              {/* Software section for FIBER DEN */}
              {product.software && (
                <>
                  <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Software Incluido
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {product.software.map((software, index) => (
                      <CapabilityItem key={index}>{software}</CapabilityItem>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact CTA Section */}
        <div className="grid-ctx">
          <div className="span-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-center text-white">
            <h2 className="text-xl font-bold mb-3">
              ¿Interesado en {product.name}?
            </h2>
            <p className="text-red-100 mb-4 max-w-xl mx-auto">
              Contáctanos para obtener una demostración personalizada y
              cotización detallada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppContact}
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Contactar por WhatsApp
              </button>
              <Link
                to="/contacto"
                className="bg-red-800 hover:bg-red-900 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Ir a Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
