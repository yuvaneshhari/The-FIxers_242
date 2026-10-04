# FloodFirst

FloodFirst is a focused hackathon demo for ward-level municipal disaster-control officers. It answers one decision: **which local hotspot needs the first disaster-response action in the next 1–3 hours?**

Pilot area: **Gummidipundi Ward Cluster, Tamil Nadu, India**.

> **DEMO MODE — NOT AN OFFICIAL WARNING.** All scores and alerts are embedded decision-support estimates for a fictional pilot area. No alert is sent.

## Run locally

Requirements: Node.js 22+ and pnpm 11+.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

For a production build:

```bash
pnpm run build
pnpm run preview
```

## Demo flow

1. Select **Extreme rain** in the scenario selector.
2. Confirm the map shifts to severe conditions and the priority queue recalculates.
3. Click **#1 Immediate action** (or any hotspot card) to focus the map and open its action recommendation.
4. Review the transparent scoring logic and exactly three recommended actions.
5. Click **Generate Resident Alert** to reveal simulated English + Tamil copy.
6. Click **Mark Alert Prepared** to show the local-only success state. It does not send anything.

## Included features

- Leaflet map with 12 embedded zone polygons and six critical-asset markers.
- Four scenario states: Normal, Moderate, Heavy, and Extreme rain.
- Explainable risk inputs: rainfall severity, low elevation, drain proximity, and historical waterlogging.
- Priority inputs: flood risk, population exposure, and critical-asset importance.
- Responsive dashboard plus Methodology and About / Disclaimer pages.
- Scenario selection and prepared-alert state persisted in browser local storage.
- No paid API keys or live data required. The basemap uses a public Esri World Street Map tile service.

## Project structure

- `src/data.ts` — embedded pilot dataset and deterministic scoring model.
- `src/components/MapView.tsx` — Leaflet map, zones, popups, and asset markers.
- `src/components/HotspotCard.tsx` — ranked hotspot cards.
- `src/components/ActionCard.tsx` — response actions and simulated alert workflow.
- `src/App.tsx` — dashboard shell, navigation, and supporting pages.
- `src/styles.css` — responsive emergency-operations visual system.
# The-FIxers_242
