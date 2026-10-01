import { profile, services } from "../data/site";
import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconSparkle,
} from "../components/Icons";

/**
 * Branded 404. Deliberately self-contained — no section navigation, because
 * those anchors don't exist on this page and would be broken internal links.
 * Rendered statically with a noindex directive by scripts/prerender.mjs.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="shell flex h-18 items-center justify-between gap-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-sm font-bold text-on-brand">
              FT
            </span>
            <span className="font-display text-lg font-bold">
              Frank<span className="text-brand">Tech</span>
            </span>
          </a>
          <a href="/" className="btn-ghost px-5 py-2.5 text-sm">
            Back to home
          </a>
        </div>
      </header>

      <main id="main" className="flex flex-1 items-center py-20">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-sm font-medium tracking-[0.22em] text-brand uppercase">
              Error 404
            </p>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">
              This page has gone <span className="text-brand italic">offline</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-muted">
              The link you followed doesn&rsquo;t exist or has moved. Nothing
              is broken on your side — head back to the homepage, or get in
              touch and I&rsquo;ll point you to the right place.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href="/" className="btn-primary">
                Back to homepage
                <IconArrowRight className="size-4" />
              </a>
              <a href={profile.phoneHref} className="btn-ghost">
                <IconPhone className="size-4" />
                {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="btn-ghost">
                <IconMail className="size-4" />
                Email me
              </a>
            </div>

            <div className="mt-14 rounded-3xl border border-line bg-surface p-7 text-left">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <IconSparkle className="size-4 text-brand" />
                Looking for something specific?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                These are the services I offer.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center gap-2 text-sm text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-line py-8">
        <div className="shell text-center text-xs text-ink-subtle">
          &copy; {new Date().getFullYear()} {profile.brand}. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}