// Centralized products catalog with DRY fields for card vs detail.
// - description_detail: long description used in ProductDetail
// - description_card: short summary for cards/grid
// - features_detail: array of { icon, title, description } for ProductDetail
// - features_card: array of short strings for cards/grid
// Icons are referenced by name and mapped in UI layers.
export const productsData = {
  // FIBER MED 1.0
  "fiber-med-2": {
    id: "fiber-med-2",
    name: "FIBER MED",
    tagline: "Medulador Inteligente de Fibras",
    image: "/assets/images/products/FIBER MED V1.0.png",
    category: "Análisis de Medulación",
    description_detail:
      "Equipo portátil que determina la incidencia de medulación en fibras de origen animal usando inteligencia artificial para interpretar imágenes digitales.",
    description_card:
      "Medulador inteligente de fibras con IA para análisis automático de medulación en fibras de origen animal.",
    features_detail: [
      {
        icon: "BarChart3",
        title: "Evaluación de Medulación",
        description:
          "Evalúa el porcentaje total y por tipo de fibras según su medulación (alpaca, llama, oveja, mohair)",
      },
      {
        icon: "Ruler",
        title: "Medición de Diámetro",
        description:
          "Mide el diámetro de fibra total y por tipo de medulación con alta precisión",
      },
      {
        icon: "Activity",
        title: "Análisis Estadístico",
        description:
          "Calcula desviación estándar y visualiza distribución de diámetros",
      },
      {
        icon: "Monitor",
        title: "IA Integrada",
        description:
          "Tecnología de inteligencia artificial para interpretación automática de imágenes",
      },
    ],
    features_card: [
      "Análisis con IA integrada",
      "8 kg, portátil",
      "Fibras blancas y claras",
      "Reportes automáticos",
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
    youtubeVideo: "https://www.youtube.com/watch?v=35Yf4dK-hyI&t=1s",
    additionalImages: ["/assets/images/products/FIBER MED V1.0.png"],
  },

  // FIBER MED 2.0 (improved)
  "fiber-med": {
    id: "fiber-med",
    name: "FIBER MED V2.0",
    tagline: "Medulador Inteligente Avanzado",
    image: "/assets/images/products/FIBER MED V2.0.jpg",
    category: "Análisis de Medulación Avanzado",
    description_detail:
      "Versión mejorada del FIBER MED que determina medulación en fibras de diferentes colores, incluyendo fibras oscuras con decoloración. Evalúa cada muestra en 40 segundos caracterizando más de 3000 fibras.",
    description_card:
      "Versión mejorada que analiza fibras de diferentes colores en 40 segundos caracterizando más de 3000 fibras por muestra.",
    features_detail: [
      {
        icon: "BarChart3",
        title: "Múltiples Colores",
        description:
          "Analiza fibras desde blanco hasta café claro sin decoloración, y fibras oscuras con decoloración",
      },
      {
        icon: "Activity",
        title: "Procesamiento Rápido",
        description:
          "Evalúa cada muestra en 40 segundos caracterizando más de 3000 fibras por muestra",
      },
      {
        icon: "Settings",
        title: "Análisis Detallado",
        description:
          "Clasifica fibras por tipo de medulación: no medulada, fragmentada, discontinua, continua",
      },
      {
        icon: "Monitor",
        title: "IA Avanzada",
        description:
          "Moderna tecnología de inteligencia artificial para interpretación automática",
      },
    ],
    features_card: [
      "Múltiples colores de fibra",
      "40 segundos/muestra",
      "3000+ fibras analizadas",
      "Cámara infrarroja",
    ],
    specifications: {
      Tipo: "Equipo automático de sobremesa/portátil",
      Peso: "8 kg",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Cámara: "Óptica e infrarroja para distintos colores",
      Software: "Software propietario FIBER MED con IA",
    },
    capabilities: [
      "Análisis en 40 segundos por muestra",
      "Caracterización de >3000 fibras por muestra",
      "Clasificación por tipo de medulación (no medulada, fragmentada, discontinua, continua)",
      "Evaluación de fibras claras y oscuras (con decoloración)",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/wp-content/uploads/2024/06/Ficha_FIBER_MED.-V1.-docx.pdf",
      en: "https://fiberstech.com/wp-content/uploads/2024/07/Data-Sheet_FIBER_MED-1.pdf",
    },
    additionalImages: ["/assets/images/products/FIBER MED V2.0.jpg"],
  },

  // FIBER EC
  "fiber-ec": {
    id: "fiber-ec",
    name: "FIBER EC",
    tagline: "Caracterizador Electrónico de Fibras",
    image: "/assets/images/products/FIBER EC.png",
    category: "Caracterización de Fibras",
    description_detail:
      "Caracterizador electrónico que evalúa la calidad de fibras de origen animal mediante tecnología de interpretación de imágenes digitales.",
    description_card:
      "Caracterizador electrónico que evalúa calidad de fibras mediante interpretación de imágenes digitales.",
    features_detail: [
      {
        icon: "BarChart3",
        title: "Análisis Completo",
        description:
          "Evalúa mechas completas obteniendo perfil de fibras y miles de datos por muestra",
      },
      {
        icon: "Ruler",
        title: "Múltiples Parámetros",
        description:
          "Mide MDF, CVMDF, DEMDF, Factor de Picazón, Factor de Confort y Finura al hilado",
      },
      {
        icon: "Shield",
        title: "Multi-especie",
        description:
          "Funciona con camélidos, ovinos, cabras, conejos, camellos y más especies",
      },
      {
        icon: "Activity",
        title: "Monitoreo Ambiental",
        description:
          "Controla temperatura y humedad ambiental durante las mediciones",
      },
    ],
    features_card: [
      "MDF, CVMDF, DEMDF",
      "Factor de Picazón/Confort",
      "Multi-especie",
      "Carcasa fibra de carbono",
    ],
    specifications: {
      Tipo: "Caracterizador electrónico de fibras",
      Peso: "—",
      Alimentación: "220-240 VAC, 50-60 Hz",
      Parámetros:
        "MDF, CVMDF, DEMDF, Factor de Picazón, Factor de Confort, Finura al hilado",
      Componentes: "Sistemas electrónico, mecánico, óptico y software",
    },
    capabilities: [
      "Evaluación de mechas completas con perfil de fibras",
      "Miles de mediciones por muestra",
      "Monitoreo de temperatura y humedad durante la medición",
      "Soporte multi-especie (camélidos, ovinos, cabras, conejos, camellos)",
    ],
    technicalSheets: {
      es: "https://fiberstech.com/fiber-ec/",
      en: "https://fiberstech.com/fiber-ec/",
    },
    additionalImages: ["/assets/images/products/FIBER EC.png"],
  },

  // S-FIBER EC
  "s-fiber-ec": {
    id: "s-fiber-ec",
    name: "S-FIBER EC",
    tagline: "Caracterizador Portátil de Campo",
    image: "/assets/images/products/S-FIBER EC.png",
    category: "Caracterización Portátil",
    description_detail:
      "Versión básica y portátil del FIBER EC, diseñada para evaluaciones en campo con mochila de transporte incluida. Trabaja en altitudes hasta 5,300 m.s.n.m.",
    description_card:
      "Versión portátil del FIBER EC, diseñada para uso en campo. Perfecta para evaluaciones in-situ con la misma precisión.",
    features_detail: [
      {
        icon: "Weight",
        title: "Ultra Portátil",
        description:
          "Solo 3.8 kg con mochila de transporte incluida para trabajo en campo",
      },
      {
        icon: "Settings",
        title: "Condiciones Extremas",
        description:
          "Funciona hasta 5,300 m.s.n.m. y temperaturas de -7°C a 45°C",
      },
      {
        icon: "BarChart3",
        title: "Parámetros Básicos",
        description:
          "Determina Media de diámetro de fibra (MDF) y Desviación Estándar (DEMDF)",
      },
      {
        icon: "Monitor",
        title: "Tecnología Digital",
        description:
          "Interpretación de imágenes digitales con almacenamiento de datos",
      },
    ],
    features_card: [
      "Solo 3.8 kg",
      "Hasta 5,300 m.s.n.m.",
      "-7°C a 45°C",
      "Mochila incluida",
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
    youtubeVideo: "https://www.youtube.com/watch?v=HW_8GKVgmdw",
    additionalImages: ["/assets/images/products/S-FIBER EC.png"],
  },

  // FIBER DEN
  "fiber-den": {
    id: "fiber-den",
    name: "FIBER DEN",
    tagline: "Densímetro de Fibras Portátil",
    image: "/assets/images/products/Fiber-Den-3.png",
    category: "Análisis de Densidad",
    description_detail:
      "Mini microscopio digital portátil que captura imágenes de fibras en piel rasurada para determinar densidad de fibras y conductos pilosos.",
    description_card:
      "Densímetro portátil con mini microscopio para análisis de densidad de fibras y conductos pilosos.",
    features_detail: [
      {
        icon: "Camera",
        title: "Captura Digital",
        description:
          "Mini microscopio con sensor de 2MP para imágenes de alta calidad",
      },
      {
        icon: "Weight",
        title: "Ultra Portátil",
        description: "Solo 200g de peso en dimensiones compactas de 11x5x5 cm",
      },
      {
        icon: "BarChart3",
        title: "Análisis Completo",
        description:
          "Densidad de fibras, conductos pilosos y relaciones estadísticas",
      },
      {
        icon: "Settings",
        title: "Área Variable",
        description: "Captura imágenes en áreas desde 0.25 hasta 9.0 mm²",
      },
    ],
    features_card: [
      "Solo 200g de peso",
      "Sensor 2MP",
      "Área 0.25-9.0 mm²",
      "Software incluido",
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
    youtubeVideo: "https://www.youtube.com/watch?v=2lgmUXohYIE",
    additionalImages: ["/assets/images/products/Fiber-Den-1.png"],
  },

  // FIBER TST
  "fiber-tst": {
    id: "fiber-tst",
    name: "FIBER TST",
    tagline: "Medidor de Esfuerzo a la Tracción",
    image: "/assets/images/products/FIBER TST.png",
    category: "Análisis de Resistencia",
    description_detail:
      "Medidor de esfuerzo a la tracción de fibras (Tensile Strength Tester) que utiliza tecnología de muestreo de datos en tiempo real con almacenamiento y graficado automático.",
    description_card:
      "Medidor de esfuerzo a la tracción con tecnología de muestreo en tiempo real y graficado automático.",
    features_detail: [
      {
        icon: "Activity",
        title: "Tiempo Real",
        description:
          "Muestreo de datos y graficado en tiempo real durante las pruebas",
      },
      {
        icon: "BarChart3",
        title: "Análisis Completo",
        description:
          "Esfuerzo máximo, media, coeficiente de variación y punto de ruptura",
      },
      {
        icon: "Settings",
        title: "Velocidad Variable",
        description:
          "Opciones de velocidad desde 6 hasta 64 mm/s para diferentes tipos de fibra",
      },
      {
        icon: "Shield",
        title: "Seguridad",
        description:
          "Mecanismo de seguridad integrado con accesorios especializados",
      },
    ],
    features_card: [
      "Velocidad 6-64 mm/s",
      "Gráficos en tiempo real",
      "Máximo 30 kg",
      "Sistema neumático",
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
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw",
    additionalImages: ["/assets/images/products/FIBER TST.png"],
  },

  // MOSIVILLE
  mosiville: {
    id: "mosiville",
    name: "MOSIVILLE",
    tagline: "Monitor de Signos Vitales Animal",
    image: "/assets/images/products/Mosiville.png",
    category: "Monitoreo Veterinario",
    description_detail:
      "Sistema de monitoreo inalámbrico en tiempo real de signos vitales de diversos animales mediante smartphone, tablet o PC, utilizando algoritmos avanzados de procesamiento digital.",
    description_card:
      "Sistema para monitoreo inalámbrico y en tiempo real de signos vitales en diversos animales.",
    features_detail: [
      {
        icon: "Monitor",
        title: "Monitoreo Remoto",
        description:
          "Visualización en tiempo real mediante smartphone, tablet o PC",
      },
      {
        icon: "Activity",
        title: "Signos Vitales",
        description:
          "Ritmo y frecuencia cardíaca, frecuencia respiratoria, temperatura",
      },
      {
        icon: "Shield",
        title: "Detección Avanzada",
        description:
          "Detecta arritmias, apneas, fiebre y variabilidad cardíaca",
      },
      {
        icon: "Weight",
        title: "Ultra Liviano",
        description: "Solo 80g de peso en dimensiones ultracompactas",
      },
    ],
    features_card: [
      "Solo 80g de peso",
      "Monitoreo inalámbrico",
      "Múltiples especies",
      "Detección de arritmias",
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
    technicalSheets: {
      es: "https://fiberstech.com/mosiville/",
      en: "https://fiberstech.com/mosiville/",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw",
    additionalImages: ["/assets/images/products/Mosiville.png"],
  },

  // MEDULÓMETRO
  medulometro: {
    id: "medulometro",
    name: "MEDULÓMETRO",
    tagline: "Microscopio de Proyección Computarizado",
    image: "/assets/images/products/medulometro.png",
    category: "Análisis Básico de Medulación",
    description_detail:
      "Versión básica del FIBER MED. Microscopio de proyección computarizado y semi-automatizado para evaluar la calidad de fibras mediante interpretación de imágenes digitales.",
    description_card:
      "Versión básica del FIBER MED. Microscopio de proyección computarizado para análisis de medulación.",
    features_detail: [
      {
        icon: "Microscope",
        title: "Microscopio Digital",
        description:
          "Microscopio de proyección computarizado y semi-automatizado",
      },
      {
        icon: "BarChart3",
        title: "Análisis por Tipo",
        description:
          "Media del diámetro por tipo de medulación y desviación estándar",
      },
      {
        icon: "Shield",
        title: "Multi-especie",
        description:
          "Camélidos, ovinos, cabras, conejos, camellos, vacunos y más",
      },
      {
        icon: "Monitor",
        title: "Almacenamiento Digital",
        description: "Transmisión y almacenamiento de base de datos y gráficos",
      },
    ],
    features_card: [
      "Microscopio digital",
      "Semi-automatizado",
      "10 kg de peso",
      "Multi-especie",
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
    technicalSheets: {
      es: "https://fiberstech.com/medulometro/",
      en: "https://fiberstech.com/medulometro/",
    },
    youtubeVideo: "https://www.youtube.com/watch?v=-b4Ztxmlbjw",
    additionalImages: ["/assets/images/products/medulometro.png"],
  },
};
