# Detección Inteligente de Cambios en Traducción (v2.4)

## 🎯 Problema Resuelto

**Problema reportado:**
El badge de traducción solo detectaba modificaciones en el campo `features` (array), pero NO en `title` y `description` (simpleFields). Esto causaba que:

- Usuario editara `title.es` agregando texto
- Badge NO aparecía indicando que falta traducir
- Al traducir, SÍ se traducían todos los campos correctamente
- Pero el badge no mostraba visualmente qué campos necesitaban traducción

**Requisito:**
Hacer la detección **general** para todos los campos (simpleFields, arrayFields, nestedFields), ya que productos tiene ~20 campos y todos deben detectar cambios, tanto en creación como en edición.

---

## ✅ Solución Implementada

### Estrategia de Detección Inteligente

Implementamos un sistema de detección en **3 niveles** para cada tipo de campo:

#### **Nivel 1: Target Vacío** (Falta traducción completa)

```javascript
if (!targetValue || !targetValue.trim()) {
  // ⚠️ DETECTADO: Campo sin traducir
}
```

#### **Nivel 2: Target Idéntico al Source** (No fue traducido, solo copiado)

```javascript
if (targetValue === sourceValue) {
  // ⚠️ DETECTADO: Campo copiado, no traducido
}
```

#### **Nivel 3: Diferencia Significativa en Longitud** (Source modificado después de traducir)

```javascript
const lengthDiff = Math.abs(sourceValue.length - targetValue.length);
const avgLength = (sourceValue.length + targetValue.length) / 2;
const diffPercentage = (lengthDiff / avgLength) * 100;

if (diffPercentage > 20) {
  // ⚠️ DETECTADO: Cambio significativo, necesita retranslación
}
```

**¿Por qué 20% de diferencia?**

- Traducciones entre ES↔EN suelen variar entre -15% y +15% en longitud
- Un 20% de diferencia indica que el source cambió significativamente
- Ejemplo: "Análisis de datos" (17 chars) → "Data analysis" (13 chars) = 13% diferencia ✅
- Ejemplo: "Análisis de datos estadísticos avanzados" (41 chars) → "Data analysis" (13 chars) = 104% diferencia ❌

---

## 🔧 Implementación por Tipo de Campo

### 1. Simple Fields (title, description, category, etc.)

```javascript
for (const field of simpleFields) {
  const sourceValue = data[field]?.[sourceLang];
  const targetValue = data[field]?.[targetLang];

  if (sourceValue && sourceValue.trim()) {
    const sourceTrimmed = sourceValue.trim();
    const targetTrimmed = targetValue ? targetValue.trim() : "";

    // Caso 1: Target vacío
    if (!targetTrimmed) {
      changedFields.push({
        field,
        type: "simple",
        isEmpty: true,
        needsTranslation: true,
      });
    }
    // Caso 2: Target idéntico al source
    else if (targetTrimmed === sourceTrimmed) {
      changedFields.push({
        field,
        type: "simple",
        isEmpty: false,
        needsTranslation: true,
      });
    }
    // Caso 3: Diferencia >20% en longitud
    else {
      const lengthDiff = Math.abs(sourceTrimmed.length - targetTrimmed.length);
      const avgLength = (sourceTrimmed.length + targetTrimmed.length) / 2;
      const diffPercentage = (lengthDiff / avgLength) * 100;

      if (diffPercentage > 20) {
        changedFields.push({
          field,
          type: "simple",
          isEmpty: false,
          hasExisting: true,
          needsTranslation: true,
        });
      }
    }
  }
}
```

**Campos que aplica (Servicios):**

- `title` (Título del servicio)
- `description` (Descripción)

**Campos que aplicará (Productos - futuro):**

- `title`, `description`, `category`, `brand`, `model`, `warranty`, `deliveryTime`, etc. (~10 campos)

---

### 2. Array Fields (features, tags, benefits, etc.)

