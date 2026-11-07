# AquaThar — Groundwater Intelligence System

A modern, responsive web application that helps people explore **estimated** groundwater availability and depth across **Tharparkar, Sindh, Pakistan**.

> ⚠️ **Disclaimer — please read first.**
> All values shown in AquaThar are **illustrative sample estimates** created for a hackathon prototype. They are **not verified field measurements** and must not be used for any operational, drilling, agricultural, drinking-water or planning decision. Always perform on-site hydrogeological surveys and consult certified professionals before relying on groundwater data.

---

## ✨ Features

| Section | What it does |
| --- | --- |
| **Dashboard** | Overview stat cards, groundwater-potential distribution (pie), estimated-depth comparison (bar) and the full sample-location table. |
| **Groundwater Map** | Interactive Leaflet + OpenStreetMap centred on Tharparkar. Color-coded markers (red / amber / green) by potential class. Click anywhere, pick a surveyed town, or enter **exact coordinates** (collapsible toolbar with manual lat/lng entry + "Use my GPS" geolocation button). |
| **Location Analysis** | For any selected point: groundwater presence, estimated depth (m), potential class, water quality, data confidence, nearest surveyed town, **a 5-step methodology panel** showing exactly how the answer was derived, and a **research-context panel** with cited hydrogeology facts. |
| **Research & Sources** | Real, publicly-available hydrogeological research about Tharparkar — 9 cited facts, WHO drinking-water reference limits, and a full bibliography of 9 sources (PCRWR, Elsevier journals, peer-reviewed hydrology). |
| **About AquaThar** | Project background, technology stack, sample-dataset coverage, and the full data disclaimer. |

### Three ways to query a location
1. **Map click** — click anywhere on the interactive Leaflet map.
2. **Town search** — type a town name (Mithi, Islamkot, Diplo, Nagarparkar, Chachro).
3. **Exact coordinates** — enter precise latitude/longitude manually (e.g. from a GPS device or maps app) or use the device's GPS via the Geolocation API. The component shows the decimal + DMS form and a Tharparkar bounds check.

### How nearest-match works
1. The user clicks the map, searches a town, or enters exact coordinates.
2. AquaThar uses the **haversine** formula to find the nearest of the five sample records.
3. If the query point is within ~15 km of a sample location it is labelled a **near match**; otherwise it is explicitly flagged as an **approximate regional estimate**.
4. The Location Analysis panel always shows whether the displayed values are based on the actual nearest survey point.
5. The **Methodology panel** traces this process step-by-step so the answer is transparent, not a black box.

### Research-based answers (not just illustrative)
The Research page grounds AquaThar in real published science:
- **PCRWR (2023)** — *Beneath the Sands: A Comprehensive Study of Groundwater in Tharparkar Region*
- **Kumar et al. (2022)** — physicochemical assessment (pH, EC, TDS, As, F) in *Groundwater for Sustainable Development*
- **Parveen (2011)** — fluoride 0.93–11.8 mg/L; 27/33 wells exceeded the WHO limit
- **Alam et al. (2024)** — Nagar Parkar fractured-granite aquifers
- **Nergis et al. (2017)** & **Singh et al. (2012)** — Thar coalfield multi-aquifer model (~9,000 km², seams at 130–250 m)
- **Ali et al. (2017)** — depth-dependent water chemistry in the Thar coalfield
- **High-resolution ERS study** — 576 resistivity probes to 300 m depth

Every fact on the Research page links to its source. These research facts are kept **separate** from AquaThar's illustrative per-town sample estimates — the UI always labels which is which.

---

## 🧰 Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** + **shadcn/ui** component library
- **Leaflet** + **react-leaflet** with **OpenStreetMap** tiles (no API key required)
- **Recharts** for charts
- **Zustand** for shared client state
- **Lucide** icons
- Fully **Vercel-ready** — no separate backend, no paid services, no filesystem runtime dependencies

---

## 🗺️ Sample Dataset

A small local JSON-style dataset (`src/data/groundwater-data.ts`) defines five illustrative sample locations:

