# Translation System UX Improvements (v2.3)

## 📋 Resumen de Mejoras

Se han implementado mejoras significativas en la experiencia de usuario del sistema de traducción automática, específicamente en el módulo de Servicios:

### 1. ✅ Modales Estilizados (Reemplazando alert/confirm del navegador)

**Problema anterior:**

- Mensajes feos de `alert()` y `window.confirm()` del navegador
- No respetan el tema claro/oscuro de la aplicación
- Sin animaciones ni contexto visual

**Solución implementada:**

- Creado componente `ConfirmModal` con 4 tipos de modales:
  - **Info** (azul): Información general
  - **Warning** (ámbar): Advertencias y confirmaciones
  - **Error** (rojo): Errores durante traducción
  - **Success** (verde): Traducciones completadas exitosamente

**Características del modal:**

```jsx
<ConfirmModal
  open={boolean}
  onClose={function}
  onConfirm={function}
  type="info|warning|error|success"
  title="Título del modal"
  message="Mensaje principal"
  details={["Lista", "de", "items"]} // O string
  confirmText="Aceptar"
  cancelText="Cancelar"
  showCancel={boolean}
/>
```

**Estilos:**

- Soporte completo de dark mode: `dark:bg-gray-800`, `dark:text-gray-300`
- Animaciones: `fade-in`, `zoom-in`, `backdrop-blur`
- Z-index: 60 (sobre el modal principal del admin)
- Colores dinámicos según tipo (blue/amber/red/green)

**Ubicación del componente:**

- `src/pages/admin/components/common/ConfirmModal.jsx` (120 líneas)

---

### 2. ✅ Badge Dinámico de Campos Pendientes

**Problema anterior:**

- Badge siempre mostraba "3 campos" sin importar si ya estaban traducidos
- No era verdaderamente dinámico ni reactivo a cambios reales

**Solución implementada:**

- Lógica mejorada en `detectChanges()` del hook `useAutoTranslate`
- Ahora **solo** marca campos como "necesitan traducción" si:
  1. El campo target está vacío/null
  2. El campo target es idéntico al source (no traducido)
  3. En arrays: diferente cantidad de items

**Lógica anterior (problemática):**

```javascript
// ❌ Siempre agregaba campos con traducciones existentes
if (targetValue) {
  changedFields.push({ field, hasExisting: true });
}
```

**Lógica nueva (correcta):**

```javascript
// ✅ Solo agrega si REALMENTE falta traducción
if (!targetValue || targetValue.trim() === "" || targetValue === sourceValue) {
  changedFields.push({ field, needsTranslation: true });
}
// Si target existe Y es diferente al source, asumimos que está traducido
// NO lo agregamos a changedFields
```

**Comportamiento esperado:**

- Badge **se oculta** cuando todos los campos están traducidos
- Badge **aparece** solo cuando hay campos sin traducir o vacíos
- Badge muestra dirección dinámica: "3 campos → EN" o "2 campos → ES"

---

## 🔧 Archivos Modificados

### 1. `src/pages/admin/components/services/ServiceFormModal.jsx`

**Cambios principales:**

#### a) Estado de modales (línea ~75-83):

```javascript
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
```

#### b) Helpers para modales (línea ~95-108):

```javascript
const showModal = (
  type,
  title,
  message,
  details = null,
  onConfirm = null,
  confirmText = "Aceptar",
  showCancel = false
) => {
  setModalState({
    open: true,
    type,
    title,
    message,
    details,
    onConfirm,
    confirmText,
    showCancel,
  });
};

const closeModal = () => {
  setModalState({ ...modalState, open: false });
};

const handleModalConfirm = () => {
  if (modalState.onConfirm) {
    modalState.onConfirm();
  }
  closeModal();
};
```

#### c) Reemplazos de alert/confirm:

**1. Campo incompleto (línea ~143):**

```javascript
// Antes: alert("Primero completa los campos...")
// Ahora:
showModal(
  "info",
  "Campos incompletos",
  `Primero completa los campos en ${
    sourceLang === "es" ? "Español" : "Inglés"
  } antes de traducir.`,
  null,
  null,
  "Entendido",
  false
);
```

**2. Confirmación de sobrescritura (línea ~153):**

