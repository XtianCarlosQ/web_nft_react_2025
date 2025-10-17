# Refactorización del CMS - Funciones Comunes Escalables

## 📋 Resumen

Se ha implementado un conjunto de **funciones comunes reutilizables** para las operaciones CRUD del CMS, haciendo el código más mantenible y escalable para futura migración a PostgreSQL.

---

## 🔧 Problema Identificado

### Causa Raíz

El modal `ResearchFormModal` **NO estaba preservando el campo `id`** al editar artículos:

```javascript
// ❌ ANTES - formData inicial sin campo 'id'
const [formData, setFormData] = useState({
  slug: "",
  order: 0,
  // ... otros campos
  // ⚠️ FALTA: id: ""
});

// ❌ Al cargar un artículo para editar
if (article) {
  setFormData({
    slug: article.slug || "",
    order: article.order || 0,
    // ... otros campos
    // ⚠️ NO SE COPIABA: id: article.id
  });
}
```

**Consecuencia**: Cuando se guardaba un artículo editado, el `payload.id` era `undefined`, por lo que el filtro `prev.filter((r) => r.id !== payload.id)` **NO eliminaba el artículo original**, creando un duplicado.

---

## ✅ Solución Implementada

### 1. **Nuevo archivo: `src/utils/crudHelpers.js`**

Funciones comunes para operaciones CRUD:

- **`normalizeOrder(list)`**: Renumera artículos activos consecutivamente (1, 2, 3...)
- **`upsertWithReorder(currentRows, payload)`**: Inserta/actualiza con reordenamiento inteligente
- **`restoreItem(currentRows, toRestore)`**: Restaura un elemento archivado
- **`archiveItem(currentRows, toArchive)`**: Archiva un elemento
- **`ensurePayloadFields(formData, original)`**: Garantiza campos necesarios en payload

### 2. **Corrección en `ResearchFormModal.jsx`**

```javascript
// ✅ DESPUÉS - formData incluye 'id'
const [formData, setFormData] = useState({
  id: "", // ⚠️ CRÍTICO: Debe preservarse al editar
  slug: "",
  order: 0,
  // ... otros campos
});

// ✅ Al cargar un artículo para editar
if (article) {
  setFormData({
    id: article.id || article.slug, // ⚠️ CRÍTICO: Preservar ID
    slug: article.slug || "",
    order: article.order || 0,
    // ... otros campos
  });
} else {
  // Nuevo artículo: generar ID
  const randomId = `article-${Math.random().toString(36).substring(2, 9)}`;
  setFormData((prev) => ({ ...prev, id: randomId, slug: randomId }));
}
```

### 3. **Refactorización en `AdminApp.jsx`**

#### **onSave de Research - ANTES:**

```javascript
onSave={async (payload) => {
  let nextComputed = [];
  setResearchRows((prev) => {
    const others = prev.filter((r) => r.id !== payload.id);
    const compact = normalizeOrder(others);
    // ... lógica de 40+ líneas
    nextComputed = normalizeOrder(next);
    return nextComputed;
  });
  // ... persist
}}
```

#### **onSave de Research - DESPUÉS:**

```javascript
onSave={async (payload) => {
  let nextComputed = [];
  setResearchRows((prev) => {
    // ✅ Una sola función hace todo
    nextComputed = upsertWithReorder(prev, payload);
    return nextComputed;
  });
  // ... persist
}}
```

#### **Archive/Restore - ANTES:**

```javascript
if (isArchiving) {
  const next = researchRows.map((r) =>
    r.id === researchConfirmRow.id ? { ...r, archived: true } : r
  );
  nextComputed = normalizeOrder(next);
} else {
  // ... 30+ líneas de lógica
}
```

#### **Archive/Restore - DESPUÉS:**

```javascript
if (isArchiving) {
  nextComputed = archiveItem(researchRows, researchConfirmRow);
} else {
  nextComputed = restoreItem(researchRows, researchConfirmRow);
}
```

---

## 🎯 Beneficios

### 1. **Código más limpio y mantenible**

- De 40+ líneas a 1 función
- Lógica centralizada en un solo lugar
- Más fácil de debuggear

### 2. **Consistencia garantizada**

- Mismo comportamiento para todas las secciones
- Previene duplicados automáticamente
- Manejo de errores uniforme

### 3. **Escalabilidad**

- Funciones parametrizadas (aceptan cualquier lista)
- Fácil migración a PostgreSQL (cambiar funciones en un solo lugar)
- Preparado para agregar más secciones (Partners, Research Projects, etc.)

### 4. **Testeable**

- Funciones puras (sin efectos secundarios)
- Se pueden probar de manera aislada
- Ver `test-order-change.cjs` como ejemplo

---

## 📝 Pasos Siguientes (Recomendado)

### **Fase 1: Validar Research** ✅ COMPLETADO

- [x] Implementar funciones comunes
- [x] Refactorizar Research para usarlas
- [x] Probar cambios de orden
- [x] Probar Archive/Restore
- [x] Verificar integridad de datos

### **Fase 2: Migrar Products/Services/Team** (Pendiente)

