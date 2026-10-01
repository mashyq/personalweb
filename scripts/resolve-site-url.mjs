/**
 * Resolves the absolute production origin used for canonical URLs, Open Graph
 * tags, JSON-LD, robots.txt and sitemap.xml.
 *
 * Resolution order (first match wins):
 *   1. VITE_SITE_URL            — explicit override, set in .env locally or in
 *                                 the Vercel project's environment variables.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected automatically by Vercel on
 *                                 every production build, e.g. "my-site-abc123.vercel.app".
 *                                 This is why the domain never has to be hardcoded.
 *   3. VERCEL_URL               — fallback for preview/branch deployments.
 *   4. http://localhost:5173    — local-only sentinel so `npm run build` still
 *                                 works on a developer machine.
 *
 * A build running on Vercel without a resolvable host is a hard error: shipping
 * a guessed or wrong canonical is far worse for indexing than a failed deploy.
 */

/** Strips trailing slashes and enforces an explicit protocol. */
function normalize(raw) {
  if (raw === undefined || raw === null) return "";
  const trimmed = String(raw).trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Hostnames that must never reach a production canonical or sitemap. */
const PLACEHOLDER_HOSTS = new Set([
  "your-domain.com",
  "your-project.vercel.app",
  "example.com",
  "example.org",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function resolveSiteUrl(env = process.env) {
  const isVercelBuild = Boolean(env.VERCEL || env.VERCEL_ENV || env.VERCEL_PROJECT_ID);

  const candidates = [
    { source: "VITE_SITE_URL", raw: env.VITE_SITE_URL },
    {
      source: "VERCEL_PROJECT_PRODUCTION_URL",
      raw: env.VERCEL_PROJECT_PRODUCTION_URL,
    },
    { source: "VERCEL_URL", raw: env.VERCEL_URL },
  ];

  for (const { source, raw } of candidates) {
    const url = normalize(raw);
    if (!url) continue;

    const host = hostOf(url);
    if (!host) {
      throw new Error(
        `${source} is set to an invalid value: "${raw}". Expected a hostname such as "my-site-abc123.vercel.app".`,
      );
    }
    if (PLACEHOLDER_HOSTS.has(host)) {
      throw new Error(
        `${source} is set to the placeholder host "${host}". Replace it with your real Vercel domain.`,
      );
    }
    if (url.startsWith("http://") && host !== "localhost") {
      throw new Error(`${source} must use HTTPS, got "${url}".`);
    }

    return {
      url,
      source,
      host,
      isProduction: url.startsWith("https://"),
      isLocal: false,
    };
  }

  if (isVercelBuild) {
    throw new Error(
      "Running on Vercel but no site URL could be resolved. Set VITE_SITE_URL in the " +
        "project environment variables to your production domain.",
    );
  }

  return {
    url: "http://localhost:5173",
    source: "local-sentinel",
    host: "localhost",
    isProduction: false,
    isLocal: true,
  };
}
