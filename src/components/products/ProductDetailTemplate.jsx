import React, { useMemo } from "react";
import {
  ChevronRight,
  Download,
  Zap,
  Camera,
  SquarePlay,
  BarChart3,
  Settings,
  Monitor,
  Microscope,
  Shield,
  Ruler,
  Activity,
  Weight,
} from "lucide-react";

// Lightweight presentational components copied/adapted from ProductDetail.jsx
// Minimal icon rendering that accepts lucide component, known string, or iconify "prefix:name"
const localIconMap = {
  BarChart3,
  Settings,
  Monitor,
  Microscope,
  Shield,
  Ruler,
  Activity,
  Weight,
};

const RenderIcon = ({ icon, className = "h-4 w-4 text-red-600" }) => {
  if (!icon) return <BarChart3 className={className} />;
  if (typeof icon === "function")
    return React.createElement(icon, { className });
  if (typeof icon === "string") {
    if (localIconMap[icon]) {
      const I = localIconMap[icon];
      return <I className={className} />;
    }
    if (icon.includes(":")) {
      const [prefix, name] = icon.split(":");
      const url = `https://api.iconify.design/${prefix}/${name}.svg?color=%23ef4444`;
      return <img src={url} alt={icon} className={className} />;
    }
  }
  return <BarChart3 className={className} />;
};

const FeatureCard = ({ feature, editable, onEdit, onPickIcon }) => {
  const { title, description, icon } = feature || {};
  return (
    <div className="group bg-white p-3 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-2 justify-between">
        {editable ? (
          <input
            className={`text-sm font-semibold text-gray-900 w-full bg-transparent ${
              editable ? "border rounded px-2 py-1" : "border-0"
            }`}
            disabled={!editable}
            value={title || ""}
            onChange={(e) => onEdit?.("title", e.target.value)}
            placeholder="Título"
          />
        ) : (
          <h3 className="text-sm font-semibold text-gray-900 w-full">
            {title}
          </h3>
        )}
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <RenderIcon icon={icon} className="h-4 w-4 text-red-600" />
          </div>
          {editable && (
            <button
              type="button"
              className="text-[11px] px-2 py-1 border rounded"
              onClick={onPickIcon}
              title="Cambiar icono"
            >
              Icono
            </button>
          )}
        </div>
      </div>
      {editable ? (
        <textarea
          className={`text-gray-600 text-xs leading-relaxed w-full bg-transparent ${
            editable ? "border rounded px-2 py-1" : "border-0"
          }`}
          disabled={!editable}
          value={description || ""}
          onChange={(e) => onEdit?.("description", e.target.value)}
          placeholder="Descripción opcional"
        />
      ) : (
        <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
      )}
    </div>
  );
};

const SpecRow = ({ label, value, editable, onEditLabel, onEditValue }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 gap-2">
    {editable ? (
      <input
        className={`font-medium text-gray-700 bg-transparent ${
          editable ? "border rounded px-2 py-1 w-40" : "border-0"
        }`}
        disabled={!editable}
        value={label}
        onChange={(e) => onEditLabel?.(e.target.value)}
      />
    ) : (
      <span className="font-medium text-gray-700 w-40">{label}</span>
    )}
    {editable ? (
      <input
        className={`text-gray-900 text-right bg-transparent flex-1 ${
          editable ? "border rounded px-2 py-1" : "border-0"
        }`}
        disabled={!editable}
        value={value}
        onChange={(e) => onEditValue?.(e.target.value)}
      />
    ) : (
      <span className="text-gray-900 text-right flex-1">{value}</span>
    )}
  </div>
);

const CapabilityItem = ({ text, editable, onEdit }) => (
  <div className="flex items-start space-x-3">
    <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
    {editable ? (
      <input
        className={`text-gray-700 leading-relaxed bg-transparent flex-1 ${
          editable ? "border rounded px-2 py-1" : "border-0"
        }`}
        disabled={!editable}
        value={text}
        onChange={(e) => onEdit?.(e.target.value)}
      />
    ) : (
      <span className="text-gray-700 leading-relaxed flex-1">{text}</span>
    )}
  </div>
);

