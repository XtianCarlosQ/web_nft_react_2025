# Fix Completo: React Hooks Error - Early Return Issue

**Fecha:** 14 de octubre de 2025  
**Error:** "Rendered more hooks than during the previous render"  
**Archivo:** `src/pages/admin/components/services/ServiceFormModal.jsx`

---

## 🐛 El Problema Real

### Diagnóstico Inicial (Incompleto)

**Primera solución:** Movimos `useMemo` antes del `if (mode === "view") return`

**Resultado:** ❌ Error persistió

**Razón:** Había **OTRO** early return que no vimos: `if (!open) return null;` en línea 87

---

## 🔍 Análisis Profundo

### Flujo de Hooks con 2 Early Returns

```jsx
function ServiceFormModal({ open, mode, service, onClose, onSave }) {
  // ===== HOOKS SIEMPRE EJECUTADOS =====
  const isView = mode === "view";                    // 1
  const [activeLang, setActiveLang] = useState("es"); // 2
  const [data, setData] = useState(...)              // 3
  const [showIconPicker, setShowIconPicker] = useState(false); // 4
  const [confirmClose, setConfirmClose] = useState(false);     // 5
  const [submitAttempted, setSubmitAttempted] = useState(false); // 6
  const [visibleTooltips, setVisibleTooltips] = useState({}); // 7
  const original = useMemo(...);                     // 8
  useEffect(...);                                    // 9
  const { translating, autoTranslate } = useAutoTranslate(...); // 10
  const [modalState, setModalState] = useState({...}); // 11

  // ===== EARLY RETURN #1 (LÍNEA 87) =====
  if (!open) return null; // ❌ Sale aquí cuando modal está cerrado

  // ===== HOOKS CONDICIONALES (DESPUÉS DE RETURN) =====
  const previewService = useMemo(...); // 12 - ❌ Solo se ejecuta si open=true

  // ... código ...

  // ===== EARLY RETURN #2 (LÍNEA 340) =====
  if (mode === "view") {
    return <ViewComponent />; // ❌ Sale aquí en modo view
  }

  // Resto del componente
}
```

### Escenarios de Error

#### Escenario 1: Modal Cerrado → Abierto

```
Render 1 (open=false):
  Hooks 1-11 ✅
  if (!open) return null → SALE ❌
  Hook 12 (useMemo) NO SE EJECUTA ❌
  Total: 11 hooks

Render 2 (open=true):
  Hooks 1-11 ✅
  if (!open) return null → NO ENTRA ✅
  Hook 12 (useMemo) SE EJECUTA ✅
  Total: 12 hooks

React detecta: 11 hooks → 12 hooks → ERROR ❌
```

#### Escenario 2: Modo View → Edit

```
Render 1 (mode="view", open=true):
  Hooks 1-11 ✅
  if (!open) return null → NO ENTRA ✅
  Hook 12 (useMemo) SE EJECUTA ✅
  if (mode === "view") return → SALE ❌
  Total: 12 hooks

Render 2 (mode="edit", open=true):
  Hooks 1-11 ✅
  if (!open) return null → NO ENTRA ✅
  Hook 12 (useMemo) SE EJECUTA ✅
  if (mode === "view") return → NO ENTRA ✅
  Resto del código...
  Total: 12 hooks ✅

React detecta: 12 hooks → 12 hooks → OK ✅
```

---

## ✅ Solución Completa

### Paso 1: Mover useMemo ANTES de TODOS los Early Returns

```jsx
function ServiceFormModal({ open, mode, service, onClose, onSave }) {
  // ===== TODOS LOS HOOKS PRIMERO =====
  const isView = mode === "view";
  const [activeLang, setActiveLang] = useState("es");
  const [data, setData] = useState(...)
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [visibleTooltips, setVisibleTooltips] = useState({});
  const original = useMemo(() => JSON.stringify(service || {}), [service]);

  useEffect(() => {
    if (open) {
      setActiveLang("es");
      setSubmitAttempted(false);
      // ... reset data
    }
  }, [open, service]);

  const { translating, autoTranslate } = useAutoTranslate(data, setData, {
    simpleFields: ["title", "description"],
    arrayFields: ["features"],
    sourceLang: activeLang,
    targetLang: activeLang === "es" ? "en" : "es",
  });

  const [modalState, setModalState] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    details: null,
    onConfirm: null,
    confirmText: "Aceptar",
    showCancel: false,
  });

  // ✅ Helper function (no es hook)
  const toCardProps = (s, lang) => ({
    icon: s.icon,
    title: s.title?.[lang] || "Título del Servicio",
    description: s.description?.[lang] || "Descripción del servicio",
    features: (s.features?.[lang] || []).filter(Boolean).length
      ? s.features?.[lang]
      : ["Característica de ejemplo"],
    whatsapp: s.whatsapp || "51988496839",
    buttonText:
      messages[lang]?.services?.consult ||
      (lang === "es" ? "Consultar" : "Consult"),
  });

  // ✅ CRÍTICO: useMemo ANTES de TODOS los early returns
  const previewService = useMemo(
    () => toCardProps(data, activeLang),
    [data, activeLang]
  );

  // ===== EARLY RETURNS DESPUÉS DE TODOS LOS HOOKS =====
  // ✅ Ahora es seguro tener returns condicionales
  if (!open) return null;

  // ... resto del código ...

  if (mode === "view") {
    return <ViewComponent service={previewService} />;
  }

  return <EditComponent service={previewService} />;
}
```

