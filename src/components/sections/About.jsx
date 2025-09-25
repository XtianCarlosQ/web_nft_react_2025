import React from "react";
import concytecPdf from "../../assets/images/About/Resolución-CONCYTEC.pdf";

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex flex-col items-center text-center">
      <div className="text-red-600 mb-4">{icon}</div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  </div>
);

const About = () => {
  const stats = [
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      value: "2016",
      label: "Año de Fundación",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      value: "15+",
      label: "Países Atendidos",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      value: "630K+",
      label: "Fibras Analizadas",
    },
  ];

  return (
    <section
      id="nosotros"
      className="bg-gray-50 rounded-3xl shadow-lg pt-[50px]"
    >
      <div className="container-app">
        {/* Hero Section - Información principal con video */}
        <div className="grid-ctx min-h-[360px] items-stretch mb-[50px]">
          <div className="span-12 bg-gray-50 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-items-center">
              {/* Nosotros */}
              <div className="w-full flex flex-col justify-center text-center md:text-left md:pl-8">
                <h3 className="text-3xl font-bold text-gray-900">Nosotros</h3>
                <h3 className="text-4xl lg:text-5xl font-bold text-red-600 mb-6">
                  FIBERSTECH
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Somos un <strong>CENTRO DE I+D</strong> autorizado por el
                  CONCYTEC, donde diseñamos, construimos y comercializamos
                  equipos y dispositivos electrónicos de la más alta tecnología,
                  así como servicios de investigación y evaluación de fibras
                  textiles.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-12 my-12">
                  <a
                    href={concytecPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 font-semibold underline underline-offset-4 hover:text-green-800 transition-colors"
                  >
                    Ver Resolución de CONCYTEC
                  </a>
                  {/* <a
                    href="#nosotros-completo"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Conócenos Más
                  </a> */}
                </div>
              </div>
              {/* Video institucional */}
              <div className="w-full order-1 md:order-none">
                <div className="w-full h-full min-h-[260px] rounded-xl overflow-hidden shadow-xl">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/HUVLqti1SCY"
                    title="Video corporativo - Natural Fiber's Tech"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas - Grid de 12 columnas */}
        <div className="grid-ctx mb-[50px] ">
          <div className="span-12 ">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
              Nuestros Números
            </h3>
          </div>
          <div className="span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Características principales - Grid de 12 columnas */}
        <div className="grid-ctx mb-[50px]">
          <div className="span-12">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
              ¿Qué nos hace únicos?
            </h3>
          </div>

          <div className="span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Innovación */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-red-600 mb-4 flex justify-center">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Innovación Constante
              </h3>
              <p className="text-gray-600">
                Desarrollamos tecnología de punta aplicando IA y automatización
                para revolucionar el análisis de fibras.
              </p>
            </div>

            {/* Precisión */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-red-600 mb-4 flex justify-center">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Precisión Científica
              </h3>
              <p className="text-gray-600">
                Resultados validados científicamente con correlaciones
                superiores al 96% de precisión.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action final */}
        <div className="grid-ctx">
          <div className="span-12 text-center">
            <div className="bg-gray-0 pb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Listo para conocer más sobre nuestra tecnología?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Descubre cómo nuestros equipos pueden revolucionar tu análisis
                de fibras con la más alta precisión y tecnología de vanguardia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#nosotros-completo"
                  className="bg-red-600 hover:bg-red-700 text-white 
                           font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Más Sobre Nosotros
                </a>
                <a
                  href="#contacto"
                  className="bg-white hover:bg-red-600 text-red-600 hover:text-white 
                           border-2 border-red-600 font-semibold py-3 px-8 rounded-lg 
                           transition-all duration-300"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
