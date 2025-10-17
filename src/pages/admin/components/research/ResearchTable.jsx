import React, { useMemo } from "react";
import { Eye, Pencil, Archive, RotateCcw, Columns } from "lucide-react";
import { useResponsiveColumns } from "../common/useResponsiveColumns";
import "../common/admin-table.css";

export default function ResearchTable({
  research,
  onView,
  onEdit,
  onArchiveToggle,
}) {
  // Asegurar que research es un array
  const articles = Array.isArray(research) ? research : [];
  // Definición de columnas con prioridades
  const columns = useMemo(
    () => [
      { key: "id", label: "ID", priority: "always" },
      { key: "order", label: "Orden", priority: "always" },
      { key: "image", label: "Imagen", priority: "always" },
      { key: "title", label: "Título", priority: "always" },
      {
        key: "journal",
        label: "Revista",
        priority: "optional",
        optionalOrder: 1,
      },
      { key: "date", label: "Fecha", priority: "optional", optionalOrder: 2 },
      { key: "status", label: "Estado", priority: "always" },
      { key: "actions", label: "Acciones", priority: "always" },
    ],
    []
  );

  const {
    visibleColumns,
    hiddenColumns,
    showAllColumns,
    toggleShowAll,
    containerRef,
    tableRef,
    getHeaderRef,
    isMobile,
    columnWidths,
    startResize,
    autoFitColumn,
  } = useResponsiveColumns(columns, 480);

  const isColumnVisible = (key) => {
    // Columnas sticky siempre visibles
    if (key === "status" || key === "actions") return true;
    return visibleColumns.some((col) => col.key === key);
  };

  const isSticky = (key) => key === "status" || key === "actions";

  const getStickyClass = (key) => {
    if (!isSticky(key) || isMobile || showAllColumns) return "";
    if (key === "actions") return "sticky-column sticky-column-actions";
    if (key === "status") return "sticky-column sticky-column-status";
    return "";
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`admin-table rounded-xl ${
          isMobile || showAllColumns ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
      >
        <table ref={tableRef} className="text-sm">
          <thead>
            <tr className="text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  ref={getHeaderRef(col.key)}
                  className={`th cell-sep ${getStickyClass(col.key)} ${
                    !isColumnVisible(col.key) ? "column-hidden" : ""
                  }`}
                  style={{
                    zIndex: isSticky(col.key) ? 4 : 1,
                    width: columnWidths[col.key] || "auto",
                  }}
                >
                  <div className="relative pr-2 select-none whitespace-nowrap">
                    {col.label}
                    {col.key !== "actions" && (
                      <div
                        className="col-resizer"
                        onMouseDown={(e) => startResize(col.key, e)}
                        onDoubleClick={() => autoFitColumn(col.key)}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr
                key={article.slug || `article-${index}`}
                className="row hoverable"
              >
                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("id") ? "column-hidden" : ""
                  }`}
                  title={article.slug}
                  style={{ width: columnWidths.id || "auto" }}
                >
                  {article.slug}
                </td>

                <td
                  className={`td cell-sep text-center ${
                    !isColumnVisible("order") ? "column-hidden" : ""
                  }`}
                  style={{ width: columnWidths.order || "auto" }}
                >
                  {article.archived ? "-" : article.order ?? "-"}
                </td>

                <td
                  className={`td cell-sep text-center ${
                    !isColumnVisible("image") ? "column-hidden" : ""
                  }`}
                  style={{ width: columnWidths.image || "auto" }}
                >
                  <div className="flex items-center justify-center">
                    {article.localImage ? (
                      <img
                        src={article.localImage}
                        alt={article.title?.es || "Artículo"}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                </td>

                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("title") ? "column-hidden" : ""
                  }`}
                  title={
                    typeof article.title === "string"
                      ? article.title
                      : article.title?.es || article.title?.en || ""
                  }
                  style={{ width: columnWidths.title || "auto" }}
                >
                  {typeof article.title === "string"
                    ? article.title
                    : article.title?.es || article.title?.en || "Sin título"}
                </td>

                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("journal") ? "column-hidden" : ""
                  }`}
                  title={article.journal}
                  style={{ width: columnWidths.journal || "auto" }}
                >
                  {article.journal}
                </td>

                <td
                  className={`td cell-sep whitespace-nowrap ${
                    !isColumnVisible("date") ? "column-hidden" : ""
                  }`}
                  style={{ width: columnWidths.date || "auto" }}
                >
                  {formatDate(article.date)}
                </td>

                <td
                  className={`td cell-sep text-center ${getStickyClass(
                    "status"
                  )} ${!isColumnVisible("status") ? "column-hidden" : ""}`}
                  style={{ width: columnWidths.status || "auto" }}
                >
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block whitespace-nowrap ${
                      article.archived
                        ? "bg-yellow-500/15 text-yellow-300"
                        : "bg-green-500/15 text-green-300"
                    }`}
                  >
                    {article.archived ? "Archivado" : "Activo"}
                  </span>
                </td>

                <td
                  className={`td cell-sep text-center ${getStickyClass(
                    "actions"
                  )} ${!isColumnVisible("actions") ? "column-hidden" : ""}`}
                  style={{ width: columnWidths.actions || "auto" }}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      className="icon-btn icon-view"
                      onClick={() => onView(article)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="icon-btn icon-edit"
                      onClick={() => onEdit(article)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className={`icon-btn ${
                        article.archived ? "icon-restore" : "icon-archive"
                      }`}
                      onClick={() => onArchiveToggle(article)}
                      title={article.archived ? "Restaurar" : "Archivar"}
                    >
                      {article.archived ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón flotante para mostrar columnas ocultas */}
      {!isMobile && hiddenColumns.length > 0 && (
        <button className="show-columns-btn" onClick={toggleShowAll}>
          <Columns className="w-5 h-5" />
          <span>
            {showAllColumns ? "Ocultar Columnas" : "Mostrar Columnas Ocultas"}
          </span>
          {!showAllColumns && (
            <span className="hidden-columns-badge">{hiddenColumns.length}</span>
          )}
        </button>
      )}
    </>
  );
}
