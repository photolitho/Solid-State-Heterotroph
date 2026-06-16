# Solid-State-Heterotroph

**Solid State — Interactive Periodic Table & Solid State Physics Explorer (PWA)**

The periodic table as a gateway into solid state physics. Tap any of the 118 elements to see
its data *and* its physics: crystal structure, Bravais lattice, band gap, conductor /
semiconductor / insulator classification, effective mass and device applications.

## Features

- **Full 118-element periodic table** — mobile-first, **colour-filled tiles** by category, 44 px+ tap
  targets, horizontal scroll on small screens.
- **Element detail sheet** (slides up from the bottom) with **Data** and **Solid State Physics**
  tabs, plus an animated electron-shell pulse on open (pure CSS).
- **Semiconductor focus mode** — dims non-semiconductors and shows a band-gap bar chart
  (direct vs indirect) plus a III-V compounds section: **InP**, GaAs, In₀.₅₃Ga₀.₄₇As, GaN,
  Al₀.₃Ga₀.₇As, 4H-SiC, InSb with band gaps and lattice constants.
- **Physics reference tab** — Bragg's law calculator, Rayleigh resolution calculator,
  radioactive-decay calculator, intrinsic carrier concentration with a **temperature-dependent
  band gap (Varshni)**, SVG crystal structure viewer (FCC / BCC / diamond cubic / zincblende),
  **device cross-sections** (n-MOSFET / InP laser / GaN HEMT), and key formulas with a Fermi–Dirac sketch.
- **Day / night theme** — full light theme toggle, persisted across sessions.
- **English / Italian** — language toggle for element names and the browse/detail chrome,
  persisted across sessions.
- **Colour the table by** — a single selector recolours every tile by a category (Chemistry,
  Semiconductor role, Photonics, Magnetism) or by a continuous-gradient property (atomic radius,
  electronegativity, melting point, density, log-scaled crustal abundance) with a colour scale.
- **Property filter** — highlight only the elements matching presets (semiconductors, direct-gap,
  conductors, ferromagnets, radioactive, dopants) and/or a numeric min/max range.
- **Magnetism** — per-element classification (dia/para/ferro/antiferromagnetic),
  susceptibility, ordered moment, Curie & Néel temperatures.
- **Radioactivity** — a ☢ marker on every radioactive element (Tc, Pm and all Z ≥ 84) with
  most-stable isotope, half-life, decay mode and a short note; **decay-chain diagrams** for the
  uranium and thorium series; plus a Physics-tab decay calculator with decay-mode and
  dose-unit (Bq / Gy / Sv) reference cards.
- **Periodic trends** — atomic-radius / abundance data per element, plus a Data-tab mini-chart of
  the property across the element's period, and °K/°C/°F unit switching.
- **Electronic structure** — animated shell diagram with valence highlighting and orbital occupancy.
- **Interactive 3D crystal cells** — drag-to-rotate FCC, BCC, HCP, diamond cubic, zincblende.
- **Compounds tab** — per-element list of semiconductor compounds (13 materials).
- **Material comparison** — side-by-side table of up to 4 elements/compounds (mobility,
  permittivity, thermal conductivity, magnetism…), exportable as **CSV** or an **SVG image**.
- **Materials map** — the classic band gap vs lattice constant chart with the InP ecosystem,
  direct/indirect coding and wafer-ecosystem notes.
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
