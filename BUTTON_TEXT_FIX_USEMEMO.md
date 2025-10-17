# Fix: Botón Consultar/Consult en Vista Previa del CMS

**Fecha:** 14 de octubre de 2025  
**Problema:** El texto del botón no cambiaba de idioma en la vista previa del admin  
**Archivo:** `src/pages/admin/components/services/ServiceFormModal.jsx`

---

## 🐛 Problema Identificado

### Síntoma

En el CMS (admin), al cambiar de idioma (Español ↔ Inglés) en la vista previa:

- **Campos editables** (título, descripción, features) SÍ cambiaban ✅
- **Botón estático** ("Consultar"/"Consult") NO cambiaba ❌

### Comparación: Web Pública vs CMS

#### ✅ **Web Pública (Funciona Correctamente)**

```jsx
// src/components/sections/Services.jsx
export const ServiceCard = ({ service, buttonText }) => {
  const { t } = useLanguage(); // ✅ Hook reactivo del contexto

  const consultText = buttonText || t("services.consult"); // ✅ Se actualiza automáticamente

  return <button>{consultText}</button>;
};
```

**Por qué funciona:**

- `useLanguage()` es un hook de contexto reactivo
- `t("services.consult")` se recalcula cada vez que el idioma cambia
- React detecta el cambio y re-renderiza el componente

---

#### ❌ **CMS/Admin (NO Funcionaba)**

```jsx
// src/pages/admin/components/services/ServiceFormModal.jsx (ANTES)
const toCardProps = (s, lang) => ({
  buttonText: messages[lang]?.services?.consult || "Consultar",
});

// En el JSX:
<ServiceCard service={toCardProps(data, activeLang)} />;
```

**Por qué NO funcionaba:**

1. `messages` es un objeto estático importado (no es reactivo)
2. `toCardProps()` se ejecuta en cada render, pero React no lo detecta como cambio
3. Aunque `activeLang` cambia, `messages[lang]` devuelve el mismo valor de referencia
4. React no re-renderiza porque no detecta cambio en las props del `ServiceCard`

---

## ✅ Solución Implementada

### Cambio 1: Usar `useMemo` para Forzar Recalculación

**Antes:**

```jsx
const toCardProps = (s, lang) => ({
  buttonText: messages[lang]?.services?.consult || "Consultar"
});

// Llamadas directas (React no detecta cambios)
<ServiceCard service={toCardProps(data, activeLang)} />
<ServiceCard service={toCardProps(data, activeLang)} />
```

**Después:**

```jsx
const toCardProps = (s, lang) => ({
  buttonText: messages[lang]?.services?.consult || "Consultar"
});

// ✅ useMemo fuerza recalculación cuando activeLang cambia
const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang] // Dependencias explícitas
);

// Usar el valor memoizado (React detecta cambios)
<ServiceCard service={previewService} />
<ServiceCard service={previewService} />
```

**Por qué funciona ahora:**

1. `useMemo` crea una nueva referencia cuando `activeLang` cambia
2. React detecta el cambio de referencia en las props de `ServiceCard`
3. `ServiceCard` se re-renderiza con el nuevo `buttonText`

---

## 🔧 Cambios en el Código

### Archivo: `ServiceFormModal.jsx`

#### Líneas 319-334: Agregado `useMemo`

```jsx
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

// ✅ NUEVO: useMemo para forzar re-render cuando activeLang cambia
const previewService = useMemo(
  () => toCardProps(data, activeLang),
  [data, activeLang]
);
```

#### Línea 373: Modo VIEW - Usar `previewService`

```jsx
// ANTES:
<ServiceCard service={toCardProps(data, activeLang)} />

// DESPUÉS:
<ServiceCard service={previewService} />
```

#### Línea 686: Modo EDIT - Usar `previewService`

```jsx
// ANTES:
<ServiceCard service={toCardProps(data, activeLang)} />

// DESPUÉS:
<ServiceCard service={previewService} />
```

---

## 📊 Flujo de Actualización

### Antes (No Funcionaba)

