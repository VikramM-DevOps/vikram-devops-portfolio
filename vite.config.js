import { defineConfig } from 'vite';

// For GitHub Pages project pages the site is served from a sub-path like
// https://<user>.github.io/<repo>/ so assets must use a matching base.
// Override with VITE_BASE=/ for a user/org page or custom domain.
const base = process.env.VITE_BASE || '/vikram-devops-portfolio/';

export default defineConfig({
  base,
  build: {
    target: 'es2018',
    cssCodeSplit: true,
  },
});
