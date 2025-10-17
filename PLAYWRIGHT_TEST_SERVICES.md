# Test Automatizado: Botón Consultar/Consult en CMS

**Fecha:** 14 de octubre de 2025  
**Archivo de Test:** `tests/admin-services-button-language.spec.js`  
**Framework:** Playwright

---

## 🎯 Objetivo del Test

Verificar que el botón **"Consultar/Consult"** en el modal de vista previa del CMS cambia correctamente de idioma cuando el usuario alterna entre Español e Inglés.

### Problema a Verificar

- **Web Pública:** El botón cambia correctamente de idioma ✅
- **CMS (Admin):** El botón **NO estaba cambiando** de idioma ❌
- **Causa:** useMemo no estaba recreando el objeto `previewService` al cambiar `activeLang`

---

## 🚀 Cómo Ejecutar el Test

### 1. **Asegúrate de que el servidor esté corriendo**

```powershell
# Si no está corriendo:
npm run dev

# Debería mostrar:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5174/
```

### 2. **Ejecutar el Test (Modo Headless)**

```powershell
# Ejecutar todos los tests de servicios
npm run test:services

# O directamente con Playwright:
npx playwright test admin-services-button-language
```

**Salida esperada:**

```
Running 3 tests using 1 worker

  ✓ admin-services-button-language.spec.js:17 (5s)
    Botón Consultar/Consult debe cambiar idioma en modo VIEW

  ✓ admin-services-button-language.spec.js:120 (3s)
    Verificar que useMemo recrea el objeto cuando cambia activeLang

  ✓ admin-services-button-language.spec.js:147 (6s)
    Comparar con web pública - ambos deben tener mismo comportamiento

  3 passed (14s)
```

---

### 3. **Ejecutar el Test (Modo Headed - Ver el navegador)**

```powershell
# Ver el navegador mientras se ejecuta el test
npm run test:services:headed

# O con Playwright:
npx playwright test admin-services-button-language --headed
```

Esto abrirá Chrome y podrás ver cómo el test interactúa con la aplicación.

---

### 4. **Ejecutar el Test (Modo Debug - Paso a Paso)**

```powershell
# Modo debug con inspector de Playwright
npm run test:services:debug

# O con Playwright:
npx playwright test admin-services-button-language --debug
```

Esto abrirá:

- **Playwright Inspector:** Para ejecutar paso a paso
- **Chrome DevTools:** Para inspeccionar elementos

---

## 📋 Tests Incluidos

### Test 1: **Cambio de Idioma Básico**

**Flujo:**

1. Navegar a `/adminx`
2. Click en "Servicios"
3. Click en botón "Ver" (ojo) del primer registro
4. Verificar modal visible
5. Click en "Español (ES)" → Verificar botón dice "Consultar"
6. Click en "Inglés (EN)" → Verificar botón dice "Consult"
7. Alternar múltiples veces para verificar estabilidad

**Verificaciones:**

- ✅ Botón muestra "Consultar" en Español
- ✅ Botón muestra "Consult" en Inglés
- ✅ No hay texto residual del otro idioma
- ✅ Funciona al alternar múltiples veces

---

### Test 2: **Verificación de useMemo**

**Flujo:**

1. Abrir modal de servicios en modo VIEW
2. Cambiar idiomas varias veces
3. Capturar el texto del botón en cada cambio

**Verificaciones:**

- ✅ useMemo recrea `previewService` cuando cambia `activeLang`
- ✅ React detecta el cambio de referencia
- ✅ ServiceCard re-renderiza correctamente

---

### Test 3: **Comparación CMS vs Web Pública**

**Flujo:**

1. **CMS:** Abrir servicio en modo VIEW, cambiar idiomas
2. **Web Pública:** Navegar a `/`, cambiar idiomas en ServiceCard
3. **Comparar:** Los textos deben ser idénticos

**Verificaciones:**