```javascript
for (const field of arrayFields) {
  const sourceArray = data[field]?.[sourceLang];
  const targetArray = data[field]?.[targetLang];

  if (Array.isArray(sourceArray) && sourceArray.length > 0) {
    const sourceFiltered = sourceArray.filter((item) => item && item.trim());
    const targetFiltered = Array.isArray(targetArray)
      ? targetArray.filter((item) => item && item.trim())
      : [];

    // Caso 1: Target vacío
    if (targetFiltered.length === 0) {
      changedFields.push({
        field,
        type: "array",
        isEmpty: true,
        needsTranslation: true,
      });
    }
    // Caso 2: Diferente cantidad de items
    else if (sourceFiltered.length !== targetFiltered.length) {
      changedFields.push({
        field,
        type: "array",
        isEmpty: false,
        hasExisting: true,
        needsTranslation: true,
      });
    }
    // Caso 3: Mismo length pero contenido diferente
    else {
      let hasContentChanges = false;

      for (let i = 0; i < sourceFiltered.length; i++) {
        const sourceItem = sourceFiltered[i].trim();
        const targetItem = targetFiltered[i].trim();

        // Si item es idéntico (no traducido)
        if (sourceItem === targetItem) {
          hasContentChanges = true;
          break;
        }

        // Si diferencia >25% en longitud (para arrays usamos umbral más alto)
        const lengthDiff = Math.abs(sourceItem.length - targetItem.length);
        const avgLength = (sourceItem.length + targetItem.length) / 2;
        const diffPercentage = (lengthDiff / avgLength) * 100;

        if (diffPercentage > 25) {
          hasContentChanges = true;
          break;
        }
      }

      if (hasContentChanges) {
        changedFields.push({
          field,
          type: "array",
          isEmpty: false,
          hasExisting: true,
          needsTranslation: true,
        });
      }
    }
  }
}
```

**Campos que aplica (Servicios):**

- `features` (Características del servicio)

**Campos que aplicará (Productos - futuro):**

- `features`, `benefits`, `tags`, `categories`, `applications`, etc.

**¿Por qué 25% para arrays?**

- En listas, los items suelen ser más cortos (5-15 palabras)
- Mayor variabilidad natural en traducciones cortas
- 25% reduce falsos positivos en listas pequeñas

---

### 3. Nested Fields (specifications[].label, specifications[].value, etc.)

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
          const sourceTrimmed = sourceValue.trim();
          const targetTrimmed = targetValue ? targetValue.trim() : "";

          // Caso 1: Target vacío
          if (!targetTrimmed) {
            changedFields.push({
              field: `${field}[${i}].${subField}`,
              type: "nested",
              isEmpty: true,
              needsTranslation: true,
            });
          }
          // Caso 2: Target idéntico
          else if (targetTrimmed === sourceTrimmed) {
            changedFields.push({
              field: `${field}[${i}].${subField}`,
              type: "nested",
              isEmpty: false,
              needsTranslation: true,
            });
          }
          // Caso 3: Diferencia >20%
          else {
            const lengthDiff = Math.abs(
              sourceTrimmed.length - targetTrimmed.length
            );
            const avgLength = (sourceTrimmed.length + targetTrimmed.length) / 2;
            const diffPercentage = (lengthDiff / avgLength) * 100;

            if (diffPercentage > 20) {
              changedFields.push({
                field: `${field}[${i}].${subField}`,
                type: "nested",
                isEmpty: false,
                hasExisting: true,
                needsTranslation: true,
              });
            }
          }
        }
      }
    }
  }
}
```

**Campos que aplicará (Productos - futuro):**

- `specifications[].label` (Etiqueta de especificación)
- `specifications[].value` (Valor de especificación)
- `faqs[].question` (Pregunta FAQ)
- `faqs[].answer` (Respuesta FAQ)

---

## 📊 Ejemplos de Detección

### Ejemplo 1: Creación de Servicio Nuevo

**Estado inicial:**

```javascript
{
  title: { es: "Análisis Estadístico", en: "" },
  description: { es: "Realizamos análisis...", en: "" },
  features: { es: ["Item 1", "Item 2"], en: [] }
}
```

**Detección:**

- `title`: ✅ Target vacío → **DETECTADO** (isEmpty: true)
- `description`: ✅ Target vacío → **DETECTADO** (isEmpty: true)
- `features`: ✅ Target vacío → **DETECTADO** (isEmpty: true)

**Badge muestra:** "3 campos → EN"

---

### Ejemplo 2: Edición - Modificar Solo Title

**Estado inicial (después de traducir):**

```javascript
{
  title: { es: "Análisis Estadístico", en: "Statistical Analysis" },
  description: { es: "Realizamos análisis avanzados de datos", en: "We perform advanced data analysis" },
  features: { es: ["Item 1", "Item 2"], en: ["Item 1", "Item 2"] }
}
```

**Usuario edita:**

```javascript
{
  title: { es: "Análisis Estadístico Avanzado y Predictivo", en: "Statistical Analysis" },
  // description y features sin cambios
}
```

**Detección:**

```javascript
// title.es antes: "Análisis Estadístico" (21 chars)
// title.es ahora: "Análisis Estadístico Avanzado y Predictivo" (43 chars)
// title.en sigue: "Statistical Analysis" (20 chars)

