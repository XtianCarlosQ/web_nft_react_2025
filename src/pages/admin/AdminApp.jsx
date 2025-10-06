import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ServicesTable from "./components/services/ServicesTable";
import ProductsTable from "./components/products/ProductsTable";
import TeamTable from "./components/team/TeamTable";
import ServiceFormModal from "./components/services/ServiceFormModal";
import ProductFormModal from "./components/products/ProductFormModal";
import ArchiveConfirmModal from "./components/services/ArchiveConfirmModal";
import ProductArchiveConfirmModal from "./components/products/ProductArchiveConfirmModal";
import TeamFormModal from "./components/team/TeamFormModal";
import TeamArchiveConfirmModal from "./components/team/TeamArchiveConfirmModal";
import { notifyDevOnComplete } from "../../config/devNotify";
import { teamFallback } from "../../data/team-fallback";
import { normalizeTeamMember, normalizeTeamOrder } from "../../models/team";
import { productsData as productsFallback } from "../../data/products-data";

async function fetchJson(url, options = {}) {
  const opts = {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  };
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
  }
  if (!res.ok) {
    const msg = data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg || "request_failed");
  }
  return data;
}

function useAuth() {
  const [auth, setAuth] = useState({ loading: true, ok: false });
  useEffect(() => {
    (async () => {
      try {
        const d = await fetchJson("/api/auth/me");
        setAuth({ loading: false, ok: !!d.authenticated });
      } catch {
        // API not available or not logged in
        setAuth({ loading: false, ok: false });
      }
    })();
  }, []);
  return auth;
}

