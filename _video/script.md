# Script — "Spatial Audio Volume" (≈30s)

Vídeo explicativo del concepto de la app: dos sesiones de audio de Windows controladas por la posición de un avatar sobre un eje horizontal.

## Especificaciones técnicas

- **Aspect ratio**: 1:1 (1080×1080). Alternativa: 9:16 (1080×1920) si va a redes verticales.
- **Duración**: 30s @ 30fps = 900 frames.
- **Fuente**: Caveat (Google Fonts) — coincide con la estética hand-drawn de la app.
- **Paleta**:
  - Papel: `#FAF7F2`
  - Trazo: `#1A1A1A`
  - Acento cyan: `#7DD3D8`
  - Atenuado: `#9CA3AF`
- **Animaciones**:
  - Trazo "draw-in" en SVG paths (`strokeDasharray` + `interpolate` sobre `strokeDashoffset`).
  - Ondas de sonido como sinusoides; `amplitude` interpola con la posición de la cabeza (`spring`).
  - La cabeza "you" mueve `x` con `spring({ damping: 18 })`.
- **Transiciones**: `slide` o `wipe` suave de `@remotion/transitions`, 15 frames.
- **Audio**: si no hay voz en off, alargar textos en pantalla ~0.5s por escena y añadir música lo-fi minimal de fondo.

---

## Escena 1 · Hook (0:00 – 0:04)

**Visual**: dos ventanas de apps superpuestas (Spotify + Discord, dibujadas en wireframe sketchy) sonando a la vez. Ondas de sonido encimadas, caóticas.

**Texto en pantalla**:
> "Dos apps. Un solo volumen maestro."

**VO / subtítulo**:
> "Cuando dos apps suenan a la vez, las mezclas con el mixer de Windows. Una a una."

---

## Escena 2 · El problema (0:04 – 0:09)

**Visual**: zoom al Volume Mixer de Windows (sketch). El cursor mueve un slider, luego otro, luego el primero otra vez. Frustración.

**Texto**:
> "Ajustar. Volver. Reajustar."

**VO**:
> "Sliders independientes. Sin relación entre ellos."

---

## Escena 3 · La idea (0:09 – 0:15)

**Visual**: el Volume Mixer se desvanece. Aparece un campo rectangular dibujado a mano con dos burbujas — izquierda **Spotify**, derecha **Discord** — y en el centro una cabecita "you". Cyan suave.

**Texto grande**:
> "¿Y si fuera espacial?"

**VO**:
> "Una sola posición. Dos volúmenes."

---

## Escena 4 · Demo del concepto (0:15 – 0:23)

**Visual**: la cabeza "you" se desliza hacia la burbuja izquierda. Mientras se acerca, las ondas de Spotify crecen y las de Discord se atenúan. Luego cruza al lado derecho y se invierte. Marcas `-1`, `0`, `+1` apareciendo bajo el eje.

**Texto sincronizado** con la posición:
- `-1` → "100% / 0%"
- `0` → "50% / 50%"
- `+1` → "0% / 100%"

**VO**:
> "Te acercas a una app, sube. Te alejas, baja. La otra hace lo contrario."

---

## Escena 5 · Bajo el capó (0:23 – 0:28)

**Visual**: split en dos: izquierda el campo con la cabeza moviéndose; derecha el Volume Mixer real moviéndose **solo**, en sincronía. Flecha curvada uniendo ambos.

**Texto**:
> "WASAPI · por PID · tiempo real"

**VO**:
> "Sin drivers. Sin rerouting. Las mismas sesiones de audio que ya usas en Windows."

---

## Escena 6 · Cierre (0:28 – 0:30)

**Visual**: logo / wordmark "Spatial Audio Volume" dibujado a mano.

**Texto**:
> Spatial Audio Volume
> Tauri 2 · Rust · Windows

---

## Primer prompt para Claude Code (dentro de `_video/`)

> Quiero un vídeo de 30s en formato 1:1, estética hand-drawn / sketchy con fuente Caveat, papel claro `#FAF7F2` y acento cyan `#7DD3D8`. Es para explicar mi app **Spatial Audio Volume**: una herramienta de Windows (Tauri 2 + Rust) que controla el volumen de dos apps simultáneamente moviendo una "cabeza" sobre un eje horizontal — acercarte a una sube su volumen y baja la de la otra. Léete el script en `script.md` y propón primero un storyboard con duración por escena, paths SVG necesarios y curvas de animación, antes de generar código.
