# Mejoras en el CRUD de Investigación - Validación y Modo Restaurar

## 📋 Cambios Implementados

### 1. **Nuevo Modo "Restore" en el Modal** 🔄

#### **Antes:**

- Restaurar mostraba un modal de confirmación simple
- No se podía editar el orden al restaurar
- Vista no era consistente con edición

#### **Después:**

- Restaurar abre el modal de edición en modo "restore"
- Permite editar todos los campos incluyendo el orden
- Vista idéntica a "edit" pero con botón "Restaurar" verde
- Badge visual indica "Modo Restaurar"

#### **Flujo de Restauración:**

```
Usuario click en "Restaurar" (artículo archivado)
     ↓
Se abre ResearchFormModal en modo="restore"
     ↓
Usuario puede editar campos (especialmente orden)
     ↓
Click en "Restaurar Artículo" (botón verde)
     ↓
Se ejecuta onRestore() con validación de orden
     ↓
Se usa restoreItem() de crudHelpers
     ↓
Artículo se desarchiva y se inserta en la posición elegida
```

---

### 2. **Validación Inteligente del Campo "Orden"** ✅

#### **Funciones Comunes en `crudHelpers.js`:**

##### **`getOrderRange(currentRows, mode, currentItem)`**

Calcula el rango válido según el contexto:

| Modo               | Rango             | Explicación                                |
| ------------------ | ----------------- | ------------------------------------------ |
| `create`           | 1 - (activos + 1) | Nuevo artículo puede ir al final           |
| `edit` (activo)    | 1 - activos       | Puede moverse entre los activos existentes |
| `edit` (archivado) | 1 - (activos + 1) | Comportamiento como restore                |
| `restore`          | 1 - (activos + 1) | Puede insertarse en cualquier posición     |

**Ejemplo:**

```javascript
// 10 artículos activos, 2 archivados

// Crear nuevo:
getOrderRange(rows, "create", null);
// → { min: 1, max: 11, activeCount: 10 }

// Editar activo:
getOrderRange(rows, "edit", activeArticle);
// → { min: 1, max: 10, activeCount: 10 }

// Restaurar archivado:
getOrderRange(rows, "restore", archivedArticle);
// → { min: 1, max: 11, activeCount: 10 }
```

##### **`validateOrder(order, currentRows, mode, currentItem)`**

Valida que el orden sea correcto:

**Validaciones:**

1. ✅ Es un número válido
2. ✅ Es un número entero (sin decimales)
3. ✅ Está dentro del rango permitido

**Retorno:**

```javascript
{
  valid: boolean,
  error: string | null,
  min: number,
  max: number
}
```

**Ejemplos de mensajes de error:**

- ❌ `"Debe ser un número entero entre 1 y 10"`
- ❌ `"Debe ser un número entero (sin decimales) entre 1 y 10"`
- ❌ `"El orden debe estar entre 1 y 10"`

---

### 3. **Feedback Visual de Validación** 🎨

#### **Input con Estado de Error:**

```jsx
<input
  type="number"
  value={formData.order}
  onChange={(e) => handleOrderChange(e.target.value)}
  className={`... ${
    orderError
      ? "border-red-500 animate-shake" // ❌ Error
      : "border-gray-600 focus:border-red-500" // ✅ Normal
  }`}
/>
```

#### **Tooltip con Mensaje de Error:**

```jsx
{
  showOrderTooltip && orderError && (
    <div className="... bg-red-600 text-white ... animate-fade-in">
      ⚠️ {orderError}
    </div>
  );
}
```

#### **Animaciones CSS Agregadas:**

