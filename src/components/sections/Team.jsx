import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  normalizeTeamMember,
  normalizeTeamOrder,
  compareByOrder,
} from "../../models/team";
import { teamFallback } from "../../data/team-fallback";

export const TeamMemberCard = ({ member, forceOverlay = false }) => {
  const image =
    member.image || member.photo || "/assets/images/team/placeholder.jpg";
  const name =
    typeof member.name === "object"
      ? member.name.es || member.name.en || ""
      : member.name;
  const positionRaw = member.position || member.role || "";
  const position =
    typeof positionRaw === "object"
      ? positionRaw.es || positionRaw.en || ""
      : positionRaw;
  const skills = Array.isArray(member.skills) ? member.skills : [];
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-900 hover:shadow-xl w-full max-w-[300px] sm:max-w-[360px] mx-auto">
      {/* Imagen del miembro */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={member.name}
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
          <h4 className="text-lg font-semibold mb-2">Especialidades:</h4>
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
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);

  // Fallback estático si no existe team.json
  const fallback = useMemo(() => {
    const norm = normalizeTeamOrder(teamFallback.map(normalizeTeamMember));
    return norm
      .filter((x) => !x.archived)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, []);

  // Cargar equipo desde /content/team.json
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/content/team.json", { cache: "no-store" });
        if (!res.ok) throw new Error("no_team_json");
        const data = await res.json();
        const norm = Array.isArray(data)
          ? normalizeTeamOrder(data.map(normalizeTeamMember))
          : [];
        if (!cancelled)
          setTeamMembers(norm.filter((x) => !x.archived).sort(compareByOrder));
      } catch {
        if (!cancelled) setTeamMembers(fallback);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
