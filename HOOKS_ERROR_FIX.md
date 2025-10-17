# Fix: React Hooks Error - "Rendered more hooks than during the previous render"

**Fecha:** 14 de octubre de 2025  
**Error:** ErrorBoundary - Rendered more hooks than during the previous render  
**Archivo:** `src/pages/admin/components/services/ServiceFormModal.jsx`

---

## 🐛 Error Detectado

### Pantalla de Error

```
❌ Error: Rendered more hooks than during the previous render.
   at ServiceFormModal (ServiceFormModal.jsx:333:26)

❌ ErrorBoundary caught an error: Error: Rendered more hooks
   than during the previous render.
```

### Síntomas

1. La lista de servicios carga correctamente ✅
2. Al hacer click en "Ver" o "Editar" → **Crash del componente** ❌
3. Pantalla roja de error en React
4. Admin deja de funcionar

---

## 🔍 Causa Raíz

### Regla de Hooks de React (Violada)

**Regla fundamental:** Los hooks deben ejecutarse **en el mismo orden** en cada render.

❌ **Código Incorrecto (Antes):**

```jsx
function ServiceFormModal({ mode, ... }) {
  const [data, setData] = useState(...);        // Hook 1
  const [activeLang, setActiveLang] = useState(...);  // Hook 2
  // ... más hooks

  // ❌ PROBLEMA: useMemo DESPUÉS de return condicional
  const toCardProps = (s, lang) => ({ ... });

  const previewService = useMemo(              // Hook N (solo a veces)
    () => toCardProps(data, activeLang),
    [data, activeLang]
  );

  // ❌ Return condicional ANTES de useMemo
  if (mode === "view") {
    return <ViewComponent />;  // Sale aquí, useMemo NO se ejecuta
  }

  // Resto del componente...
  return <EditComponent />;
}
```

### Flujo del Error

**Render 1 (mode = "view"):**

```
1. useState() - Hook 1
2. useState() - Hook 2
3. ...
4. if (mode === "view") return → SALE AQUÍ
5. ❌ useMemo() NO SE EJECUTA

Total hooks ejecutados: N (sin useMemo)
```

**Render 2 (mode = "edit"):**

```
1. useState() - Hook 1
2. useState() - Hook 2
3. ...
4. if (mode === "view") → NO entra (mode es "edit")
5. ✅ useMemo() SÍ SE EJECUTA - Hook N+1

Total hooks ejecutados: N+1 (con useMemo)
```

**React detecta:**

```
Render 1: N hooks
Render 2: N+1 hooks
❌ ERROR: "Rendered more hooks than during the previous render"
```

---

## ✅ Solución Implementada

### Mover useMemo ANTES del Return Condicional

✅ **Código Correcto (Después):**

```jsx
function ServiceFormModal({ mode, ... }) {
  const [data, setData] = useState(...);        // Hook 1
  const [activeLang, setActiveLang] = useState(...);  // Hook 2
  // ... más hooks

  const toCardProps = (s, lang) => ({ ... });

  // ✅ SOLUCIÓN: useMemo ANTES de cualquier return condicional
  const previewService = useMemo(              // Hook N (siempre)
    () => toCardProps(data, activeLang),
    [data, activeLang]
  );

  // ✅ Return condicional DESPUÉS de todos los hooks
  if (mode === "view") {
    return <ViewComponent service={previewService} />;
  }

  // Resto del componente...
  return <EditComponent service={previewService} />;
}
```

### Flujo Correcto

**Render 1 (mode = "view"):**

```
1. useState() - Hook 1
2. useState() - Hook 2
3. ...
N. useMemo() - Hook N ✅
N+1. if (mode === "view") return

Total hooks ejecutados: N (con useMemo)
```

**Render 2 (mode = "edit"):**

```
1. useState() - Hook 1
2. useState() - Hook 2
3. ...
N. useMemo() - Hook N ✅
N+1. if (mode === "view") → NO entra

Total hooks ejecutados: N (con useMemo)
```

**React valida:**

```
Render 1: N hooks ✅
Render 2: N hooks ✅
✅ OK: Mismo número de hooks en ambos renders
```

---

## 🔧 Cambio Realizado

### Archivo: `ServiceFormModal.jsx`

**Líneas 332-337:**

```jsx
// ANTES (❌ Incorrecto):
const toCardProps = (s, lang) => ({ ... });

const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang]
);

if (mode === "view") {  // ❌ useMemo después del return
  return ...;
}
```

```jsx
// DESPUÉS (✅ Correcto):
const toCardProps = (s, lang) => ({ ... });

// ✅ IMPORTANTE: useMemo debe estar ANTES de cualquier return condicional
// Para cumplir con las reglas de hooks de React
const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang]
);

// ============== MODO VIEW ==============
if (mode === "view") {  // ✅ useMemo antes del return
  return ...;
}
```

---

## 📚 Reglas de Hooks de React

### Regla 1: Solo llamar Hooks en el Nivel Superior

❌ **NO hacer:**

```jsx
function Component() {
  if (condition) {
    const [state, setState] = useState(0); // ❌ Hook dentro de if
  }
}
```

✅ **Hacer:**

```jsx
function Component() {
  const [state, setState] = useState(0); // ✅ Hook en nivel superior

  if (condition) {
    // Usar state aquí
  }
}
```

---

### Regla 2: Solo llamar Hooks desde Funciones de React

❌ **NO hacer:**

```jsx
function normalFunction() {
  const [state, setState] = useState(0); // ❌ Hook en función normal
}
```

