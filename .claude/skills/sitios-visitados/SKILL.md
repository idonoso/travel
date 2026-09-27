---
name: sitios-visitados
description: Añade o actualiza sitios en la página sitios-visitados.html del proyecto travel (dónde ha estado Bubu, el oso panda, y Dudu, el oso pardo, y si quieren volver, lo han visto todo o les falta algo por ver). Disparadores - "hemos estado en", "he estado en", "bubu ha estado en", "dudu ha estado en", "añade un sitio visitado", "marca ... como visitado", "quiero volver a...", "no quiero volver a...", "nos falta ver en...", "hemos visto todo en...", "actualiza sitios visitados".
---

# Skill: Sitios visitados

Cuando el usuario invoque este skill (o mencione un lugar donde ha estado él o su pareja), sigue estos pasos para registrarlo en `sitios-visitados.html`. Este skill **solo** toca ese fichero; no edites `css/styles.css`, `js/app.js`, el nav de otras páginas ni ningún otro fichero del proyecto.

## Ruta

- **Página**: `/Users/ignacio/Sites/travel/sitios-visitados.html`

## Paso 1: Recoger los datos que falten

Las dos personas son:
- **Bubu** — oso panda, icono 🐼
- **Dudu** — oso pardo, icono 🐻

Para cada sitio necesitas:

1. **Quién ha estado**: Bubu, Dudu, o los dos. Puede ser solo uno. Si el mensaje del usuario ya lo deja claro ("yo he estado en..."), pregunta primero a quién se refiere ("yo") si no lo sabes con certeza — no asumas cuál de los dos es sin confirmarlo.
2. **Nombre del sitio concreto**: el lugar exacto (ej. "Teide", "Centro histórico de Córdoba", "Parque Nacional de Ordesa").
3. **Tipo de sitio**: uno de `ciudad`, `pueblo`, `parque-natural`, `playa`, `monumento` o `atraccion`. Infiere el tipo tú mismo a partir de lo que sabes del lugar (ej. "Bilbao" → ciudad, "Cabárceno" → parque natural, "Getaria" → pueblo) sin preguntar. **Pregunta al usuario solo si no eres capaz de adivinarlo con confianza** (nombre desconocido, ambiguo, o que no encaja claramente en ninguna categoría) — en ese caso pregunta directamente "¿Qué es exactamente? ¿Una ciudad, un pueblo, un parque natural, una playa, un monumento o una atracción?".
4. **Región/provincia** bajo la que agrupar el sitio (ej. "Cantabria", "Lleida"). Si el sitio y la región son lo mismo (ej. "Córdoba" ciudad), usa el mismo nombre para ambos.
5. **País**. Infiere el país a partir del sitio o la región sin preguntar si es obvio (por defecto "España"); pregunta el país solo si no es obvio a partir del sitio.
6. **Estado de cada persona mencionada en ese sitio** — pregúntalo explícitamente, una opción de estas tres:
   - `quiere-volver` → "Quiere volver"
   - `visto-todo` → "Visto todo"
   - `falta-por-ver` → "Le falta por ver"

   No asumas el estado a partir de comentarios genéricos; confírmalo con el usuario para cada persona que haya estado en el sitio. Si el usuario ya lo dijo explícitamente en su mensaje (p.ej. "me gustaría volver a Ordesa"), no vuelvas a preguntarlo.

Haz preguntas cortas y agrupadas, solo por los datos que falten.

## Paso 2: Leer el estado actual de la página

Lee `sitios-visitados.html` completo para ver si el sitio ya existe (misma región + mismo nombre exacto) y para decidir dónde insertar la fila nueva.

## Paso 3: La página es una única tabla plana

Desde el rediseño, `sitios-visitados.html` ya no usa continente/país/región como secciones plegables anidadas: es **una sola tabla** (`<table class="site-table" id="visited-table" data-sortable>`) con un buscador encima (`<input ... data-table-filter="visited-table">`) y columnas ordenables al hacer clic (`Sitio`, `Región` y `País`). No hay agregados por región/país que calcular ni mantener.