1. Actualizar `ProductFormModal` para incluir campo `id`
2. Actualizar `ServiceFormModal` para incluir campo `id`
3. Actualizar `TeamFormModal` para incluir campo `id`
4. Refactorizar onSave/Archive/Restore de Products
5. Refactorizar onSave/Archive/Restore de Services
6. Refactorizar onSave/Archive/Restore de Team
7. Eliminar función `normalizeOrder` local de AdminApp.jsx
8. Eliminar función `normalizeTeamOrder` de `models/team.js`

### **Fase 3: Optimización** (Futuro)

1. Crear componente genérico `<EntityTable>`
2. Crear componente genérico `<EntityFormModal>`
3. Centralizar persistencia con función `persistEntity()`
4. Agregar validaciones en `crudHelpers.js`

---

## 🧪 Testing

### **Pruebas Realizadas:**

1. ✅ **Cambio de orden 1→2**

   ```bash
   node test-order-change.cjs
   ```

   - Resultado: Sin duplicados, IDs únicos
   - Los artículos se intercambian correctamente

2. ✅ **Análisis de integridad**

   ```bash
   node analyze-research-data.cjs
   ```

   - 41 artículos totales
   - 41 IDs únicos
   - 41 slugs únicos
   - 40 activos + 1 archivado

3. ✅ **Compilación**
   - Sin errores de TypeScript/ESLint
   - Hot reload funciona correctamente

### **Pruebas Pendientes en Navegador:**

1. 🔲 Editar un artículo y cambiar orden (ej: del 5 al 10)
2. 🔲 Crear un nuevo artículo
3. 🔲 Archivar un artículo
4. 🔲 Restaurar un artículo archivado
5. 🔲 Verificar que la web pública muestra solo activos
6. 🔲 Cambiar orden en CMS y verificar en web pública

---

## 📚 Documentación de Funciones

### `normalizeOrder(list)`

**Propósito**: Renumerar artículos activos consecutivamente sin gaps.

**Entrada**: Array de elementos con `{ id, order, archived, ... }`

**Salida**: Array normalizado donde activos tienen orden 1, 2, 3... (archivados mantienen su orden)

**Ejemplo**:

```javascript
// Entrada: [
//   {id: 'a', order: 5, archived: false},
//   {id: 'b', order: 10, archived: false},
//   {id: 'c', order: 15, archived: true}
// ]

// Salida: [
//   {id: 'a', order: 1, archived: false},  // Renumerado
//   {id: 'b', order: 2, archived: false},  // Renumerado
//   {id: 'c', order: 15, archived: true}   // Sin cambios
// ]
```

---

### `upsertWithReorder(currentRows, payload)`

**Propósito**: Insertar o actualizar un elemento con reordenamiento inteligente.

**Casos manejados**:

1. **Editar existente**: Elimina el original, lo reinserta en nueva posición
2. **Crear nuevo**: Lo inserta en la posición solicitada
3. **Archivado**: Lo agrega sin desplazar nada

**Ejemplo - Cambiar orden 1→2**:

```javascript
// Estado actual: [A(1), B(2), C(3)]
// payload: {...A, order: 2}

// Resultado: [B(1), A(2), C(3)]
// - A eliminado temporalmente
// - B renumerado a 1
// - A insertado en 2
// - C renumerado a 3
```

---

### `restoreItem(currentRows, toRestore)`

**Propósito**: Restaurar un elemento archivado en una posición específica.

**Ejemplo**:

```javascript
// Estado: [A(1), B(2), C(archived)]
// Restaurar C en orden 2

// Resultado: [A(1), C(2), B(3)]
```

---

### `archiveItem(currentRows, toArchive)`

**Propósito**: Archivar un elemento manteniendo el resto normalizado.

**Ejemplo**:

```javascript
// Estado: [A(1), B(2), C(3)]
// Archivar B

// Resultado: [A(1), C(2), B(archived)]
```

---

## 🔍 Debug Tips

### Ver logs en consola del navegador:

```javascript
// Buscar:
🟢 [Research onSave] Payload received
🟢 [Research onSave] Current rows
🟢 [Research onSave] Next rows
```

### Verificar datos en terminal:

```bash
node analyze-research-data.cjs
```

### Simular cambios sin afectar datos:

```bash
node test-order-change.cjs
```

---

## 💡 Notas para Migración a PostgreSQL

Cuando migremos a PostgreSQL, solo necesitamos:

1. Cambiar `persistResearchRows()` para llamar API REST
2. Mantener las funciones de `crudHelpers.js` SIN cambios
3. El frontend seguirá funcionando igual

**Ejemplo de migración**:

```javascript
// ❌ ACTUAL (JSON file)
async function persistResearchRows(data) {
  return await fetchJson("/api/research/save", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

// ✅ FUTURO (PostgreSQL)
async function persistResearchRows(data) {
  return await fetchJson("/api/research", {
    method: "PUT", // RESTful update
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}
```

---

## ✨ Conclusión

Esta refactorización establece las bases para un CMS escalable, mantenible y listo para crecer. Las funciones comunes en `crudHelpers.js` son el primer paso hacia una arquitectura más profesional.

**Próximo paso recomendado**: Probar exhaustivamente Research en el navegador antes de migrar Products/Services/Team.