export default function AdminApp() {
  const [view, setView] = useState("login"); // login | app
  const [section, setSection] = useState("services"); // services | products | team | research
  const [subView, setSubView] = useState("list"); // list | edit
  const [form, setForm] = useState({ username: "", password: "" });
  const [rows, setRows] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [teamRows, setTeamRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [productEditing, setProductEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [productShowForm, setProductShowForm] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [productModalMode, setProductModalMode] = useState("view");
  const [confirmRow, setConfirmRow] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productConfirmRow, setProductConfirmRow] = useState(null);
  const [productShowConfirm, setProductShowConfirm] = useState(false);
  const [teamEditing, setTeamEditing] = useState(null);
  const [teamShowForm, setTeamShowForm] = useState(false);
  const [teamModalMode, setTeamModalMode] = useState("view");
  const [teamConfirmRow, setTeamConfirmRow] = useState(null);
  const [teamShowConfirm, setTeamShowConfirm] = useState(false);
  const auth = useAuth();

  // Auto-persist helpers
  async function persistRows(nextRows, reason = "auto-save") {
    try {
      await fetchJson("/api/services/save", {
        method: "POST",
        body: JSON.stringify({
          data: normalizeOrder(nextRows),
          message: reason,
        }),
      });
    } catch (e) {
      console.warn("Auto-persist failed:", e?.message || e);
      // Opcional: mostrar aviso no intrusivo
    }
  }
  async function persistTeamRows(nextRows, reason = "auto-save") {
    try {
      await fetchJson("/api/team/save", {
        method: "POST",
        body: JSON.stringify({
          data: normalizeTeamOrder(nextRows),
          message: reason,
        }),
      });
    } catch (e) {
      console.warn("Auto-persist team failed:", e?.message || e);
    }
  }
  async function persistProductRows(nextRows, reason = "auto-save") {
    try {
      // Always keep a local fallback cache
      try {
        localStorage.setItem(
          "admin_products",
          JSON.stringify(normalizeOrder(nextRows))
        );
      } catch {}
      await fetchJson("/api/products/save", {
        method: "POST",
        body: JSON.stringify({
          data: normalizeOrder(nextRows),
          message: reason,
        }),
      });
    } catch (e) {
      console.warn("Auto-persist products failed:", e?.message || e);
    }
  }

  useEffect(() => {
    if (auth.loading) return;
    if (auth.ok) {
      setView("app");
      setSection("services");
      setSubView("list");
      loadServices();
      loadTeam();
      loadProducts();
    } else {
      setView("login");
    }
  }, [auth]);

  async function login(e) {
    e.preventDefault();
    try {
      const d = await fetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (d?.ok) {
        window.location.reload();
      } else {
        alert("Credenciales inválidas");
      }
    } catch (err) {
      const msg = String(err?.message || err);
      if (msg.includes("404")) {
        alert(
          "API no disponible (404). ¿Iniciaste `vercel dev` en el puerto 3000 y reiniciaste `npm run dev` para activar el proxy?"
        );
      } else {
        alert("No se pudo iniciar sesión: " + msg);
      }
    }
  }

  function logout() {
    fetch("/api/auth/logout").then(() => window.location.reload());
  }

  function loadServices() {
    fetchJson("/api/services/list")
      .then((d) => {
        if (d.ok) {
          const data = Array.isArray(d.data) ? d.data : [];
          setRows(normalizeOrder(data));
        }
      })
      .catch(() => {
        /* ignore for now */
      });
  }

  function loadTeam() {
    fetchJson("/api/team/list")
      .then((d) => {
        if (d.ok) {
          let data = Array.isArray(d.data) ? d.data : [];
          if (!data.length) {
            // Seed from fallback on first run
            const seeded = normalizeTeamOrder(
              teamFallback.map((m, idx) => ({
                ...normalizeTeamMember(m),
                order: idx + 1,
                archived: false,
              }))
            );
            setTeamRows(seeded);
            // Persist immediately so public site and next loads see it
            persistTeamRows(seeded, "seed team from fallback");
          } else {
            setTeamRows(normalizeTeamOrder(data.map(normalizeTeamMember)));
          }
        }
      })
      .catch(() => {});
  }

  function loadProducts() {
    fetchJson("/api/products/list")
      .then((d) => {
        if (d.ok) {
          let data = Array.isArray(d.data) ? d.data : [];
          if (!data.length) {
            // Seed from products-data.js on first run
            const list = Object.values(productsFallback || {});
            const seeded = normalizeOrder(
              list.map((p, idx) => ({
                id: p.id || "prod-" + (idx + 1),
                name: { es: p.name || "", en: p.name || "" },
                tagline: { es: p.tagline || "", en: p.tagline || "" },
                description: {
                  es: p.description_card || "",
                  en: p.description_card || "",
                },
                descriptionDetail: {
                  es: p.description_detail || "",
                  en: p.description_detail || "",
                },
                image: p.image || "",
                category: p.category || "",
                features: {
                  es: (p.features_card || []).map((f) => f),
                  en: (p.features_card || []).map((f) => f),
                },
                // New extended fields for detail editing
                featuresDetail: Array.isArray(p.features_detail)
                  ? p.features_detail.map((fd) => ({
                      icon: fd.icon || "BarChart3",
                      title: { es: fd.title || "", en: fd.title || "" },
                      description: {
                        es: fd.description || "",
                        en: fd.description || "",
                      },
                    }))
                  : [],
                specifications: p.specifications || {},
                capabilities: Array.isArray(p.capabilities)
                  ? p.capabilities
                  : [],
                youtubeVideo: p.youtubeVideo || "",
                additionalImages: Array.isArray(p.additionalImages)
                  ? p.additionalImages
                  : [],
                order: idx + 1,
                archived: false,
              }))
            );
            setProductRows(seeded);
            persistProductRows(seeded, "seed products from fallback");
          } else {
            setProductRows(normalizeOrder(data));
          }
        }
      })
      .catch(() => {
        // Try local cache first
        try {
          const cached = JSON.parse(
            localStorage.getItem("admin_products") || "[]"
          );
          if (Array.isArray(cached) && cached.length) {
            setProductRows(normalizeOrder(cached));
            return;
          }
        } catch {}
        // Try public content JSON
        fetchJson("/content/products.json")
          .then((d) => {
            const data = Array.isArray(d)
              ? d
              : Array.isArray(d?.data)
              ? d.data
              : [];
            if (data.length) {
              setProductRows(normalizeOrder(data));
              try {
                localStorage.setItem(
                  "admin_products",
                  JSON.stringify(normalizeOrder(data))
                );
              } catch {}
              return;
            }
            // fallthrough to centralized
            const list = Object.values(productsFallback || {});
            const seeded = normalizeOrder(
              list.map((p, idx) => ({
                id: p.id || "prod-" + (idx + 1),
                name: { es: p.name || "", en: p.name || "" },
                tagline: { es: p.tagline || "", en: p.tagline || "" },
                description: {
                  es: p.description_card || "",
                  en: p.description_card || "",
                },
                descriptionDetail: {
                  es: p.description_detail || "",
                  en: p.description_detail || "",
                },
                image: p.image || "",
                category: p.category || "",
                features: {
                  es: (p.features_card || []).map((f) => f),
                  en: (p.features_card || []).map((f) => f),
                },
                featuresDetail: Array.isArray(p.features_detail)
                  ? p.features_detail.map((fd) => ({
                      icon: fd.icon || "BarChart3",
                      title: { es: fd.title || "", en: fd.title || "" },
                      description: {
                        es: fd.description || "",
                        en: fd.description || "",
                      },
                    }))
                  : [],
                specifications: p.specifications || {},
                capabilities: Array.isArray(p.capabilities)
                  ? p.capabilities
                  : [],
                youtubeVideo: p.youtubeVideo || "",
                additionalImages: Array.isArray(p.additionalImages)
                  ? p.additionalImages
                  : [],
                order: idx + 1,
                archived: false,
              }))
            );
            setProductRows(seeded);
          })
          .catch(() => {
            const list = Object.values(productsFallback || {});
            const seeded = normalizeOrder(
              list.map((p, idx) => ({
                id: p.id || "prod-" + (idx + 1),
                name: { es: p.name || "", en: p.name || "" },
                tagline: { es: p.tagline || "", en: p.tagline || "" },
                description: {
                  es: p.description_card || "",
                  en: p.description_card || "",
                },
                descriptionDetail: {
                  es: p.description_detail || "",
                  en: p.description_detail || "",
                },
                image: p.image || "",
                category: p.category || "",
                features: {
                  es: (p.features_card || []).map((f) => f),
                  en: (p.features_card || []).map((f) => f),
                },
                order: idx + 1,
                archived: false,
              }))
            );
            setProductRows(seeded);
          });
      });
  }

  function newService() {
    const blank = {
      id: "service-" + Math.random().toString(36).slice(2, 8),
      icon: "Brain",
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      features: { es: [], en: [] },
      order: (rows?.length || 0) + 1,
      whatsapp: "51988496839",
      archived: false,
    };
    setEditing(blank);
    setModalMode("create");
    setShowForm(true);
  }

  function editService(row) {
    // deep clone to avoid editing list directly
    setEditing(JSON.parse(JSON.stringify(row)));
    setModalMode("edit");
    setShowForm(true);
  }
  // Manual save button: persists current rows
  async function save() {
    setSaving(true);
    try {
      if (section === "services") {
        await fetchJson("/api/services/save", {
          method: "POST",
          body: JSON.stringify({ data: normalizeOrder(rows) }),
        });
      } else if (section === "products") {
        const normalized = normalizeOrder(productRows);
        // Always cache locally first
        try {
          localStorage.setItem("admin_products", JSON.stringify(normalized));
        } catch {}
        try {
          await fetchJson("/api/products/save", {
            method: "POST",
            body: JSON.stringify({ data: normalized }),
          });
        } catch (e) {
          // Network/API down: keep local cache and continue
        }
      } else if (section === "team") {
        await fetchJson("/api/team/save", {
          method: "POST",
          body: JSON.stringify({ data: normalizeTeamOrder(teamRows) }),
        });
      }
      try {
        await notifyDevOnComplete?.("Datos guardados");
      } catch {}
    } catch (e) {
      alert("No se pudo guardar: " + (e?.message || e));
    } finally {
      setSaving(false);
    }
  }
  if (view === "login") {
    return (
      <div className="container-app pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form
          onSubmit={login}
          className="max-w-sm space-y-3 bg-white p-6 rounded-xl shadow"
        >
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Usuario"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
          <button className="btn-cta px-4 py-2" type="submit">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Table shows both active and archived in a stable order: actives first by order, then archived
  const tableRows = (Array.isArray(rows) ? [...rows] : []).sort((a, b) => {
    if (!!a.archived && !b.archived) return 1;
    if (!a.archived && !!b.archived) return -1;
    const ao = typeof a.order === "number" ? a.order : 999;
    const bo = typeof b.order === "number" ? b.order : 999;
    return ao - bo;
  });

  return (
    <div className="container-app pt-24 pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg border ${
              section === "services"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white"
            }`}
            onClick={() => {
              setSection("services");
              setSubView("list");
            }}
          >
            Servicios
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              section === "products"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white"
            }`}
            onClick={() => {
              setSection("products");
              setSubView("list");
            }}
          >
            Productos
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              section === "team"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white"
            }`}
            onClick={() => {
              setSection("team");
              setSubView("list");
            }}
          >
            Equipo
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              section === "research"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white opacity-60 cursor-not-allowed"
            }`}
            title="Próximamente"
            disabled
          >
            Investigación
          </button>
        </div>
        <div className="flex gap-2">
          {subView === "list" && (
            <>
              {section === "services" ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white"
                  onClick={newService}
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              ) : section === "products" ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white"
                  onClick={() => {
                    const blank = {
                      id: "product-" + Math.random().toString(36).slice(2, 8),
                      name: { es: "", en: "" },
                      tagline: { es: "", en: "" },
                      description: { es: "", en: "" },
                      descriptionDetail: { es: "", en: "" },
                      image: "",
                      category: "",
                      technicalSheets: { es: "", en: "" },
                      features: { es: [""], en: [""] },
                      featuresDetail: [],
                      specifications: {},
                      capabilities: [],
                      youtubeVideo: "",
                      additionalImages: [],
                      order:
                        (productRows?.filter((x) => !x.archived).length || 0) +
                        1,
                      archived: false,
                    };
                    setProductEditing(blank);
                    setProductModalMode("create");
                    setProductShowForm(true);
                  }}
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              ) : section === "team" ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white"
                  onClick={() => {
                    const blank = {
                      id: "team-" + Math.random().toString(36).slice(2, 8),
                      name: "",
                      role: "",
                      photo: "",
                      skills: [],
                      order:
                        (teamRows?.filter((x) => !x.archived).length || 0) + 1,
                      archived: false,
                    };
                    setTeamEditing(blank);
                    setTeamModalMode("create");
                    setTeamShowForm(true);
                  }}
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              ) : null}
              <button
                className="btn-cta px-4 py-2"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </>
          )}
          <button className="px-3 py-2 border rounded" onClick={logout}>
            Salir
          </button>
        </div>
      </div>

      {/* List view with new table */}
      {section === "services" && subView === "list" && (
        <ServicesTable
          services={tableRows}
          onView={(row) => {
            setEditing(row);
            setModalMode("view");
            setShowForm(true);
          }}
          onEdit={(row) => editService(row)}
          onArchiveToggle={(row) => {
            setConfirmRow(row);
            setShowConfirm(true);
          }}
        />
      )}
      {section === "products" && subView === "list" && (
        <ProductsTable
          products={[...(productRows || [])].sort((a, b) => {
            if (!!a.archived && !b.archived) return 1;
            if (!a.archived && !!b.archived) return -1;
            const ao = typeof a.order === "number" ? a.order : 999;
            const bo = typeof b.order === "number" ? b.order : 999;
            return ao - bo;
          })}
          onView={(row) => {
            setProductEditing(row);
            setProductModalMode("view");
            setProductShowForm(true);
          }}
          onEdit={(row) => {
            setProductEditing(JSON.parse(JSON.stringify(row)));
            setProductModalMode("edit");
            setProductShowForm(true);
          }}
          onArchiveToggle={(row) => {
            setProductConfirmRow(row);
            setProductShowConfirm(true);
          }}
        />
      )}
      {section === "team" && subView === "list" && (
        <TeamTable
          team={[...(teamRows || [])].sort((a, b) => {
            if (!!a.archived && !b.archived) return 1;
            if (!a.archived && !!b.archived) return -1;
            const ao = typeof a.order === "number" ? a.order : 999;
            const bo = typeof b.order === "number" ? b.order : 999;
            return ao - bo;
          })}
          onView={(row) => {
            setTeamEditing(row);
            setTeamModalMode("view");
            setTeamShowForm(true);
          }}
          onEdit={(row) => {
            setTeamEditing(JSON.parse(JSON.stringify(row)));
            setTeamModalMode("edit");
            setTeamShowForm(true);
          }}
          onArchiveToggle={(row) => {
            setTeamConfirmRow(row);
            setTeamShowConfirm(true);
          }}
        />
      )}

      {/* Modals */}
      <ServiceFormModal
        open={showForm}
        mode={modalMode}
        service={editing}
        onClose={() => setShowForm(false)}
        onSave={(payload) => {
          // Upsert respetando el orden elegido: insertar en 'order' y desplazar el resto
          let nextComputed = [];
          setRows((prev) => {
            // 1) Remove current row and compact active orders to contiguous 1..N
            const others = prev.filter((r) => r.id !== payload.id);
            const compact = normalizeOrder(others);
            if (payload.archived) {
              nextComputed = normalizeOrder([...compact, payload]);
              return nextComputed;
            }
            const active = compact.filter((x) => !x.archived);
            const activeCount = active.length;
            const req = Number(payload.order) || activeCount + 1;
            const target = Math.max(1, Math.min(req, activeCount + 1));
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= target) {
                return { ...r, order: Number(r.order) + 1 };
              }
              return r;
            });
            const next = [
              ...shifted,
              { ...payload, archived: false, order: target },
            ];
            nextComputed = normalizeOrder(next);
            return nextComputed;
          });
          // Auto-persistir inmediatamente
          persistRows(nextComputed, "auto-save: onSave service");
          setShowForm(false);
        }}
        onRestore={(toRestore) => {
          if (!toRestore) return;
          let nextComputed = [];
          setRows((prev) => {
            const compact = normalizeOrder(prev);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
            const req = Math.max(
              1,
              Math.min(Number(toRestore.order) || max + 1, max + 1)
            );
            // shift down any active with order >= req
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= req) {
                return { ...r, order: Number(r.order) + 1 };
              }
              return r;
            });
            const next = shifted.map((r) =>
              r.id === toRestore.id ? { ...r, archived: false, order: req } : r
            );
            nextComputed = normalizeOrder(next);
            return nextComputed;
          });
          // Auto-persistir inmediatamente
          persistRows(nextComputed, "auto-save: restore service");
          setShowForm(false);
        }}
      />
      <ProductFormModal
        open={productShowForm}
        mode={productModalMode}
        product={productEditing}
        onClose={() => setProductShowForm(false)}
        onSave={(payload) => {
          let nextComputed = [];
          setProductRows((prev) => {
            const others = prev.filter((r) => r.id !== payload.id);
            const compact = normalizeOrder(others);
            if (payload.archived) {
              nextComputed = normalizeOrder([...compact, payload]);
              return nextComputed;
            }
            const active = compact.filter((x) => !x.archived);
            const activeCount = active.length;
            const req = Number(payload.order) || activeCount + 1;
            const target = Math.max(1, Math.min(req, activeCount + 1));
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= target) {
                return { ...r, order: Number(r.order) + 1 };
              }
              return r;
            });
            const next = [
              ...shifted,
              { ...payload, archived: false, order: target },
            ];
            nextComputed = normalizeOrder(next);
            return nextComputed;
          });
          persistProductRows(nextComputed, "auto-save: onSave product");
          setProductShowForm(false);
        }}
        onRestore={(toRestore) => {
          if (!toRestore) return;
          let nextComputed = [];
          setProductRows((prev) => {
            const compact = normalizeOrder(prev);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
            const req = Math.max(
              1,
              Math.min(Number(toRestore.order) || max + 1, max + 1)
            );
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= req) {
                return { ...r, order: Number(r.order) + 1 };
              }
              return r;
            });
            const next = shifted.map((r) =>
              r.id === toRestore.id ? { ...r, archived: false, order: req } : r
            );
            nextComputed = normalizeOrder(next);
            return nextComputed;
          });
          persistProductRows(nextComputed, "auto-save: restore product");
          setProductShowForm(false);
        }}
      />
      <TeamFormModal
        open={teamShowForm}
        mode={teamModalMode}
        member={teamEditing}
        onClose={() => setTeamShowForm(false)}
        onSave={(payload) => {
          let nextComputed = [];
          setTeamRows((prev) => {
            const others = prev.filter((r) => r.id !== payload.id);
            const compact = normalizeTeamOrder(others);
            if (payload.archived) {
              nextComputed = normalizeTeamOrder([...compact, payload]);
              return nextComputed;
            }
            const active = compact.filter((x) => !x.archived);
            const activeCount = active.length;
            const req = Number(payload.order) || activeCount + 1;
            const target = Math.max(1, Math.min(req, activeCount + 1));
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= target)
                return { ...r, order: Number(r.order) + 1 };
              return r;
            });
            const next = [
              ...shifted,
              { ...payload, archived: false, order: target },
            ];
            nextComputed = normalizeTeamOrder(next);
            return nextComputed;
          });
          persistTeamRows(nextComputed, "auto-save: onSave team");
          setTeamShowForm(false);
        }}
        onRestore={(toRestore) => {
          if (!toRestore) return;
          let nextComputed = [];
          setTeamRows((prev) => {
            const compact = normalizeTeamOrder(prev);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
            const req = Math.max(
              1,
              Math.min(Number(toRestore.order) || max + 1, max + 1)
            );
            const shifted = compact.map((r) => {
              if (!r.archived && Number(r.order) >= req)
                return { ...r, order: Number(r.order) + 1 };
              return r;
            });
            const next = shifted.map((r) =>
              r.id === toRestore.id ? { ...r, archived: false, order: req } : r
            );
            nextComputed = normalizeTeamOrder(next);
            return nextComputed;
          });
          persistTeamRows(nextComputed, "auto-save: restore team");
          setTeamShowForm(false);
        }}
      />
      <TeamArchiveConfirmModal
        open={teamShowConfirm}
        member={teamConfirmRow}
        activeCount={(teamRows || []).filter((x) => !x.archived).length}
        onClose={() => setTeamShowConfirm(false)}
        onConfirm={(restoreAt) => {
          if (!teamConfirmRow) return;
          const willArchive = !teamConfirmRow.archived;
          if (willArchive) {
            let nextComputed = [];
            setTeamRows((prev) => {
              nextComputed = normalizeTeamOrder(
                prev.map((r) =>
                  r.id === teamConfirmRow.id
                    ? { ...r, archived: true, order: r.order }
                    : r
                )
              );
              return nextComputed;
            });
            persistTeamRows(nextComputed, "auto-save: archive team");
            setTeamShowConfirm(false);
          } else {
            let nextComputed = [];
            setTeamRows((prev) => {
              const compact = normalizeTeamOrder(prev);
              const active = compact.filter((x) => !x.archived);
              const max = Math.max(
                0,
                ...active.map((x) => Number(x.order) || 0)
              );
              const target =
                typeof restoreAt === "number"
                  ? Math.max(1, Math.min(restoreAt, max + 1))
                  : max + 1;
              const shifted = compact.map((r) => {
                if (!r.archived && Number(r.order) >= target)
                  return { ...r, order: Number(r.order) + 1 };
                return r;
              });
              const next = shifted.map((r) =>
                r.id === teamConfirmRow.id
                  ? { ...r, archived: false, order: target }
                  : r
              );
              nextComputed = normalizeTeamOrder(next);
              return nextComputed;
            });
            persistTeamRows(nextComputed, "auto-save: restore team from modal");
            setTeamShowConfirm(false);
          }
        }}
      />
      <ArchiveConfirmModal
        open={showConfirm}
        service={confirmRow}
        activeCount={(rows || []).filter((x) => !x.archived).length}
        onClose={() => setShowConfirm(false)}
        onConfirm={(restoreAt) => {
          if (!confirmRow) return;
          const willArchive = !confirmRow.archived;
          if (willArchive) {
            // Archivar: quitar estado activo y compactar orden
            let nextComputed = [];
            setRows((prev) => {
              nextComputed = normalizeOrder(
                prev.map((r) =>
                  r.id === confirmRow.id
                    ? { ...r, archived: true, order: r.order }
                    : r
                )
              );
              return nextComputed;
            });
            persistRows(nextComputed, "auto-save: archive service");
            setShowConfirm(false);
          } else {
            // Restaurar: colocar en el orden elegido o al final
            let nextComputed = [];
            setRows((prev) => {
              const compact = normalizeOrder(prev);
              const active = compact.filter((x) => !x.archived);
              const max = Math.max(
                0,
                ...active.map((x) => Number(x.order) || 0)
              );
              const target =
                typeof restoreAt === "number"
                  ? Math.max(1, Math.min(restoreAt, max + 1))
                  : max + 1;
              // shift down any active with order >= target
              const shifted = compact.map((r) => {
                if (!r.archived && Number(r.order) >= target) {
                  return { ...r, order: Number(r.order) + 1 };
                }
                return r;
              });
              const next = shifted.map((r) =>
                r.id === confirmRow.id
                  ? { ...r, archived: false, order: target }
                  : r
              );
              nextComputed = normalizeOrder(next);
              return nextComputed;
            });
            persistRows(nextComputed, "auto-save: restore from modal");
            setShowConfirm(false);
          }
        }}
      />
      <ProductArchiveConfirmModal
        open={productShowConfirm}
        product={productConfirmRow}
        activeCount={(productRows || []).filter((x) => !x.archived).length}
        onClose={() => setProductShowConfirm(false)}
        onConfirm={(restoreAt) => {
          if (!productConfirmRow) return;
          const willArchive = !productConfirmRow.archived;
          if (willArchive) {
            let nextComputed = [];
            setProductRows((prev) => {
              nextComputed = normalizeOrder(
                prev.map((r) =>
                  r.id === productConfirmRow.id
                    ? { ...r, archived: true, order: r.order }
                    : r
                )
              );
              return nextComputed;
            });
            persistProductRows(nextComputed, "auto-save: archive product");
            setProductShowConfirm(false);
          } else {
            let nextComputed = [];
            setProductRows((prev) => {
              const compact = normalizeOrder(prev);
              const active = compact.filter((x) => !x.archived);
              const max = Math.max(
                0,
                ...active.map((x) => Number(x.order) || 0)
              );
              const target =
                typeof restoreAt === "number"
                  ? Math.max(1, Math.min(restoreAt, max + 1))
                  : max + 1;
              const shifted = compact.map((r) => {
                if (!r.archived && Number(r.order) >= target)
                  return { ...r, order: Number(r.order) + 1 };
                return r;
              });
              const next = shifted.map((r) =>
                r.id === productConfirmRow.id
                  ? { ...r, archived: false, order: target }
                  : r
              );
              nextComputed = normalizeOrder(next);
              return nextComputed;
            });
            persistProductRows(
              nextComputed,
              "auto-save: restore product from modal"
            );
            setProductShowConfirm(false);
          }
        }}
      />
    </div>
  );
}

// Ensure active (non-archived) items have consecutive order values 1..N without gaps.
// Archived items keep their existing order value but are ignored in the renumbering.
function normalizeOrder(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  const active = arr
    .filter((r) => !r.archived)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  active.forEach((item, idx) => {
    item.order = idx + 1;
  });
  // Merge back with archived untouched
  const byId = new Map(active.map((x) => [x.id, x]));
  return arr.map((r) => (r.archived ? r : byId.get(r.id) || r));
}