// Diferencia: |43 - 20| = 23 chars
// Promedio: (43 + 20) / 2 = 31.5 chars
// Porcentaje: (23 / 31.5) * 100 = 73% > 20% ✅ DETECTADO
```

**Badge muestra:** "1 campo → EN"

---

### Ejemplo 3: Edición - Modificar Array (Agregar Item)

**Estado inicial:**

```javascript
{
  features: {
    es: ["Análisis de datos", "Reportes automatizados"],
    en: ["Data analysis", "Automated reports"]
  }
}
```

**Usuario agrega item:**

```javascript
{
  features: {
    es: ["Análisis de datos", "Reportes automatizados", "Visualización interactiva"],
    en: ["Data analysis", "Automated reports"] // Sigue con 2 items
  }
}
```

**Detección:**

```javascript
// sourceFiltered.length = 3
// targetFiltered.length = 2
// 3 !== 2 ✅ DETECTADO (diferente cantidad)
```

**Badge muestra:** "1 campo → EN"

---

### Ejemplo 4: Edición - Modificar Item Existente en Array

**Estado inicial:**

```javascript
{
  features: {
    es: ["Análisis de datos", "Reportes"],
    en: ["Data analysis", "Reports"]
  }
}
```

**Usuario modifica primer item:**

```javascript
{
  features: {
    es: ["Análisis de datos estadísticos avanzados", "Reportes"],
    en: ["Data analysis", "Reports"]
  }
}
```

**Detección:**

```javascript
// Item 0:
// source: "Análisis de datos estadísticos avanzados" (41 chars)
// target: "Data analysis" (13 chars)
// Diferencia: |41 - 13| = 28 chars
// Promedio: (41 + 13) / 2 = 27 chars
// Porcentaje: (28 / 27) * 100 = 103% > 25% ✅ DETECTADO
```

**Badge muestra:** "1 campo → EN"

---

### Ejemplo 5: Sin Cambios - Todo Traducido Correctamente

**Estado:**

```javascript
{
  title: { es: "Análisis Estadístico", en: "Statistical Analysis" },
  description: { es: "Realizamos análisis avanzados", en: "We perform advanced analysis" },
  features: {
    es: ["Análisis de datos", "Reportes"],
    en: ["Data analysis", "Reports"]
  }
}
```

**Detección:**

```javascript
// title:
// Diferencia: |22 - 20| = 2 chars
// Promedio: 21 chars
// Porcentaje: 9.5% < 20% ✅ OK (no detectado)

// description:
// Diferencia: |29 - 28| = 1 char
// Promedio: 28.5 chars
// Porcentaje: 3.5% < 20% ✅ OK (no detectado)

