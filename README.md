# Vikram Shamrao Mulik — DevOps Portfolio

Resume-based responsive portfolio for Vikram Shamrao Mulik, Principal Engineer (DevOps & Cloud).

Built with **Vite**, **vanilla HTML/CSS/JavaScript** — no framework weight, professional build tooling.

## Features

- Modern dark design system (CSS custom properties, `color-mix`, fluid `clamp()` typography)
- Single **Dark** theme with a neon cyber palette (violet `#d51cff` / blue `#3c7dff` / cyan `#37e8ff` / pink `#ff2fd3`)
- Hero terminal **typewriter effect** (DevOps CLI commands)
- Count-up stats (scroll-triggered)
- Skills shown as clean capability cards with focus tags (no fake percentage meters)
- Scrollspy active nav, reveal-on-scroll, back-to-top button
- GPU-friendly particle/network background (pauses when tab hidden, disabled on reduced-motion)
- Full a11y: skip link, ARIA landmarks/state, focus styles, `prefers-reduced-motion` support
- SEO: meta/OG/Twitter, JSON-LD Person schema, `robots.txt`, `sitemap.xml`, favicon
- Sections: hero, stats, skills, about, projects, delivery pipeline, experience, certifications, education, contact
- Downloadable PDF resume at `public/assets/Vikram-Mulik-Resume.pdf`

## Getting started

```bash
# install deps
npm install

# dev server with HMR
npm run dev

# production build -> dist/
npm run build

# preview production build
npm run preview

# lint / format
npm run lint
npm run format
```

Run the dev server and open the printed localhost URL.

## Project structure

```
public/            # static assets copied as-is into dist/ (favicon, robots, sitemap, resume)
assets/style.css   # design system (CSS)
assets/script.js   # interactions
index.html         # markup + SEO/meta/JSON-LD
vite.config.js
```

Any file in `public/` is served at the root path (e.g. `public/assets/Vikram-Mulik-Resume.pdf` → `/assets/Vikram-Mulik-Resume.pdf`).

## Before publishing

1. Replace the placeholder LinkedIn and GitHub URLs in `index.html` with your real profiles.
2. Review the content and, if you use a custom domain, update the canonical link and `sitemap.xml`.

## Deploy to GitHub Pages

This repo is set up to build from the **`main` branch** and publish to GitHub Pages automatically via GitHub Actions. The Vite config uses `/vikram-devops-portfolio/` as the base path (project-page style), matching `https://vikramm-devops.github.io/vikram-devops-portfolio/`.

### One-time setup (GitHub repo)

1. Create the repo (e.g. `vikram-devops-portfolio`) under your `vikramm-devops` account.
2. In **Settings → Pages**, set **Source = GitHub Actions** (the workflow `.github/workflows/deploy.yml` handles the build and publish — no branch config needed here).

### Commit and push

```bash
git add .
git commit -m "Initial portfolio with GitHub Pages deployment"
git remote add origin https://github.com/vikramm-devops/vikram-devops-portfolio.git
git push -u origin main
```

Pushing to `main` (or clicking **Actions → Deploy to GitHub Pages → Run workflow**) triggers the build + deploy. The site will go live at:

`https://vikramm-devops.github.io/vikram-devops-portfolio/`

### How it works

- `.github/workflows/deploy.yml` — runs `npm ci` & `npm run build` on `main`, uploads `dist/` as a Pages artifact, then deploys it.
- `vite.config.js` — sets `base = '/vikram-devops-portfolio/'` so asset URLs work under the sub-path. Override with `VITE_BASE=/` for a user/org page or a custom domain.
- `public/.nojekyll` — copied into `dist/` so GitHub Pages serves it as plain static files (no Jekyll processing).

> For a root domain (user/org page or custom domain), add a `CNAME` and rebuild with `VITE_BASE=/`.