Si el fichero todavía tiene el bloque de `empty-state` (primera entrada) o la estructura antigua con `.continent-block`/`.country-block`/`.region-group`, avisa al usuario en vez de intentar migrar la estructura tú mismo.

## Paso 4: Plantilla de markup

Cada sitio es una única `<tr>` dentro del `<tbody>` de la tabla, con este formato exacto:

```html
<tr data-name="Teide" data-region="Tenerife" data-country="España">
    <td class="site-name-cell"><span class="site-type" data-type="atraccion" title="Atracción">🎡</span>Teide</td>
    <td class="persona-cell">Tenerife</td>
    <td class="persona-cell">España</td>
    <td class="persona-cell">
        <span class="persona-badge" data-status="quiere-volver">Quiere volver</span>
    </td>
    <td class="persona-cell">—</td>
</tr>
```

Reglas de la plantilla:
- El orden de columnas en el `<tbody>` es siempre: Sitio, Región, País, 🐻 Dudu, 🐼 Bubu (mismo orden que el `<thead>` existente, no lo cambies).
- `data-name` en la `<tr>` es el nombre exacto del sitio (sin icono), `data-region` es el texto exacto de la región y `data-country` es el texto exacto del país — se usan para ordenar y filtrar la tabla; deben coincidir con el texto visible.
- La celda de sitio es `<td class="site-name-cell"><span class="site-type" data-type="...">icono</span>Nombre del sitio</td>`. El icono va pegado al nombre, sin espacio de por medio (el CSS ya le da margen). `data-type` solo admite `ciudad`, `pueblo`, `parque-natural`, `playa`, `monumento` o `atraccion`, con estos iconos exactos:
  - `ciudad` → 🏙️
  - `pueblo` → 🏘️
  - `parque-natural` → 🌳
  - `playa` → 🏖️
  - `monumento` → 🏛️
  - `atraccion` → 🎡
- La celda de región es `<td class="persona-cell">Texto de la región</td>` (texto plano, sin markup adicional).
- La celda de país es `<td class="persona-cell">Texto del país</td>` (texto plano, sin markup adicional). Por defecto "España".
- En la columna de cada persona: si esa persona **ha estado** en el sitio, pon únicamente el `<span class="persona-badge" data-status="...">` con el texto exacto "Quiere volver", "Visto todo" o "Le falta por ver" (sin año ni ningún otro dato). Si esa persona **no ha estado**, la celda es solo un guion: `<td class="persona-cell">—</td>`.
- `data-status` solo admite `quiere-volver`, `visto-todo` o `falta-por-ver`.

## Paso 5: Insertar en el lugar correcto

El orden visual de la tabla no importa para el funcionamiento (se puede reordenar haciendo clic en las cabeceras), pero para que el HTML se mantenga legible al leerlo o diffearlo, inserta la `<tr>` nueva agrupada junto a las demás filas de la misma región, y esa región en su posición alfabética respecto al resto (comparación insensible a mayúsculas/acentos). Si la región no existe todavía, crea el primer grupo de filas para ella en su posición alfabética.

## Paso 6: Sitio ya existente — actualizar en vez de duplicar

Si el sitio (misma región + mismo nombre exacto de sitio) ya existe:

- Si la celda de la persona que estás registrando está vacía (`—`), sustitúyela por su `<span class="persona-badge">`.
- Si la celda **ya tiene un badge** y su estado ha cambiado (p.ej. pasó de "Le falta por ver" a "Visto todo"), actualiza `data-status` y el texto del badge en consecuencia.
- Nunca crees una `<tr>` duplicada para el mismo sitio.
- Si el sitio existente todavía no tiene `<span class="site-type">` (páginas antiguas) o le falta el `data-name`/`data-region`/`data-country` en la `<tr>` o la celda de País, añádeselos siguiendo las reglas del Paso 4.

## Paso 7: Resumen final

Al terminar, confirma en una frase qué se ha añadido o actualizado (sitio, región, y el estado de cada persona).