| Town | Region | Coordinates (approx) | Est. depth (m) | Potential |
| --- | --- | --- | --- | --- |
| Mithi | Central Tharparkar | 24.74°N, 69.80°E | 60 – 90 | Medium |
| Islamkot | Eastern Tharparkar | 24.70°N, 70.18°E | 70 – 110 | Medium |
| Diplo | Western Tharparkar | 24.55°N, 69.85°E | 50 – 80 | High |
| Nagarparkar | South-Eastern Tharparkar | 24.36°N, 70.76°E | 90 – 130 | Low |
| Chachro | Northern Tharparkar | 25.10°N, 70.25°E | 80 – 120 | Low |

> All values above are illustrative estimates. Coordinates are approximate town centres.

---

## 🚀 Local development

Requirements: **Node.js 18+** (Node 20+ recommended) and **npm / pnpm / bun**.

```bash
# 1. Install dependencies
npm install        # or: pnpm install  /  bun install

# 2. Run the dev server
npm run dev        # or: pnpm dev  /  bun run dev

# 3. Open the app
#   http://localhost:3000
```

### Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server (port 3000). |
| `npm run build` | Production build. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint + Next.js rules. |

---

## ☁️ Deploy to Vercel

The project is fully compatible with Vercel — **no environment variables are required** (Leaflet + OpenStreetMap need no API key).

### Option A — One-click via GitHub
1. Push this repository to GitHub.
2. Go to <https://vercel.com/new> and **Import** the GitHub repository.
3. Vercel auto-detects **Next.js** as the framework.
4. Leave the build settings at defaults:
   - Build Command: `next build`
   - Output: handled automatically by Next.js
5. (Optional) add environment variables if you wire up paid map providers later.
6. Click **Deploy**.
7. Once deployed, open the live URL and test the map interaction.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Why it works on Vercel without changes
- **App Router** is used throughout.
- **Sample data lives in a local TypeScript file** (`src/data/groundwater-data.ts`) — no runtime filesystem reads.
- **No backend server**: everything is client-side + static data.
- **Leaflet is loaded client-side only** via `next/dynamic` with `ssr: false` (see `src/components/aquathar/MapView.tsx`).
- **No paid API dependencies** — OpenStreetMap tiles are free.
- **No authentication** required.

---

## 📁 Project structure

```
src/
├── app/
│   ├── globals.css          # Tailwind + AquaThar palette (blue / white / green)
│   ├── layout.tsx           # Root layout, fonts, metadata, Leaflet CSS import
│   └── page.tsx             # Single-page app shell + view switching
├── components/
│   └── aquathar/
│       ├── Sidebar.tsx
│       ├── StatCard.tsx
│       ├── LocationSearch.tsx
│       ├── ExactLocationInput.tsx     # Manual lat/lng + Geolocation API
│       ├── TharMap.tsx                # Leaflet map (client-only)
│       ├── PotentialDistributionChart.tsx
│       ├── DepthComparisonChart.tsx
│       ├── MethodologyPanel.tsx       # 5-step "how answer was produced" trace
│       ├── DashboardView.tsx
│       ├── MapView.tsx
│       ├── LocationAnalysisView.tsx
│       ├── ResearchView.tsx           # Cited research facts + bibliography
│       └── AboutView.tsx
├── data/
│   ├── groundwater-data.ts            # Sample dataset (5 Tharparkar towns)
│   └── research-data.ts              # Real cited research facts + sources
├── lib/
│   ├── groundwater.ts                 # haversine, nearest match, chart data
│   └── utils.ts                       # cn() helper
└── store/
    └── aqua-store.ts                  # Zustand shared state (view + selected)
```

---

## 🔒 Environment variables

None are required for the prototype. Optional future extensions:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_MAP_TILES_URL` | Override the default OpenStreetMap tile URL. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | If you swap to Mapbox tiles later. |

---

## 🧭 Roadmap ideas

- Replace the sample dataset with real survey data (clearly marked, sourced, dated).
- Add a water-quality lab results sub-panel per location.
- Add time-series depth chart when temporal data is available.
- Add a "report a well" community-sourcing form.
- Add offline support for field workers in low-connectivity areas.

---

## 🤝 Credits

- Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- Built with Next.js, Tailwind CSS, shadcn/ui, Leaflet, Recharts and Zustand.

## 📜 License

MIT — for prototype and educational use. The sample groundwater values are illustrative and carry no warranty of fitness for any operational use.
