import React, { useEffect, useMemo, useRef, useState } from "react";
import { TeamMemberCard } from "../../../../components/sections/Team";
import { Upload } from "lucide-react";

export default function TeamFormModal({
  open,
  member,
  mode = "edit",
  onClose,
  onSave,
  onRestore,
}) {
  const [data, setData] = useState(() => member || {});
  const [showTip, setShowTip] = useState(null);
  const [lang, setLang] = useState("es");
  const fileInputRef = useRef(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [previewMode, setPreviewMode] = useState(
    mode === "view" ? "plain" : "overlay"
  ); // 'overlay' | 'plain'

  // Helpers for fields that may be string or { es, en }
  const getI18nVal = (val, lng) =>
    typeof val === "object"
      ? String(val?.[lng] ?? val?.es ?? val?.en ?? "")
      : String(val ?? "");
  const setI18nVal = (val, lng, next) => {
    const base =
      typeof val === "object"
        ? { es: getI18nVal(val, "es"), en: getI18nVal(val, "en") }
        : { es: getI18nVal(val, "es"), en: "" };
    return { ...base, [lng]: next };
  };

  useEffect(() => {
    setData(member || {});
  }, [member]);

  useEffect(() => {
    if (!open) setShowTip(null);
  }, [open]);

  const isView = mode === "view";
  const isCreate = mode === "create";
  const title = isView
    ? "Miembro"
    : isCreate
    ? "Nuevo Miembro"
    : "Editar Miembro";

  function validate() {
    const nameVal = getI18nVal(data?.name, lang);
    if (!nameVal.trim()) {
      setShowTip("name");
      setTimeout(() => setShowTip(null), 1000);
      return false;
    }
    const roleVal = getI18nVal(data?.role, lang);
    if (!roleVal.trim()) {
      setShowTip("role");
      setTimeout(() => setShowTip(null), 1000);
      return false;
    }
    if (!(data?.photo || data?.image || "").trim().length) {
      setShowTip("photo");
      setTimeout(() => setShowTip(null), 1000);
      return false;
    }
    const skillsStr =
      data.skillsText !== undefined
        ? data.skillsText
        : Array.isArray(data.skills)
        ? data.skills.join("\n")
        : "";
    if (!skillsStr.trim().length) {
      setShowTip("skills");
      setTimeout(() => setShowTip(null), 1000);
      return false;
    }
    return true;
  }

  async function uploadImage(file) {
    // Prefer serverless multipart endpoint (/api/upload). Fallback to dev-mock JSON (/api/upload/team)
    // 1) Try multipart form to /api/upload (works on Vercel and local vercel dev)
    try {
      const form = new FormData();
      form.append("path", "public/uploads/team");
      form.append("file", file, file.name || `team-${Date.now()}.png`);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out?.url) return out.url;
      // If not ok, fall through to JSON mock
    } catch {}

    // 2) Dev-only fallback: JSON base64 to /api/upload/team (handled by Vite mock middleware)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
          const res = String(fr.result || "");
          const idx = res.indexOf(",");
          resolve(idx >= 0 ? res.slice(idx + 1) : res);
        };
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
      const resp = await fetch("/api/upload/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, data: base64 }),
      });
      const out = await resp.json().catch(() => ({}));
      if (!resp.ok || !out?.url) throw new Error("upload_failed");
      return out.url;
    } catch (e) {
      throw e;
    }
  }

  async function handleFile(file) {
    try {
      setUploadMsg("");
      const url = await uploadImage(file);
      setData((d) => ({ ...d, photo: url }));
    } catch (e) {
      const objUrl = URL.createObjectURL(file);
      setData((d) => ({ ...d, photo: objUrl }));
      setUploadMsg("No se pudo subir la imagen. Se usará una vista previa local.");
    }
  }

  function onDropFile(e) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }
  function onPickFile(e) {
    const file = e.target?.files?.[0];
    if (file) handleFile(file);
  }

  function submit(e) {
    e?.preventDefault?.();
    if (!validate()) return;
    const skillsPref =
      data.skillsText !== undefined
        ? data.skillsText
        : Array.isArray(data.skills)
        ? data.skills.join("\n")
        : "";
    const nameES = getI18nVal(data.name, "es");
    const nameEN = getI18nVal(data.name, "en");
    const roleES = getI18nVal(data.role, "es");
    const roleEN = getI18nVal(data.role, "en");
    const bioES = getI18nVal(data.bio, "es");
    const bioEN = getI18nVal(data.bio, "en");

    const payload = {
      id: data.id || `team-${Math.random().toString(36).slice(2, 8)}`,
      name: { es: nameES.trim(), en: (nameEN || nameES).trim() },
      role: { es: roleES.trim(), en: (roleEN || roleES).trim() },
      bio: { es: bioES, en: bioEN || bioES },
      photo: (data.photo || data.image || "").trim(),
      skills: skillsPref
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      order: Number(data.order) || undefined,
      archived: !!data.archived,
    };
    onSave?.(payload);
    onClose?.();
  }

  const Preview = useMemo(() => {
    const skillsText =
      data.skillsText !== undefined
        ? data.skillsText
        : Array.isArray(data.skills)
        ? data.skills.join("\n")
        : "";
    const m = {
      name: getI18nVal(data.name, lang),
      position: getI18nVal(data.role, lang),
      image: data.photo || data.image || "",
      skills: skillsText
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    return m;
  }, [data, lang]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="px-3 py-1 border rounded" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div
          className={`grid grid-cols-1 ${
            mode !== "view" ? "md:grid-cols-2" : ""
          } gap-6 p-6`}
        >
          {!isView && (
            <form className="space-y-3" onSubmit={submit}>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg border ${
                    lang === "es"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white"
                  }`}
                  onClick={() => setLang("es")}
                >
                  Español (ES)
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg border ${
                    lang === "en"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white"
                  }`}
                  onClick={() => setLang("en")}
                >
                  Inglés (EN)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">ID</label>
                  <input
                    className="w-full border rounded px-3 py-2 bg-gray-50"
                    value={data.id || "(auto)"}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Orden (requerido)
                  </label>
                  <input
                    type="number"
                    className={`w-full border rounded px-3 py-2 ${
                      showTip === "order" ? "border-red-500" : ""
                    }`}
                    value={data.order ?? ""}
                    onChange={(e) =>
                      setData((d) => ({ ...d, order: e.target.value }))
                    }
                    disabled={isView}
                  />
                  {showTip === "order" && (
                    <div className="text-xs text-red-600 mt-1">
                      Campo obligatorio
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Foto (4:3 recomendado, JPG/PNG, arrastrar o buscar)
                </label>
                <div
                  className={`relative rounded-xl border-2 ${
                    showTip === "photo"
                      ? "border-red-500"
                      : "border-dashed border-gray-300"
                  } bg-gray-50 flex items-center justify-center aspect-[4/3] text-gray-500`}
                  onDrop={onDropFile}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {data.photo || data.image ? (
                    <img
                      src={data.photo || data.image}
                      alt="preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center px-4">
                      <Upload className="w-6 h-6" />
                      <div className="text-sm">Arrastrar imagen aquí</div>
                      <div className="text-xs text-gray-400">o</div>
                      <button
                        type="button"
                        className="px-3 py-1 rounded border"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Buscar
                      </button>
                      <div className="text-xs text-gray-500">
                        Tamaño recomendado 4:3 • JPG/PNG
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickFile}
                  />
                </div>
                {uploadMsg && (
                  <div className="text-xs text-yellow-600 mt-1">{uploadMsg}</div>
                )}
                <input
                  className="w-full border rounded px-3 py-2 mt-2"
                  placeholder="o pega aquí una URL pública de la foto"
                  value={data.photo || data.image || ""}
                  onChange={(e) => setData((d) => ({ ...d, photo: e.target.value }))}
                  disabled={isView}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nombre (requerido)</label>
                <input
                  className={`w-full border rounded px-3 py-2 ${
                    showTip === "name" ? "border-red-500" : ""
                  }`}
                  value={getI18nVal(data.name, lang)}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      name: setI18nVal(d.name, lang, e.target.value),
                    }))
                  }
                  disabled={isView}
                />
                {showTip === "name" && (
                  <div className="text-xs text-red-600 mt-1">Campo obligatorio</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Cargo (requerido)</label>
                <input
                  className={`w-full border rounded px-3 py-2 ${
                    showTip === "role" ? "border-red-500" : ""
                  }`}
                  value={getI18nVal(data.role, lang)}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      role: setI18nVal(d.role, lang, e.target.value),
                    }))
                  }
                  disabled={isView}
                />
                {showTip === "role" && (
                  <div className="text-xs text-red-600 mt-1">Campo obligatorio</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Skills (una por línea o separadas por coma) - requerido
                </label>
                <textarea
                  className={`w-full border rounded px-3 py-2 h-28 ${
                    showTip === "skills" ? "border-red-500" : ""
                  }`}
                  value={
                    data.skillsText !== undefined
                      ? data.skillsText
                      : Array.isArray(data.skills)
                      ? data.skills.join("\n")
                      : ""
                  }
                  onChange={(e) => setData((d) => ({ ...d, skillsText: e.target.value }))}
                  disabled={isView}
                />
                {showTip === "skills" && (
                  <div className="text-xs text-red-600 mt-1">Campo obligatorio</div>
                )}
              </div>
              {!isView && (
                <div className="pt-2 flex gap-2">
                  <button type="submit" className="btn-cta px-4 py-2">
                    {isCreate ? "Guardar" : "Guardar Cambios"}
                  </button>
                  <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>
                    Cancelar
                  </button>
                  {data.archived ? (
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      onClick={() =>
                        onRestore?.({
                          ...data,
                          order: Number(data.order) || undefined,
                        })
                      }
                    >
                      Restaurar
                    </button>
                  ) : null}
                </div>
              )}
            </form>
          )}
          <div className="flex flex-col h-full">
            <div className="flex gap-2 mb-2 justify-end md:justify-center lg:justify-center">
              <button
                type="button"
                className={`px-3 py-1 rounded-lg border ${
                  previewMode === "overlay"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white"
                }`}
                onClick={() => setPreviewMode("overlay")}
              >
                Vista Overlay
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-lg border ${
                  previewMode === "plain"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white"
                }`}
                onClick={() => setPreviewMode("plain")}
              >
                Vista Sin Overlay
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                <TeamMemberCard member={Preview} forceOverlay={previewMode === "overlay"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
