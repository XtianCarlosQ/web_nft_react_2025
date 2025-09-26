import React from "react";
import concytecPdf from "../../assets/images/About/Resolución-CONCYTEC.pdf";
import Team from "./Team";
import {
  Users,
  Target,
  Eye,
  ShieldCheck,
  CalendarPlus2,
  BookOpenCheck,
  Globe,
} from "lucide-react";

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex flex-col items-center text-center">
      <div className="text-red-600 mb-4">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  </div>
);

// Sección reutilizable: Hero (varía estilos según resume)
const SectionHero = ({ resume }) => (
  <div
    className={`grid-ctx ${
      resume ? "min-h-[360px] mb-[50px]" : "min-h-[220px] mb-[40px]"
    } items-stretch`}
  >
    <div
      className={`span-12 rounded-2xl shadow-lg ${
        resume ? "bg-gray-50" : "bg-white p-8"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
        {/* Texto */}
        <div
          className={`w-full flex flex-col justify-center ${
            resume ? "text-center md:text-left md:pl-8" : ""
          }`}
        >
          <h3 className="text-2xl font-bold text-gray-900">Nosotros</h3>
          <h3 className="text-3xl lg:text-3xl font-bold text-red-600 mb-6">
            FIBERSTECH
          </h3>
          <p className="text-gray-700 text-sm text-justify leading-relaxed">
            Somos un <strong>Centro de Investigación y Desarrollo (I+D)</strong>{" "}
            autorizado por CONCYTEC. Desarrollamos y comercializamos equipos
            electrónicos para evaluar fibras animales y textiles —clave para el
            mejoramiento genético—, y brindamos servicios de investigación.
            Nuestros equipos, presentes en laboratorios de diversas
            instituciones, destacan por su precisión y calidad.
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
          </div>
        </div>
        {/* Video */}
        <div className="w-full">
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl">
            {/* 16:9 aspect ratio */}
            <div className="pt-[60%]"></div>
            <iframe
              className="absolute inset-0 w-full h-full"
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
);

// Sección reutilizable: Stats
const SectionStats = ({ stats }) => (
  <div className="grid-ctx mb-[40px]">
    <div className="span-12">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Nuestros Números
      </h3>
    </div>
    <div className="span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  </div>
);

// Sección reutilizable: Qué nos hace únicos
const SectionUnique = () => (
  <div className="grid-ctx mb-[50px]">
    <div className="span-12">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
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
          Desarrollamos tecnología de punta aplicando IA y automatización para
          revolucionar el análisis de fibras.
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
          Resultados validados científicamente con correlaciones superiores al
          96% de precisión.
        </p>
      </div>
    </div>
  </div>
);

// Tarjeta para principios
const PrincipleCard = ({ icon: Icon, title, text }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="text-red-600 mb-3">
      <Icon className="w-8 h-8" />
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
  </div>
);

// Sección Historia
const SectionHistory = () => (
  <div className="grid-ctx mb-[40px]">
    <div className="span-12 bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Nuestra Historia
      </h3>
      <div className="prose max-w-none text-gray-700">
        <p>
          NFT son las siglas de <strong>Natural Fiber’s Tech</strong>, empresa
          peruana de base tecnológica fundada en 2016. Nacimos para responder a
          la necesidad del sector académico y la industria textil por
          instrumentos que caractericen fibras de origen animal.
        </p>
        <br />
        <p>
          En 2015, <strong>Edgar Quispe</strong> propone a su hijo Max
          desarrollar un equipo capaz de medir la calidad de la fibra. Con una
          fuerte sinergia en electrónica y procesamiento de imágenes,
          desarrollamos nuestro primer invento: el{" "}
          <strong>caracterizador de fibras FIBER‑EC</strong>.
        </p>
        <br />
        <p>
          Gracias al co-financiamiento de <strong>CONCYTEC</strong> fortalecimos
          la idea de negocio, evolucionamos prototipos, participamos en eventos
          académicos y ferias de innovación, y obtuvimos reconocimientos y
          premios nacionales.
        </p>
        <br />
        <p>
          Hoy contamos con <strong>múltiples innovaciones tecnológicas</strong>,
          patentes nacionales e internacionales y un equipo altamente calificado
          entre ingenieros, investigadores y tesistas. Nuestras alianzas
          estratégicas han permitido que nuestros equipos estén presentes en
          laboratorios de diversas instituciones, generando valor con su
          precisión, exactitud y calidad.
        </p>
      </div>
    </div>
  </div>
);

// Sección Principios
const SectionPrinciples = ({ principles }) => (
  <div className="grid-ctx mb-[40px]">
    <div className="span-12">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Misión, Visión y Valores
      </h3>
    </div>
    <div className="span-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {principles.map((p, i) => (
        <PrincipleCard key={i} {...p} />
      ))}
    </div>
  </div>
);

// Sección CTA (varía según resume)
const SectionCTA = ({ resume }) => (
  <div className="grid-ctx">
    <div className="span-12 text-center">
      <div className="bg-gray-0 pb-12">
        {resume ? (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para conocer más sobre nuestra tecnología?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubre cómo nuestros equipos pueden revolucionar tu análisis de
              fibras con la más alta precisión y tecnología de vanguardia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/nosotros"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Más Sobre Nosotros
              </a>
              <a
                href="#contacto"
                className="bg-white hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                Contactanos
              </a>
            </div>
          </>
        ) : (
          <button
            onClick={() => {
              const message = encodeURIComponent(
                "Hola, me interesa conocer más sobre la empresa y sus soluciones."
              );
              const phoneNumber = "51988496839";
              window.open(
                `https://wa.me/${phoneNumber}?text=${message}`,
                "_blank"
              );
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold mt-8 py-3 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Hablar con un asesor
          </button>
        )}
      </div>
    </div>
  </div>
);

const About = ({ resume = false }) => {
  // Stats unificados (siempre 4) usando íconos de lucide-react
  const stats = [
    {
      icon: <CalendarPlus2 className="w-10 h-10" />,
      value: "2016",
      label: "Año de Fundación",
    },
    {
      icon: <Globe className="w-10 h-10" />,
      value: "15+",
      label: "Países Atendidos",
    },
    {
      icon: <Users className="w-10 h-10" />,
      value: "630K+",
      label: "Fibras Analizadas",
    },
    {
      icon: <BookOpenCheck className="w-10 h-10" />,
      value: "7+",
      label: "Innovaciones y patentes",
    },
  ];

  const principles = [
    {
      icon: Target,
      title: "Misión",
      text: "Desarrollar tecnología de precisión para evaluar la calidad de fibras de origen animal y generar valor para el sector académico e industrial.",
    },
    {
      icon: Eye,
      title: "Visión",
      text: "Ser referente internacional en innovación para el análisis de fibras, impulsando ciencia aplicada desde Latinoamérica al mundo.",
    },
    {
      icon: ShieldCheck,
      title: "Valores",
      text: "Integridad, innovación, colaboración y enfoque en impacto: guiamos nuestras decisiones para entregar calidad y confianza.",
    },
  ];

  return (
    <section
      id="nosotros"
      className="bg-gray-50 rounded-2xl shadow-lg pt-[50px]"
    >
      <div className="container-app">
        <SectionHero resume={resume} />
        <SectionStats stats={stats} />
        <SectionUnique />
        {!resume && (
          <>
            <SectionHistory />
            <SectionPrinciples principles={principles} />
            <Team />
          </>
        )}
        <SectionCTA resume={resume} />
      </div>
    </section>
  );
};

export default About;
