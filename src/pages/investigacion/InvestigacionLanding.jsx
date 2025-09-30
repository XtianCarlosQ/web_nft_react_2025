import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  BookOpen,
  Award,
  Download,
  ExternalLink,
  ChevronDown,
  X,
  Settings,
} from "lucide-react";

const InvestigacionLanding = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar datos del JSON
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch("/assets/images/investigacion/posts.json");
        const data = await response.json();
        setArticles(data);
        setFilteredArticles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading articles:", error);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Obtener listas únicas para filtros
  const uniqueJournals = [
    ...new Set(articles.map((article) => article.journal)),
  ];
  const uniqueYears = [
    ...new Set(articles.map((article) => new Date(article.date).getFullYear())),
  ].sort((a, b) => b - a);

  // KPIs para el encabezado
  const publicationsCount = articles.length;
  const journalsCount = new Set(articles.map((a) => a.journal)).size;
  const yearsRange = articles.length
    ? {
        min: Math.min(...articles.map((a) => new Date(a.date).getFullYear())),
        max: Math.max(...articles.map((a) => new Date(a.date).getFullYear())),
      }
    : { min: 0, max: 0 };
  const yearsOfResearch = articles.length
    ? yearsRange.max - yearsRange.min + 1
    : 0;
  const productsCount = 9; // A la fecha, solicitados por el cliente

  // Definir items de KPI para renderizar con map (escalable)
  const kpiItems = [
    {
      id: "pubs",
      Icon: BookOpen,
      value: publicationsCount,
      label: "Publicaciones",
    },
    {
      id: "years",
      Icon: Calendar,
      value: yearsOfResearch,
      label: "Años de Investigación",
    },
    {
      id: "journals",
      Icon: Award,
      value: journalsCount,
      label: "Revistas Científicas",
    },
    {
      id: "products",
      Icon: Settings,
      value: productsCount,
      label: "Productos desarrollados",
    },
  ];

  // Filtrar y ordenar artículos
  useEffect(() => {
    let filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesJournal =
        !selectedJournal || article.journal === selectedJournal;

      const matchesYear =
        !selectedYear ||
        new Date(article.date).getFullYear().toString() === selectedYear;

      return matchesSearch && matchesJournal && matchesYear;
    });

    // Ordenar
    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedJournal, selectedYear, sortBy]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedJournal("");
    setSelectedYear("");
    setSortBy("date-desc");
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando investigaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app pt-8 pb-12">
        {/* Encabezado */}
        <div className="grid-ctx mb-8">
          <div className="span-12 text-center">
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
              Centro de <span className="text-red-600">Investigación</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-lg max-w-4xl mx-auto">
              Descubre nuestro legado científico: {publicationsCount}{" "}
              publicaciones que impulsan la innovación en tecnología de fibras
              textiles
            </p>
          </div>
          {/* KPIs */}
          <div className="span-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {kpiItems.map(({ id, Icon, value, label }) => (
                <div
                  key={id}
                  className="bg-white rounded-2xl shadow-md p-5 h-32 flex flex-col items-center justify-center text-center transition duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="text-red-600/90 flex justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="mt-3 text-3xl font-bold text-gray-900">
                      {value}
                    </div>
                    <div className="text-gray-500 text-sm">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Filtros y Búsqueda */}
        <div className="grid-ctx mb-8">
          <div className="span-12">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Barra de búsqueda */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, abstract o palabras clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Botón de filtros móvil */}
              <div className="flex items-center justify-between mb-4 md:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  Filtros
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {(searchTerm || selectedJournal || selectedYear) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filtros */}
              <div
                className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
                  showFilters ? "block" : "hidden md:grid"
                }`}
              >
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Todas las revistas</option>
                  {uniqueJournals.map((journal) => (
                    <option key={journal} value={journal}>
                      {journal}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Todos los años</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="date-desc">Más recientes</option>
                  <option value="date-asc">Más antiguas</option>
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                </select>

                <div className="hidden md:flex items-center">
                  {(searchTerm || selectedJournal || selectedYear) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredArticles.length} de {articles.length}{" "}
                investigaciones
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Artículos */}
        <div className="grid-ctx">
          <div className="span-12">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron investigaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para cada tarjeta de artículo
const ArticleCard = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  const handleViewDetail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Navegar al detalle del artículo
    console.log("Ver detalle del artículo:", article.slug);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 flex flex-col">
      {/* Imagen - relación 16:9, ring y bordes redondeados */}
      <div className="relative overflow-hidden flex-shrink-0 rounded-t-2xl bg-gray-50 ring-1 ring-gray-200 aspect-[16/9]">
        {!imageError && article.localImage ? (
          <img
            src={article.localImage}
            alt={article.title}
            className="w-full h-full object-contain rounded-t-2xl"
            onError={(e) => {
              console.log("❌ Error cargando imagen:", e.target.src);
              console.log("📂 Ruta del artículo:", article.localImage);
              console.log("🔍 Verificar si existe:", article.localImage);
              setImageError(true);
            }}
            onLoad={() => {
              console.log(
                "✅ Imagen cargada correctamente:",
                article.localImage
              );
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-red-300 mx-auto mb-2" />
              <p className="text-xs text-red-400">Imagen no disponible</p>
              {imageError && (
                <p className="text-xs text-red-500 mt-1">
                  Ruta: {article.localImage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col min-h-0">
        {/* Metadata */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
            {article.journal}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            {formatDate(article.date)}
          </span>
        </div>

        {/* Título */}
        <div className="mb-2 sm:mb-3 flex-shrink-0 min-h-[3.5rem] sm:min-h-[3.75rem] md:min-h-[3.75rem] lg:min-h-[3.75rem] xl:min-h-[3.75rem]">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-3 group-hover:text-red-600 transition-colors leading-tight">
            {article.title}
          </h3>
        </div>

        {/* Resumen */}
        <div className="text-gray-600 text-xs mb-2 sm:mb-3 flex-shrink-0 min-h-[3.75rem] sm:min-h-[3.75rem] md:min-h-[3.75rem] lg:min-h-[3.75rem] xl:min-h-[3.75rem]">
          <p
            className="leading-relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {article.summary_30w}
          </p>
        </div>

        {/* Keywords: fixed 2-row height, chips constant height */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 flex-shrink-0 h-[3.25rem] overflow-hidden content-start">
          {article.keywords && article.keywords.length > 0 && (
            <>
              {article.keywords.slice(0, 6).map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs inline-flex items-center h-6 px-2 rounded whitespace-nowrap"
                >
                  {keyword}
                </span>
              ))}
            </>
          )}
        </div>

        {/* Productos relacionados */}
        <div className="border-t pt-1 sm:pt-2 flex-shrink-0">
          {article.products && article.products.length > 0 ? (
            <>
              <p className="text-xs text-gray-500 mb-1">
                Productos relacionados:
              </p>
              <div className="flex flex-wrap gap-1">
                {article.products.slice(0, 2).map((product, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {product}
                  </span>
                ))}
                {article.products.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{article.products.length - 2} más
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400">
              Sin productos relacionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestigacionLanding;
