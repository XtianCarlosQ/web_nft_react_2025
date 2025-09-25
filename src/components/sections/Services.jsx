import React from "react";

const ServiceCard = ({ title, description, icon, features }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Buen día, estoy interesado en el servicio de ${title}`
    );
    const phoneNumber = "51988496839";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-500 group">
      <div className="flex flex-col h-[500px] p-8">
        {/* Icon Section - Fixed height */}
        <div className="h-40 bg-red-50 rounded-xl flex items-center justify-center mb-6">
          <div className="text-red-600 transform transition-transform duration-700 ease-out group-hover:scale-110">
            <div className="w-16 h-16">{icon}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow">
          {/* Header - Fixed height */}
          <div className="h-32">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Features List - Fixed height */}
          <div className="h-36">
            <ul className="space-y-2">
              {features.map((feature, index) => (
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

          {/* WhatsApp Button - Fixed position at bottom */}
          <div className="mt-auto">
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-white border border-red-600 text-red-600 py-2 px-4 rounded text-sm font-medium hover:bg-red-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              Consultar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Análisis con IA",
      description:
        "Utilizamos algoritmos avanzados de inteligencia artificial para proporcionar análisis precisos y detallados de fibras animales.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      features: [
        "Machine Learning",
        "Procesamiento de imágenes",
        "Análisis predictivo",
        "Reportes automáticos",
        "Desarrollo a medida",
      ],
    },
    {
      title: "Proyectos Personalizados",
      description:
        "Desarrollamos soluciones tecnológicas a medida para necesidades específicas de análisis y caracterización de fibras.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      features: [
        "Integración de sistemas",
        "Soporte técnico",
        "Mantenimiento especializado",
      ],
    },
    {
      title: "Capacitación Técnica",
      description:
        "Programas de formación especializados para el manejo de equipos y comprensión de análisis de fibras animales.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      features: [
        "Cursos presenciales",
        "Capacitación online",
        "Certificación técnica",
        "Material didáctico",
      ],
    },
  ];

  return (
    <section id="servicios" className="py-8 bg-gray-50 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Nuestros <span className="text-red-600">Servicios</span>
          </h2>
          <p className="text-gray-600 text-center text-sm">
            Ofrecemos soluciones integrales que van más allá de la venta de
            equipos, brindando acompañamiento completo en cada proyecto
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="#nosotros-completo"
              className="bg-red-600 hover:bg-red-700 text-white 
                           font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver Todos los Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
