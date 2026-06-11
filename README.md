# Solid-State-Heterotroph

**Solid State — Interactive Periodic Table & Solid State Physics Explorer (PWA)**

The periodic table as a gateway into solid state physics. Tap any of the 118 elements to see
its data *and* its physics: crystal structure, Bravais lattice, band gap, conductor /
semiconductor / insulator classification, effective mass and device applications.

## Features

- **Full 118-element periodic table** — mobile-first, colour-coded by category, 44 px+ tap
  targets, horizontal scroll on small screens.
- **Element detail sheet** (slides up from the bottom) with **Data** and **Solid State Physics**
  tabs, plus an animated electron-shell pulse on open (pure CSS).
- **Semiconductor focus mode** — dims non-semiconductors and shows a band-gap bar chart
  (direct vs indirect) plus a III-V compounds section: **InP**, GaAs, In₀.₅₃Ga₀.₄₇As, GaN,
  Al₀.₃Ga₀.₇As, 4H-SiC, InSb with band gaps and lattice constants.
- **Physics reference tab** — Bragg's law calculator, Rayleigh resolution calculator,
  intrinsic carrier concentration vs temperature, SVG crystal structure viewer
  (FCC / BCC / diamond cubic / zincblende), and key formulas with a Fermi–Dirac sketch.
- **Full PWA** — `manifest.json` + cache-first `sw.js`; works completely offline after first
  load and is installable from Safari on iOS (Share → Add to Home Screen).

## Files

| File | Purpose |
|---|---|
| `index.html` | Entire app: markup, styles, all element data, logic |
| `manifest.json` | PWA manifest (standalone, dark theme) |
| `sw.js` | Service worker, cache-first offline strategy |
| `icon-192.png` / `icon-512.png` | App icons |

No build tools, no frameworks, no network calls at runtime.

## Deploy (GitHub Pages)

Settings → Pages → deploy from branch, root folder. All paths are relative, so it works from
a project subpath (`https://<user>.github.io/Solid-State-Heterotroph/`).