✅ **Hacer:**

```jsx
function Component() {
  const [state, setState] = useState(0); // ✅ Hook en componente
}
```

---

### Regla 3: Hooks deben ejecutarse en el mismo orden

❌ **NO hacer:**

```jsx
function Component({ condition }) {
  const [state1] = useState(1);

  if (condition) return null; // ❌ Return antes de todos los hooks

  const [state2] = useState(2); // ❌ Hook después de return condicional
}
```

✅ **Hacer:**

```jsx
function Component({ condition }) {
  const [state1] = useState(1);
  const [state2] = useState(2); // ✅ Todos los hooks antes de returns

  if (condition) return null; // ✅ Return después de todos los hooks
}
```

---

## 🧪 Testing

### Verificación del Fix

1. **Abrir Admin** (http://localhost:5174/adminx)

   - Lista de servicios debe cargar ✅

2. **Click en "Ver" (modo VIEW):**

   - Modal debe abrir sin errores ✅
   - Vista previa debe mostrar servicio ✅
   - Cambiar idioma ES/EN debe funcionar ✅

3. **Click en "Editar" (modo EDIT):**

   - Modal debe abrir sin errores ✅
   - Formulario debe cargar datos ✅
   - Vista previa lateral debe funcionar ✅
   - Cambiar idioma ES/EN debe funcionar ✅

4. **Alternar entre modos:**
   - Ver → Cerrar → Editar → Sin errores ✅
   - Editar → Guardar → Ver → Sin errores ✅

---

## 📊 Comparación: Antes vs Después

| Aspecto               | ❌ Antes (Bug)                  | ✅ Después (Fix)            |
| --------------------- | ------------------------------- | --------------------------- |
| **Orden de hooks**    | Inconsistente (depende de mode) | Consistente (siempre igual) |
| **useMemo ubicación** | Después de return condicional   | Antes de return condicional |
| **Render VIEW**       | N hooks (sin useMemo)           | N hooks (con useMemo)       |
| **Render EDIT**       | N+1 hooks (con useMemo)         | N hooks (con useMemo)       |
| **Error de React**    | ❌ Crash                        | ✅ Sin errores              |
| **Funcionalidad**     | ❌ No funciona                  | ✅ Funciona                 |

---

## 🎯 Lecciones Aprendidas

### 1. **Hooks deben estar en el nivel superior**

- Nunca dentro de if, loops, o callbacks
- Siempre antes de cualquier return condicional

### 2. **useMemo sigue las reglas de hooks**

- Aunque parezca "opcional", es un hook como useState
- Debe ejecutarse en cada render en el mismo orden

### 3. **Early returns son peligrosos con hooks**

- Colocar todos los hooks ANTES de cualquier return
- Validaciones tempranas deben ir al inicio del componente

### 4. **React Hook Linter**

- ESLint plugin `eslint-plugin-react-hooks` detecta estos errores
- Siempre revisar advertencias del linter

---

## 🔄 Patrón Recomendado

### Estructura Segura de Componente con Hooks

```jsx
function Component({ mode, data }) {
  // 1️⃣ TODOS los hooks primero (en orden fijo)
  const [state1, setState1] = useState(initialValue);
  const [state2, setState2] = useState(initialValue);
  const memoValue = useMemo(() => compute(), [deps]);
  const callbackFn = useCallback(() => {}, [deps]);
  useEffect(() => {}, [deps]);

  // 2️⃣ Funciones helper (no hooks)
  const helperFunction = (arg) => { ... };

  // 3️⃣ Early returns condicionales (después de hooks)
  if (mode === "loading") return <Loading />;
  if (!data) return <Empty />;

  // 4️⃣ Render principal
  return <MainComponent />;
}
```

---

## 📚 Referencias

**React Docs:**

- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useMemo](https://react.dev/reference/react/useMemo)
- [Conditional Rendering](https://react.dev/learn/conditional-rendering)

**ESLint Plugin:**

- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

**Stack Overflow:**

- [Rendered more hooks than during the previous render](https://stackoverflow.com/questions/55622768/rendered-more-hooks-than-during-the-previous-render)

---

## ✅ Checklist de Verificación

- [x] useMemo movido antes de return condicional
- [x] No hay errores de sintaxis
- [x] Orden de hooks es consistente
- [x] Comentarios explicativos agregados
- [ ] **Testing por usuario en browser:**
  - [ ] Abrir modal en modo VIEW sin errores
  - [ ] Abrir modal en modo EDIT sin errores
  - [ ] Cambiar idioma en vista previa
  - [ ] Alternar entre modos múltiples veces
  - [ ] Guardar cambios y reabrir

---

## 🚨 Prevención Futura

### Checklist al Agregar Nuevos Hooks:

1. ✅ ¿El hook está en el nivel superior del componente?
2. ✅ ¿El hook está ANTES de cualquier return condicional?
3. ✅ ¿El hook se ejecutará en TODOS los renders?
4. ✅ ¿El orden de hooks es consistente?

### Code Review:

- Buscar patrones: `if (...) return` → Verificar que todos los hooks estén antes
- Buscar hooks: `useState`, `useEffect`, `useMemo`, `useCallback` → Verificar ubicación
- Ejecutar linter: `npm run lint` → Verificar advertencias de hooks

---

**Estado:** ✅ Fix implementado  
**Testing:** Pendiente de usuario  
**Severidad:** Alta (componente crasheaba completamente)  
**Prevención:** Usar ESLint plugin para hooks
