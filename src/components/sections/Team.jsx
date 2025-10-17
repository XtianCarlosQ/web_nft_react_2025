import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { messages } from "../../config/i18n"; // ✅ Importar messages para admin preview
import {
  normalizeTeamMember,
  normalizeTeamOrder,
  compareByOrder,
} from "../../models/team";
// Eliminado: fallback de equipo en src/data. Fuente única: public/content/team.json

export const TeamMemberCard = ({ member, forceOverlay = false, lang }) => {
  const { t } = useLanguage();

  const image =
    member.image || member.photo || "/assets/images/team/placeholder.jpg";

  // En la web pública, member ya viene normalizado (strings planos)
  // En admin, member tiene estructura {es, en} y lang indica qué idioma mostrar
  let name, position, skills;

  if (lang) {
    // Modo admin: extraer según idioma
    console.log("🔍 Team DEBUG (Admin):", {
      lang,
      member_name: member.name,
      member_role: member.role,
      member_skills: member.skills,
    });

    name =
      typeof member.name === "object"
        ? member.name[lang] || member.name.es || member.name.en || ""
        : member.name || "";

    position =
      typeof member.role === "object"
        ? member.role[lang] || member.role.es || member.role.en || ""
        : member.role || member.position || "";

    // ✅ SEGURIDAD: Garantizar que siempre sean strings
    name = String(name || "");
    position = String(position || "");

    if (
      typeof member.skills === "object" &&
      member.skills !== null &&
      !Array.isArray(member.skills)
    ) {
      skills =
        member.skills[lang] || member.skills.es || member.skills.en || [];
    } else if (Array.isArray(member.skills)) {
      skills = member.skills;
    } else {
      skills = [];
    }

    console.log("🔍 Team DEBUG (Admin extracted):", {
      name,
      position,
      skills,
    });
  } else {
    // Modo web pública: datos ya normalizados como strings
    name = member.name || "";
    position = member.role || member.position || "";
    skills = Array.isArray(member.skills) ? member.skills : [];

    // ✅ SEGURIDAD: Garantizar que siempre sean strings (también en modo público)
    name = String(name || "");
    position = String(position || "");

    // DEBUG: Verificar que los datos vienen normalizados
    console.log("🔍 Team DEBUG (Web):", {
      name,
      position,
      skills,
      raw_member: member,
    });
  }

  // ✅ Si lang está provisto (admin preview), usar messages directamente
  // De lo contrario, usar t() del contexto (web pública)
  const specialtiesText = lang
    ? messages[lang]?.team?.specialties ||
      (lang === "es" ? "Especialidades:" : "Specialties:")
    : t("team.specialties");

  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-900 hover:shadow-xl w-full max-w-[300px] sm:max-w-[360px] mx-auto">
      {/* Imagen del miembro */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay con skills */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-red-400/70 via-red-900/50 to-red-900/30 ${
            forceOverlay
              ? "translate-y-0"
              : "translate-y-full group-hover:translate-y-0"
          } transition-transform duration-800 ease-out flex flex-col justify-center px-6 text-white/95 backdrop-blur-[2px] rounded-2xl ring-1 ring-white/10`}
        >
          <h4 className="text-lg font-semibold mb-2">{specialtiesText}</h4>
          <ul className="space-y-2">
            {skills.map((skill, index) => (
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
          {name}
        </h3>
        <p className="text-xs md:text-lg lg:text-xl text-red-600 font-medium">
          {position}
        </p>
      </div>
    </div>
  );
};

const Team = () => {
  const { t, language } = useLanguage(); // ✅ Usar 'language' del contexto
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);

  // DEBUG: Verificar que language cambia
  console.log("🔍 Team - language del contexto:", language);

  // Cargar equipo desde /content/team.json
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/content/team.json", { cache: "no-store" });
        if (!res.ok) throw new Error("no_team_json");
        const data = await res.json();

        if (cancelled) return;

        // Normalizar según idioma actual (como Services)
        const normalized = (Array.isArray(data) ? data : [])
          .map((m) => {
            // Helper para extraer valores bilingües
            const getI18nValue = (field) => {
              if (!field) return "";
              if (typeof field === "string") return field;
              if (typeof field === "object" && !Array.isArray(field)) {
                return field[language] || field.es || field.en || "";
              }
              return "";
            };

            // Helper para extraer arrays bilingües
            const getI18nArray = (field) => {
              if (!field) return [];
              if (Array.isArray(field)) return field; // Legacy: array simple
              if (typeof field === "object") {
                return field[language] || field.es || field.en || [];
              }
              return [];
            };

            return {
              id: m.id || `team-${Math.random().toString(36).slice(2, 8)}`,
              name: getI18nValue(m.name),
              role: getI18nValue(m.role),
              bio: getI18nValue(m.bio),
              photo: m.photo || m.image || "",
              image: m.photo || m.image || "",
              skills: getI18nArray(m.skills),
              order: typeof m.order === "number" ? m.order : 9999,
              archived: !!m.archived,
            };
          })
          .filter((x) => !x.archived)
          .sort(compareByOrder);

        // DEBUG: Ver datos normalizados
        console.log("🔍 Team useEffect - language:", language);
        console.log("🔍 Team normalized (first item):", normalized[0]);

        if (!cancelled) setTeamMembers(normalized);
      } catch {
        if (!cancelled) setTeamMembers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [language]); // ✅ Recargar cuando cambia el idioma

  const pageSize = 3;
  const pages = useMemo(() => {
    const list = Array.isArray(teamMembers) ? teamMembers : [];
    return Array.from({ length: Math.ceil(list.length / pageSize) }, (_, i) =>
      list.slice(i * pageSize, i * pageSize + pageSize)
    );
  }, [teamMembers]);
  const totalSlides = pages.length || 1;

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
              {t("team.title").split(" ")[0]}{" "}
              <span className="text-red-600">
                {t("team.title").split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
              {t("team.subtitle")}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("team.description")}
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
