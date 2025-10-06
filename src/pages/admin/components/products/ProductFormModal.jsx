import React, { useEffect, useMemo, useRef, useState } from "react";
import { ProductFormComponentWithPicker as ProductFormComponent } from "./ProductFormComponent";

export default function ProductFormModal({
  open,
  mode = "view",
  product,
  onClose,
  onSave,
  onRestore,
}) {
  const isOpen = !!open;
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const initial = useMemo(
    () =>
      product || {
        id: "product-" + Math.random().toString(36).slice(2, 8),
        name: { es: "", en: "" },
        tagline: { es: "", en: "" },
        description: { es: "", en: "" }, // short card description
        descriptionDetail: { es: "", en: "" },
        image: "",
        category: "",
        technicalSheets: { es: "", en: "" },
        features: { es: [""], en: [""] }, // short bullet points for card
        featuresDetail: [],
        specifications: {},
        capabilities: [],
        youtubeVideo: "",
        additionalImages: [],
        order: 1,
        archived: false,
      },
    [product]
  );
  const [local, setLocal] = useState(initial);
  const [tab, setTab] = useState("es");
  const [previewTab, setPreviewTab] = useState("card"); // card | detail
  const [errors, setErrors] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const dzImgRef = useRef(null);

  useEffect(() => {
    if (product) setLocal(product);
  }, [product]);

  function validate() {
    const e = {};
    if (!local?.id?.trim()) e.id = "ID requerido";
    if (!local?.name?.es?.trim()) e.name_es = "Campo obligatorio";
    if (!local?.tagline?.es?.trim()) e.tag_es = "Campo obligatorio";
    if (!local?.description?.es?.trim()) e.desc_es = "Campo obligatorio";
    if (!local?.image?.trim()) e.image = "Imagen requerida";
    if (!local?.category?.trim()) e.category = "Campo obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function changeLangField(lang, key, value) {
    setLocal((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [lang]: value },
    }));
  }

  function setFeaturesAt(lang, idx, value) {
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[lang])
        ? [...prev.features[lang]]
        : [];
      arr[idx] = value;
      return { ...prev, features: { ...(prev.features || {}), [lang]: arr } };
    });
  }
  function addFeature(lang) {
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[lang])
        ? [...prev.features[lang]]
        : [];
      arr.push("");
      return { ...prev, features: { ...(prev.features || {}), [lang]: arr } };
    });
  }
  function removeFeature(lang, idx) {
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[lang])
        ? [...prev.features[lang]]
        : [];
      arr.splice(idx, 1);
      return { ...prev, features: { ...(prev.features || {}), [lang]: arr } };
    });
  }
  function changeLangDetail(value) {
    setLocal((prev) => ({
      ...prev,
      descriptionDetail: { ...(prev.descriptionDetail || {}), [tab]: value },
    }));
  }

  async function uploadFile(kind, file) {
    // kind: 'datasheet-es' | 'datasheet-en' | 'image' | 'additional'
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("path", `/content/products/${local.id}/`);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("upload_failed");
      const data = await res.json();
      const url = data?.url || data?.path || "";
      if (!url) throw new Error("no_url");
      if (kind === "image") setLocal((p) => ({ ...p, image: url }));
      if (kind === "additional")
        setLocal((p) => ({
          ...p,
          additionalImages: [...(p.additionalImages || []), url],
        }));
      if (kind === "datasheet-es")
        setLocal((p) => ({
          ...p,
          technicalSheets: { ...(p.technicalSheets || {}), es: url },
        }));
      if (kind === "datasheet-en")
        setLocal((p) => ({
          ...p,
          technicalSheets: { ...(p.technicalSheets || {}), en: url },
        }));
    } catch (e) {
      // Fallback: preview-only object URL
      const url = URL.createObjectURL(file);
      if (kind === "image") setLocal((p) => ({ ...p, image: url }));
      if (kind === "additional")
        setLocal((p) => ({
          ...p,
          additionalImages: [...(p.additionalImages || []), url],
        }));
      if (kind === "datasheet-es")
        setLocal((p) => ({
          ...p,
          technicalSheets: { ...(p.technicalSheets || {}), es: url },
        }));
      if (kind === "datasheet-en")
        setLocal((p) => ({
          ...p,
          technicalSheets: { ...(p.technicalSheets || {}), en: url },
        }));
    } finally {
      setUploading(false);
    }
  }

  function onDrop(kind, e) {
    e.preventDefault();
    if (isView) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(kind, file);
  }

  function onPick(kind) {
    if (isView) return;
    const inp = document.createElement("input");
    inp.type = "file";
    if (kind === "image" || kind === "additional") {
      inp.accept = "image/*";
      if (kind === "additional") inp.multiple = true;
    } else {
      inp.accept = ".pdf,.doc,.docx";
    }
    inp.onchange = (ev) => {
      const files = Array.from(ev.target.files || []);
      if (!files.length) return;
      if (kind === "additional") files.forEach((f) => uploadFile(kind, f));
      else uploadFile(kind, files[0]);
    };
    inp.click();
  }

  async function handleGenerateAI() {
    try {
      setGenerating(true);
      // Basic placeholder call — requires backend implementation
      const res = await fetch("/api/ai/products/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: local.id,
          datasheets: local.technicalSheets,
          language: tab,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Expecting { name, tagline, description, category, features }
        const next = { ...local };
        if (data.name) next.name = { ...next.name, [tab]: data.name };
        if (data.tagline)
          next.tagline = { ...next.tagline, [tab]: data.tagline };
        if (data.description) {
          next.description = { ...next.description, [tab]: data.description };
          if (!next.descriptionDetail?.[tab]) {
            next.descriptionDetail = {
              ...(next.descriptionDetail || {}),
              [tab]: data.description,
            };
          }
        }
        if (data.category) next.category = data.category;
        if (Array.isArray(data.features))
          next.features = { ...next.features, [tab]: data.features };
        setLocal(next);
      } else {
        alert("No se pudo generar con IA (requiere backend)");
      }
    } catch (e) {
      alert("Error generando con IA: " + (e?.message || e));
    } finally {
      setGenerating(false);
    }
  }

  function wordCount(text) {
    return (text || "").trim().split(/\s+/).filter(Boolean).length;
  }

  function onSubmit(e) {
    e?.preventDefault?.();
    if (!validate()) {
      setShowHint(true);
      // Focus/scroll to first invalid field in current tab
      setTimeout(() => {
        setShowHint(false);
      }, 1200);
      try {
        const priority = ["name", "tagline", "description", "category"]; // order
        const first = priority.find((k) =>
          k === "description"
            ? !(
                local.descriptionDetail?.[tab] ||
                local.description?.[tab] ||
                ""
              ).trim()
            : k === "name" || k === "tagline"
            ? !(local?.[k]?.[tab] || "").trim()
            : k === "category"
            ? !(local?.category || "").trim()
            : false
        );
        if (first) {
          const input = document.querySelector(`[data-field="${first}"]`);
          if (input) {
            input.focus({ preventScroll: false });
            input.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      } catch {}
      return;
    }
    const next = { ...local };
    ["name", "tagline", "description", "descriptionDetail"].forEach((k) => {
      const obj = next[k] || {};
      if (!obj.en?.trim()) obj.en = obj.es || "";
      next[k] = obj;
    });
    // Compact features: remove empty
    next.features = {
      es: (next.features?.es || [])
        .map((s) => (s || "").trim())
        .filter(Boolean),
      en: (next.features?.en || [])
        .map((s) => (s || "").trim())
        .filter(Boolean),
    };
    onSave?.(next);
  }

  if (!isOpen) return null;

  const Title = isCreate
    ? "Nuevo Producto"
    : isEdit
    ? "Editar Producto"
    : "Vista de Producto";
  const hasES = !!local.technicalSheets?.es;
  const hasEN = !!local.technicalSheets?.en;
  const showGenerateAI = isCreate;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{Title}</h3>
            {/* TabMenu: Vista Card | Vista Detalle (also visible in view mode) */}
            {
              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg border text-sm ${
                    previewTab === "card"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white"
                  }`}
                  onClick={() => setPreviewTab("card")}
                >
                  Vista Card
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg border text-sm ${
                    previewTab === "detail"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white"
                  }`}
                  onClick={() => setPreviewTab("detail")}
                >
                  Vista Detalle
                </button>
              </div>
            }
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Language tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {["es", "en"].map((l) => (
              <button
                type="button"
                key={l}
                className={`px-3 py-1 rounded-lg border ${
                  tab === l
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white"
                }`}
                onClick={() => setTab(l)}
              >
                {l === "es" ? "Español (ES)" : "Inglés (EN)"}
              </button>
            ))}
          </div>

          {/* Compact toolbar: ID y Orden (sin Fichas ni IA aquí) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">ID</label>
              <input
                disabled={isView || isEdit}
                value={local.id}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, id: e.target.value.trim() }))
                }
                className={`w-48 border rounded px-3 py-1.5 ${
                  errors.id ? "border-red-400" : ""
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Orden</label>
              <input
                type="number"
                disabled={isView || local.archived}
                value={local.order ?? 1}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, order: Number(e.target.value) }))
                }
                className="w-20 border rounded px-3 py-1.5"
                min={1}
              />
            </div>
            {uploading && (
              <span className="text-xs text-gray-500">Subiendo...</span>
            )}
          </div>
          {/* Nota de carga se muestra cerca del carrusel y CTA dentro del template */}

          {/* Editable Preview */}
          <ProductFormComponent
            mode={previewTab}
            tab={tab}
            local={local}
            setLocal={setLocal}
            hasES={hasES}
            hasEN={hasEN}
            onPick={onPick}
            onDrop={onDrop}
            generating={generating}
            readOnly={isView}
            onGenerate={showGenerateAI ? handleGenerateAI : undefined}
            invalid={
              tab === "es"
                ? {
                    name: !local?.name?.es?.trim(),
                    tagline: !local?.tagline?.es?.trim(),
                    description:
                      !local?.descriptionDetail?.es?.trim() &&
                      !local?.description?.es?.trim(),
                    category: !local?.category?.trim(),
                  }
                : {
                    name: false,
                    tagline: false,
                    description: false,
                    category: !local?.category?.trim(),
                  }
            }
            showHints={showHint}
          />
          {showHint && (
            <div className="mt-2 text-sm text-red-600 animate-pulse">
              Algunos campos son obligatorios. Completa los resaltados.
            </div>
          )}
        </div>
        {isEdit && local.archived && (
          <div className="px-6 pb-4 text-yellow-700">
            Este producto está archivado. Edite y use Restaurar para volver a
            activarlo.
          </div>
        )}

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
          <button className="px-3 py-2 border rounded" onClick={onClose}>
            Cerrar
          </button>
          {!isView && (
            <button className="btn-cta px-4 py-2" onClick={onSubmit}>
              {isCreate ? "Crear" : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
