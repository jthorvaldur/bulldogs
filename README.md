# The Bulldog Dermatitis Handbook

Evidence-based diagnostic workup, treatment protocols, and community-validated insights for Malassezia dermatitis, alopecia, and skin health in bulldogs.

**Live site:** [jthorvaldur.github.io/bulldogs](https://jthorvaldur.github.io/bulldogs/)

---

## What This Is

A comprehensive, evidence-checked knowledge base for bulldog skin health. Every piece of community-contributed information is validated against the peer-reviewed veterinary dermatology literature. The site bridges the gap between clinical science and real-world bulldog ownership experience.

The core principle: **the yeast is the symptom, not the disease.**

## Site Structure

### Pages

| Page | Path | Description |
|------|------|-------------|
| **Landing page** | `/` | Hero with animated Malassezia cells, stats bar, visualization grid, 7-step framework summary, evidence methodology badges |
| **Handbook** | `/handbook.html` | All 20 chapters rendered as a single long-form page with sidebar navigation. Covers diagnostic workup, treatment protocols, environmental strategy, and long-term management |
| **About** | `/about.html` | Methodology, core principles, validation system explanation, and full reference list (18 peer-reviewed sources + community references) |

### Interactive Visualizations

Each visualization is a self-contained HTML file with inline CSS and JavaScript (no external dependencies beyond Google Fonts). All use Canvas2D for rendering.

| Visualization | Path | Description |
|---------------|------|-------------|
| **Condition Network** | `/viz/condition_network.html` | Force-directed graph of 10 bulldog skin conditions. Nodes are color-coded by category (infectious, allergic, endocrine, parasitic, structural). Hover highlights connections, click opens detail panel with signs, body sites, and key facts. Animated particles flow along relationship edges. |
| **Body Map** | `/viz/body_map.html` | Stylized bulldog silhouette with 8 clickable body regions (face, ears, paws, belly, tail, trunk, groin, rear paws). Each region pulses with a glow. Click opens a side panel showing conditions affecting that area, clinical descriptions, and specific care protocols. |
| **Treatment Protocol Flow** | `/viz/treatment_flow.html` | 13-node animated flow diagram showing the complete treatment pipeline from initial cytology through long-term maintenance. Nodes are color-coded by phase (diagnosis, topical treatment, systemic, maintenance, escalation). Hover for detailed tooltips with evidence levels. Animated particles flow along edges showing the treatment pathway. |
| **Diagnostic Flowchart** | `/viz/diagnostic_tree.html` | Interactive click-through decision tree with 15 nodes spanning the 7-step diagnostic sequence. Click clinical decisions to navigate branches (e.g., "Malassezia confirmed" vs "No organisms found"). Shows evidence callouts, data tables, and branch outcomes. Includes a progress bar and restart button. |
| **Cytopoint Efficacy** | `/viz/cytopoint_efficacy.html` | Three animated charts visualizing clinical trial data from Gober et al. 2022 (PMC9343842, n=62 dogs): (1) treatment success rate timeline (47% at 24h, 94% Day 7, 100% Day 56), (2) PVAS pruritus score decline with normal threshold line, (3) comparative bar chart of all itch management approaches. |

### Data

| File | Description |
|------|-------------|
| `data/conditions.json` | Structured data for 10 conditions, 8 body regions, treatment protocols (topical, community-validated, systemic, itch management), 7-step diagnostic sequence, and Cytopoint clinical trial data |
| `bulldog_dermatitis_handbook.pdf` | The complete 17-page handbook as a downloadable PDF (20 chapters, 5 parts) |

## Tech Stack

- **Frontend:** Pure static HTML/CSS/JS -- no frameworks, no bundler, no Node.js runtime
- **Visualizations:** Canvas2D (vanilla JavaScript), one external: Google Fonts (JetBrains Mono)
- **Design system:** CSS custom properties in `site/css/global.css` -- swap `--accent` color to re-theme
- **Build:** `build.sh` -- bash script that copies `site/` + `viz/` + `data/` into `dist/`
- **Deploy:** GitHub Actions workflow auto-deploys `dist/` to GitHub Pages on every push to `main`

## Project Layout

```
bulldogs/
├── site/                          # Source pages
│   ├── css/global.css             # Shared design system (CSS variables, components)
│   ├── index.html                 # Landing page with Canvas2D Malassezia animation
│   ├── handbook.html              # Full 20-chapter handbook
│   └── about.html                 # Methodology, principles, references
├── viz/                           # Self-contained visualizations
│   ├── condition_network.html     # Force-directed condition relationship map
│   ├── body_map.html              # Interactive bulldog body map
│   ├── treatment_flow.html        # Animated treatment protocol flow
│   ├── diagnostic_tree.html       # Click-through diagnostic decision tree
│   └── cytopoint_efficacy.html    # Cytopoint clinical trial data charts
├── data/
│   └── conditions.json            # Structured condition/treatment/diagnostic data
├── build.sh                       # Build script (site/ + viz/ + data/ → dist/)
├── .github/workflows/deploy.yml   # GitHub Actions auto-deploy to Pages
├── bulldog_dermatitis_handbook.pdf # Downloadable handbook PDF
├── CLAUDE.md                      # AI assistant project instructions
├── DEPLOY.md                      # Deployment guide and template reuse instructions
└── dist/                          # Built output (gitignored, created by build.sh)
```

## Local Development

```bash
# Build
bash build.sh

# Preview
npx serve dist
# → http://localhost:3000
```

No install step. No dependencies. The build script just copies files.

## Deployment

See [DEPLOY.md](DEPLOY.md) for full deployment instructions, custom domain setup, and how to reuse this as a template for other sites.

## Content Sources

- **Handbook PDF:** 17-page comprehensive reference (20 chapters across 5 parts)
- **[1]-[17]:** Peer-reviewed veterinary dermatology literature (PMC/NIH, ACVD, veterinary journals)
- **[18]:** Gober M et al. "Use of Cytopoint in the Allergic Dog." *Front Vet Sci.* 2022;9:909776. [PMC9343842](https://pmc.ncbi.nlm.nih.gov/articles/PMC9343842/)
- **[C1]:** r/Bulldogs community thread (~64 upvotes, 53 comments) -- cross-referenced against veterinary evidence

## Template Reuse

This site follows the same architecture as [morpheme-page](https://github.com/jthorvaldur/morpheme-page) and [words_quantum_legal](https://github.com/jthorvaldur/words_quantum_legal). To create a new knowledge-base site:

1. Copy the `site/`, `viz/`, `data/`, `build.sh` structure
2. Edit CSS variables in `site/css/global.css` (change `--accent` color, site name)
3. Replace HTML content and visualization data
4. Copy `.github/workflows/deploy.yml` as-is
5. Push to GitHub, enable Pages -- done

## Disclaimer

This site is for educational and informational purposes only. It does not constitute veterinary advice. All diagnostic and treatment decisions should be made in consultation with a licensed veterinarian. Community-contributed content has been evaluated against veterinary literature but has not been reviewed by a veterinary licensing board.