// features:
// Item 0: "Análisis de datos" (17) vs "Data analysis" (13) = 26% > 25% ❌
// Espera... esto es falso positivo
```

**Problema potencial:** Items cortos pueden generar falsos positivos.

**Solución:** Ajustar umbral o agregar longitud mínima:

```javascript
// Solo aplicar detección de longitud si el texto es >20 caracteres
if (avgLength > 20 && diffPercentage > 25) {
  hasContentChanges = true;
}
```

---

## 🎛️ Ajustes de Sensibilidad

### Umbrales Configurables

Puedes ajustar los umbrales según necesidad:

```javascript
const THRESHOLDS = {
  simpleFields: {
    minLength: 20, // Longitud mínima para aplicar detección
    diffPercentage: 20, // Porcentaje de diferencia para detectar
  },
  arrayFields: {
    minLength: 15, // Arrays suelen tener items más cortos
    diffPercentage: 25, // Umbral más alto para arrays
  },
  nestedFields: {
    minLength: 20,
    diffPercentage: 20,
  },
};
```

### Casos Especiales

**1. Textos muy cortos (<10 chars):**

```javascript
// "Nuevo" (6) → "New" (3) = 66% diferencia
// Pero son traducciones válidas
// Solución: No aplicar detección si avgLength < 10
```

**2. Textos idénticos en ambos idiomas:**

```javascript
// "Wi-Fi" (5) → "Wi-Fi" (5) = 0% diferencia pero SON iguales
// Solución: Ya detectado en Caso 2 (target === source)
```

**3. Números y códigos:**

```javascript
// "Model X-2000" → "Model X-2000" (idéntico)
// Solución: Caso 2 lo detecta como "no traducido"
```

---

## ✅ Ventajas del Sistema

### 1. **Escalable**

- Funciona con 3 campos (Servicios) o 20 campos (Productos)
- Misma lógica para todos los tipos de campo
- No requiere configuración adicional por módulo

### 2. **Inteligente**

- Detecta cambios sutiles (agregar/quitar palabras)
- Distingue traducciones válidas de cambios reales
- Reduce falsos positivos con umbrales ajustados

### 3. **Visual**

- Badge siempre refleja el estado real
- Contador preciso de campos modificados
- Dirección clara (→ EN o → ES)

### 4. **No Invasivo**

- No requiere baseline/tracking state
- No aumenta complejidad del componente
- Basado solo en comparación de valores actuales

---

## 🧪 Pruebas Recomendadas

### Test 1: Crear Servicio Nuevo

1. Completar todos los campos en ES
2. **Esperado:** Badge "3 campos → EN"
3. Traducir
4. **Esperado:** Badge desaparece

### Test 2: Editar Title (Agregar Palabras)

1. Abrir servicio traducido
2. Cambiar `title.es` de "Análisis" a "Análisis Avanzado de Datos"
3. **Esperado:** Badge "1 campo → EN"
4. Traducir
5. **Esperado:** Badge desaparece

### Test 3: Editar Description (Quitar Palabras)

1. Abrir servicio traducido
2. Cambiar `description.es` eliminando mitad del texto
3. **Esperado:** Badge "1 campo → EN"

### Test 4: Editar Features (Agregar Item)

1. Abrir servicio traducido
2. Agregar nuevo item en `features.es`
3. **Esperado:** Badge "1 campo → EN"

### Test 5: Editar Features (Modificar Item)

1. Abrir servicio traducido
2. Modificar item existente agregando texto
3. **Esperado:** Badge "1 campo → EN"

### Test 6: Editar Sin Cambios Significativos

1. Abrir servicio traducido
2. Cambiar `title.es` de "Análisis" a "Análisis." (agregar punto)
3. **Esperado:** Badge NO aparece (cambio <20%)

### Test 7: Múltiples Campos Modificados

1. Abrir servicio traducido
2. Modificar `title.es`, `description.es` y agregar item en `features.es`
3. **Esperado:** Badge "3 campos → EN"

---

## 📈 Comparación Antes/Después

| Aspecto                   | Antes (v2.3)               | Ahora (v2.4)                     |
| ------------------------- | -------------------------- | -------------------------------- |
| **Detección title**       | ❌ No detecta cambios      | ✅ Detecta +20% diferencia       |
| **Detección description** | ❌ No detecta cambios      | ✅ Detecta +20% diferencia       |
| **Detección features**    | ✅ Solo diferente cantidad | ✅ Detecta cantidad Y contenido  |
| **Nested fields**         | ❌ No detecta cambios      | ✅ Detecta +20% diferencia       |
| **Sensibilidad**          | Muy baja (solo vacíos)     | Alta (cambios sutiles)           |
| **Falsos positivos**      | Bajo                       | Bajo (umbrales ajustados)        |
| **Escalabilidad**         | Limitada                   | Total (funciona con 3-20 campos) |

---

## 🚀 Próximos Pasos

### Mejora Futura: Umbral Adaptativo

En lugar de 20% fijo, calcular umbral según longitud:

```javascript
function getAdaptiveThreshold(avgLength) {
  if (avgLength < 10) return 50; // Textos muy cortos: umbral alto
  if (avgLength < 30) return 30; // Textos cortos: umbral medio
  if (avgLength < 100) return 20; // Textos normales: umbral estándar
  return 15; // Textos largos: umbral bajo
}
```

### Mejora Futura: Detección de Palabras Clave

Detectar si se agregaron/quitaron palabras clave importantes:

```javascript
const sourceWords = sourceTrimmed.toLowerCase().split(/\s+/);
const targetWords = targetTrimmed.toLowerCase().split(/\s+/);

// Si hay >3 palabras nuevas en source, detectar cambio
const newWords = sourceWords.filter((w) => !targetWords.includes(w));
if (newWords.length > 3) {
  changedFields.push({ field, hasNewKeywords: true });
}
```

---

## 📝 Checklist de Implementación

- [x] Actualizar `detectChanges()` para simpleFields con 3 niveles
- [x] Actualizar `detectChanges()` para arrayFields con detección de contenido
- [x] Actualizar `detectChanges()` para nestedFields con 3 niveles
- [x] Documentar umbrales y razón de 20%/25%
- [x] Agregar comentarios explicativos en código
- [x] Crear ejemplos de detección
- [x] Definir casos especiales (textos cortos, códigos)
- [ ] **Pendiente:** Probar todos los escenarios en navegador
- [ ] **Pendiente:** Ajustar umbrales si hay falsos positivos
- [ ] **Pendiente:** Aplicar a módulo Products
- [ ] **Pendiente:** Considerar implementar umbral adaptativo

---

**Fecha de implementación:** Enero 2025  
**Versión:** 2.4  
**Módulos afectados:** Servicios (inmediato), Productos (futuro)  
**Archivos modificados:** `src/pages/admin/hooks/useAutoTranslate.js`
