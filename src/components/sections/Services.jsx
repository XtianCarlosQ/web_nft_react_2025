import React from "react";
import {
  Brain,
  Settings,
  BookOpen,
  Users,
  BarChart3,
  Lightbulb,
} from "lucide-react";

// ================= ServiceCard =================
// Tarjeta individual de servicio (altura fija para alineación de grid)
const ServiceCard = ({ service }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Buen día, estoy interesado en el servicio de ${service.title}`
    );
    const phoneNumber = "51988496839";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-500 group">
      <div className="flex flex-col h-[430px] p-8 rounded-2xl shadow-2xl">
        {/* Icono */}
        <div className="h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <div className="text-red-600 transition-transform duration-700 ease-out group-hover:scale-110">
            <div className="w-16 h-16 flex items-center justify-center">
              <service.icon className="w-10 h-10" />
            </div>
          </div>
        </div>
        {/* Contenido */}
        <div className="flex flex-col flex-1 px-3 py-2">
          <div>
            <h3 className="text-[15px] md:text-[16px] font-bold text-gray-900 leading-tight line-clamp-2 mb-2">
              {service.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-snug line-clamp-3 mb-3">
              {service.description}
            </p>
          </div>
          <div className="flex-1 flex flex-col">
            <ul className="space-y-1 text-xs md:text-sm text-gray-600 max-h-28 overflow-hidden">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="mt-3 w-full bg-white border border-red-600 text-red-600 py-2 px-4 rounded text-xs md:text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Services (lista) =================
const Services = ({ limit }) => {
  const services = [
    {
      title: "Análisis con IA",
      icon: Brain,
      description:
        "Utilizamos algoritmos avanzados de inteligencia artificial para proporcionar análisis precisos y detallados de fibras animales.",
      features: [
        "Machine Learning",
        "Procesamiento de imágenes",
        "Análisis predictivo",
        "Reportes automáticos",
      ],
    },
    {
      title: "Proyectos Personalizados",
      icon: Settings,
      description:
        "Desarrollamos soluciones tecnológicas a medida para necesidades específicas de análisis y caracterización de fibras.",
      features: [
        "Integración de sistemas",
        "Soporte técnico",
        "Mantenimiento especializado",
      ],
    },
    {
      title: "Capacitación Técnica",
      icon: BookOpen,
      description:
        "Programas de formación especializados para el manejo de equipos y comprensión de análisis de fibras animales.",
      features: [
        "Cursos presenciales",
        "Capacitación online",
        "Certificación técnica",
        "Material didáctico",
      ],
    },
    {
      title: "Asesorías Especializadas",
      icon: Users,
      description:
        "Consultoría experta para optimización de procesos, interpretación de resultados y mejora de calidad.",
      features: [
        "Consultoría técnica",
        "Optimización de procesos",
        "Interpretación de datos",
        "Mejores prácticas",
      ],
    },
    {
      title: "Análisis de Laboratorio",
      icon: BarChart3,
      description:
        "Servicios completos de análisis de fibras en nuestro laboratorio certificado con tecnología de punta.",
      features: [
        "Análisis completo",
        "Certificación de calidad",
        "Reportes técnicos",
        "Muestras de referencia",
      ],
    },
    {
      title: "I+D Colaborativo",
      icon: Lightbulb,
      description:
        "Proyectos de investigación y desarrollo en colaboración con universidades e instituciones especializadas.",
      features: [
        "Investigación aplicada",
        "Desarrollo conjunto",
        "Publicaciones científicas",
        "Transferencia tecnológica",
      ],
    },
  ];

  const benefits = [
    "Más de 15 años de experiencia en el sector",
    "Tecnología patentada internacionalmente",
    "Respaldo académico y científico",
    "Soporte técnico personalizado",
    "Resultados validados científicamente",
    "Alcance internacional en más de 15 países",
  ];

  const displayed = limit ? services.slice(0, limit) : services;

  return (
    <section id="servicios" className="py-8 bg-gray-50 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-3 tracking-tight">
            Nuestros <span className="text-red-600">Servicios</span>
          </h2>
          <p className="text-center text-[15px] text-gray-600 max-w-4xl mx-auto leading-snug">
            Ofrecemos soluciones integrales que van más allá de la venta de
            equipos, brindando acompañamiento completo en cada proyecto
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {displayed.map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
          {!limit && (
            <>
              <div className="mt-14 bg-white rounded-3xl border border-gray-100 shadow-3xl py-8 px-12">
                <h3 className="text-2xl font-bold text-center mb-6">
                  ¿Por qué elegir Fiberstech?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start text-md text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 mt-2"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(
                      "Hola, me interesa solicitar una consulta sobre sus servicios."
                    );
                    const phoneNumber = "51988496839";
                    window.open(
                      `https://wa.me/${phoneNumber}?text=${message}`,
                      "_blank"
                    );
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Consultar Sobre Servicios
                </button>
              </div>
            </>
          )}
          {limit && (
            <div className="text-center mt-10">
              <a
                href="/servicios"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todos los Servicios
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