- ✅ CMS (ES) = "Consultar"
- ✅ Web Pública (ES) = "Consultar"
- ✅ CMS (EN) = "Consult"
- ✅ Web Pública (EN) = "Consult"
- ✅ Ambos tienen el mismo comportamiento

---

## 🐛 Qué Hace el Test Internamente

### Paso 1: Navegar y Autenticarse

```javascript
await page.goto("/adminx");
await page.waitForLoadState("networkidle");
```

### Paso 2: Abrir Sección de Servicios

```javascript
const servicesButton = page.getByRole("button", { name: /Servicios/i });
await servicesButton.click();
```

### Paso 3: Abrir Modal de Vista Previa

```javascript
const viewButton = page
  .locator('button[title="Ver"], button:has-text("Ver")')
  .first();
await viewButton.click();
```

### Paso 4: Cambiar Idioma y Verificar

```javascript
// Cambiar a Español
await page.getByRole("button", { name: /Español.*ES/i }).click();

// Buscar el botón dentro del ServiceCard
const consultButton = serviceCard.locator(
  'button:has-text("Consultar"), a:has-text("Consultar")'
);

// Verificar texto
const text = await consultButton.textContent();
expect(text.trim()).toBe("Consultar");
```

---

## 📊 Resultados del Test

### ✅ Si el Test Pasa

```
✓ Botón Consultar/Consult debe cambiar idioma en modo VIEW (5s)

  📍 Click en botón Ver...
  ✅ Modal abierto
  ✅ ServiceCard visible
  ✅ Botones de idioma visibles

  🔍 TEST 1: Cambiar a Español (ES)
  📝 Texto del botón en ES: "Consultar"
  ✅ Botón muestra 'Consultar' en Español

  🔍 TEST 2: Cambiar a Inglés (EN)
  📝 Texto del botón en EN: "Consult"
  ✅ Botón muestra 'Consult' en Inglés

  🔍 TEST 3: Alternar idiomas múltiples veces
  ✅ ES → Consultar
  ✅ EN → Consult
  ✅ ES → Consultar (segunda vez)

  🏁 Test completado exitosamente
```

**Significado:** useMemo está funcionando correctamente y el botón cambia de idioma.

---

### ❌ Si el Test Falla

```
✗ Botón Consultar/Consult debe cambiar idioma en modo VIEW (3s)

  Error: expect(received).toBe(expected)

  Expected: "Consult"
  Received: "Consultar"

  at tests/admin-services-button-language.spec.js:95:28
```

**Significado:** El botón no está cambiando de idioma. Posibles causas:

1. **useMemo no tiene `activeLang` en dependencies:**

   ```javascript
   // ❌ Incorrecto:
   const previewService = useMemo(() => toCardProps(data, activeLang), [data]);

   // ✅ Correcto:
   const previewService = useMemo(
     () => toCardProps(data, activeLang),
     [data, activeLang]
   );
   ```

2. **toCardProps no usa `lang` parámetro:**

   ```javascript
   // ❌ Incorrecto:
   const toCardProps = (s, lang) => ({
     buttonText: "Consultar", // Hardcoded
   });

   // ✅ Correcto:
   const toCardProps = (s, lang) => ({
     buttonText:
       messages[lang]?.services?.consult ||
       (lang === "es" ? "Consultar" : "Consult"),
   });
   ```

3. **ServiceCard no recibe el prop `buttonText`:**

   ```javascript
   // ❌ Incorrecto:
   <ServiceCard service={{ ...data }} />

   // ✅ Correcto:
   <ServiceCard service={previewService} />
   ```

---

## 🔧 Troubleshooting

### Problema 1: Test no encuentra el botón "Ver"

**Error:**

```
TimeoutError: locator.click: Timeout 5000ms exceeded
```

**Solución:**
Ajustar el selector del botón "Ver" según la implementación real:

```javascript
// Opción 1: Por texto
const viewButton = page.locator('button:has-text("Ver")').first();

// Opción 2: Por título
const viewButton = page.locator('button[title="Ver"]').first();

// Opción 3: Por ícono (lucide-react Eye)
const viewButton = page.locator("button:has(svg.lucide-eye)").first();

// Opción 4: Por clase CSS
const viewButton = page.locator("button.view-service-btn").first();
```

