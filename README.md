# FrankTech — ICT Solutions Portfolio

Personal portfolio and service site for **Francis Macharia (FrankTech)** — an
independent ICT professional providing technical support, networking, CCTV
installation, PC repair and IT consultation in Nairobi, Kenya.

Built with **React 19**, **Vite 7** and **Tailwind CSS v4**, deployed to
**Vercel**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script            | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                                     |
| `npm run build`   | Production build → prerender → SEO audit (fails on SEO errors) |
| `npm run preview` | Serve the production build locally                             |
| `npm run lint`    | ESLint (includes React Compiler rules)                         |
| `npm run audit:seo` | Re-run the crawl-style SEO audit against `dist/`             |

> On Windows PowerShell, `npm` may be blocked by script policy — use `npm.cmd`.

---

## Project structure

```
├── index.html               HTML shell; <!--@seo--> block regenerated at build
├── vite.config.js           Vite + Tailwind plugin, vendor chunk split
├── vercel.json              Vercel build config, cache + security headers
├── prerender/entry.jsx      Build-time prerenderer (writes dist/*.html, robots, sitemap)
├── scripts/audit-seo.mjs    Crawl-style SEO audit over dist/
├── public/                  favicon.svg, og-image.svg, site.webmanifest
└── src/
    ├── App.jsx              Section composition
    ├── index.css            Tailwind v4 theme tokens, components, keyframes
    ├── data/site.js         All site copy and content (edit here, not in JSX)
    ├── lib/
    │   ├── seo.js           Single source of truth for metadata + JSON-LD
    │   ├── cn.js            Class name helper
    │   └── iconMap.js       Data icon-name → component lookup
    ├── hooks/               useTheme, useInView, useCountUp, useTypewriter,
    │                        useScrollSpy, useMediaQuery, useScrollProgress
    ├── components/          Navbar, Hero, About/Process, Services, Work,
    │                        Testimonials, Pricing, FAQ, Contact, Footer,
    │                        BackToTop, Icons
    │   └── ui/              Section, Reveal, TiltCard, Backdrop, Marquee, ThemeToggle
    └── pages/NotFound.jsx   Branded 404
```

### Editing content

All copy, services, projects, testimonials, pricing and FAQs live in
`src/data/site.js`. Site-wide metadata (title, description, canonical, social
tags, structured data) lives in `src/lib/seo.js`. You should not need to touch
any `.jsx` file for routine content changes.

---

## Environment variables

Copy `.env.example` to `.env` and fill in. **Set `VITE_SITE_URL` before
deploying** — it drives canonical URLs, Open Graph, JSON-LD, `robots.txt` and
`sitemap.xml`.

| Variable                            | Required | Purpose                                            |
| ----------------------------------- | -------- | -------------------------------------------------- |
| `VITE_SITE_URL`                     | **Yes**  | Production origin, no trailing slash              |
| `VITE_OG_IMAGE`                     | No       | Path to a 1200×630 PNG if you replace the SVG card |
| `VITE_GOOGLE_SITE_VERIFICATION`     | No       | Search Console HTML-tag token                      |
| `VITE_BING_SITE_VERIFICATION`       | No       | Bing Webmaster Tools token (`msvalidate.01`)       |
| `VITE_CONTACT_ENDPOINT`             | No       | Form POST endpoint for the contact form            |

No secrets belong in these variables — they are all inlined into the public
client bundle.

### Contact form

With no `VITE_CONTACT_ENDPOINT`, the form validates in the browser and then
opens the visitor's email client with the message pre-filled (zero backend, zero
cost). Set the variable to any endpoint accepting a JSON `POST` — Formspree,
Web3Forms or Basin all work — and the form will submit directly instead.

---

## SEO implementation

The site is a single-page React app, but **all content is prerendered into the
initial HTML at build time** by `prerender/entry.jsx`. Crawlers and no-JS
visitors therefore receive the full page, every internal link, and complete
metadata without executing JavaScript. React then re-renders the same tree on the
client via `createRoot`.

