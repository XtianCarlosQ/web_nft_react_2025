import React, { useEffect, useMemo, useRef, useState } from "react";
import { ProductFormComponentWithPicker as ProductFormComponent } from "./ProductFormComponent";
import DetailIncompleteConfirmModal from "./DetailIncompleteConfirmModal";

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
  const [cardErrors, setCardErrors] = useState({});
  const [detailErrors, setDetailErrors] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const dzImgRef = useRef(null);
  const [showDetailConfirm, setShowDetailConfirm] = useState(false);
  const [pendingSave, setPendingSave] = useState(null); // holds next payload when awaiting confirm

  useEffect(() => {
    if (product) setLocal(product);
  }, [product]);

  // Validators split by view (card/detail) and language rules
  function validateCard() {
    const e = {};
    if (!local?.id?.trim()) e.id = "ID requerido";
    if (!local?.name?.es?.trim()) e.name_es = "Nombre (ES) requerido";
    if (!local?.description?.es?.trim())
      e.desc_es = "Descripción (ES) requerida";
    if (!local?.image?.trim()) e.image = "Imagen requerida";
    // At least one non-empty feature in ES
    const feats = (local?.features?.es || [])
      .map((s) => (s || "").trim())
      .filter(Boolean);
    if (!feats.length) e.features = "Al menos 1 característica (ES)";
    setCardErrors(e);
    return e;
  }
  function validateDetail() {
    const e = {};
    if (!local?.category?.trim()) e.category = "Categoría requerida";
    if (!(local?.descriptionDetail?.es || local?.description?.es || "").trim())
      e.detail_es = "Descripción detallada (ES) requerida";
    setDetailErrors(e);
    return e;
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

  async function uploadFromUrl(kind, urlStr) {
    const url = String(urlStr || "").trim();
    if (!url) return;
    if (url.startsWith("blob:")) {
      alert(
        "Esa URL es de tipo 'blob:' y no se puede importar directamente. Copia una URL https pública (Copiar dirección de imagen) o descarga el archivo y súbelo."
      );
      return;
    }
    setUploading(true);
    try {
      console.log("[adminx] uploadFromUrl start", { kind, url, id: local.id });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, path: `/content/products/${local.id}/` }),
      });
      const debugHdr = res.headers.get("X-Upload-Debug");
      const data = await res.json().catch(() => ({}));
      console.log("[adminx] uploadFromUrl res", {
        status: res.status,
        ok: res.ok,
        debug: debugHdr,
        data,
      });
      if (!res.ok || !data?.ok) {
        const msg = data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const hosted = data?.url || data?.path || "";
      if (!hosted) throw new Error("no_url");
      if (kind === "image") setLocal((p) => ({ ...p, image: hosted }));
      if (kind === "additional")
        setLocal((p) => ({
          ...p,
          additionalImages: [...(p.additionalImages || []), hosted],
        }));
    } catch (e) {
      alert(
        `No se pudo importar desde URL (${kind}). Detalle: ${
          e?.message || e
        }\nSi el sitio bloquea la descarga, descarga el archivo y súbelo manualmente.`
      );
      console.error("[adminx] uploadFromUrl error", e);
    } finally {
      setUploading(false);
    }
  }

  async function uploadFile(kind, file) {
    // kind: 'datasheet-es' | 'datasheet-en' | 'image' | 'additional'
    setUploading(true);
    try {
      if (!(file instanceof File || file instanceof Blob)) {
        // Soporta cuando accidentalmente nos pasan una URL (string)
        if (typeof file === "string") {
          setUploading(false);
          return uploadFromUrl(kind, file);
        }
      }
      // 1) Intento multipart
      let url = "";
      try {
        const form = new FormData();
        form.append("file", file, file.name || `file-${Date.now()}.bin`);
        form.append("path", `/content/products/${local.id}/`);
        console.log("[adminx] upload multipart start", {
          kind,
          name: file?.name,
          size: file?.size,
          id: local.id,
        });
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const debugHdr = res.headers.get("X-Upload-Debug");
        const data = await res.json().catch(() => ({}));
        console.log("[adminx] upload multipart res", {
          status: res.status,
          ok: res.ok,
          debug: debugHdr,
          data,
        });
        if (res.ok && data?.ok) {
          url = data?.url || data?.path || "";
        } else {
          // 2) Fallback JSON base64 (cuando multipart no llega bien)
          console.log("[adminx] fallback base64 start", {
            kind,
            name: file?.name,
            size: file?.size,
          });
          const base64 = await new Promise((resolve, reject) => {
            try {
              const fr = new FileReader();
              fr.onload = () => {
                const s = String(fr.result || "");
                const i = s.indexOf(",");
                resolve(i >= 0 ? s.slice(i + 1) : s);
              };
              fr.onerror = reject;
              fr.readAsDataURL(file);
            } catch (e) {
              reject(e);
            }
          });
          const res2 = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name || `file-${Date.now()}.bin`,
              path: `/content/products/${local.id}/`,
              data: base64,
            }),
          });
          const debugHdr2 = res2.headers.get("X-Upload-Debug");
          const data2 = await res2.json().catch(() => ({}));
          console.log("[adminx] fallback base64 res", {
            status: res2.status,
            ok: res2.ok,
            debug: debugHdr2,
            data: data2,
          });
          if (!res2.ok || !data2?.ok) {
            const msg = data2?.error || `HTTP ${res2.status}`;
            throw new Error(msg);
          }
          url = data2?.url || data2?.path || "";
        }
      } catch (inner) {
        // Re-lanza para la alerta superior
        console.error("[adminx] upload error inner", inner);
        throw inner;
      }

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
      alert(
        `No se pudo subir el archivo (${kind}).\nDetalle: ${
          e?.message || e
        }\n\nConsejos:\n- Evita URLs 'blob:' (no se pueden importar).\n- Usa el botón Importar URL con un enlace https público, o descarga el archivo y súbelo.\n- Asegúrate de tener vercel dev corriendo (puerto :3000) y variables GITHUB_* válidas.`
      );
      console.error("[adminx] uploadFile error", e);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(kind, e) {
    e.preventDefault();
    if (isView) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      console.log("[adminx] drop file", {
        kind,
        name: file?.name,
        size: file?.size,
      });
      return uploadFile(kind, file);
    }
    // Intentar URL si no hay archivo
    try {
      const items = e.dataTransfer?.items;
      if (items && items.length) {
        for (const it of items) {
          if (it.kind === "string") {
            const type = it.type || "text/plain";
            if (type === "text/uri-list" || type === "text/plain") {
              it.getAsString((text) => {
                const u = String(text || "").trim();
                console.log("[adminx] drop url", { kind, u });
                if (u) uploadFromUrl(kind, u);
              });
              return;
            }
          }
        }
      }
    } catch {}
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
      console.log(
        "[adminx] input change",
        files.map((f) => ({ name: f?.name, size: f?.size }))
      );
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
    const eCard = validateCard();
    const eDetail = validateDetail();
    const missingCard = Object.keys(eCard);
    const missingDetail = Object.keys(eDetail);
    // Permitir guardar con Card completa aunque detalle falte (confirmar)
    if (!missingCard.length && missingDetail.length) {
      setShowHint(true);
      const next = prepareNext();
      setPendingSave(next);
      setShowDetailConfirm(true);
      return;
    }
    // Si Card tiene errores, bloquear y mostrar hints
    if (missingCard.length) {
      setShowHint(true);
      try {
        const priority = ["name", "description"]; // orden básico para Card
        const first = priority.find((k) =>
          k === "description"
            ? !(local.description?.[tab] || "").trim()
            : k === "name"
            ? !(local?.name?.[tab] || "").trim()
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
    onSave?.(prepareNext());
  }

  function prepareNext() {
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
    return next;
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
  const missingList = (
    previewTab === "card"
      ? Object.values(cardErrors)
      : Object.values(detailErrors)
  ).filter(Boolean);

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
          {/* Language tabs (only show here in Vista Detalle; in Vista Card se muestran centrados en la plantilla) */}
          {previewTab === "detail" && (
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
          )}

          {/* Toolbar ID/Orden: solo en Vista Detalle; en Vista Card se muestran centrados en la plantilla */}
          {previewTab === "detail" && (
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
                    cardErrors.id ? "border-red-400" : ""
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
          )}
          {/* Nota de carga se muestra cerca del carrusel y CTA dentro del template */}

          {/* Editable Preview */}
          <ProductFormComponent
            mode={previewTab}
            tab={tab}
            setTab={setTab}
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
              previewTab === "card"
                ? {
                    name: tab === "es" ? !local?.name?.es?.trim() : false,
                    description:
                      tab === "es" ? !local?.description?.es?.trim() : false,
                    features:
                      tab === "es" &&
                      !(local?.features?.es || [])
                        .map((s) => (s || "").trim())
                        .filter(Boolean).length,
                  }
                : {
                    name: tab === "es" ? !local?.name?.es?.trim() : false,
                    tagline: tab === "es" ? !local?.tagline?.es?.trim() : false,
                    description:
                      tab === "es"
                        ? !(
                            (local?.descriptionDetail?.es || "").trim() ||
                            (local?.description?.es || "").trim()
                          )
                        : false,
                    category: !local?.category?.trim(),
                  }
            }
            showHints={showHint}
            uploading={uploading}
          />
          {showHint && (
            <div className="mt-2 text-sm text-red-600">
              <div className="font-semibold mb-1">
                Algunos campos son obligatorios:
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {missingList.length ? (
                  missingList.map((m, i) => <li key={i}>{m}</li>)
                ) : (
                  <li>Completa los resaltados en rojo</li>
                )}
              </ul>
              <div className="text-xs text-gray-600 mt-1">
                El aviso permanecerá visible hasta completar los campos.
              </div>
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
      {/* Confirm modal when detail is incomplete */}
      <DetailIncompleteConfirmModal
        open={showDetailConfirm}
        message="La Vista Detalle tiene campos pendientes (p.ej., Categoría requerida). ¿Deseas guardar solo la Vista Card por ahora?"
        onCancel={() => {
          setShowDetailConfirm(false);
        }}
        onAccept={() => {
          setShowDetailConfirm(false);
          if (pendingSave) {
            onSave?.(pendingSave);
            setPendingSave(null);
          } else {
            onSave?.(prepareNext());
          }
        }}
      />
    </div>
  );
}

// Render confirm modal for incomplete detail
// Place after default export to keep file structure consistent