---

### Problema 2: Test no encuentra el ServiceCard

**Error:**

```
TimeoutError: locator.isVisible: Timeout 2000ms exceeded
```

**Solución:**
Ajustar el selector del ServiceCard:

```javascript
// Opción 1: Por clases de Tailwind
const serviceCard = page.locator(".bg-gradient-to-br.rounded-2xl").first();

// Opción 2: Por data-attribute
const serviceCard = page.locator('[data-testid="service-card"]').first();

// Opción 3: Por estructura
const serviceCard = page.locator(".relative.group.rounded-2xl").first();
```

**Alternativa:** Agregar `data-testid` al ServiceCard:

```jsx
<div data-testid="service-card" className="relative group ...">
```

---

### Problema 3: Test pasa pero botón no cambia visualmente

**Síntoma:**
Test pasa pero al revisar manualmente, el botón no cambia.

**Posible causa:**
El texto cambia en el DOM pero CSS oculta el cambio o hay texto duplicado.

**Solución:**
Verificar en Chrome DevTools:

```javascript
// En el test, agregar:
await page.pause(); // Pausa el test para inspeccionar

// O hacer screenshot:
await page.screenshot({ path: "debug-button.png" });
```

---

## 📈 Métricas del Test

| Métrica                  | Valor Esperado   |
| ------------------------ | ---------------- |
| **Duración Total**       | 10-15 segundos   |
| **Test 1 (Básico)**      | 5-7 segundos     |
| **Test 2 (useMemo)**     | 3-4 segundos     |
| **Test 3 (Comparación)** | 6-8 segundos     |
| **Success Rate**         | 100% (3/3 tests) |

---

## 🎬 Grabación del Test

Para grabar video del test:

```powershell
# Grabar video en todas las ejecuciones
npx playwright test admin-services-button-language --video=on

# Grabar solo en fallas
npx playwright test admin-services-button-language --video=retain-on-failure
```

Videos se guardan en `test-results/`.

---

## 📸 Screenshots en Fallas

Si el test falla, Playwright automáticamente guarda:

1. **Screenshot:** `test-results/.../test-failed-1.png`
2. **Video:** `test-results/.../video.webm`
3. **Trace:** `test-results/.../trace.zip`

Para ver el trace:

```powershell
npx playwright show-trace test-results/.../trace.zip
```

---

## 🔄 Integración Continua (CI)

Para ejecutar en GitHub Actions, agregar a `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:services

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📚 Referencias

**Playwright Docs:**

- [Getting Started](https://playwright.dev/docs/intro)
- [Locators](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)

**React Testing:**

- [Testing React Apps](https://playwright.dev/docs/testing-react)
- [Component Testing](https://playwright.dev/docs/test-components)

---

## ✅ Checklist Pre-Test

Antes de ejecutar el test, verificar:

- [ ] Servidor dev corriendo en `http://localhost:5174`
- [ ] Admin accesible en `/adminx`
- [ ] Existe al menos un servicio en `public/content/services.json`
- [ ] Playwright instalado: `npx playwright install`
- [ ] No hay errores en consola del navegador

---

## 🏁 Conclusión

Este test automatizado verifica que:

1. ✅ El modal de servicios abre correctamente
2. ✅ Los botones de idioma funcionan
3. ✅ useMemo recrea `previewService` al cambiar `activeLang`
4. ✅ ServiceCard recibe el prop actualizado
5. ✅ El botón muestra el texto correcto en cada idioma
6. ✅ CMS y Web Pública tienen el mismo comportamiento

**Si el test pasa:** El bug está resuelto ✅  
**Si el test falla:** Revisar los pasos en "Troubleshooting" ⚠️

---

**Última actualización:** 14 de octubre de 2025  
**Próxima revisión:** Después de ejecutar el test y verificar resultados
