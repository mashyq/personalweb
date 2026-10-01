import { useEffect, useState } from "react";
import { navLinks, profile } from "../data/site";
import { useScrollProgress, useScrolled } from "../hooks/useScrollProgress";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { cn } from "../lib/cn";
import {
  IconArrowRight,
  IconClose,
  IconMenu,
  IconPhone,
} from "./Icons";
import { ThemeToggle } from "./ui/ThemeToggle";

const sectionIds = navLinks.map((link) => link.id);

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(sectionIds);
  const progress = useScrollProgress();
  const scrolled = useScrolled(20);

  // Close the drawer on resize back to desktop so it can't get stranded open.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = (event) => event.matches && setMenuOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Prevent the page behind the drawer from scrolling, compensating for the
  // scrollbar so the layout doesn't jump sideways.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-brand focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-on-brand"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Reading progress */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 origin-left bg-brand transition-opacity duration-300"
          style={{
            transform: `scaleX(${progress})`,
            opacity: progress > 0.005 ? 1 : 0,
          }}
        />

        <div className="shell flex h-18 items-center justify-between gap-6">
          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label={`${profile.brand} — home`}
          >
            <span className="relative grid size-9 place-items-center rounded-xl bg-brand text-on-brand">
              <span className="font-display text-sm font-bold">FT</span>
              <span className="absolute inset-0 rounded-xl bg-brand opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Frank<span className="text-brand">Tech</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-brand"
                          : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-px origin-center bg-brand transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={profile.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-brand/50 hover:text-brand md:inline-flex lg:hidden xl:inline-flex"
            >
              <IconPhone className="size-4" />
              {profile.phone}
            </a>

            <ThemeToggle />

            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message FrankTech on WhatsApp"
              className="btn-primary hidden sm:inline-flex"
            >
              Let&rsquo;s Talk
              <IconArrowRight className="size-4" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-line bg-surface/70 text-ink backdrop-blur transition-colors hover:border-brand/50 hover:text-brand lg:hidden"
            >
              {menuOpen ? (
                <IconClose className="size-5" />
              ) : (
                <IconMenu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer. `inert` while collapsed so its links stay out of
            both the tab order and the accessibility tree. */}
        <div
          id="mobile-menu"
          inert={!menuOpen}
          className={cn(
            "overflow-hidden border-t border-line bg-canvas/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 ease-out lg:hidden",
            menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="shell py-5">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      style={{ transitionDelay: menuOpen ? `${index * 40}ms` : "0ms" }}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all duration-300",
                        menuOpen && "translate-x-0 opacity-100",
                        !menuOpen && "translate-x-3 opacity-0",
                        isActive
                          ? "bg-brand-soft text-brand"
                          : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                      )}
                    >
                      {link.label}
                      <IconArrowRight className="size-4 opacity-40" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full"
              >
                Book a Consultation
              </a>
              <a
                href={profile.phoneHref}
                className="btn-ghost w-full"
              >
                <IconPhone className="size-4" />
                {profile.phone}
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}