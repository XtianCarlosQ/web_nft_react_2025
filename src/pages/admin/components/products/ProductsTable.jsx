import React, { useMemo } from "react";
import { Eye, Pencil, Archive, RotateCcw, Columns } from "lucide-react";
import { useResponsiveColumns } from "../common/useResponsiveColumns";
import "../common/admin-table.css";

export default function ProductsTable({
  products,
  onView,
  onEdit,
  onArchiveToggle,
}) {
  // Definición de columnas con prioridades
  const columns = useMemo(
    () => [
      { key: "id", label: "ID", priority: "always" },
      { key: "order", label: "Orden", priority: "always" },
      { key: "image", label: "Imagen", priority: "always" },
      { key: "name", label: "Nombre", priority: "always" },
      {
        key: "category",
        label: "Categoría",
        priority: "optional",
        optionalOrder: 1,
      },
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
            {products.map((p) => (
              <tr key={p.id} className="row hoverable">
                {/* ID */}
                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("id") ? "column-hidden" : ""
                  }`}
                  title={p.id}
                  style={{ width: columnWidths.id || "auto" }}
                >
                  {p.id}
                </td>

                {/* Orden */}
                <td
                  className={`td cell-sep text-center ${
                    !isColumnVisible("order") ? "column-hidden" : ""
                  }`}
                  style={{ width: columnWidths.order || "auto" }}
                >
                  {p.archived ? "-" : p.order ?? "-"}
                </td>

                {/* Imagen */}
                <td
                  className={`td cell-sep text-center ${
                    !isColumnVisible("image") ? "column-hidden" : ""
                  }`}
                  style={{ width: columnWidths.image || "auto" }}
                >
                  <div className="flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name?.es || "Producto"}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                </td>

                {/* Nombre */}
                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("name") ? "column-hidden" : ""
                  }`}
                  title={p.name?.es}
                  style={{ width: columnWidths.name || "auto" }}
                >
                  {p.name?.es}
                </td>

                {/* Categoría (opcional) */}
                <td
                  className={`td cell-sep whitespace-nowrap truncate ${
                    !isColumnVisible("category") ? "column-hidden" : ""
                  }`}
                  title={
                    typeof p.category === "string"
                      ? p.category
                      : p.category?.es || "-"
                  }
                  style={{ width: columnWidths.category || "auto" }}
                >
                  {typeof p.category === "string"
                    ? p.category
                    : p.category?.es || "-"}
                </td>

                {/* Estado */}
                <td
                  className={`td cell-sep text-center ${getStickyClass(
                    "status"
                  )} ${!isColumnVisible("status") ? "column-hidden" : ""}`}
                  style={{ width: columnWidths.status || "auto" }}
                >
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block whitespace-nowrap ${
                      p.archived
                        ? "bg-yellow-500/15 text-yellow-300"
                        : "bg-green-500/15 text-green-300"
                    }`}
                  >
                    {p.archived ? "Archivado" : "Activo"}
                  </span>
                </td>

                {/* Acciones */}
                <td
                  className={`td cell-sep text-center ${getStickyClass(
                    "actions"
                  )} ${!isColumnVisible("actions") ? "column-hidden" : ""}`}
                  style={{ width: columnWidths.actions || "auto" }}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      className="icon-btn icon-view"
                      onClick={() => onView(p)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="icon-btn icon-edit"
                      onClick={() => onEdit(p)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className={`icon-btn ${
                        p.archived ? "icon-restore" : "icon-archive"
                      }`}
                      onClick={() => onArchiveToggle(p)}
                      title={p.archived ? "Restaurar" : "Archivar"}
                    >
                      {p.archived ? (
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
