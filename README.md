# CANVAR website

A dependency-free static site built from the supplied content map, text files and image archive.

## Pages

- `index.html` — home
- `projects.html` — filterable project index
- `qdlo.html` — ¿Quién dio la orden?
- `sexilio.html` — Sexilio visual archive
- `paramoverso.html` — Paramoverso
- `camino-cimarron.html` — El Camino Cimarrón
- `colombia-resiste.html` — Colombia Resiste 360
- `continuum-vr.html` — Continuum VR
- `les-danses-extatiques.html` — Les Danses Extatiques
- `mountain-museum.html` — Mountain Museum
- `research.html` — research index
- `residencies.html` — Artivistas, Le Lab and the 2025 cohort

Open `index.html` directly, or serve the directory with any static file server. Global colors, fonts and heading sizes are centralized in `assets/css/theme.css`; layout rules remain in `assets/css/styles.css`, and behavior lives in `assets/js/main.js`. The full source-to-usage image audit is in `assets/ASSET-MANIFEST.md`.

Embedded YouTube players require an HTTP origin. For local video testing, run `python -m http.server 8000` in this directory and open `http://localhost:8000/`; opening the HTML through `file://` causes YouTube error 153.

If Python is unavailable, run `node scripts/serve.js` and open `http://127.0.0.1:8000/`. This server also sends the correct MIME type for local `.glb` model testing.