const MediaCard = ({
  product,
  editable,
  onPickImage,
  onDropImage,
  onAddAdditional,
  onRemoveAdditional,
  onEditYouTube,
}) => {
  const mediaItems = useMemo(() => {
    const items = [];
    if (product.youtubeVideo)
      items.push({ type: "video", url: product.youtubeVideo });
    if (product.image) items.push({ type: "image", url: product.image });
    if (Array.isArray(product.additionalImages))
      product.additionalImages.forEach((url) =>
        items.push({ type: "image", url })
      );
    return items.length ? items : [{ type: "image", url: product.image }];
  }, [product]);

  const first = mediaItems[0];
  const getYouTubeId = (url) => {
    const m = (url || "").match(/(?:v=|be\/)\??([^&#\s]{11})/);
    return m ? m[1] : null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 pb-3 shadow-lg h-full">
      <div
        className="flex-grow flex items-center justify-center mb-4 rounded-2xl overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.02) 80%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -20px 60px rgba(0,0,0,0.25)",
          border: "1px solid var(--glass-border)",
          WebkitBackdropFilter: "blur(8px) saturate(140%)",
          backdropFilter: "blur(8px) saturate(140%)",
        }}
        onDragOver={(e) => editable && e.preventDefault()}
        onDrop={(e) => editable && onDropImage?.(e)}
        onClick={() => editable && onPickImage?.()}
        title={
          editable ? "Haz clic o arrastra para cambiar imagen/video" : undefined
        }
      >
        {first?.type === "video" && first.url ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(first.url)}`}
              title={product.name}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={first?.url || "/assets/images/logo/logo_NFT.png"}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/logo/logo_NFT.png";
              }}
            />
          </div>
        )}
      </div>
      {editable && (
        <div className="space-y-3">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            {first?.type === "video" ? (
              <SquarePlay className="h-4 w-4" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Clic o arrastra para cambiar
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">YouTube URL</label>
            <input
              className="flex-1 border rounded px-2 py-1 text-xs"
              placeholder="https://www.youtube.com/watch?v=..."
              value={product.youtubeVideo || ""}
              onChange={(e) => onEditYouTube?.(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">
                Imágenes adicionales
              </span>
              <button
                type="button"
                className="text-xs px-2 py-1 border rounded"
                onClick={onAddAdditional}
              >
                + Agregar imagen
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(product.additionalImages || []).map((url, idx) => (
                <div
                  key={idx}
                  className="relative border rounded overflow-hidden group"
                  draggable={editable}
                  onDragStart={(e) =>
                    editable && e.dataTransfer.setData("text/plain", String(idx))
                  }
                  onDragOver={(e) => editable && e.preventDefault()}
                  onDrop={(e) => {
                    if (!editable) return;
                    const from = Number(e.dataTransfer.getData("text/plain"));
                    const to = idx;
                    if (!Number.isNaN(from) && from !== to)
                      onRemoveAdditional?.(from, to, true);
                  }}
                >
                  <img
                    src={url}
                    alt={`img-${idx}`}
                    className="w-full h-16 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-white/80 border opacity-0 group-hover:opacity-100"
                    onClick={() => onRemoveAdditional?.(idx)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple carousel for public view (video + images)
const PublicMediaCarousel = ({ product }) => {
  const [idx, setIdx] = React.useState(0);
  const items = useMemo(() => {
    const res = [];
    if (product.youtubeVideo)
      res.push({ type: "video", url: product.youtubeVideo });
    if (product.image) res.push({ type: "image", url: product.image });
    if (Array.isArray(product.additionalImages))
      res.push(
        ...product.additionalImages.map((u) => ({ type: "image", url: u }))
      );
    return res.length ? res : [{ type: "image", url: product.image }];
  }, [product]);
  const total = items.length;
  const getYouTubeId = (url) => {
    const m = (url || "").match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return m ? m[1] : null;
  };
  const cur = items[idx] || {};
  return (
    <div className="relative h-full flex flex-col">
      <div
        className="flex-grow flex items-center justify-center mb-4 rounded-2xl overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.02) 80%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -20px 60px rgba(0,0,0,0.25)",
          border: "1px solid var(--glass-border)",
          WebkitBackdropFilter: "blur(8px) saturate(140%)",
          backdropFilter: "blur(8px) saturate(140%)",
        }}
      >
        {cur.type === "video" ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(cur.url)}`}
              title={product.name}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={cur.url || "/assets/images/logo/logo_NFT.png"}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) =>
                (e.currentTarget.src = "/assets/images/logo/logo_NFT.png")
              }
            />
          </div>
        )}
      </div>
      {total > 1 && (
        <div className="flex justify-center space-x-2 mt-0">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-3 h-3 rounded-full ${
                i === idx ? "bg-red-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductDetailTemplate({
  product,
  labels = {
    datasheetES: "Ficha ES",
    datasheetEN: "Ficha EN",
    mainFeatures: "Características Principales",
    technicalSpecs: "Especificaciones Técnicas",
    capabilities: "Capacidades",
  },
  editable = false,
  onEdit,
  onPick,
  onDrop,
  onPickIcon,
  onGenerate,
  generating = false,
  invalid,
  showHints = false,
}) {
  if (!product) return null;
  const features = Array.isArray(product.features) ? product.features : [];
  const specsEntries = Object.entries(product.specifications || {});
  const capabilities = Array.isArray(product.capabilities)
    ? product.capabilities
    : [];

  const handleEdit = (path, value) => onEdit?.(path, value);

  return (
    <div className="min-h-[60vh]">
      <div className="grid-ctx mb-6">
        <div className="span-12">
          <div className="mb-4">
            <div className="flex items-center justify-left mb-3 gap-3 flex-wrap">
              {editable ? (
                <div className="relative">
                  <input
                  className={`text-3xl lg:text-4xl font-bold text-gray-900 bg-transparent border rounded px-2 py-1 ${
                    invalid?.name ? "border-red-500 ring-1 ring-red-300" : ""
                  }`}
                  value={product.name || ""}
                  onChange={(e) => handleEdit(["name"], e.target.value)}
                  placeholder="Nombre del producto"
                  data-field="name"
                />
                  {showHints && invalid?.name && (
                    <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs rounded px-2 py-0.5 shadow">
                      Campo obligatorio
                    </div>
                  )}
                </div>
              ) : (
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
              )}
              {editable ? (
                <div className="relative">
                  <input
                  className={`bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full border ${
                    invalid?.category ? "border-red-500 ring-1 ring-red-300" : ""
                  }`}
                  value={product.category || ""}
                  onChange={(e) => handleEdit(["category"], e.target.value)}
                  placeholder="Categoría"
                  data-field="category"
                />
                  {showHints && invalid?.category && (
                    <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs rounded px-2 py-0.5 shadow">
                      Campo obligatorio
                    </div>
                  )}
                </div>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>
            {editable ? (
              <div className="relative">
                <input
                className={`text-lg text-red-600 font-medium mb-3 bg-transparent border rounded px-2 py-1 w-full ${
                  invalid?.tagline ? "border-red-500 ring-1 ring-red-300" : ""
                }`}
                value={product.tagline || ""}
                onChange={(e) => handleEdit(["tagline"], e.target.value)}
                placeholder="Tagline"
                data-field="tagline"
              />
                {showHints && invalid?.tagline && (
                  <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs rounded px-2 py-0.5 shadow">
                    Campo obligatorio
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg text-red-600 font-medium mb-3">
                {product.tagline}
              </p>
            )}
            {editable ? (
              <div className="relative">
                <textarea
                className={`text-gray-700 leading-relaxed mb-4 w-full bg-transparent border rounded px-2 py-2 ${
                  invalid?.description ? "border-red-500 ring-1 ring-red-300" : ""
                }`}
                rows={4}
                value={product.description || ""}
                onChange={(e) => handleEdit(["description"], e.target.value)}
                placeholder="Descripción detallada"
                data-field="description"
              />
                {showHints && invalid?.description && (
                  <div className="absolute -top-6 left-0 bg-red-600 text-white text-xs rounded px-2 py-0.5 shadow">
                    Campo obligatorio
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl opacity-80 cursor-default">
                <Zap className="h-5 w-5" />
                WhatsApp
              </button>
              <div className="flex gap-2 flex-wrap items-center">
                <div className="flex items-center gap-2">
                  <a
                    href={product.technicalSheets?.es || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (editable) {
                        e.preventDefault();
                        onPick?.("datasheet-es");
                      }
                    }}
                    onDragOver={(e) => editable && e.preventDefault()}
                    onDrop={(e) => editable && onDrop?.("datasheet-es", e)}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {labels.datasheetES}
                  </a>
                  {editable && (
                    <button
                      type="button"
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() => onPick?.("datasheet-es")}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop?.("datasheet-es", e)}
                      title="Cargar Ficha ES"
                    >
                      Cargar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={product.technicalSheets?.en || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (editable) {
                        e.preventDefault();
                        onPick?.("datasheet-en");
                      }
                    }}
                    onDragOver={(e) => editable && e.preventDefault()}
                    onDrop={(e) => editable && onDrop?.("datasheet-en", e)}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {labels.datasheetEN}
                  </a>
                  {editable && (
                    <button
                      type="button"
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() => onPick?.("datasheet-en")}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop?.("datasheet-en", e)}
                      title="Cargar Ficha EN"
                    >
                      Cargar
                    </button>
                  )}
                </div>
                {editable && onGenerate && (
                  <button
                    type="button"
                    onClick={onGenerate}
                    disabled={
                      generating || !(
                        product.technicalSheets?.es || product.technicalSheets?.en
                      )
                    }
                    className={`inline-flex items-center gap-2 font-semibold py-3 px-4 rounded-xl border transition-colors text-white ${
                      generating || !(
                        product.technicalSheets?.es || product.technicalSheets?.en
                      )
                        ? "bg-red-300"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {generating ? "Generando..." : "Generar con IA"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid-ctx mb-6">
        <div className="span-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {labels.mainFeatures}
          </h2>
        </div>
        <div className="span-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              draggable={editable}
              onDragStart={(e) => {
                if (!editable) return;
                e.dataTransfer.setData("text/plain", String(i));
              }}
              onDragOver={(e) => editable && e.preventDefault()}
              onDrop={(e) => {
                if (!editable) return;
                const from = Number(e.dataTransfer.getData("text/plain"));
                const to = i;
                if (!Number.isNaN(from) && from !== to)
                  handleEdit(["features", "reorder"], { from, to });
              }}
            >
              <FeatureCard
                feature={f}
                editable={editable}
                onEdit={(field, val) => handleEdit(["features", i, field], val)}
                onPickIcon={() => onPickIcon?.(i)}
              />
            </div>
          ))}
          {editable && (
            <div className="flex items-center gap-2">
              <button
                className="text-sm px-3 py-2 border rounded"
                onClick={() => handleEdit(["features", "add"], "")}
              >
                + Agregar característica
              </button>
              <button
                className="text-sm px-3 py-2 border rounded"
                onClick={() => handleEdit(["features", "remove", "last"], "")}
              >
                − Eliminar última característica
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specs + Media */}
      <div className="grid-ctx mb-6">
        <div className="span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {labels.technicalSpecs}
              </h3>
              <div className="space-y-1">
                {specsEntries.map(([key, value], idx) => (
                  <SpecRow
                    key={idx}
                    label={key}
                    value={value}
                    editable={editable}
                    onEditLabel={(val) => handleEdit(["specsLabel", key], val)}
                    onEditValue={(val) => handleEdit(["specsValue", key], val)}
                  />
                ))}
                {editable && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="text-sm px-3 py-2 border rounded"
                      onClick={() => handleEdit(["specs", "add"], "")}
                    >
                      + Agregar especificación
                    </button>
                    <button
                      className="text-sm px-3 py-2 border rounded"
                      onClick={() => handleEdit(["specs", "remove", "last"], "")}
                    >
                      − Eliminar última
                    </button>
                  </div>
                )}
              </div>
            </div>
            {editable ? (
              <MediaCard
                product={product}
                editable={editable}
                onPickImage={() => onPick?.("image")}
                onDropImage={(e) => onDrop?.("image", e)}
                onAddAdditional={() => onPick?.("additional")}
                onRemoveAdditional={(from, to, reorder) => {
                  if (reorder)
                    return handleEdit(["additionalImages", "reorder"], {
                      from,
                      to,
                    });
                  return handleEdit(["additionalImages", "remove", from], "");
                }}
                onEditYouTube={(val) => handleEdit(["youtubeVideo"], val)}
              />
            ) : (
              <PublicMediaCarousel product={product} />
            )}
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid-ctx mb-8">
        <div className="span-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {labels.capabilities}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {capabilities.map((c, idx) => (
                <CapabilityItem
                  key={idx}
                  text={c}
                  editable={editable}
                  onEdit={(val) => handleEdit(["capabilities", idx], val)}
                />
              ))}
            </div>
            {editable && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="text-sm px-3 py-2 border rounded"
                  onClick={() => handleEdit(["capabilities", "add"], "")}
                >
                  + Agregar capacidad
                </button>
                <button
                  className="text-sm px-3 py-2 border rounded"
                  onClick={() => handleEdit(["capabilities", "remove", "last"], "")}
                >
                  − Eliminar última
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
