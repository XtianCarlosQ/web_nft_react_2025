import React, { useEffect, useMemo, useState } from "react";
import {
  RenderIcon,
  localIconMap,
  suggestedIconNames,
} from "../common/IconUtils";
import { ServiceCard } from "../../../../components/sections/Services";

export default function ServiceFormModal({
  open,
  mode = "edit", // create | edit | view
  service,
  onClose,
  onSave,
  onRestore,
}) {
  const isView = mode === "view";
  const [activeLang, setActiveLang] = useState("es");
  const [data, setData] = useState(
    () =>
      service || {
        id: "service-" + Math.random().toString(36).slice(2, 8),
        icon: "Brain",
        title: { es: "", en: "" },
        description: { es: "", en: "" },
        features: { es: [""], en: [""] },
        whatsapp: "51988496839",
        order: "",
        archived: false,
      }
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [visibleTooltips, setVisibleTooltips] = useState({});
  const original = useMemo(() => JSON.stringify(service || {}), [service]);

  useEffect(() => {
    if (open) {
      setActiveLang("es");
      setSubmitAttempted(false);
      if (service) {
        setData({
          ...service,
          order: service.archived ? "" : service.order || "",
        });
      } else {
        setData({
          id: "service-" + Math.random().toString(36).slice(2, 8),
          icon: "Brain",
          title: { es: "", en: "" },
          description: { es: "", en: "" },
          features: { es: [""], en: [""] },
          whatsapp: "51988496839",
          order: "",
          archived: false,
        });
      }
    }
  }, [open, service]);

  if (!open) return null;

  const hasChanges =
    JSON.stringify(data) !== (service ? JSON.stringify(service) : original);

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) {
      if (isView || !hasChanges) onClose();
      else setConfirmClose(true);
    }
  }

  function updateLangField(key, val) {
    setData((s) => ({ ...s, [key]: { ...(s[key] || {}), [activeLang]: val } }));
  }

  function updateField(key, val) {
    setData((s) => ({ ...s, [key]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (isView) return onClose();
    const titleEs = (data.title?.es || "").trim();
    const descEs = (data.description?.es || "").trim();
    const featuresEs = (data.features?.es || [])
      .map((x) => (x || "").trim())
      .filter(Boolean);
    const whatsapp = (data.whatsapp || "").trim();
    const orderInvalid = data.order === "" || Number(data.order) < 1;
    const hasMissing =
      !titleEs ||
      !descEs ||
      featuresEs.length === 0 ||
      !whatsapp ||
      orderInvalid;
    if (hasMissing) {
      setSubmitAttempted(true);
      setActiveLang("es");
      const tooltips = {};
      if (!titleEs) tooltips.title = true;
      if (!descEs) tooltips.description = true;
      if (featuresEs.length === 0) tooltips.features = true;
      if (!whatsapp) tooltips.whatsapp = true;
      if (orderInvalid) tooltips.order = true;
      setVisibleTooltips(tooltips);
      setTimeout(() => setVisibleTooltips({}), 1000);
      return;
    }
    const auto = (valEs, valEn) =>
      valEn && valEn !== "" ? valEn : valEs || "";
    const payload = {
      ...data,
      title: {
        es: data.title?.es || "",
        en: auto(data.title?.es, data.title?.en),
      },
      description: {
        es: data.description?.es || "",
        en: auto(data.description?.es, data.description?.en),
      },
      features: {
        es: (data.features?.es || []).filter(Boolean),
        en:
          data.features?.en && data.features.en.length
            ? data.features.en
            : (data.features?.es || []).filter(Boolean),
      },
      order: Number(data.order),
    };
    onSave?.(payload);
    onClose?.();
  }

  const toCardProps = (s, lang) => ({
    icon: s.icon,
    title: s.title?.[lang] || "Título del Servicio",
    description: s.description?.[lang] || "Descripción del servicio",
    features: (s.features?.[lang] || []).filter(Boolean).length
      ? s.features?.[lang]
      : ["Característica de ejemplo"],
    whatsapp: s.whatsapp || "51988496839",
  });

  if (mode === "view") {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-transparent w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-sm mx-auto">
            <ServiceCard service={toCardProps(data, activeLang)} />
          </div>
          <div className="text-center mt-4">
            <button className="px-3 py-2 border rounded" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">
            {mode === "create"
              ? "Crear Servicio"
              : mode === "edit"
              ? "Editar Servicio"
              : "Ver Servicio"}
          </h3>
          <button
            className="text-gray-500"
            onClick={() =>
              isView || !hasChanges ? onClose() : setConfirmClose(true)
            }
          >
            ×
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border ${
                  activeLang === "es"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white"
                }`}
                onClick={() => setActiveLang("es")}
              >
                Español (ES)
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border ${
                  activeLang === "en"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white"
                }`}
                onClick={() => setActiveLang("en")}
              >
                Inglés (EN)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">ID</label>
                <input
                  disabled
                  className="border rounded w-full px-2 py-2 bg-gray-100 text-gray-700"
                  value={data.id}
                />
              </div>
              <div className="relative">
                <label className="block text-xs text-gray-600 mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  min={1}
                  disabled={isView}
                  className={`border rounded w-full px-2 py-2 bg-white ${
                    submitAttempted &&
                    (data.order === "" || Number(data.order) < 1)
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Ingrese el orden"
                  value={data.order}
                  onChange={(e) =>
                    updateField(
                      "order",
                      e.target.value === ""
                        ? ""
                        : Math.max(1, Number(e.target.value) || 1)
                    )
                  }
                />
                {visibleTooltips.order && (
                  <div className="absolute left-0 top-full mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                    Campo Obligatorio
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Icono</label>
              <div className="flex items-center gap-3">
                <div className="flex-grow flex items-center gap-3 bg-gray-50 border rounded p-2">
                  <RenderIcon
                    iconName={data.icon}
                    className="w-6 h-6 text-red-600"
                  />
                  <span className="text-sm text-gray-700 truncate">
                    {data.icon}
                  </span>
                </div>
                {!isView && (
                  <button
                    type="button"
                    className="px-3 py-2 rounded border bg-red-600/10 text-red-700 border-red-300"
                    onClick={() => setShowIconPicker(true)}
                  >
                    Buscar
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">
                Título ({activeLang.toUpperCase()})
              </label>
              <input
                disabled={isView}
                className={`border px-2 py-2 rounded w-full ${
                  submitAttempted &&
                  (data.title?.es || "").trim() === "" &&
                  activeLang === "es"
                    ? "border-red-500"
                    : ""
                }`}
                value={data.title?.[activeLang] || ""}
                onChange={(e) => updateLangField("title", e.target.value)}
              />
              {visibleTooltips.title && activeLang === "es" && (
                <div className="absolute left-0 top-full mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                  Campo Obligatorio
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">
                Descripción ({activeLang.toUpperCase()})
              </label>
              <textarea
                disabled={isView}
                className={`border px-2 py-2 rounded w-full h-24 ${
                  submitAttempted &&
                  activeLang === "es" &&
                  (data.description?.es || "").trim() === ""
                    ? "border-red-500"
                    : ""
                }`}
                value={data.description?.[activeLang] || ""}
                onChange={(e) => updateLangField("description", e.target.value)}
              />
              {visibleTooltips.description && activeLang === "es" && (
                <div className="absolute left-0 top-full mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                  Campo Obligatorio
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">
                Características ({activeLang.toUpperCase()}) — una por línea
              </label>
              <textarea
                disabled={isView}
                className={`border px-2 py-2 rounded w-full h-28 ${
                  submitAttempted &&
                  activeLang === "es" &&
                  (data.features?.es || [])
                    .map((x) => (x || "").trim())
                    .filter(Boolean).length === 0
                    ? "border-red-500"
                    : ""
                }`}
                value={(data.features?.[activeLang] || []).join("\n")}
                onChange={(e) =>
                  updateLangField("features", e.target.value.split("\n"))
                }
              />
              {visibleTooltips.features && activeLang === "es" && (
                <div className="absolute left-0 top-full mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                  Campo Obligatorio
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">
                WhatsApp
              </label>
              <input
                disabled={isView}
                className={`border rounded w-full px-2 py-2 ${
                  submitAttempted && (data.whatsapp || "").trim() === ""
                    ? "border-red-500"
                    : ""
                }`}
                value={data.whatsapp || ""}
                onChange={(e) => updateField("whatsapp", e.target.value)}
              />
              {visibleTooltips.whatsapp && (
                <div className="absolute left-0 top-full mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                  Campo Obligatorio
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {!isView && (
                <button className="btn-cta px-5 py-2" type="submit">
                  Guardar Cambios
                </button>
              )}
              {mode === "edit" && data.archived && (
                <button
                  type="button"
                  className="px-3 py-2 rounded border bg-green-600/10 text-green-700 border-green-300"
                  onClick={() => {
                    const invalid = data.order === "" || Number(data.order) < 1;
                    if (invalid) {
                      setSubmitAttempted(true);
                      setVisibleTooltips({ order: true });
                      setTimeout(() => setVisibleTooltips({}), 1000);
                      return;
                    }
                    onRestore?.({ ...data, order: Number(data.order) });
                    onClose?.();
                  }}
                >
                  Restaurar
                </button>
              )}
              <button
                className="px-3 py-2 border rounded"
                type="button"
                onClick={() =>
                  isView || !hasChanges ? onClose() : setConfirmClose(true)
                }
              >
                {isView ? "Cerrar" : "Cancelar"}
              </button>
            </div>
          </form>

          <div className="hidden md:flex flex-col p-6 items-center justify-start">
            <h4 className="text-sm font-semibold mb-3 text-gray-700">
              Vista previa
            </h4>
            <div className="w-full max-w-sm">
              <ServiceCard service={toCardProps(data, activeLang)} />
            </div>
          </div>
        </div>

        {showIconPicker && (
          <IconPicker
            onSelect={(name) => {
              setData((s) => ({ ...s, icon: name }));
              setShowIconPicker(false);
            }}
            onClose={() => setShowIconPicker(false)}
          />
        )}

        {confirmClose && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setConfirmClose(false)}
          >
            <div
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold mb-2">
                ¿Cerrar sin guardar?
              </h4>
              <p className="text-gray-700 mb-4">
                Se perderán los cambios no guardados.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-2 border rounded"
                  onClick={() => setConfirmClose(false)}
                >
                  Continuar editando
                </button>
                <button
                  className="px-3 py-2 rounded bg-red-600 text-white"
                  onClick={onClose}
                >
                  Cerrar sin guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IconPicker({ onSelect, onClose }) {
  const [tab, setTab] = useState("local");
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term), 400);
    return () => clearTimeout(id);
  }, [term]);

  useEffect(() => {
    let active = true;
    async function search() {
      if (tab !== "web" || debounced.length < 3) return setResults([]);
      setLoading(true);
      try {
        const q = encodeURIComponent(debounced);
        const res = await fetch(`https://api.iconify.design/search?query=${q}`);
        const data = await res.json();
        if (!active) return;
        const items = Array.isArray(data?.icons) ? data.icons : [];
        setResults(items.map((x) => x));
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    search();
    return () => {
      active = false;
    };
  }, [tab, debounced]);

  const localIcons = Object.keys(localIconMap);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/90 rounded-xl p-5 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded border ${
                tab === "local"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white"
              }`}
              onClick={() => setTab("local")}
            >
              Iconos Locales
            </button>
            <button
              className={`px-3 py-1.5 rounded border ${
                tab === "web"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white"
              }`}
              onClick={() => setTab("web")}
            >
              Buscar en la Web
            </button>
          </div>
          <button className="text-gray-500" onClick={onClose}>
            ×
          </button>
        </div>

        {tab === "web" && (
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar icono en inglés (ejm: database, brain)"
            className="w-full border rounded px-3 py-2 mb-3"
          />
        )}

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
          {tab === "local" &&
            (localIcons.length ? localIcons : suggestedIconNames).map(
              (name) => (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className="p-2 rounded hover:bg-red-200 flex flex-col items-center gap-1"
                >
                  <RenderIcon
                    iconName={name}
                    className="w-6 h-6 text-red-600"
                  />
                  <span className="text-[11px] text-gray-600 truncate w-full text-center">
                    {name}
                  </span>
                </button>
              )
            )}
          {tab === "web" &&
            (loading ? (
              <div className="col-span-full text-center text-sm text-gray-600">
                Buscando…
              </div>
            ) : results.length ? (
              results.slice(0, 60).map((full) => (
                <button
                  key={full}
                  onClick={() => onSelect(full)}
                  className="p-2 rounded hover:bg-red-200 flex flex-col items-center gap-1"
                >
                  <RenderIcon
                    iconName={full}
                    className="w-6 h-6 text-red-600"
                  />
                  <span className="text-[11px] text-gray-600 truncate w-full text-center">
                    {full.split(":").pop()}
                  </span>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-sm text-gray-600">
                Sin resultados
              </div>
            ))}
        </div>

        <div className="mt-4 pt-3 border-t">
          <button className="w-full py-2 rounded border" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