```javascript
// Antes: window.confirm("⚠️ ¿Deseas sobrescribir?...")
// Ahora:
showModal(
  "warning",
  "Confirmar sobrescritura",
  result.message,
  [
    `Traducción: ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()}`,
    "Algunos campos ya tienen traducciones",
    "Si aceptas, se sobrescribirán con las nuevas traducciones",
  ],
  async () => {
    const forceResult = await autoTranslate(true);
    if (forceResult.success) {
      showModal("success", "¡Traducción completada!", forceResult.message);
      setActiveLang(targetLang);
    } else {
      showModal("error", "Error de traducción", forceResult.message);
    }
  },
  "Sobrescribir",
  true
);
```

**3. Traducción exitosa (línea ~175):**

```javascript
// Antes: alert("✅ ¡Traducción completada!")
// Ahora:
showModal(
  "success",
  "¡Traducción completada!",
  result.message,
  null,
  null,
  "Aceptar",
  false
);
```

**4. Error de traducción (línea ~178):**

```javascript
// Antes: alert("❌ Error...")
// Ahora:
showModal(
  "error",
  "Error de traducción",
  result.message,
  null,
  null,
  "Cerrar",
  false
);
```

**5. Mostrar campos faltantes (línea ~185-201):**

```javascript
// Antes: alert("⚠️ Campos que necesitan traducción...")
// Ahora:
if (missing.length === 0) {
  showModal(
    "success",
    "Traducción completa",
    "Todos los campos están traducidos correctamente."
  );
} else {
  showModal(
    "info",
    "Campos pendientes de traducción",
    `Los siguientes campos necesitan traducción (${activeLang.toUpperCase()} → ${targetLang.toUpperCase()}):`,
    missing,
    () => setActiveLang(targetLang),
    "Ver traducciones",
    false
  );
}
```

#### d) Renderizado del modal (línea ~673-687):

```jsx
{
  /* Modal de confirmación/información estilizado */
}
<ConfirmModal
  open={modalState.open}
  onClose={closeModal}
  onConfirm={handleModalConfirm}
  type={modalState.type}
  title={modalState.title}
  message={modalState.message}
  details={modalState.details}
  confirmText={modalState.confirmText}
  cancelText="Cancelar"
  showCancel={modalState.showCancel}
/>;
```

---

### 2. `src/pages/admin/hooks/useAutoTranslate.js`

**Cambios principales:**

#### a) Detección de campos simples (línea ~91-108):

```javascript
for (const field of simpleFields) {
  const sourceValue = data[field]?.[sourceLang];
  const targetValue = data[field]?.[targetLang];

  if (sourceValue && sourceValue.trim()) {
    // ✅ Solo marcar si REALMENTE falta traducción
    if (
      !targetValue ||
      targetValue.trim() === "" ||
      targetValue === sourceValue
    ) {
      changedFields.push({
        field,
        type: "simple",
        isEmpty: !targetValue || targetValue.trim() === "",
        needsTranslation: true,
      });
    }
    // ✅ Si target existe Y es diferente, está traducido (NO agregar)
  }
}
```

#### b) Detección de arrays (línea ~110-145):

```javascript
for (const field of arrayFields) {
  const sourceArray = data[field]?.[sourceLang];
  const targetArray = data[field]?.[targetLang];

  if (Array.isArray(sourceArray) && sourceArray.length > 0) {
    const sourceFiltered = sourceArray.filter((item) => item && item.trim());
    const targetFiltered = Array.isArray(targetArray)
      ? targetArray.filter((item) => item && item.trim())
      : [];

    // ✅ Solo marcar si target vacío o diferente cantidad
    if (targetFiltered.length === 0) {
      changedFields.push({
        field,
        type: "array",
        isEmpty: true,
        needsTranslation: true,
      });
    } else if (sourceFiltered.length !== targetFiltered.length) {
      changedFields.push({
        field,
        type: "array",
        isEmpty: false,
        hasExisting: true,
        needsTranslation: true,
      });
    }
    // ✅ Si mismo length, asumimos que está traducido (NO agregar)
  }
}
```

#### c) Detección de campos nested (línea ~147-171):

```javascript
for (const nestedConfig of nestedFields) {
  const { field, subFields } = nestedConfig;
  if (Array.isArray(data[field])) {
    for (let i = 0; i < data[field].length; i++) {
      const item = data[field][i];
      for (const subField of subFields) {
        const sourceValue = item[subField]?.[sourceLang];
        const targetValue = item[subField]?.[targetLang];

        if (sourceValue && sourceValue.trim()) {
          // ✅ Solo marcar si falta traducción
          if (
            !targetValue ||
            targetValue.trim() === "" ||
            targetValue === sourceValue
          ) {
            changedFields.push({
              field: `${field}[${i}].${subField}`,
              type: "nested",
              isEmpty: !targetValue || targetValue.trim() === "",
              needsTranslation: true,
            });
          }
          // ✅ Si target existe Y es diferente, está traducido (NO agregar)
        }
      }
    }
  }
}
```

