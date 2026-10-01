import { heroBadges, heroRotatingRoles, profile } from "../data/site";
import { useCountUp } from "../hooks/useCountUp";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";
import {
  IconArrowRight,
  IconCheck,
  IconMapPin,
  IconPhone,
  IconSparkle,
  IconZap,
} from "./Icons";
import { Backdrop, StatusPill } from "./ui/Backdrop";
import { Reveal } from "./ui/Reveal";

function CounterStat({ value, suffix, label }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const count = useCountUp(value, { start: inView });

  return (
    <div ref={ref} className="text-center sm:text-left">
      <p className="font-display text-2xl font-bold text-ink">
        {count}
        <span className="text-brand">{suffix}</span>
      </p>
      <p className="mt-0.5 text-xs tracking-wide text-ink-subtle">{label}</p>
    </div>
  );
}

export function Hero() {
  const { text } = useTypewriter(heroRotatingRoles);

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <Backdrop />

      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ---------------------------------------------------------- copy */}
          <div className="flex flex-col items-start">
            <Reveal>
              <StatusPill>
                {profile.availability}
                <span aria-hidden="true" className="text-ink-subtle">·</span>
                {profile.location}
              </StatusPill>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem]">
                <span className="block">Friendly, reliable</span>
                <span className="block">
                  tech <span className="text-brand italic">solutions</span>
                </span>
                <span className="mt-3 block text-xl font-sans font-medium text-ink-muted sm:text-2xl lg:text-[1.6rem]">
                  for modern teams.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {profile.brand} provides professional ICT support, networking
                and system maintenance with a calm, human touch. From setup to
                troubleshooting, your tech is in safe hands.
              </p>
            </Reveal>

            {/* Rotating specialism. Not aria-live: announcing every keystroke
              would flood a screen reader. */}
            <Reveal delay={220}>
              <p className="mt-6 flex min-h-8 items-center gap-2 font-mono text-sm text-brand">
                <IconSparkle className="size-4 shrink-0" />
                <span>{text}</span>
                <span
                  aria-hidden="true"
                  className="animate-blink h-4 w-px bg-brand"
                />
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#contact" className="btn-primary">
                  Book a Consultation
                  <IconArrowRight className="size-4" />
                </a>
                <a href="#services" className="btn-ghost">
                  View Services
                </a>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <ul className="mt-10 flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <li key={badge} className="chip">
                    <IconCheck className="size-3.5 text-brand" />
                    {badge}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* --------------------------------------------------------- card */}
          <Reveal delay={200} className="relative">
            <div className="card relative overflow-hidden p-7 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 size-64 rounded-full bg-brand/10 blur-3xl"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand font-display text-lg font-bold text-on-brand">
                    FM
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold leading-tight">
                      {profile.name}
                    </p>
                    <p className="text-sm text-ink-muted">{profile.role}</p>
                  </div>
                </div>
                <span
                  className="animate-pulse-ring mt-1 size-3 shrink-0 rounded-full bg-success"
                  aria-label="Online"
                  role="status"
                />
              </div>

              <div className="relative mt-7 grid grid-cols-2 gap-x-4 gap-y-6 border-y border-line py-6 sm:grid-cols-4 lg:grid-cols-2">
                {profile.stats.map((stat) => (
                  <CounterStat key={stat.label} {...stat} />
                ))}
              </div>

              <dl className="relative mt-6 flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Location</dt>
                  <IconMapPin className="size-4 shrink-0 text-brand" />
                  <dd className="text-ink-muted">{profile.location}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Response time</dt>
                  <IconZap className="size-4 shrink-0 text-brand" />
                  <dd className="text-ink-muted">{profile.responseTime}</dd>
                </div>
              </dl>

              <blockquote className="relative mt-6 rounded-2xl bg-brand-soft p-5 text-sm leading-relaxed font-medium text-ink">
                &ldquo;Let&rsquo;s simplify your technology so you can focus on
                what matters.&rdquo;
              </blockquote>
            </div>

            {/* Floating call-to-action */}
            <div className="animate-float absolute -bottom-5 -left-4 hidden sm:flex sm:items-center sm:gap-2.5 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold shadow-lift">
              <IconPhone className="size-4 text-brand" />
              Fast response, clear solutions.
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="mx-auto mt-16 hidden w-fit flex-col items-center gap-2 text-ink-subtle transition-colors hover:text-brand sm:flex"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="animate-float text-lg leading-none"
        >
          ↓
        </span>
      </a>
    </section>
  );
}