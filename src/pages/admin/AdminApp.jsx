import React, { useEffect, useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import ServicesTable from "./components/services/ServicesTable";
import ProductsTable from "./components/products/ProductsTable";
import TeamTable from "./components/team/TeamTable";
import ResearchTable from "./components/research/ResearchTable";
import ServiceFormModal from "./components/services/ServiceFormModal";
import ProductFormModal from "./components/products/ProductFormModal";
import ArchiveConfirmModal from "./components/services/ArchiveConfirmModal";
import ProductArchiveConfirmModal from "./components/products/ProductArchiveConfirmModal";
import TeamFormModal from "./components/team/TeamFormModal";
import TeamArchiveConfirmModal from "./components/team/TeamArchiveConfirmModal";
import ResearchFormModal from "./components/research/ResearchFormModal";
import ResearchArchiveConfirmModal from "./components/research/ResearchArchiveConfirmModal";
import { notifyDevOnComplete } from "../../config/devNotify";
import { normalizeTeamMember, normalizeTeamOrder } from "../../models/team";
import { useProducts } from "../../context/ProductsContext";
// ✅ Importar utilidades comunes para CRUD escalable
import {
  normalizeOrder as normalizeOrderCommon,
  upsertWithReorder,
  restoreItem,
  archiveItem,
} from "../../utils/crudHelpers";

async function fetchJson(url, options = {}) {
  const opts = {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    // Always send cookies for auth-protected dev API and avoid stale caches
    credentials: "include",
    cache: "no-store",
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
    console.warn("fetchJson error", { url, status: res.status, body: text });
    const err = new Error(msg || "request_failed");
    err.__raw = text;
    err.__status = res.status;
    throw err;
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
  const [showPass, setShowPass] = useState(false);
  const [rows, setRows] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [teamRows, setTeamRows] = useState([]);
  const [researchRows, setResearchRows] = useState([]);
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
  const [researchEditing, setResearchEditing] = useState(null);
  const [researchShowForm, setResearchShowForm] = useState(false);
  const [researchModalMode, setResearchModalMode] = useState("view");
  const [researchConfirmRow, setResearchConfirmRow] = useState(null);
  const [researchShowConfirm, setResearchShowConfirm] = useState(false);
  const auth = useAuth();
  const { refreshProducts } = useProducts();

  // Auto-persist helpers
  async function persistRows(nextRows, reason = "auto-save") {
    // IMPORTANT: nextRows should ALREADY be normalized before calling this function
    try {
      console.log("🟢 [persistRows] Called with length:", nextRows.length);
      console.log("🟢 [persistRows] First item:", nextRows[0]?.id);
      console.log("🟢 [persistRows] Sending to API, length:", nextRows.length);

      await fetchJson("/api/services/save", {
        method: "POST",
        body: JSON.stringify({
          data: nextRows, // ← REMOVED normalizeOrder call
          message: reason,
        }),
      });
      return true;
    } catch (e) {
      console.warn("Auto-persist failed:", e?.message || e);
      return false;
    }
  }
  async function persistTeamRows(nextRows, reason = "auto-save") {
    // Returns true on success, false on failure
    // IMPORTANT: nextRows should ALREADY be normalized before calling this function
    try {
      console.log("🟢 [persistTeamRows] Called with length:", nextRows.length);
      console.log("🟢 [persistTeamRows] First item:", nextRows[0]?.id);

      // Keep a small local cache like products, for resilience when API is down
      try {
        localStorage.setItem(
          "admin_team",
          JSON.stringify(nextRows) // ← REMOVED normalizeTeamOrder call
        );
      } catch {}

      console.log(
        "🟢 [persistTeamRows] Sending to API, length:",
        nextRows.length
      );

      await fetchJson("/api/team/save", {
        method: "POST",
        body: JSON.stringify({
          data: nextRows, // ← REMOVED normalizeTeamOrder call
          message: reason,
        }),
      });
      return true;
    } catch (e) {
      console.warn("Auto-persist team failed:", e?.message || e);
      return false;
    }
  }
  async function persistProductRows(nextRows, reason = "auto-save") {
    // Returns true if saved to API, false otherwise.
    // IMPORTANT: nextRows should ALREADY be normalized before calling this function
    try {
      console.log(
        "🟢 [persistProductRows] Called with length:",
        nextRows.length
      );
      console.log("🟢 [persistProductRows] First item:", nextRows[0]?.id);

      // Always keep a local fallback cache
      try {
        localStorage.setItem(
          "admin_products",
          JSON.stringify(nextRows) // ← REMOVED normalizeOrder call
        );
      } catch {}

      console.log(
        "🟢 [persistProductRows] Sending to API, length:",
        nextRows.length
      );

      await fetchJson("/api/products/save", {
        method: "POST",
        body: JSON.stringify({
          data: nextRows, // ← REMOVED normalizeOrder call
          message: reason,
        }),
      });
      return true;
    } catch (e) {
      console.warn("Auto-persist products failed:", e?.message || e);
      return false;
    }
  }

  async function persistResearchRows(nextRows, reason = "auto-save") {
    try {
      console.log(
        "🟢 [persistResearchRows] Called with length:",
        nextRows.length
      );
      await fetchJson("/api/research/save", {
        method: "POST",
        body: JSON.stringify({
          data: nextRows,
          message: reason,
        }),
      });
      return true;
    } catch (e) {
      console.warn("Auto-persist research failed:", e?.message || e);
      return false;
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
      loadResearch();
    } else {
      setView("login");
    }
  }, [auth]);

  async function login(e) {
    e.preventDefault();
    try {
      const payload = {
        username: (form.username || "").trim(),
        password: (form.password || "").trim(),
      };
      const d = await fetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
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
    const tryPublicFallback = async () => {
      try {
        const r = await fetch("/content/services.json");
        if (!r.ok) return;
        const raw = await r.json();
        const data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        if (data?.length) {
          const normalized = normalizeOrder(data);
          setRows(normalized);
          // if API is available later, persist so both admin/public stay in sync
          try {
            await persistRows(normalized, "seed services from public content");
          } catch {}
        }
      } catch {}
    };
    fetchJson("/api/services/list")
      .then((d) => {
        if (d.ok) {
          const data = Array.isArray(d.data) ? d.data : [];
          setRows(normalizeOrder(data));
        }
      })
      .catch(() => {
        // API down? Try public JSON
        tryPublicFallback();
      });
  }

  function loadTeam() {
    const tryPublicFallback = async () => {
      try {
        const r = await fetch("/content/team.json");
        if (!r.ok) return;
        const raw = await r.json();
        const data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        if (data?.length) {
          const normalized = normalizeTeamOrder(
            data.map((m) => normalizeTeamMember(m))
          );
          setTeamRows(normalized);
          try {
            await persistTeamRows(normalized, "seed team from public content");
          } catch {}
          return true;
        }
      } catch {}
      return false;
    };
    fetchJson("/api/team/list")
      .then(async (d) => {
        if (d.ok) {
          let data = Array.isArray(d.data) ? d.data : [];
          setTeamRows(normalizeTeamOrder(data.map(normalizeTeamMember)));
        }
      })
      .catch(async () => {
        // API down? Try public JSON first; si no, queda vacío
        const fromPublic = await tryPublicFallback();
        if (fromPublic) return;
        setTeamRows([]);
      });
  }

  // 🔧 Función para migrar productos con estructura legacy a bilingüe
  function migrateProduct(product) {
    const migrated = { ...product };

    // Migrar category si viene como string
    if (typeof migrated.category === "string") {
      migrated.category = {
        es: migrated.category,
        en: "",
      };
    }

    // Migrar features si vienen como array simple
    if (Array.isArray(migrated.features)) {
      migrated.features = {
        es: migrated.features,
        en: [],
      };
    }

    // Migrar specifications si viene como objeto plano (sin es/en)
    if (
      migrated.specifications &&
      typeof migrated.specifications === "object" &&
      !migrated.specifications.es &&
      !migrated.specifications.en
    ) {
      migrated.specifications = {
        es: migrated.specifications,
        en: {},
      };
    }

    // Migrar capabilities si viene como array simple
    if (Array.isArray(migrated.capabilities)) {
      migrated.capabilities = {
        es: migrated.capabilities,
        en: [],
      };
    }

    return migrated;
  }

  function loadProducts() {
    fetchJson("/api/products/list")
      .then((d) => {
        if (d.ok) {
          let data = Array.isArray(d.data) ? d.data : [];
          // 🔧 Migrar cada producto antes de guardar
          data = data.map(migrateProduct);
          setProductRows(normalizeOrder(data));
        }
      })
      .catch(() => {
        // Try public content JSON as best effort
        fetchJson("/content/products.json")
          .then((d) => {
            const data = Array.isArray(d)
              ? d
              : Array.isArray(d?.data)
              ? d.data
              : [];
            // 🔧 Migrar cada producto antes de guardar
            const migrated = data.map(migrateProduct);
            setProductRows(normalizeOrder(migrated));
          })
          .catch(() => setProductRows([]));
      });
  }

  function loadResearch() {
    fetchJson("/api/research/list")
      .then((d) => {
        if (d.ok) {
          let data = Array.isArray(d.data) ? d.data : [];
          // Filtrar duplicados por slug (quedarnos con el primero)
          const uniqueData = data.reduce((acc, item) => {
            if (!acc.some((existing) => existing.slug === item.slug)) {
              acc.push(item);
            }
            return acc;
          }, []);
          const normalized = normalizeOrder(uniqueData);
          setResearchRows(normalized);
        }
      })
      .catch((err) => {
        // Try public content JSON as best effort
        fetchJson("/content/research.json")
          .then((d) => {
            const data = Array.isArray(d)
              ? d
              : Array.isArray(d?.data)
              ? d.data
              : [];
            // Filtrar duplicados por slug (quedarnos con el primero)
            const uniqueData = data.reduce((acc, item) => {
              if (!acc.some((existing) => existing.slug === item.slug)) {
                acc.push(item);
              }
              return acc;
            }, []);
            const normalized = normalizeOrder(uniqueData);
            setResearchRows(normalized);
          })
          .catch((err2) => {
            console.error("Failed to load research:", err2);
            setResearchRows([]);
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
          <div className="relative">
            <input
              className="w-full border px-3 py-2 rounded pr-10"
              placeholder="Contraseña"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPass ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
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
                : "bg-white"
            }`}
            onClick={() => {
              setSection("research");
              setSubView("list");
            }}
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
              ) : null}
              {section === "products" ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white"
                  title="Restaurar productos desde respaldo"
                  onClick={async () => {
                    try {
                      // 1) Try backup files
                      const b = await fetchJson("/api/products/backups");
                      const files = Array.isArray(b?.files) ? b.files : [];
                      if (files.length) {
                        const latest = files[0];
                        const r = await fetchJson(
                          `/api/products/restore?file=${encodeURIComponent(
                            latest
                          )}`,
                          { method: "POST" }
                        );
                        if (r?.ok) {
                          await loadProducts();
                          alert(
                            "Productos restaurados desde respaldo: " + latest
                          );
                          return;
                        }
                      }
                      // 2) Try localStorage cache
                      try {
                        const cached = localStorage.getItem("admin_products");
                        if (cached) {
                          const data = JSON.parse(cached);
                          if (Array.isArray(data) && data.length) {
                            setProductRows(data);
                            await fetchJson("/api/products/save", {
                              method: "POST",
                              body: JSON.stringify({ data }),
                            });
                            alert("Productos restaurados desde caché local");
                            return;
                          }
                        }
                      } catch {}
                      alert("No se encontraron respaldos disponibles");
                    } catch (e) {
                      alert("Error restaurando: " + (e?.message || e));
                    }
                  }}
                >
                  Restaurar
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
              ) : section === "research" ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white"
                  onClick={() => {
                    const blank = {
                      id: "research-" + Math.random().toString(36).slice(2, 8),
                      slug: "",
                      order:
                        (researchRows?.filter((x) => !x.archived).length || 0) +
                        1,
                      localImage: "",
                      journal: "",
                      date: new Date().toISOString().split("T")[0],
                      title: { es: "", en: "" },
                      summary_30w: { es: "", en: "" },
                      keywords: [],
                      products: [],
                      fullSummary: { es: "", en: "" },
                      methodology: { es: "", en: "" },
                      results: { es: "", en: "" },
                      conclusions: { es: "", en: "" },
                      download_link_DOI: "",
                      download_link_pdf: "",
                      href: "",
                      archived: false,
                    };
                    setResearchEditing(blank);
                    setResearchModalMode("create");
                    setResearchShowForm(true);
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
      {section === "research" && subView === "list" && (
        <ResearchTable
          research={[...(researchRows || [])].sort((a, b) => {
            if (!!a.archived && !b.archived) return 1;
            if (!a.archived && !!b.archived) return -1;
            const ao = typeof a.order === "number" ? a.order : 999;
            const bo = typeof b.order === "number" ? b.order : 999;
            return ao - bo;
          })}
          onView={(row) => {
            setResearchEditing(row);
            setResearchModalMode("view");
            setResearchShowForm(true);
          }}
          onEdit={(row) => {
            setResearchEditing(JSON.parse(JSON.stringify(row)));
            setResearchModalMode("edit");
            setResearchShowForm(true);
          }}
          onArchiveToggle={(row) => {
            // ✅ Si está archivado, abrir modal en modo "restore"
            // ✅ Si está activo, mostrar confirmación de archivado
            if (row.archived) {
              setResearchEditing(JSON.parse(JSON.stringify(row)));
              setResearchModalMode("restore");
              setResearchShowForm(true);
            } else {
              setResearchConfirmRow(row);
              setResearchShowConfirm(true);
            }
          }}
        />
      )}

      {/* Modals */}
      <ServiceFormModal
        open={showForm}
        mode={modalMode}
        service={editing}
        onClose={() => setShowForm(false)}
        onSave={async (payload) => {
          // Upsert: Calculate OUTSIDE setRows (like Products)
          console.log("🔵 [SERVICE onSave] Payload:", {
            id: payload.id,
            order: payload.order,
            archived: payload.archived,
          });
          console.log("🔵 [SERVICE onSave] Current rows length:", rows.length);

          // 1) Remove current row and compact active orders to contiguous 1..N
          const others = rows.filter((r) => r.id !== payload.id);
          const compact = normalizeOrder(others);

          let nextComputed;
          if (payload.archived) {
            nextComputed = normalizeOrder([...compact, payload]);
          } else {
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
          }

          console.log(
            "🔵 [SERVICE onSave] After normalizeOrder, length:",
            nextComputed.length
          );

          // Update state
          setRows(nextComputed);

          // Auto-persist immediately
          const ok = await persistRows(
            nextComputed,
            "auto-save: onSave service"
          );
          if (!ok) {
            alert(
              "No se pudo guardar el servicio. Revisa la conexión del API de desarrollo. Tus cambios locales se conservaron temporalmente."
            );
          } else {
            loadServices();
          }
          setShowForm(false);
        }}
        onRestore={async (toRestore) => {
          if (!toRestore) return;

          // Restore: Calculate OUTSIDE setRows (like Products)
          console.log("🟢 [SERVICE onRestore] toRestore:", {
            id: toRestore.id,
            order: toRestore.order,
          });

          const compact = normalizeOrder(rows);
          const active = compact.filter((x) => !x.archived);
          const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
          const req = Math.max(
            1,
            Math.min(Number(toRestore.order) || max + 1, max + 1)
          );

          console.log("🟢 [SERVICE onRestore] Calculated req:", req);

          // Shift down any active with order >= req
          const shifted = compact.map((r) => {
            if (!r.archived && Number(r.order) >= req) {
              return { ...r, order: Number(r.order) + 1 };
            }
            return r;
          });

          const next = shifted.map((r) =>
            r.id === toRestore.id ? { ...r, archived: false, order: req } : r
          );

          const nextComputed = normalizeOrder(next);
          console.log(
            "🟢 [SERVICE onRestore] After normalizeOrder, length:",
            nextComputed.length
          );

          // Update state
          setRows(nextComputed);

          // Auto-persist immediately
          const ok = await persistRows(
            nextComputed,
            "auto-save: restore service"
          );
          if (!ok) {
            alert(
              "No se pudo restaurar el servicio. Verifica la conexión del API de desarrollo."
            );
          } else {
            loadServices();
          }
          setShowForm(false);
        }}
      />
      <ProductFormModal
        open={productShowForm}
        mode={productModalMode}
        product={productEditing}
        onClose={() => setProductShowForm(false)}
        onSave={async (payload) => {
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
          const ok = await persistProductRows(
            nextComputed,
            "auto-save: onSave product"
          );
          if (!ok) {
            alert(
              "No se pudo guardar el producto. Revisa la conexión del API de desarrollo. Tus cambios locales se conservaron temporalmente."
            );
          } else {
            // Keep admin list in sync with source of truth
            loadProducts();
            // Refresh navbar products
            refreshProducts();
          }
          setProductShowForm(false);
        }}
        onRestore={async (toRestore) => {
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
          const ok = await persistProductRows(
            nextComputed,
            "auto-save: restore product"
          );
          if (!ok) {
            alert(
              "No se pudo restaurar el producto. Revisa la conexión del API de desarrollo."
            );
          } else {
            loadProducts();
            refreshProducts();
          }
          setProductShowForm(false);
        }}
      />
      <TeamFormModal
        open={teamShowForm}
        mode={teamModalMode}
        member={teamEditing}
        onClose={() => setTeamShowForm(false)}
        onSave={async (payload) => {
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
          const ok = await persistTeamRows(
            nextComputed,
            "auto-save: onSave team"
          );
          if (!ok) {
            alert(
              "No se pudo guardar el miembro del equipo. Revisa la conexión del API de desarrollo."
            );
          } else {
            loadTeam();
          }
          setTeamShowForm(false);
        }}
        onRestore={async (toRestore) => {
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
          const ok = await persistTeamRows(
            nextComputed,
            "auto-save: restore team"
          );
          if (!ok) {
            alert(
              "No se pudo restaurar el miembro del equipo. Revisa la conexión del API de desarrollo."
            );
          } else {
            loadTeam();
          }
          setTeamShowForm(false);
        }}
      />
      <TeamArchiveConfirmModal
        open={teamShowConfirm}
        member={teamConfirmRow}
        activeCount={(teamRows || []).filter((x) => !x.archived).length}
        onClose={() => setTeamShowConfirm(false)}
        onConfirm={async (restoreAt) => {
          if (!teamConfirmRow) return;
          const willArchive = !teamConfirmRow.archived;
          if (willArchive) {
            // Calculate BEFORE setTeamRows
            const mapped = teamRows.map((r) =>
              r.id === teamConfirmRow.id
                ? { ...r, archived: true, order: r.order }
                : r
            );
            const nextComputed = normalizeTeamOrder(mapped);

            // Update state
            setTeamRows(nextComputed);

            const ok = await persistTeamRows(
              nextComputed,
              "auto-save: archive team"
            );
            if (!ok) {
              alert(
                "No se pudo archivar el miembro. Verifica que el servidor de desarrollo esté activo y el endpoint /api disponible."
              );
            } else {
              loadTeam();
            }
            setTeamShowConfirm(false);
          } else {
            // Restore: calculate BEFORE setTeamRows
            const compact = normalizeTeamOrder(teamRows);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
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
            const nextComputed = normalizeTeamOrder(next);

            // Update state
            setTeamRows(nextComputed);

            const ok = await persistTeamRows(
              nextComputed,
              "auto-save: restore team from modal"
            );
            if (!ok) {
              alert(
                "No se pudo restaurar el miembro del equipo. Verifica la conexión del API de desarrollo."
              );
            } else {
              loadTeam();
            }
            setTeamShowConfirm(false);
          }
        }}
      />
      <ArchiveConfirmModal
        open={showConfirm}
        service={confirmRow}
        activeCount={(rows || []).filter((x) => !x.archived).length}
        onClose={() => setShowConfirm(false)}
        onConfirm={async (restoreAt) => {
          if (!confirmRow) return;
          const willArchive = !confirmRow.archived;
          if (willArchive) {
            // Archivar: Calculate nextComputed OUTSIDE setRows (like Products)
            console.log(
              "🔵 [ARCHIVE SERVICE] Starting archive for:",
              confirmRow.id
            );
            console.log(
              "🔵 [ARCHIVE SERVICE] Current rows length:",
              rows.length
            );

            const mapped = rows.map((r) =>
              r.id === confirmRow.id
                ? { ...r, archived: true, order: r.order }
                : r
            );
            console.log(
              "🔵 [ARCHIVE SERVICE] After map, length:",
              mapped.length
            );

            const nextComputed = normalizeOrder(mapped);
            console.log(
              "🔵 [ARCHIVE SERVICE] After normalizeOrder, length:",
              nextComputed.length
            );
            console.log(
              "🔵 [ARCHIVE SERVICE] nextComputed sample:",
              nextComputed[0]
            );

            // Update state with calculated value
            setRows(nextComputed);

            console.log(
              "🔵 [ARCHIVE SERVICE] Before persistRows, length:",
              nextComputed.length
            );

            const ok = await persistRows(
              nextComputed,
              "auto-save: archive service"
            );
            if (!ok) {
              alert(
                "No se pudo archivar. Verifica que el servidor de desarrollo esté activo (npm run dev) y que el endpoint /api esté disponible."
              );
            } else {
              loadServices();
            }
            setShowConfirm(false);
          } else {
            // Restaurar: Calculate OUTSIDE setRows (like Products)
            console.log(
              "🟢 [RESTORE SERVICE] Starting restore for:",
              confirmRow.id
            );
            console.log("🟢 [RESTORE SERVICE] Target position:", restoreAt);

            const compact = normalizeOrder(rows);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
            const target =
              typeof restoreAt === "number"
                ? Math.max(1, Math.min(restoreAt, max + 1))
                : max + 1;

            console.log("🟢 [RESTORE SERVICE] Calculated target:", target);

            // Shift down any active with order >= target
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

            const nextComputed = normalizeOrder(next);
            console.log(
              "🟢 [RESTORE SERVICE] After normalizeOrder, length:",
              nextComputed.length
            );

            // Update state
            setRows(nextComputed);

            const ok = await persistRows(
              nextComputed,
              "auto-save: restore from modal"
            );
            if (!ok) {
              alert(
                "No se pudo restaurar el servicio. Verifica la conexión del API de desarrollo."
              );
            } else {
              loadServices();
            }
            setShowConfirm(false);
          }
        }}
      />
      <ProductArchiveConfirmModal
        open={productShowConfirm}
        product={productConfirmRow}
        activeCount={(productRows || []).filter((x) => !x.archived).length}
        onClose={() => setProductShowConfirm(false)}
        onConfirm={async (restoreAt) => {
          if (!productConfirmRow) return;
          const willArchive = !productConfirmRow.archived;
          if (willArchive) {
            console.log(
              "🔵 [ARCHIVE PRODUCT] Starting archive for:",
              productConfirmRow.id
            );
            console.log(
              "🔵 [ARCHIVE PRODUCT] Current productRows length:",
              productRows.length
            );

            // Calculate nextComputed BEFORE setProductRows
            const mapped = productRows.map((r) =>
              r.id === productConfirmRow.id
                ? { ...r, archived: true, order: r.order }
                : r
            );
            console.log(
              "🔵 [ARCHIVE PRODUCT] After map, length:",
              mapped.length
            );

            const nextComputed = normalizeOrder(mapped);
            console.log(
              "🔵 [ARCHIVE PRODUCT] After normalizeOrder, length:",
              nextComputed.length
            );
            console.log(
              "🔵 [ARCHIVE PRODUCT] nextComputed sample:",
              nextComputed[0]
            );

            // Update state with the calculated value
            setProductRows(nextComputed);

            console.log(
              "🔵 [ARCHIVE PRODUCT] Before persistProductRows, length:",
              nextComputed.length
            );

            const ok = await persistProductRows(
              nextComputed,
              "auto-save: archive product"
            );
            if (!ok) {
              alert(
                "No se pudo archivar. Verifica que el servidor de desarrollo esté activo (npm run dev) y que el endpoint /api esté disponible."
              );
            } else {
              loadProducts();
              refreshProducts();
            }
            setProductShowConfirm(false);
          } else {
            // Restore: calculate BEFORE setProductRows
            const compact = normalizeOrder(productRows);
            const active = compact.filter((x) => !x.archived);
            const max = Math.max(0, ...active.map((x) => Number(x.order) || 0));
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
            const nextComputed = normalizeOrder(next);

            // Update state
            setProductRows(nextComputed);

            const ok = await persistProductRows(
              nextComputed,
              "auto-save: restore product from modal"
            );
            if (!ok) {
              alert(
                "No se pudo restaurar el producto. Verifica la conexión del API de desarrollo."
              );
            } else {
              loadProducts();
              refreshProducts();
            }
            setProductShowConfirm(false);
          }
        }}
      />
      <ResearchFormModal
        open={researchShowForm}
        article={researchEditing}
        onClose={() => setResearchShowForm(false)}
        mode={researchModalMode}
        allRows={researchRows}
        onSave={async (payload) => {
          console.log("🟢 [Research onSave] Payload received:", {
            id: payload.id,
            slug: payload.slug,
            order: payload.order,
            archived: payload.archived,
          });

          // ✅ Usar función común escalable para upsert con reordenamiento
          let nextComputed = [];
          setResearchRows((prev) => {
            console.log("🟢 [Research onSave] Current rows:", prev.length);
            nextComputed = upsertWithReorder(prev, payload);
            console.log("🟢 [Research onSave] Next rows:", nextComputed.length);
            return nextComputed;
          });

          const ok = await persistResearchRows(
            nextComputed,
            "auto-save: onSave research"
          );
          if (!ok) {
            alert(
              "No se pudo guardar el artículo. Revisa la conexión del API."
            );
          } else {
            loadResearch();
          }

          console.log("✅ Research saved:", payload);
          setResearchShowForm(false);
        }}
        onRestore={async (payload) => {
          console.log("🟢 [Research onRestore] Payload received:", {
            id: payload.id,
            slug: payload.slug,
            order: payload.order,
            archived: payload.archived,
            title: payload.title,
          });

          // ⚠️ IMPORTANTE: Usar upsertWithReorder para preservar TODAS las modificaciones
          // restoreItem solo cambia archived/order pero ignora otros campos editados
          let nextComputed = [];
          setResearchRows((prev) => {
            console.log("🟢 [Research onRestore] Current rows:", prev.length);

            // ✅ Asegurar que archived sea false en el payload
            const payloadWithActiveState = {
              ...payload,
              archived: false, // Forzar estado activo
            };

            // ✅ Usar upsertWithReorder que actualiza TODOS los campos del payload
            nextComputed = upsertWithReorder(prev, payloadWithActiveState);
            console.log(
              "🟢 [Research onRestore] Next rows:",
              nextComputed.length
            );
            return nextComputed;
          });

          const ok = await persistResearchRows(
            nextComputed,
            "auto-save: restore research"
          );
          if (!ok) {
            alert(
              "No se pudo restaurar el artículo. Revisa la conexión del API."
            );
          } else {
            loadResearch();
          }

          console.log("✅ Research restored with all modifications:", payload);
          setResearchShowForm(false);
        }}
      />
      <ResearchArchiveConfirmModal
        open={researchShowConfirm}
        article={researchConfirmRow}
        onCancel={() => {
          setResearchShowConfirm(false);
          setResearchConfirmRow(null);
        }}
        onConfirm={async () => {
          if (!researchConfirmRow) return;

          const isArchiving = !researchConfirmRow.archived;
          let nextComputed = [];

          console.log("🔵 [Archive/Restore] Start - isArchiving:", isArchiving);
          console.log("🔵 [Archive/Restore] Article:", researchConfirmRow.slug);
          console.log(
            "🔵 [Archive/Restore] Current rows:",
            researchRows.length
          );

          try {
            // ✅ Usar funciones comunes escalables
            if (isArchiving) {
              nextComputed = archiveItem(researchRows, researchConfirmRow);
              console.log("🔵 [Archive] Computed rows:", nextComputed.length);
            } else {
              nextComputed = restoreItem(researchRows, researchConfirmRow);
              console.log("🔵 [Restore] Computed rows:", nextComputed.length);
            }

            console.log(
              "🔵 [Archive/Restore] Persisting",
              nextComputed.length,
              "rows..."
            );

            const ok = await persistResearchRows(
              nextComputed,
              isArchiving ? "archive research" : "restore research"
            );

            if (!ok) {
              console.error("❌ [Archive/Restore] Persist failed");
              alert(
                `No se pudo ${
                  isArchiving ? "archivar" : "restaurar"
                } el artículo. Verifica la conexión del API.`
              );
            } else {
              console.log("✅ [Archive/Restore] Success, updating state...");
              setResearchRows(nextComputed);
              loadResearch();
            }
          } catch (error) {
            console.error("❌ [Archive/Restore] Error:", error);
            alert(
              `Error al ${
                isArchiving ? "archivar" : "restaurar"
              } el artículo: ${error.message}`
            );
          }

          setResearchShowConfirm(false);
          setResearchConfirmRow(null);
        }}
      />
    </div>
  );
}

// ✅ Migrado a src/utils/crudHelpers.js - Usar normalizeOrderCommon
// Esta función ahora está centralizada para uso escalable en todo el CMS
// Mantener comentada como referencia durante migración de Products/Services/Team
/*
// Ensure active (non-archived) items have consecutive order values 1..N without gaps.
// Archived items keep their existing order value but are ignored in the renumbering.
function normalizeOrder(list) {
  console.log("🟡 [normalizeOrder] Input length:", list?.length);

  const arr = Array.isArray(list) ? [...list] : [];
  console.log("🟡 [normalizeOrder] Array copy length:", arr.length);

  // Log IDs to detect any duplicates or missing
  const ids = arr.map(r => r.id).filter(Boolean);
  const uniqueIds = new Set(ids);
  console.log("🟡 [normalizeOrder] Total IDs:", ids.length, "Unique IDs:", uniqueIds.size);
  
  if (ids.length !== uniqueIds.size) {
    console.warn("⚠️  [normalizeOrder] DUPLICATE IDs DETECTED!");
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    console.warn("⚠️  Duplicate IDs:", [...new Set(duplicates)]);
  }

  const active = arr
    .filter((r) => !r.archived)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  console.log("🟡 [normalizeOrder] Active items:", active.length);
  console.log(
    "🟡 [normalizeOrder] Archived items:",
    arr.filter((r) => r.archived).length
  );

  // Create a map of updated active items (WITHOUT MUTATION)
  const updatedActive = active.map((item, idx) => ({
    ...item,
    order: idx + 1,
  }));

  // Merge back with archived untouched
  const byId = new Map(updatedActive.map((x) => [x.id, x]));
  const archived = arr.filter(r => r.archived);
  const result = [...updatedActive, ...archived];

  console.log("🟡 [normalizeOrder] Result length:", result.length);
  console.log("🟡 [normalizeOrder] Result breakdown - Active:", updatedActive.length, "Archived:", archived.length);

  return result;
}
*/

// ⚠️ TEMPORAL: Alias para mantener compatibilidad con Products/Services/Team
// TODO: Migrar Products/Services/Team para usar las funciones comunes de crudHelpers.js
function normalizeOrder(list) {
  return normalizeOrderCommon(list);
}