What the build generates:

| Artifact             | Notes                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| `dist/index.html`    | Full app markup + complete `<head>`                                   |
| `dist/404.html`      | Branded error page, `noindex`                                          |
| `dist/robots.txt`    | Allows all content, points at the sitemap                             |
| `dist/sitemap.xml`   | Absolute HTTPS URLs, `lastmod` from build date                        |

Head tags emitted: `<title>`, description, keywords, `robots`, `author`,
canonical, full Open Graph (including `og:locale`, `og:image:width/height`),
Twitter/X card, and a JSON-LD `@graph` containing:

- `WebSite`, `WebPage`, `ImageObject`
- `ProfessionalService` (correct schema.org subtype for an on-site ICT service)
  with address, geo area served, telephone, email, founder and an
  `OfferCatalog` of the seven real services
- `FAQPage` built from the FAQs that are actually visible on the page

### Indexing controls

- `dist/index.html` — `index, follow`
- `dist/404.html` — `noindex, nofollow`, plus an `X-Robots-Tag` header rule in
  `vercel.json`
- No catch-all rewrite in `vercel.json`, so unknown URLs return a **real HTTP
  404** instead of a soft-200. Safe because the site navigates with hash anchors
  and needs no client-side router.

### Validation

`scripts/audit-seo.mjs` runs at the end of every build and **fails the build**
on: missing/over-long title or description, non-HTTPS canonical, `noindex` on the
index page, missing OG/Twitter tags, zero or multiple `<h1>`, heading level
jumps, duplicate `id` attributes, internal links pointing at missing ids,
malformed JSON-LD, `<img>` without `alt`, invalid `robots.txt`, insecure or
duplicated sitemap URLs, a non-`noindex` 404, and unreplaced build markers.

---

## Accessibility

- Semantic landmarks (`header`/`nav`/`main`/`section`/`article`/`footer`), one
  `<h1>`, no skipped heading levels
- Skip-to-content link, visible focus rings, full keyboard support
- Disclosure panels (services, FAQ) and the mobile drawer use `aria-expanded` /
  `aria-controls`; the collapsed drawer is `inert` so it stays out of the tab
  order
- Form fields have real `<label>`s, linked error messages via `aria-describedby`,
  `aria-invalid`, and a polite `role="status"` summary
- The decorative typewriter is intentionally **not** `aria-live`, which would
  otherwise announce every keystroke
- All animation is disabled under `prefers-reduced-motion: reduce`
- Scroll-reveal hides content only when JavaScript is running (`.js .reveal`),
  so nothing is invisible without JS

---

## Performance

- React runtime split into a separate long-cached vendor chunk
- Fonts loaded asynchronously with `preconnect` and `display=swap`, so the
  stylesheet never blocks first paint
- Zero raster images — icons are inline SVG (no extra requests, no CLS)
- `IntersectionObserver`-driven reveals and counters; scroll handlers are
  rAF-throttled and passive
- Immutable one-year caching for hashed assets, HSTS, `nosniff` and a
  restrictive `Permissions-Policy`

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Or import the repository at [vercel.com/new](https://vercel.com/new) — the
framework preset is detected and `vercel.json` supplies the build command,
output directory and headers.

After the first deploy, set `VITE_SITE_URL` to the assigned domain (in
**Project → Settings → Environment Variables**) and redeploy so canonical URLs,
`sitemap.xml` and `robots.txt` point at the real origin.

### GitHub Pages

The build output in `dist/` is plain static files, so Pages works too — but
`vite.config.js` `base` and `VITE_SITE_URL` must both match the Pages path
(`/repo-name/`), and the SPA-rewrite behaviour differs from Vercel.

---

## Contact

- **Francis Macharia (FrankTech)** — ICT Professional, Nairobi, Kenya
- Phone: [0742998580](tel:+254742998580)
- Email: [francwanjiku2@gmail.com](mailto:francwanjiku2@gmail.com)