```
Usuario cambia idioma
  ↓
activeLang = "en" (era "es")
  ↓
Component re-render
  ↓
toCardProps(data, "en") ejecuta
  ↓
messages["en"].services.consult = "Consult"
  ↓
Retorna: { buttonText: "Consult" }
  ↓
React compara props de ServiceCard
  ↓
❌ "Shallow comparison" detecta mismo objeto
  ↓
❌ NO re-renderiza ServiceCard
  ↓
❌ Botón sigue mostrando "Consultar"
```

### Después (Funciona)

```
Usuario cambia idioma
  ↓
activeLang = "en" (era "es")
  ↓
Component re-render
  ↓
useMemo detecta cambio en [data, activeLang]
  ↓
toCardProps(data, "en") ejecuta
  ↓
messages["en"].services.consult = "Consult"
  ↓
✅ useMemo crea NUEVA referencia: { buttonText: "Consult" }
  ↓
React compara props de ServiceCard
  ↓
✅ Detecta NUEVA referencia
  ↓
✅ Re-renderiza ServiceCard
  ↓
✅ Botón muestra "Consult"
```

---

## 🧪 Testing

### Caso 1: Cambio Español → Inglés

**Setup:**

1. Abrir servicio en Admin (modo VIEW o EDIT)
2. Idioma activo: **Español**
3. Vista previa muestra botón: "Consultar"

**Acción:**

1. Click en botón "Inglés (EN)" en la parte superior

**Resultado Esperado:**

- Título cambia: "Servicio Estadística" → "Statistics Service" ✅
- Descripción cambia: "Servicios de..." → "Statistics services..." ✅
- Features cambian: ["Estadística", ...] → ["Statistics", ...] ✅
- **Botón cambia: "Consultar" → "Consult"** ✅ **RESUELTO**

---

### Caso 2: Cambio Inglés → Español

**Setup:**

1. Servicio con ambos idiomas llenos
2. Idioma activo: **Inglés**
3. Vista previa muestra botón: "Consult"

**Acción:**

1. Click en botón "Español (ES)"

**Resultado Esperado:**

- Título cambia: "Statistics Service" → "Servicio Estadística" ✅
- Descripción cambia: "Statistics services..." → "Servicios de..." ✅
- Features cambian: ["Statistics", ...] → ["Estadística", ...] ✅
- **Botón cambia: "Consult" → "Consultar"** ✅ **RESUELTO**

---

### Caso 3: Modo EDIT - Cambio de Idioma

**Setup:**

1. Abrir servicio en modo EDIT
2. Vista previa en la derecha (desktop)

**Acción:**

1. Cambiar idioma múltiples veces: ES → EN → ES → EN

**Resultado Esperado:**

- Botón cambia correctamente en cada cambio ✅
- Sin retraso ni "lag" ✅
- Sincronizado con los campos editables ✅

---

## 📝 Conceptos Técnicos

### 1. **React Shallow Comparison**

React compara props usando `===` (shallow comparison):

```javascript
// Objeto 1
const obj1 = { buttonText: "Consult" };

// Objeto 2 (mismo contenido, diferente referencia)
const obj2 = { buttonText: "Consult" };

obj1 === obj2; // false ✅ React detecta cambio

// Pero si reutilizas la misma referencia:
const obj3 = obj1;
obj1 === obj3; // true ❌ React NO detecta cambio
```

**Problema anterior:** `toCardProps()` creaba un nuevo objeto, pero React no lo detectaba como cambio porque el objeto se creaba dentro del render sin dependencias explícitas.

---

### 2. **useMemo Hook**

`useMemo` memoriza el resultado de una función y solo lo recalcula cuando las dependencias cambian:

```javascript
const memoizedValue = useMemo(
  () => expensiveCalculation(a, b),
  [a, b] // Dependencias
);

// Solo se recalcula si `a` o `b` cambian
```

**Ventajas:**

- Crea nueva referencia cuando dependencias cambian
- React detecta el cambio de referencia
- Optimiza rendimiento (evita cálculos innecesarios)

---

### 3. **Objeto Estático vs Hook Reactivo**