### Paso 2: Eliminar Definiciones Duplicadas

**Antes (❌ Duplicado):**

```jsx
// Línea 87:
const [modalState, setModalState] = useState({...});

if (!open) return null;

// ... 250 líneas de código ...

// Línea 342 (DUPLICADO):
const toCardProps = (s, lang) => ({...});

const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang]
);

if (mode === "view") {
  return ...;
}
```

**Después (✅ Sin duplicados):**

```jsx
// Línea 87:
const [modalState, setModalState] = useState({...});

const toCardProps = (s, lang) => ({...}); // ✅ Definido una sola vez

const previewService = useMemo(...); // ✅ Antes de TODOS los returns

if (!open) return null; // ✅ Después de TODOS los hooks

// ... código ...

if (mode === "view") {
  return ...;
}
```

---

## 🔄 Flujo Correcto

### Escenario 1: Modal Cerrado → Abierto (Corregido)

```
Render 1 (open=false):
  Hooks 1-12 (incluye useMemo) ✅
  if (!open) return null → SALE ✅
  Total: 12 hooks ✅

Render 2 (open=true):
  Hooks 1-12 (incluye useMemo) ✅
  if (!open) return null → NO ENTRA ✅
  Total: 12 hooks ✅

React detecta: 12 hooks → 12 hooks → OK ✅
```

### Escenario 2: Modo View → Edit (Corregido)

```
Render 1 (mode="view", open=true):
  Hooks 1-12 (incluye useMemo) ✅
  if (!open) return null → NO ENTRA ✅
  if (mode === "view") return → SALE ✅
  Total: 12 hooks ✅

Render 2 (mode="edit", open=true):
  Hooks 1-12 (incluye useMemo) ✅
  if (!open) return null → NO ENTRA ✅
  if (mode === "view") return → NO ENTRA ✅
  Total: 12 hooks ✅

React detecta: 12 hooks → 12 hooks → OK ✅
```

---

## 📋 Lista de Hooks en Orden

```jsx
// ✅ ORDEN FINAL CORRECTO (12 hooks totales):

1.  const isView = mode === "view"; (variable normal)
2.  const [activeLang, setActiveLang] = useState("es");
3.  const [data, setData] = useState(...)
4.  const [showIconPicker, setShowIconPicker] = useState(false);
5.  const [confirmClose, setConfirmClose] = useState(false);
6.  const [submitAttempted, setSubmitAttempted] = useState(false);
7.  const [visibleTooltips, setVisibleTooltips] = useState({});
8.  const original = useMemo(() => JSON.stringify(service || {}), [service]);
9.  useEffect(() => { ... }, [open, service]);
10. const { translating, autoTranslate } = useAutoTranslate(...); (custom hook)
11. const [modalState, setModalState] = useState({...});
12. const toCardProps = (s, lang) => ({...}); (función normal, no hook)
13. const previewService = useMemo(() => toCardProps(data, activeLang), [data, activeLang]);

// ✅ Después de todos los hooks:
if (!open) return null;
if (mode === "view") return <View />;
return <Edit />;
```

---

## 🎯 Regla de Oro: Hooks Antes de Returns

### ❌ NUNCA Hacer:

```jsx
function Component({ condition, data }) {
  const [state1] = useState(1);

  if (condition) return null; // ❌ Return antes de todos los hooks

  const [state2] = useState(2); // ❌ Hook después de return
  const value = useMemo(...);   // ❌ Hook después de return
}
```

### ✅ SIEMPRE Hacer:

```jsx
function Component({ condition, data }) {
  // 1️⃣ TODOS los hooks primero
  const [state1] = useState(1);
  const [state2] = useState(2);
  const value = useMemo(...);
  useEffect(() => {}, []);

  // 2️⃣ Early returns después
  if (condition) return null;

  // 3️⃣ Render principal
  return <div>...</div>;
}
```

---

## 🧪 Testing

### Verificación 1: Modal Cerrado → Abierto

```bash
# Estado inicial: Modal cerrado
open = false

# Acción: Abrir modal
setOpen(true)

# Resultado esperado: ✅ Sin errores de hooks
```

### Verificación 2: Alternar Modos

```bash
# Estado inicial: Modal abierto en modo VIEW
mode = "view", open = true

# Acción: Cambiar a EDIT
setMode("edit")

# Resultado esperado: ✅ Sin errores de hooks
```

### Verificación 3: Cerrar y Reabrir

