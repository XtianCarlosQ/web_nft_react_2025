import { useLanguage } from "../../context/LanguageContext";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  CircleAlert,
} from "lucide-react";

const PHONE_NUMBER = "51988496839"; // usado en otras partes del sitio

const InvestigacionDetail = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doiUrl, setDoiUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/assets/images/investigacion/posts.json");
        const data = await res.json();
        setArticles(data);
      } catch (e) {
        console.error("Error cargando posts.json", e);
        setError("No se pudo cargar la base de publicaciones.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const article = useMemo(
    () => articles.find((a) => a.slug === slug),
    [articles, slug]
  );

  // Intentar resolver DOI/PDF: 1) JSON; 2) scrape básico del HTML de href buscando doi.org; 3) fallback a WhatsApp
  useEffect(() => {
    if (!article) return;

    const initialDoi = article.download_link_DOI?.trim();
    const initialPdf = article.download_link_pdf?.trim();
    if (initialDoi) setDoiUrl(initialDoi);
    if (initialPdf) setPdfUrl(initialPdf);

    // Scrape en runtime si falta DOI. Puede fallar por CORS en cuyo caso ignoramos.
    const tryScrape = async () => {
      if (initialDoi || !article.href) return;
      try {
        const resp = await fetch(article.href, { mode: "cors" });
        const html = await resp.text();
        // Buscar patrón de DOI típico
        const doiMatch = html.match(/https?:\/\/doi\.org\/[\w\/.\-()]+/i);
        if (doiMatch) {
          setDoiUrl(doiMatch[0]);
        }
        // Buscar PDF absoluto si existiera
        const pdfMatch = html.match(/href=\"([^\"]+\.pdf)\"/i);
        if (pdfMatch && !initialPdf) {
          // Resolver relativo si corresponde
          const url = new URL(pdfMatch[1], article.href);
          setPdfUrl(url.toString());
        }
      } catch (e) {
        console.warn("Scrape saltado por CORS o error de red", e);
      }
    };
    tryScrape();
  }, [article]);

  const openPublication = () => {
    if (doiUrl) {
      window.open(doiUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // Fallback a WhatsApp si no hay DOI
    const text = encodeURIComponent(
      t("researchDetail.waFallback", {
        title: article?.title ?? "(sin título)",
      })
    );
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, "_blank");
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(
        language === "en" ? "en-US" : "es-ES",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-app py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <CircleAlert className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">
            {t("researchDetail.notFound")}
          </h2>
          <Link to="/investigacion" className="text-red-600 hover:underline">
            {t("research.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      {/* Card principal */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Imagen */}
        <div className="bg-gray-50 ring-1 ring-gray-200 aspect-[16/9] flex items-center justify-center">
          {article.localImage ? (
            <img
              src={article.localImage}
              alt={article.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <BookOpen className="h-12 w-12 text-red-300" />
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8">
          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {formatDate(article.date)}
            </span>
            <span className="bg-red-100 text-red-800 font-semibold px-2 py-1 rounded-full">
              {article.journal}
            </span>
          </div>

          {/* Keywords como subtítulo */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-4 text-gray-600">
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                {t("researchDetail.keywords")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-xs inline-flex items-center h-6 px-2 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Abstract completo */}
          <div className="mt-5">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              {t("researchDetail.abstract")}
            </h2>
            <p className="text-gray-700 text-sm text-justify leading-relaxed">
              {article.abstract}
            </p>
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={openPublication}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <ExternalLink className="h-4 w-4" />{" "}
              {t("researchDetail.openPublication")}
            </button>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                <FileText className="h-4 w-4" /> {t("researchDetail.pdf")}
              </a>
            )}
          </div>

          {/* Cita (APA/MLA) */}
          <CitationBlock article={article} doiUrl={doiUrl} />
        </div>
      </div>
    </div>
  );
};

// Bloque de cita con botón copiar
const CitationBlock = ({ article, doiUrl }) => {
  const { t } = useLanguage();
  const [style, setStyle] = useState("APA");
  const authorsRaw = article.author || article.autor || article.authors; // soporta futuras claves

  const authorsList = useMemo(() => {
    if (!authorsRaw) return [];
    if (Array.isArray(authorsRaw)) return authorsRaw;
    // separar por ; o , si es string
    return String(authorsRaw)
      .split(/;|\|/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [authorsRaw]);

  const parts = useMemo(() => {
    const d = new Date(article.date);
    const monthsEs = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return {
      year: isNaN(d) ? "" : String(d.getFullYear()),
      day: isNaN(d) ? "" : String(d.getDate()),
      monthName: isNaN(d) ? "" : monthsEs[d.getMonth()],
    };
  }, [article.date]);

  const formatAuthorAPA = (name) => {
    // "Nombre Apellido" -> "Apellido, N."
    const parts = name.split(/\s+/);
    if (parts.length === 1) return name;
    const last = parts.pop();
    const initials = parts
      .map((p) => (p ? p[0].toUpperCase() + "." : ""))
      .join(" ");
    return `${last}, ${initials}`.trim();
  };

  const authorsAPA = authorsList.length
    ? authorsList.map(formatAuthorAPA).join(", ")
    : "Autores no disponibles";

  const authorsMLA = authorsList.length
    ? authorsList.join(", ")
    : "Autores no disponibles";

  const apa = `${authorsAPA} (${parts.year}). ${article.title}. ${
    article.journal
  }. ${doiUrl || article.href || ""}`.trim();
  const mla = `${authorsMLA}. "${article.title}." ${article.journal}, ${
    parts.day
  } ${parts.monthName} ${parts.year}. ${doiUrl || article.href || ""}`.trim();

  const text = style === "APA" ? apa : mla;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.warn("No se pudo copiar al portapapeles", e);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center text-sm justify-between mt-24 mb-8">
        <h3 className="text-base font-semibold text-gray-900">
          {t("researchDetail.citation")}
        </h3>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">
            {t("researchDetail.format")}{" "}
          </h2>
          <button
            className={`px-3 py-1 rounded border ${
              style === "APA"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setStyle("APA")}
          >
            APA
          </button>
          <button
            className={`px-3 py-1 rounded border ${
              style === "MLA"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setStyle("MLA")}
          >
            MLA
          </button>
          <button
            onClick={copy}
            className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            title={t("researchDetail.copy")}
          >
            {t("researchDetail.copy")}
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
      {!authorsRaw && (
        <p className="mt-2 text-xs text-gray-500">
          {t("researchDetail.authorsMissing")}
        </p>
      )}
    </div>
  );
};

export default InvestigacionDetail;