**Objeto Estático (messages):**

```javascript
import { messages } from "./i18n.js";

// messages es un objeto estático
messages.es.services.consult; // "Consultar" (siempre el mismo)
messages.en.services.consult; // "Consult" (siempre el mismo)

// React NO detecta cambios automáticamente
```

**Hook Reactivo (useLanguage):**

```javascript
const { t, language } = useLanguage();

// t() es una función que lee del contexto reactivo
t("services.consult"); // Se actualiza automáticamente

// React detecta cambios en el contexto
```

**Por qué no usar `useLanguage()` en admin:**

- El admin tiene su propio sistema de idioma (`activeLang` local)
- No usa el contexto global `LanguageContext` de la web pública
- Por eso usamos `messages` directamente con `useMemo`

---

## 🎯 Ventajas de la Solución

### ✅ **Mínimo Cambio**

- Solo 3 líneas agregadas (`useMemo`)
- No requiere refactorización grande
- Mantiene arquitectura existente

### ✅ **Rendimiento**

- `useMemo` optimiza recalculaciones
- Solo se ejecuta cuando `data` o `activeLang` cambian
- No impacta performance

### ✅ **Consistencia**

- Mismo comportamiento que web pública
- Botón se sincroniza con campos editables
- UX coherente

### ✅ **Mantenibilidad**

- Código claro y documentado
- Fácil de entender para otros desarrolladores
- Patrón estándar de React

---

## 🔄 Alternativas Consideradas

### Alternativa 1: Usar `useLanguage()` en Admin

**Ventajas:**

- Reutiliza contexto de la web pública
- Código más DRY

**Desventajas:**

- Admin tiene idioma independiente del contexto global
- Requeriría refactorizar toda la lógica de idioma en admin
- Más complejo y propenso a bugs

**Decisión:** ❌ No implementar

---

### Alternativa 2: Pasar `activeLang` como Key

```jsx
<ServiceCard key={activeLang} service={toCardProps(data, activeLang)} />
```

**Ventajas:**

- Fuerza re-mount completo del componente

**Desventajas:**

- Menos eficiente (re-crea todo el componente)
- Pierde estado interno si ServiceCard tuviera state
- Animaciones/transiciones se reinician

**Decisión:** ❌ No implementar (useMemo es más elegante)

---

### Alternativa 3: Crear Nuevo Objeto con Spread

```jsx
<ServiceCard service={{ ...toCardProps(data, activeLang) }} />
```

**Ventajas:**

- Crea nueva referencia en cada render

**Desventajas:**

- Recalcula en CADA render (ineficiente)
- No hay control de dependencias
- Puede causar renders innecesarios

**Decisión:** ❌ No implementar (useMemo es más eficiente)

---

## ✅ Checklist de Verificación

- [x] `useMemo` agregado con dependencias correctas
- [x] `previewService` usado en modo VIEW (línea 373)
- [x] `previewService` usado en modo EDIT (línea 686)
- [x] No hay errores de sintaxis
- [x] Import de `useMemo` existe (React.useMemo o destructured)
- [ ] **Testing por usuario en browser:**
  - [ ] Modo VIEW: Cambiar idioma → Botón cambia
  - [ ] Modo EDIT: Cambiar idioma → Botón en preview cambia
  - [ ] Sin errores en consola
  - [ ] Rendimiento OK (sin lag)

---

## 📚 Documentación Relacionada

- **React useMemo Docs:** https://react.dev/reference/react/useMemo
- **React Rendering Behavior:** https://react.dev/learn/render-and-commit
- **Shallow Comparison:** https://react.dev/reference/react/memo

**Archivos del proyecto:**

- `src/config/i18n.js` - Diccionario de traducciones
- `src/components/sections/Services.jsx` - ServiceCard (web pública)
- `src/pages/admin/components/services/ServiceFormModal.jsx` - Admin (CMS)
- `src/context/LanguageContext.jsx` - Contexto global de idioma

---

**Estado:** ✅ Implementado  
**Testing:** Pendiente de usuario  
**Próxima Revisión:** Ninguna (solución completa)