**Shake (temblor):**

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}
```

**Fade-in (aparecer suavemente):**

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 4. **Validación en Tiempo Real** ⚡

#### **handleOrderChange():**

```javascript
const handleOrderChange = (value) => {
  setFormData((prev) => ({ ...prev, order: value }));

  // ✅ Validar inmediatamente al escribir
  const orderValidation = validateOrder(
    value,
    allRows,
    currentMode === "restore" ? "restore" : article ? "edit" : "create",
    article
  );

  if (!orderValidation.valid) {
    setOrderError(orderValidation.error);
    setShowOrderTooltip(true);
    setTimeout(() => setShowOrderTooltip(false), 3000); // Auto-ocultar
  } else {
    setOrderError(null);
    setShowOrderTooltip(false);
  }
};
```

**Comportamiento:**

- ⌨️ Usuario escribe un número
- ⚡ Validación instantánea
- 🔴 Si es inválido: borde rojo + animación shake + tooltip
- ⏱️ Tooltip se oculta automáticamente después de 3 segundos
- ✅ Si es válido: estilo normal, sin tooltip

---

### 5. **Prevención de Guardado Inválido** 🛡️

#### **En handleSave() y handleRestore():**

```javascript
const handleSave = async () => {
  // ... otras validaciones ...

  // ✅ Validar orden antes de guardar
  const orderValidation = validateOrder(
    formData.order,
    allRows,
    article ? "edit" : "create",
    article
  );

  if (!orderValidation.valid) {
    setOrderError(orderValidation.error);
    setShowOrderTooltip(true);
    setTimeout(() => setShowOrderTooltip(false), 3000);
    return; // ⛔ Bloquear guardado
  }

  // ... continuar con guardado ...
};
```

**Resultado:**

- ❌ No se puede guardar con orden inválido
- 💡 Usuario ve el error claramente
- 🔄 Puede corregir y volver a intentar

---

## 🎯 Cambios en Archivos

### **1. `src/utils/crudHelpers.js`** (Expandido)

**Funciones agregadas:**

- ✅ `getOrderRange(currentRows, mode, currentItem)`
- ✅ `validateOrder(order, currentRows, mode, currentItem)`

**Propósito:** Lógica centralizada y reutilizable para validación

---

### **2. `src/pages/admin/components/research/ResearchFormModal.jsx`** (Mejorado)

**Props nuevos:**

- `onRestore` - Handler para restaurar artículo
- `allRows` - Lista completa para calcular rangos
- `mode` - Ahora soporta: 'view' | 'edit' | 'create' | 'restore'

**Estados nuevos:**

- `orderError` - Mensaje de error de validación
- `showOrderTooltip` - Control de visibilidad del tooltip

**Funciones nuevas:**

- `handleRestore()` - Procesa la restauración con validación
- `handleOrderChange()` - Valida en tiempo real al escribir

**UI mejorada:**

- 🔄 Modo "restore" con badge verde
- 🎨 Input de orden con validación visual
- 💬 Tooltip animado con mensaje de error
- 🟢 Botón "Restaurar Artículo" en modo restore

---

### **3. `src/pages/admin/AdminApp.jsx`** (Actualizado)

**Cambios en ResearchTable:**

```javascript
onArchiveToggle={(row) => {
  if (row.archived) {
    // ✅ Archivado: abrir modal en modo "restore"
    setResearchEditing(JSON.parse(JSON.stringify(row)));
    setResearchModalMode("restore");
    setResearchShowForm(true);
  } else {
    // Activo: mostrar confirmación de archivado
    setResearchConfirmRow(row);
    setResearchShowConfirm(true);
  }
}}
```

**Cambios en ResearchFormModal:**

```javascript
<ResearchFormModal
  open={researchShowForm}
  article={researchEditing}
  mode={researchModalMode}
  allRows={researchRows}  // ✅ Nuevo
  onSave={...}
  onRestore={async (payload) => {  // ✅ Nuevo
    let nextComputed = restoreItem(researchRows, payload);
    await persistResearchRows(nextComputed, "auto-save: restore research");
    loadResearch();
    setResearchShowForm(false);
  }}
  onClose={...}
/>
```

---

### **4. `src/index.css`** (Animaciones agregadas)

```css
@keyframes shake {
  ...;
}
@keyframes fade-in {
  ...;
}

.animate-shake {
  ...;
}
.animate-fade-in {
  ...;
}
```

---

## 📸 Capturas de Pantalla (Descripción)

### **Modal en Modo "Restore":**

```
┌─────────────────────────────────────────────────────┐
│ Restaurar Artículo  [Modo Restaurar]        [X]     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┬─────────────────┐               │
│ │ ID/Slug         │ Orden * (1-41)  │               │
│ │ article-abc123  │ [  5  ] ✅      │               │
│ └─────────────────┴─────────────────┘               │
│                                                      │
│ [Formulario completo de edición...]                 │
│                                                      │
├─────────────────────────────────────────────────────┤
│                        [Cancelar] [🔄 Restaurar]    │
└─────────────────────────────────────────────────────┘
```

### **Validación con Error:**

```
┌─────────────────────────────────────────────────────┐
│ Editar Artículo                              [X]     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┬─────────────────┐               │
│ │ ID/Slug         │ Orden * (1-40)  │               │
│ │ article-abc123  │ [  50  ] ❌     │ ← ROJO SHAKE  │
│ └─────────────────┴─────────────────┘               │
│                    ┌──────────────────────────────┐  │
│                    │ ⚠️ El orden debe estar       │  │
│                    │ entre 1 y 40                 │  │
│                    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### **1. Crear Nuevo Artículo**

