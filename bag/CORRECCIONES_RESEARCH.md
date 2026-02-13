# 🔧 Correcciones Aplicadas al CMS de Investigación

## ✅ Problemas Resueltos

### 1. **Datos no cargaban en la tabla**

**Problema:** El CMS buscaba datos en `/content/research.json` pero la landing pública leía de `/assets/images/investigacion/posts.json`

**Solución:**

- ✅ Unificado todo en `/public/content/research.json`
- ✅ Actualizado `InvestigacionLanding.jsx` para leer de `/content/research.json`
- ✅ Eliminados archivos duplicados:
  - `public/assets/images/investigacion/posts.json`
  - `src/investigacion/posts.json`

### 2. **IDs y Orden duplicados**

**Problema:** Todos los artículos tenían el mismo ID y orden, causando errores de React "duplicate key"

**Solución:**

- ✅ Normalizado `research.json` con script:
  - IDs únicos basados en `slug`
  - Orden secuencial (1, 2, 3...)
  - Ordenados por fecha descendente (más recientes primero)
  - Campo `archived: false` agregado a todos

### 3. **Endpoint API no configurado**

**Problema:** Vite no tenía proxy para `/api/research/*`

**Solución:**

- ✅ Agregado `/api/research/` a la lista de rutas protegidas en `vite.config.js`
- ✅ Implementados handlers:
  - `GET /api/research/list` - Lista artículos
  - `POST /api/research/save` - Guarda artículos con backup automático

### 4. **Logs de debug en producción**

**Solución:**

- ✅ Eliminados todos los `console.log` de debug
- ✅ Mantenidos solo `console.error` para errores críticos

---

## 📁 Estructura Final de Datos

```
public/
├── content/
│   ├── services.json      ✅ Servicios
│   ├── products.json      ✅ Productos
│   ├── team.json          ✅ Equipo
│   ├── research.json      ✅ Investigación (41 artículos)
│   └── _backups/          ✅ Backups automáticos
└── assets/
    └── images/
        └── investigacion/
            ├── images/    ✅ Imágenes de artículos
            └── pdf/       ✅ PDFs de artículos
```

---

## 🎯 Formato de Datos en research.json

```json
{
  "id": "classification-of-south-american-camelid-...",
  "slug": "classification-of-south-american-camelid-...",
  "order": 1,
  "archived": false,
  "lang": "en",
  "title": "Classification of South American Camelid...",
  "date": "2024-04-04",
  "journal": "SOUTH AMERICAN CAMELIDS",
  "summary_30w": "Some animal fibers are considerably cheaper...",
  "keywords": ["Deep learning", "FTIR spectrometry", ...],
  "products": ["Otros"],
  "localImage": "/assets/images/investigacion/images/...",
  "download_link_DOI": "https://doi.org/10.1080/...",
  "download_link_pdf": "/assets/images/investigacion/pdf/...",
  "author": ["Max Quispe", "Jesús D. Trigo", ...]
}
```

---

## 🚀 Resultado Final

✅ **41 artículos** cargados correctamente  
✅ **Ordenados por fecha** (más recientes primero)  
✅ **Sin errores** de duplicate keys  
✅ **Tabla responsive** funcionando  
✅ **API endpoints** configurados  
✅ **Backups automáticos** habilitados  
✅ **Código limpio** sin logs de debug

---

## 📝 Próximos Pasos Sugeridos

1. **Implementar función Archivar** (actualmente muestra alert)
2. **Agregar filtros** en la tabla (por revista, fecha, keywords)
3. **Implementar búsqueda** por título/abstract
4. **Mejorar preview** con más campos visibles
5. **Agregar validaciones** en el formulario
6. **Upload de imágenes** directo al servidor

---

## 🔄 Comandos Útiles

**Normalizar artículos manualmente:**

```bash
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('public/content/research.json', 'utf8')); const normalized = data.map((item, idx) => ({ ...item, id: item.slug || 'research-' + idx, order: idx + 1, archived: false })).sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => ({ ...item, order: idx + 1 })); fs.writeFileSync('public/content/research.json', JSON.stringify(normalized, null, 2)); console.log('Normalized:', normalized.length);"
```

**Verificar estructura:**

```bash
Get-ChildItem "public\content\" | Select-Object Name, Length
```

**Contar artículos:**

```bash
(Get-Content "public\content\research.json" | ConvertFrom-Json).Length
```

---

Fecha: 2025-10-11  
Estado: ✅ COMPLETADO
