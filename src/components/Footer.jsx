import { footerLinks, profile, services } from "../data/site";
import { IconArrowUp, IconMail, IconMapPin, IconPhone } from "./Icons";
import { ThemeToggle } from "./ui/ThemeToggle";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-surface-2/50">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-sm font-bold text-on-brand">
                FT
              </span>
              <span className="font-display text-lg font-bold">
                Frank<span className="text-brand">Tech</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
              Professional ICT solutions with warm, clear communication. Your
              technology, in safe hands.
            </p>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-subtle uppercase">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-sm text-ink-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-subtle uppercase">
              Services
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-ink-muted transition-colors hover:text-brand"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-subtle uppercase">
              Get in touch
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              <li>
                <a
                  href={profile.phoneHref}
                  className="group flex items-start gap-3 text-sm text-ink-muted transition-colors hover:text-brand"
                >
                  <IconPhone className="mt-0.5 size-4 shrink-0 text-brand" />
                  {profile.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-start gap-3 text-sm break-all text-ink-muted transition-colors hover:text-brand"
                >
                  <IconMail className="mt-0.5 size-4 shrink-0 text-brand" />
                  {profile.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-ink-muted">
                <IconMapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                {profile.location}
              </li>
            </ul>

            <a href="#contact" className="btn-primary mt-6 w-full sm:w-auto">
              Book a Consultation
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-center text-xs text-ink-subtle sm:text-left">
            &copy; {year} {profile.brand}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs text-ink-subtle">
            <span className="animate-pulse-ring size-1.5 rounded-full bg-success" />
            {profile.availability} · {profile.responseTime}
          </p>
        </div>
      </div>
    </footer>
  );
}