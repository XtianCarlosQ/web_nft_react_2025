import React, { useState } from "react";
import { ProductCard } from "../../../../components/sections/Products";
import ProductDetailTemplate from "../../../../components/products/ProductDetailTemplate";
import IconPicker from "../common/IconPicker";

export default function ProductFormComponent({
  mode = "card", // 'card' | 'detail'
  tab = "es",
  local,
  setLocal,
  hasES,
  hasEN,
  onPick,
  onDrop,
  generating,
  readOnly = false,
  onPickIcon,
  onGenerate,
  invalid,
  showHints,
}) {
  const change = (field, value) =>
    setLocal((prev) => ({ ...prev, [field]: value }));
  const changeLang = (field, value) =>
    setLocal((prev) => ({
      ...prev,
      [field]: { ...(prev[field] || {}), [tab]: value },
    }));
  const ensureFeaturesDetail = (arrLen) =>
    setLocal((prev) => {
      const fd = Array.isArray(prev.featuresDetail)
        ? [...prev.featuresDetail]
        : [];
      while (fd.length < arrLen) fd.push({ icon: "BarChart3" });
      return { ...prev, featuresDetail: fd };
    });
  const setFeatureAt = (idx, value) =>
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[tab])
        ? [...prev.features[tab]]
        : [];
      arr[idx] = value;
      const next = {
        ...prev,
        features: { ...(prev.features || {}), [tab]: arr },
      };
      return next;
    });
  const addFeature = () =>
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[tab])
        ? [...prev.features[tab]]
        : [];
      arr.push("");
      const next = {
        ...prev,
        features: { ...(prev.features || {}), [tab]: arr },
      };
      const fd = Array.isArray(prev.featuresDetail)
        ? [...prev.featuresDetail]
        : [];
      fd.push({ icon: "BarChart3" });
      next.featuresDetail = fd;
      return next;
    });
  const removeFeature = (idx) =>
    setLocal((prev) => {
      const arr = Array.isArray(prev.features?.[tab])
        ? [...prev.features[tab]]
        : [];
      arr.splice(idx, 1);
      const next = {
        ...prev,
        features: { ...(prev.features || {}), [tab]: arr },
      };
      if (Array.isArray(prev.featuresDetail)) {
        const fd = [...prev.featuresDetail];
        fd.splice(idx, 1);
        next.featuresDetail = fd;
      }
      return next;
    });

  // Card mode: reuse public ProductCard at realistic size
  if (mode === "card") {
    const cardProduct = {
      id: local.id,
      name: local.name?.[tab] || "",
      image: local.image || "",
      description: local.description?.[tab] || "",
      features: Array.isArray(local.features?.[tab]) ? local.features[tab] : [],
    };
    return (
      <div className="w-full max-w-sm">
        {!readOnly && (
          <div
            className="mb-3 rounded-xl overflow-hidden border border-dashed border-gray-300 p-2 flex items-center justify-center text-xs text-gray-500"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop?.("image", e)}
            onClick={() => onPick?.("image")}
            title="Clic o arrastra para cambiar imagen"
          >
            Clic o arrastra para cambiar imagen de la Card
          </div>
        )}
        <ProductCard
          product={cardProduct}
          disabled
          editable={!readOnly}
          onEdit={(path, value) => {
            const [head, idx] = path;
            if (head === "name") return changeLang("name", value);
            if (head === "description") return changeLang("description", value);
            if (head === "features") {
              const i = idx;
              const arr = Array.isArray(local.features?.[tab])
                ? [...local.features[tab]]
                : [];
              arr[i] = value;
              return setLocal((prev) => ({
                ...prev,
                features: { ...(prev.features || {}), [tab]: arr },
              }));
            }
          }}
        />
        {!readOnly && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Características</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 border rounded"
                  onClick={addFeature}
                >
                  + Agregar
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 border rounded"
                  onClick={() => {
                    const arr = Array.isArray(local.features?.[tab])
                      ? [...local.features[tab]]
                      : [];
                    if (arr.length > 0) removeFeature(arr.length - 1);
                  }}
                >
                  − Quitar Última
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detail mode: reuse public ProductDetail layout as a template
  const productForTemplate = {
    id: local.id,
    name: local.name?.[tab] || "",
    category: local.category || "",
    tagline: local.tagline?.[tab] || "",
    description:
      (local.descriptionDetail && local.descriptionDetail[tab]) ||
      (local.description && local.description[tab]) ||
      "",
    image: local.image || "",
    technicalSheets: local.technicalSheets || {},
    features: (local.features?.[tab] || []).map((f, i) => ({
      title: f,
      description: f,
      icon: local.featuresDetail?.[i]?.icon || "BarChart3",
    })),
    specifications: local.specifications || {},
    capabilities: local.capabilities || [],
    youtubeVideo: local.youtubeVideo || "",
    additionalImages: local.additionalImages || [],
  };

  const handleEdit = (path, value) => {
    if (!Array.isArray(path) || !path.length) return;
    const [head, ...rest] = path;
    if (head === "name") return changeLang("name", value);
    if (head === "category") return change("category", value);
    if (head === "tagline") return changeLang("tagline", value);
    if (head === "description")
      return setLocal((p) => ({
        ...p,
        descriptionDetail: { ...(p.descriptionDetail || {}), [tab]: value },
      }));
    if (head === "features") {
      if (rest[0] === "add") return addFeature();
      if (rest[0] === "remove" && rest[1] === "last") {
        const arr = Array.isArray(local.features?.[tab])
          ? [...local.features[tab]]
          : [];
        if (arr.length > 0) return removeFeature(arr.length - 1);
        return;
      }
      if (rest[0] === "reorder") {
        const { from, to } = value || {};
        setLocal((prev) => {
          const arr = Array.isArray(prev.features?.[tab])
            ? [...prev.features[tab]]
            : [];
          if (from == null || to == null || from === to) return prev;
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          const fd = Array.isArray(prev.featuresDetail)
            ? [...prev.featuresDetail]
            : [];
          const [movedFd] = fd.splice(from, 1);
          fd.splice(to, 0, movedFd || { icon: "BarChart3" });
          return {
            ...prev,
            features: { ...(prev.features || {}), [tab]: arr },
            featuresDetail: fd,
          };
        });
        return;
      }
      const [idx, field] = rest;
      if (field === "title" || field === "description")
        return setFeatureAt(idx, value);
    }
    if (head === "additionalImages") {
      if (rest[0] === "remove") {
        const idx = rest[1];
        return setLocal((prev) => {
          const arr = Array.isArray(prev.additionalImages)
            ? [...prev.additionalImages]
            : [];
          arr.splice(idx, 1);
          return { ...prev, additionalImages: arr };
        });
      }
      if (rest[0] === "reorder") {
        const { from, to } = value || {};
        return setLocal((prev) => {
          const arr = Array.isArray(prev.additionalImages)
            ? [...prev.additionalImages]
            : [];
          if (from == null || to == null || from === to) return prev;
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { ...prev, additionalImages: arr };
        });
      }
    }
    if (head === "youtubeVideo") return change("youtubeVideo", value);
    if (head === "specsLabel") {
      const [key] = rest;
      return setLocal((prev) => {
        const specs = { ...(prev.specifications || {}) };
        const val = specs[key];
        delete specs[key];
        specs[value] = val;
        return { ...prev, specifications: specs };
      });
    }
    if (head === "specsValue") {
      const [key] = rest;
      return setLocal((prev) => ({
        ...prev,
        specifications: { ...(prev.specifications || {}), [key]: value },
      }));
    }
    if (head === "specs") {
      if (rest[0] === "add") {
        return setLocal((prev) => ({
          ...prev,
          specifications: { ...(prev.specifications || {}), ["Nuevo"]: "" },
        }));
      }
      if (rest[0] === "remove" && rest[1] === "last") {
        return setLocal((prev) => {
          const entries = Object.entries(prev.specifications || {});
          if (!entries.length) return prev;
          entries.pop();
          return { ...prev, specifications: Object.fromEntries(entries) };
        });
      }
    }
    if (head === "capabilities") {
      if (rest[0] === "add")
        return setLocal((prev) => ({
          ...prev,
          capabilities: [...(prev.capabilities || []), ""],
        }));
      if (rest[0] === "remove" && rest[1] === "last") {
        return setLocal((prev) => {
          const arr = Array.isArray(prev.capabilities)
            ? [...prev.capabilities]
            : [];
          if (arr.length) arr.pop();
          return { ...prev, capabilities: arr };
        });
      }
      const [idx] = rest;
      return setLocal((prev) => {
        const arr = Array.isArray(prev.capabilities)
          ? [...prev.capabilities]
          : [];
        arr[idx] = value;
        return { ...prev, capabilities: arr };
      });
    }
  };

  return (
    <ProductDetailTemplate
      product={productForTemplate}
      labels={{
        datasheetES: "Ficha ES",
        datasheetEN: "Ficha EN",
        mainFeatures: "Características Principales",
        technicalSpecs: "Especificaciones Técnicas",
        capabilities: "Capacidades",
      }}
      editable={!readOnly}
      onEdit={handleEdit}
      onPick={onPick}
      onDrop={onDrop}
      onPickIcon={onPickIcon}
      onGenerate={onGenerate}
      generating={generating}
      invalid={invalid}
      showHints={showHints}
    />
  );
}

// Inline Icon Picker modal
export function FeatureIconPicker({ open, onClose, onSelect }) {
  if (!open) return null;
  return <IconPicker onSelect={onSelect} onClose={onClose} />;
}

// Wrap default export to render icon picker overlay when invoked
export function ProductFormComponentWithPicker(props) {
  const [local, setLocal] = [props.local, props.setLocal];
  const [iconPickerIndex, setIconPickerIndex] = useState(null);

  const onSelectIcon = (iconName) => {
    const idx = iconPickerIndex;
    setIconPickerIndex(null);
    if (idx == null) return;
    setLocal((prev) => {
      const fd = Array.isArray(prev.featuresDetail)
        ? [...prev.featuresDetail]
        : [];
      while (fd.length <= idx) fd.push({ icon: "BarChart3" });
      fd[idx] = { ...(fd[idx] || {}), icon: iconName };
      return { ...prev, featuresDetail: fd };
    });
  };

  const Comp = ProductFormComponent;
  return (
    <>
      <Comp
        {...props}
        local={local}
        setLocal={setLocal}
        onPickIcon={(idx) => setIconPickerIndex(idx)}
      />
      <FeatureIconPicker
        open={iconPickerIndex != null}
        onClose={() => setIconPickerIndex(null)}
        onSelect={onSelectIcon}
      />
    </>
  );
}