- ✅ Rango: 1 - (activos + 1)
- ✅ Ejemplo: Si hay 40 activos → 1 a 41
- ❌ Ingresar 0 → Error
- ❌ Ingresar 42 → Error
- ❌ Ingresar 5.5 → Error (decimal)
- ✅ Ingresar 41 → OK (se crea al final)

### **2. Editar Artículo Activo**

- ✅ Rango: 1 - activos
- ✅ Ejemplo: Si hay 40 activos → 1 a 40
- ✅ Cambiar orden de 5 a 10 → OK
- ❌ Ingresar 41 → Error (fuera de rango)

### **3. Restaurar Artículo Archivado**

- ✅ Rango: 1 - (activos + 1)
- ✅ Se abre modal en modo "restore"
- ✅ Puede elegir orden de inserción
- ✅ Botón verde "Restaurar Artículo"
- ✅ Al restaurar, se desplaza el resto

### **4. Validación en Tiempo Real**

- ⌨️ Escribir número → Validación instantánea
- 🔴 Número inválido → Borde rojo + shake + tooltip
- ⏱️ Tooltip se oculta después de 3 segundos
- ✅ Corregir número → Borde vuelve a normal

### **5. Prevención de Guardado**

- ❌ Click en "Guardar" con orden inválido → Bloqueado
- 💡 Muestra tooltip con error
- 🔄 Usuario corrige y puede guardar

---

## 🚀 Próximos Pasos

### **Testing Completo de Research:**

1. 🔲 Crear nuevo artículo con diferentes órdenes
2. 🔲 Editar artículo existente y cambiar orden
3. 🔲 Archivar artículo (debería usar modal de confirmación)
4. 🔲 Restaurar artículo (debería abrir modal editable)
5. 🔲 Probar validación con números inválidos
6. 🔲 Verificar que animaciones funcionan
7. 🔲 Verificar que tooltips se ocultan automáticamente

### **Una Vez Validado Research:**

1. ✅ Migrar validación a Products
2. ✅ Migrar validación a Services
3. ✅ Migrar validación a Team
4. ✅ Crear componente genérico `<OrderInput>` (opcional)

---

## 💡 Beneficios

### **1. Experiencia de Usuario Mejorada**

- 🎯 Feedback inmediato al escribir
- 💬 Mensajes de error claros
- 🎨 Animaciones suaves y profesionales
- 🔄 Flujo de restauración más intuitivo

### **2. Prevención de Errores**

- ✅ No se pueden guardar órdenes inválidos
- ✅ Validación en tiempo real previene frustración
- ✅ Rangos dinámicos según contexto

### **3. Código Mantenible**

- 📦 Lógica centralizada en `crudHelpers.js`
- 🔄 Fácil de aplicar a otras secciones
- 🧪 Funciones puras y testeables
- 📚 Bien documentado

### **4. Escalabilidad**

- 🎯 Mismo código para Research/Products/Services/Team
- 🔧 Fácil agregar nuevas validaciones
- 🚀 Preparado para migración a PostgreSQL

---

## 📝 Comandos Útiles

### **Verificar Integridad:**

```bash
node analyze-research-data.cjs
```

### **Simular Cambio de Orden:**

```bash
node test-order-change.cjs
```

### **Ver Logs en Navegador:**

Buscar en consola:

```
🟢 [Research onSave] Payload received
🟢 [Research onRestore] Payload received
```

---

## ✨ Conclusión

Estas mejoras establecen un patrón sólido para validación de formularios en el CMS. El código es:

- ✅ Reutilizable (funciones comunes)
- ✅ Intuitivo (feedback visual claro)
- ✅ Robusto (previene errores)
- ✅ Escalable (fácil aplicar a otras secciones)

**Estado actual:** ✅ Listo para testing en Research
**Siguiente fase:** Aplicar a Products/Services/Team después de validar