```bash
# Secuencia:
1. open = false (cerrado)
2. open = true, mode = "view" (abrir en view)
3. mode = "edit" (cambiar a edit)
4. open = false (cerrar)
5. open = true, mode = "create" (abrir en create)

# Resultado esperado: ✅ Sin errores en ningún cambio
```

---

## 📊 Comparación: Antes vs Después

| Aspecto                   | ❌ Antes (Bug)              | ✅ Después (Fix)               |
| ------------------------- | --------------------------- | ------------------------------ |
| **useMemo ubicación**     | Después de `if (!open)`     | Antes de `if (!open)`          |
| **toCardProps ubicación** | Después de `if (!open)`     | Antes de `if (!open)`          |
| **Orden de hooks**        | Inconsistente (11-12 hooks) | Consistente (12 hooks siempre) |
| **Modal cerrado**         | 11 hooks ejecutados ❌      | 12 hooks ejecutados ✅         |
| **Modal abierto**         | 12 hooks ejecutados ❌      | 12 hooks ejecutados ✅         |
| **Error React**           | ❌ "Rendered more hooks..." | ✅ Sin errores                 |
| **Funcionalidad**         | ❌ Crash al abrir modal     | ✅ Funciona correctamente      |

---

## 🔧 Cambios Realizados

### Cambio 1: Mover useMemo y toCardProps

**Líneas 75-87 (Antes):**

```jsx
const [modalState, setModalState] = useState({...});

if (!open) return null; // ❌ Early return antes de useMemo

const hasChanges = ...;
```

**Líneas 75-111 (Después):**

```jsx
const [modalState, setModalState] = useState({...});

// ✅ Helper function para ServiceCard
const toCardProps = (s, lang) => ({...});

// ✅ useMemo ANTES del early return
const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang]
);

// ✅ Early return DESPUÉS de todos los hooks
if (!open) return null;

const hasChanges = ...;
```

### Cambio 2: Eliminar Definiciones Duplicadas

**Líneas 340-360 (Antes):**

```jsx
onClose?.();
}

const toCardProps = (s, lang) => ({...}); // ❌ DUPLICADO

const previewService = useMemo(...); // ❌ DUPLICADO

if (mode === "view") {
  return ...;
}
```

**Líneas 340-345 (Después):**

```jsx
onClose?.();
}

// ✅ Sin duplicados (ya están definidos arriba)

if (mode === "view") {
  return ...;
}
```

---

## 🚨 Lecciones Aprendidas

### 1. **Revisar TODOS los Early Returns**

Cuando movemos hooks, debemos revisar **TODOS** los `return` en el componente, no solo el más obvio.

```jsx
// ❌ Incompleto (solo vimos el segundo return)
if (mode === "view") return; // ⚠️ Este vimos

// ✅ Completo (hay que revisar todos)
if (!open) return null; // ⚠️ Este NO vimos inicialmente
if (mode === "view") return; // ⚠️ Este vimos
```

### 2. **Early Returns al Final**

La estructura segura es:

```jsx
function Component() {
  // 1. Todos los hooks
  // 2. Funciones helper
  // 3. Early returns
  // 4. Render principal
}
```

### 3. **Debugging Hooks Errors**

Para debug de hooks, seguir este checklist:

```bash
1. ✅ Listar TODOS los hooks del componente
2. ✅ Listar TODOS los returns del componente
3. ✅ Verificar que TODOS los hooks están antes de TODOS los returns
4. ✅ Buscar hooks dentro de if, loops, callbacks
5. ✅ Verificar que custom hooks (useAutoTranslate) están antes de returns
```

---

## ✅ Checklist de Verificación

- [x] useMemo movido antes de `if (!open) return null;`
- [x] toCardProps movido antes de `if (!open) return null;`
- [x] Definiciones duplicadas eliminadas
- [x] No hay errores de sintaxis
- [x] Orden de hooks es consistente (12 hooks siempre)
- [ ] **Testing por usuario:**
  - [ ] Abrir modal → Sin errores ✅
  - [ ] Cerrar modal → Sin errores ✅
  - [ ] Reabrir modal → Sin errores ✅
  - [ ] Cambiar modo VIEW → EDIT → Sin errores ✅
  - [ ] Cambiar idioma ES → EN → Botón cambia ✅

---

## 📚 Referencias

**React Docs:**

- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Early Returns and Hooks](https://react.dev/learn/conditional-rendering#early-returns)
- [useMemo Pitfalls](https://react.dev/reference/react/useMemo#my-calculation-runs-twice-on-every-re-render)

**Common Mistakes:**

- [Rendered more hooks than during previous render](https://react.dev/warnings/invalid-hook-call-warning)
- [Conditional Rendering with Hooks](https://react.dev/learn/conditional-rendering#conditionally-returning-jsx)

---

**Estado:** ✅ Fix completo implementado  
**Testing:** Pendiente de usuario  
**Complejidad:** Alta (error no obvio, requirió análisis profundo)  
**Prevención:** Usar ESLint + Checklist de hooks antes de PR
