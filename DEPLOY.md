# Deployment Guide

Instructions for deploying this site and reusing the template for other projects.

## Current Deployment

| Item | Value |
|------|-------|
| **Live URL** | [jthorvaldur.github.io/bulldogs](https://jthorvaldur.github.io/bulldogs/) |
| **Hosting** | GitHub Pages (free) |
| **CI/CD** | GitHub Actions (`.github/workflows/deploy.yml`) |
| **Trigger** | Automatic on every push to `main` |
| **Build** | `bash build.sh` copies `site/` + `viz/` + `data/` + PDF into `dist/` |
| **Cost** | $0 (GitHub Pages free tier: 100GB bandwidth/month) |

## How the Build Works

```bash
bash build.sh
```

The build script does the following:
1. Cleans `dist/` directory
2. Copies `site/*.html` and `site/css/` into `dist/`
3. Copies `viz/*.html` into `dist/viz/`
4. Copies `data/*.json` into `dist/data/`
5. Copies `bulldog_dermatitis_handbook.pdf` into `dist/`
6. Performs template replacements in `index.html` (section count, build date)

No Node.js, no npm, no bundler. Just file copies.

## GitHub Pages Setup (already configured)

The GitHub Actions workflow at `.github/workflows/deploy.yml` handles everything:

```yaml
# On push to main:
# 1. Checkout repo
# 2. Run bash build.sh
# 3. Upload dist/ as Pages artifact
# 4. Deploy to GitHub Pages
```

Pages was enabled via:
```bash
gh api repos/jthorvaldur/bulldogs/pages -X POST --input - <<< '{"build_type":"workflow"}'
```

To verify deployment status:
```bash
gh run list --repo jthorvaldur/bulldogs --limit 3
```

## Adding a Custom Domain

### Step 1: Purchase a domain

Recommended registrars (at-cost pricing):
- **Cloudflare Registrar** -- ~$10/yr for `.com`, no markup
- **Namecheap** -- ~$8-12/yr for `.com`

Suggested domains for this project:
- `bulldogderm.com` -- matches the `BulldogDerm` nav branding already in the site
- `yeastypaws.com` -- memorable, community-friendly
- `bulldogskin.com` -- clear, direct

### Step 2: Configure DNS

At your registrar, set up one of these:

**Option A: CNAME (recommended for apex + www)**
```
Type   Name   Value
CNAME  www    jthorvaldur.github.io
```

**Option B: A records (for apex domain)**
```
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

### Step 3: Tell GitHub about the domain

```bash
# Via CLI
gh api repos/jthorvaldur/bulldogs/pages -X PUT --input - <<< '{"cname":"bulldogderm.com"}'

# Or: repo Settings → Pages → Custom domain → enter domain → Save
```

### Step 4: Add CNAME file to build

Add your domain to a CNAME file so it persists across deploys:

```bash
echo "bulldogderm.com" > dist/CNAME
```

Or add it to `build.sh` so it's included automatically.

### Step 5: Enforce HTTPS

GitHub auto-provisions an SSL certificate. Enable in Settings → Pages → "Enforce HTTPS".

## Alternative: Cloudflare Pages

If you prefer Cloudflare Pages (unlimited bandwidth, edge CDN, Worker API routes):

```bash
# One-time deploy
npx wrangler pages deploy dist --project-name=bulldog-derm

# Preview URL: bulldog-derm.pages.dev
# Custom domain: add via Cloudflare dashboard
```

Cloudflare Pages advantages:
- Unlimited bandwidth (vs 100GB/mo on GitHub Pages)
- Edge CDN (faster globally)
- Cloudflare Workers for API routes (free tier: 100k requests/day)
- Useful if you later add the community submission system with Claude API validation

## Cost Comparison

| Component | GitHub Pages | Cloudflare Pages |
|-----------|-------------|-----------------|
| Hosting | Free | Free |
| Bandwidth | 100GB/month | Unlimited |
| SSL | Auto (Let's Encrypt) | Auto (Cloudflare) |
| CDN | GitHub CDN | Cloudflare edge (faster) |
| Custom domain | ~$10/yr (registrar) | ~$10/yr (registrar) |
| API/Workers | Not available | Free tier: 100k req/day |
| Builds | Unlimited | 500/month (free tier) |
| **Total** | **~$10/yr** | **~$10/yr** |

## Reusing This Template for a New Site

This project is designed as a reusable template. The same architecture powers [morpheme-page](https://github.com/jthorvaldur/morpheme-page) and [words_quantum_legal](https://github.com/jthorvaldur/words_quantum_legal).

### Step-by-step

1. **Create new repo** and copy the structure:
   ```
   new-site/
   ├── site/
   │   ├── css/global.css    # Re-theme here
   │   ├── index.html        # New landing page
   │   └── ...               # Your pages
   ├── viz/                  # Your visualizations
   ├── data/                 # Your data files
   ├── build.sh              # Copy as-is, adjust paths if needed
   └── .github/workflows/deploy.yml  # Copy as-is
   ```

2. **Re-theme the design system** by editing CSS variables in `site/css/global.css`:
   ```css
   :root {
     --accent: #d4a060;       /* Change this to your brand color */
     --bg: #0a0a0a;           /* Dark background (keep for consistency) */
     --clinical: #5b9bd5;     /* Category color 1 */
     --health: #5a9e6f;       /* Category color 2 */
     --warning: #cc8844;      /* Category color 3 */
     --danger: #c04040;       /* Category color 4 */
   }
   ```

3. **Replace content** -- edit HTML files, add your own visualizations, update `data/` JSON

4. **Push and enable Pages:**
   ```bash
   git push origin main
   gh api repos/OWNER/REPO/pages -X POST --input - <<< '{"build_type":"workflow"}'
   ```

5. **Done.** Site auto-deploys on every push.

### What to keep vs. replace

| Keep as-is | Replace |
|-----------|---------|
| `build.sh` | HTML content in `site/` |
| `.github/workflows/deploy.yml` | Visualization HTML in `viz/` |
| CSS structure in `global.css` | CSS variable values (colors, fonts) |
| `.gitignore` | `data/*.json` |
| Overall directory layout | `CLAUDE.md`, `README.md` |
