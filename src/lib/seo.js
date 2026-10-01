import { faqs, profile, services } from "../data/site";

/**
 * Single source of truth for every piece of metadata the site emits.
 *
 * The build-time prerenderer reads this to generate <head> tags, JSON-LD,
 * robots.txt and sitemap.xml, so nothing can drift between environments.
 *
 * Set VITE_SITE_URL to the real production origin (no trailing slash).
 * Set VITE_GOOGLE_SITE_VERIFICATION / VITE_BING_SITE_VERIFICATION to the
 * tokens from Search Console / Webmaster Tools — never hardcoded here.
 */
const configuredUrl = import.meta.env.VITE_SITE_URL;

/** Absolute origin with any trailing slash and protocol normalised away. */
export const SITE_URL = (
  configuredUrl || "https://mashyq.github.io-portifolio"
).replace(/\/+$/, "");

export const SITE = {
  name: profile.brand,
  legalName: `${profile.brand} — ${profile.role}`,
  title: "FrankTech — ICT Support, Networking & Security Solutions",
  titleTemplate: "%s — FrankTech",
  description:
    "FrankTech provides ICT support, networking, CCTV installation and PC repair in Nairobi. Clear, dependable tech help for homes and small businesses.",
  keywords: [
    "ICT support Nairobi",
    "computer repair Kenya",
    "networking services",
    "CCTV installation Nairobi",
    "IT consultation",
    "computer maintenance",
    "FrankTech",
  ],
  locale: "en_KE",
  lang: "en",
  ogType: "website",
  twitterCard: "summary_large_image",
  themeColor: { light: "#ffffff", dark: "#0d0b14" },
  // Absolute paths; resolved to full URLs below.
  paths: {
    ogImage: "/og-image.svg",
    logo: "/favicon.svg",
  },
};

export const absolute = (path) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Social preview image. SVG by default; point VITE_OG_IMAGE at a 1200x630 PNG
 * if you need broader platform support (X/Twitter does not reliably render SVG).
 */
export const OG_IMAGE = import.meta.env.VITE_OG_IMAGE
  ? absolute(import.meta.env.VITE_OG_IMAGE)
  : absolute(SITE.paths.ogImage);

export const LOGO = absolute(SITE.paths.logo);

/** Text that must appear in the rendered HTML for a description to be honest. */
export const SERVICE_CATALOGUE = services.map(({ id, title, summary }) => ({
  id,
  title,
  summary,
}));

/**
 * JSON-LD graph describing only what is genuinely visible on the page.
 * Includes ProfessionalService (a LocalBusiness subtype appropriate for an
 * on-site ICT service), the WebSite/WebPage pair, and the visible FAQ.
 */
export function buildJsonLd({ canonical = SITE_URL } = {}) {
  const businessId = `${canonical}/#business`;
  const websiteId = `${canonical}/#website`;
  const webpageId = `${canonical}/#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonical,
        name: SITE.name,
        description: SITE.description,
        inLanguage: SITE.lang,
        publisher: { "@id": businessId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonical,
        name: SITE.title,
        description: SITE.description,
        inLanguage: SITE.lang,
        isPartOf: { "@id": websiteId },
        about: { "@id": businessId },
        primaryImageOfPage: { "@id": `${canonical}/#primaryimage` },
      },
      {
        "@type": "ImageObject",
        "@id": `${canonical}/#primaryimage`,
        url: OG_IMAGE,
        contentUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        caption: `${SITE.name} — ICT support, networking and security solutions`,
      },
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: SITE.name,
        legalName: SITE.legalName,
        description: SITE.description,
        url: canonical,
        logo: LOGO,
        image: OG_IMAGE,
        telephone: profile.phoneE164,
        email: profile.email,
        priceRange: "KES 2500 - KES 8500 per visit",
        currenciesAccepted: "KES",
        address: {
          "@type": "PostalAddress",
          streetAddress: profile.location,
          addressLocality: profile.city,
          addressRegion: profile.region,
          addressCountry: profile.country,
        },
        areaServed: [
          { "@type": "City", name: profile.city },
          { "@type": "Country", name: profile.countryName },
        ],
        availableLanguage: [SITE.lang],
        founder: {
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.role,
        },
        knowsAbout: [
          "Technical support",
          "Computer networking",
          "CCTV installation",
          "Computer repair",
          "IT consultation",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "ICT services",
          itemListElement: services.map((service, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.summary,
              serviceType: service.title,
              provider: { "@id": businessId },
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

/** Escapes a string for safe interpolation into an HTML attribute. */
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

const meta = (attr, key, content) =>
  `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;

/**
 * Renders the complete <head> block for a page.
 *
 * @param {object}  options
 * @param {string}  options.canonical  Absolute URL this page should index as.
 * @param {string}  options.title
 * @param {string}  options.description
 * @param {boolean} options.noindex   Emits robots noindex for utility pages.
 * @param {string}  options.ogType
 * @param {string}  options.image
 */
export function renderHead({
  canonical = SITE_URL,
  title = SITE.title,
  description = SITE.description,
  ogType = SITE.ogType,
  image = OG_IMAGE,
  noindex = false,
} = {}) {
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    meta("name", "description", description),
    meta("name", "robots", robots),
    meta("name", "author", profile.name),
    meta("name", "keywords", SITE.keywords.join(", ")),
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,

    // Open Graph
    meta("property", "og:type", ogType),
    meta("property", "og:site_name", SITE.name),
    meta("property", "og:locale", SITE.locale),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", canonical),
    meta("property", "og:image", image),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:alt", `${SITE.name} — ICT support and security solutions`),

    // Twitter / X
    meta("name", "twitter:card", SITE.twitterCard),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    meta("name", "twitter:image", image),
    meta("name", "twitter:image:alt", `${SITE.name} — ICT support and security solutions`),

    // Icons + sitemap discovery
    `<link rel="sitemap" type="application/xml" href="${absolute("/sitemap.xml")}" />`,

    // Search engine verification (only rendered when configured)
    import.meta.env.VITE_GOOGLE_SITE_VERIFICATION &&
      meta(
        "name",
        "google-site-verification",
        import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
      ),
    import.meta.env.VITE_BING_SITE_VERIFICATION &&
      meta(
        "name",
        "msvalidate.01",
        import.meta.env.VITE_BING_SITE_VERIFICATION,
      ),

    // Structured data
    `<script type="application/ld+json">${JSON.stringify(buildJsonLd({ canonical }))}</script>`,
  ];

  return tags.filter(Boolean).join("\n    ");
}

/** robots.txt content for the configured origin. Kept plain ASCII. */
export function renderRobots() {
  return [
    "# FrankTech - robots.txt",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Assets must stay crawlable for rendering and link previews.",
    "Allow: /assets/",
    "",
    "Sitemap: " + absolute("/sitemap.xml"),
    "",
  ].join("\n");
}

/** XML sitemap for the configured origin. */
export function renderSitemap({ lastmod }) {
  const url = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url>",
    `    <loc>${escapeHtml(SITE_URL)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "    <changefreq>monthly</changefreq>",
    "    <priority>1.0</priority>",
    "  </url>",
    "</urlset>",
    "",
  ].join("\n");

  return url;
}