---

### 3. `src/pages/admin/components/common/ConfirmModal.jsx` (NUEVO)

Componente completo de 120 líneas. Características principales:

```jsx
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar",
  message = "",
  details = null,
  type = "info", // info | warning | error | success
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancel = true,
}) {
  if (!open) return null;

  const typeStyles = {
    info: {
      icon: "ℹ️",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      headerBg: "bg-blue-500",
      confirmBg:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      headerBg: "bg-amber-500",
      confirmBg:
        "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
    },
    error: {
      icon: "❌",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      headerBg: "bg-red-500",
      confirmBg:
        "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    },
    success: {
      icon: "✅",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      headerBg: "bg-green-500",
      confirmBg:
        "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    },
  };

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in duration-200">
        {/* Header con color e icono */}
        <div className={`${styles.headerBg} px-6 py-4 flex items-center gap-3`}>
          <div className={`${styles.iconBg} rounded-full p-2`}>
            <span className="text-2xl">{styles.icon}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 dark:text-gray-300 mb-3">{message}</p>

          {details && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {Array.isArray(details) ? (
                <ul className="space-y-2">
                  {details.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {details}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex gap-3 justify-end">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${styles.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Escenarios de Prueba

### Test 1: Modal de campos incompletos

1. Abrir modal de crear/editar servicio
2. Cambiar idioma a ES
3. Dejar campos vacíos
4. Click en "🌐 Traducir a EN"
5. **Resultado esperado:** Modal azul (info) con mensaje "Campos incompletos"

### Test 2: Modal de confirmación de sobrescritura

1. Abrir servicio que ya tiene traducciones en ambos idiomas
2. Modificar `title.es` (agregar texto)
3. Click en "🌐 Traducir a EN"
4. **Resultado esperado:** Modal ámbar (warning) con lista de advertencias y botones "Sobrescribir" / "Cancelar"
5. Click en "Sobrescribir"
6. **Resultado esperado:** Modal verde (success) "¡Traducción completada!"

### Test 3: Badge dinámico - Servicio sin traducir

1. Crear nuevo servicio
2. Completar campos en ES (title, description, features)
3. **Resultado esperado:** Badge muestra "3 campos → EN"
4. Click en "🌐 Traducir a EN"
5. Traducción exitosa
6. **Resultado esperado:** Badge desaparece (no muestra "0 campos")

### Test 4: Badge dinámico - Servicio parcialmente traducido

1. Editar servicio existente con traducciones
2. Cambiar a idioma ES
3. Modificar solo `description.es` (agregar texto)
4. **Resultado esperado:** Badge muestra "1 campo → EN"
5. Traducir
6. **Resultado esperado:** Badge desaparece

### Test 5: Badge dinámico - Servicio completamente traducido

1. Abrir servicio con todas las traducciones completas
2. **Resultado esperado:** Badge NO se muestra
3. Cambiar idioma entre ES/EN
4. **Resultado esperado:** Badge sigue sin mostrarse

### Test 6: Modal de campos faltantes

1. Abrir servicio con traducciones incompletas
2. Click en badge (ej: "2 campos → EN")
3. **Resultado esperado:** Modal azul (info) con lista de campos faltantes
4. Click en "Ver traducciones"
5. **Resultado esperado:** Idioma cambia a EN automáticamente

### Test 7: Tema oscuro/claro

1. Cambiar tema de la aplicación a oscuro
2. Abrir cualquier modal
3. **Resultado esperado:** Fondo gris oscuro (`dark:bg-gray-800`), texto claro
4. Cambiar a tema claro
5. **Resultado esperado:** Fondo blanco, texto oscuro

---

## 📊 Comparación Antes/Después

| Aspecto            | Antes (v2.0)                      | Ahora (v2.3)                          |
| ------------------ | --------------------------------- | ------------------------------------- |
| **Mensajes**       | `alert()` feo del navegador       | Modales estilizados con tema          |
| **Confirmaciones** | `window.confirm()` sin contexto   | Modal ámbar con detalles en lista     |
| **Badge**          | Siempre "3 campos" (estático)     | Dinámico, se oculta si todo traducido |
| **UX**             | Interrumpe flujo, sin animaciones | Fluido, animaciones, no bloquea       |
| **Dark mode**      | No respeta tema                   | Respeta tema claro/oscuro             |
| **Iconos**         | Emojis básicos en texto           | Iconos grandes con background color   |
| **Detalles**       | Todo en string plano              | Listas con bullets, mejor layout      |

---

## 🚀 Próximos Pasos (Futuro)

### Mejora pendiente: Detección de cambios en modo edición

**Problema actual:**
El badge ahora se oculta correctamente si todos los campos están traducidos, pero no detecta si el usuario **edita** un campo source después de traducir (no compara contra un "baseline").

**Ejemplo del problema:**

1. Servicio tiene `title.es = "A"` y `title.en = "A translated"`
2. Usuario edita `title.es` a `"AB"` (agrega texto)
3. Badge NO aparece porque detectChanges() compara source vs target actuales (ambos existen)

**Solución propuesta:**

- Agregar estado `baseline` que guarde la versión inicial al abrir el modal
- Comparar `data.title.es` vs `baseline.title.es` para detectar si hubo cambios
- Si hay cambios en source pero target no se actualizó, mostrar badge

**Código sugerido:**

```javascript
// En ServiceFormModal
const [baseline, setBaseline] = useState(null);

