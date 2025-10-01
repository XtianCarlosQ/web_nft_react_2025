import React, { useState } from "react";

const TeamMemberCard = ({ member }) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-900 hover:shadow-xl w-full max-w-[300px] sm:max-w-[360px] mx-auto">
      {/* Imagen del miembro */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
        <img
          src={member.image || "/assets/images/team/placeholder.jpg"}
          alt={member.name}
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay con skills */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-400/70 via-red-900/50 to-red-900/30 translate-y-full transition-transform duration-800 ease-out group-hover:translate-y-0 flex flex-col justify-center px-6 text-white/95 backdrop-blur-[2px] rounded-2xl ring-1 ring-white/10">
          <h4 className="text-lg font-semibold mb-2">Especialidades:</h4>
          <ul className="space-y-2">
            {member.skills.map((skill, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
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
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Información del miembro: Nombre-Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/40 backdrop-blur-sm rounded-b-2xl">
        <h3 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900">
          {member.name}
        </h3>
        <p className="text-xs md:text-lg lg:text-xl text-red-600 font-medium">
          {member.position}
        </p>
      </div>
    </div>
  );
};

const Team = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reduciendo la cantidad de miembros mostrados en la landing
  const teamMembers = [
    {
      name: "Edgar Quispe Peña",
      position: "CEO",
      image: "/assets/images/team/edgar-quispe-2.jpg",
      skills: [
        "PhD, Ingeniero Zootecnista",
        "Inventor e investigador RENACYT (Categoría Carlos Monge - Nivel II)",
        "Experto en mejoramiento genético",
        "Consultor y docente internacional",
      ],
    },
    {
      name: "Max Quispe Bonilla",
      position: "CTO",
      image: "/assets/images/team/max-quispe.jpg",
      skills: [
        "PhD (c), Ing. Electrónico",
        "Inventor",
        "Experto en instrumentación electrónica",
        "Especialista en automatización",
      ],
    },
    {
      name: "Christian Quispe Bonilla",
      position: "AI Specialist",
      image: "/assets/images/team/carlos-quispe3.png",
      skills: [
        "Ingeniero Físico",
        "Especialista en IA",
        "Arquitecto y desarrollador de software",
        "Automatización de procesos",
      ],
    },
    {
      name: "Henry Chico",
      position: "CRO",
      image: "/assets/images/team/henry-chico.jpg",
      skills: [
        "Magister en Agronegocios",
        "Experto en desarrollo de negocios",
        "Gestión de operaciones",
        "Desarrollo comercial",
      ],
    },
    {
      name: "Adolfo Poma",
      position: "Technical Specialist",
      image: "/assets/images/team/adolfo-poma.jpg",
      skills: [
        "Ingeniero Zootecnista",
        "Investigador RENACYT",
        "Análisis de fibras",
        "Consultor técnico",
      ],
    },
    {
      name: "Tania Rodriguez",
      position: "Secretaria",
      image: "/assets/images/team/tania-rodriguez.jpg",
      skills: [
        "Secretaria administrativa",
        "Bilingüe Español-Inglés",
        "Licitaciones y contratos",
        "Atención al cliente",
      ],
    },
  ];

  const pageSize = 3;
  const pages = Array.from(
    { length: Math.ceil(teamMembers.length / pageSize) },
    (_, i) => teamMembers.slice(i * pageSize, i * pageSize + pageSize)
  );
  const totalSlides = pages.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section
      id="nosotros"
      className="py-10 my-10 bg-gray-50 rounded-3xl shadow-lg overflow-x-hidden"
    >
      <div className="container-app">
        <div className="grid grid-cols-12 gap-4 md:gap-8 w-full max-w-full box-border">
          {/* Header */}
          <div className="col-span-12 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Nuestro <span className="text-red-600">Equipo</span>
            </h2>
            <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
              Conoce a Nuestros Colaboradores
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un equipo multidisciplinario de expertos en tecnología,
              investigación y desarrollo
            </p>
          </div>

          {/* Team Members Carousel */}
          <div className="col-span-12 relative w-full max-w-full min-w-0">
            <div className="overflow-hidden rounded-3xl w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out w-full max-w-full min-w-0"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {pages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="w-full max-w-full min-w-0 flex-shrink-0"
                  >
                    <div className="flex flex-col items-center w-full max-w-full min-w-0 box-border gap-4 sm:gap-6 md:grid md:grid-cols-3 md:justify-items-center">
                      {page.map((member) => (
                        <TeamMemberCard key={member.name} member={member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors group"
              disabled={currentSlide === 0}
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors group"
              disabled={currentSlide === totalSlides - 1}
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide
                      ? "bg-red-600"
                      : "bg-gray-300 hover:bg-red-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