useEffect(() => {
  if (open && service) {
    setBaseline(JSON.parse(JSON.stringify(service))); // Deep clone
  }
}, [open, service]);

// Pasar baseline al hook
const { translating, autoTranslate, detectMissing } = useAutoTranslate(
  data,
  setData,
  {
    simpleFields: ["title", "description"],
    arrayFields: ["features"],
    sourceLang: activeLang,
    targetLang: activeLang === "es" ? "en" : "es",
    baseline: baseline, // NUEVO
  }
);

// En useAutoTranslate
function detectChanges() {
  // Comparar data[field][sourceLang] vs baseline[field][sourceLang]
  // Si cambió source pero target no, marcar como needsTranslation
}
```

---

## 📝 Checklist Final

- [x] Crear componente `ConfirmModal` con 4 tipos
- [x] Agregar soporte de dark mode al modal
- [x] Importar modal en `ServiceFormModal`
- [x] Reemplazar `alert()` de campos incompletos
- [x] Reemplazar `window.confirm()` de sobrescritura
- [x] Reemplazar `alert()` de traducción exitosa
- [x] Reemplazar `alert()` de error de traducción
- [x] Reemplazar `alert()` de campos faltantes
- [x] Renderizar `<ConfirmModal>` en JSX
- [x] Modificar `detectChanges()` para no marcar campos ya traducidos
- [x] Aplicar lógica mejorada a simpleFields
- [x] Aplicar lógica mejorada a arrayFields
- [x] Aplicar lógica mejorada a nestedFields
- [x] Verificar que badge se oculta cuando todo está traducido
- [ ] **Pendiente:** Implementar detección con baseline para modo edición
- [ ] **Pendiente:** Aplicar mismo patrón a módulo Products
- [ ] **Pendiente:** Probar todos los escenarios en navegador

---

## 🎨 Capturas de Diseño

### Modal de tipo "info" (azul):

- Header azul con icono ℹ️
- Contenido con mensaje
- Botón único "Entendido"

### Modal de tipo "warning" (ámbar):

- Header ámbar con icono ⚠️
- Lista con viñetas en detalles
- Botones "Cancelar" y "Sobrescribir"

### Modal de tipo "success" (verde):

- Header verde con icono ✅
- Mensaje de éxito
- Botón único "Aceptar"

### Modal de tipo "error" (rojo):

- Header rojo con icono ❌
- Mensaje de error
- Botón único "Cerrar"

---

## 📚 Documentación Relacionada

- `README.md` - Arquitectura general del proyecto
- `SERVICES_TRANSLATION_FIX.md` - Corrección inicial del sistema (v1.0)
- `SERVICES_TRANSLATION_V2.md` - Implementación bidireccional y detección de cambios (v2.0)
- **Este archivo** - Mejoras de UX con modales y badge dinámico (v2.3)

---

**Fecha de implementación:** Enero 2025  
**Versión:** 2.3  
**Autor:** GitHub Copilot + Usuario  
**Módulos afectados:** Servicios (CMS Admin)
