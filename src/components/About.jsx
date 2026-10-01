import { expertise, processSteps, profile, timeline } from "../data/site";
import { useInView } from "../hooks/useInView";
import {
  IconAward,
  IconBriefcase,
  IconClock,
  IconMapPin,
  IconUsers,
} from "./Icons";
import { Label } from "./ui/Backdrop";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";

function SkillBar({ name, level, delay }) {
  const [ref, inView] = useInView({ threshold: 0.6 });

  return (
    <li ref={ref}>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-ink">{name}</span>
        <span className="font-mono text-xs text-ink-subtle">{level}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-out"
          style={{
            width: inView ? `${level}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </li>
  );
}

const highlights = [
  { icon: IconAward, label: "8+ years experience" },
  { icon: IconUsers, label: "120+ jobs delivered" },
  { icon: IconClock, label: "Same-day response" },
  { icon: IconMapPin, label: "On-site in Nairobi" },
];

export function About() {
  return (
    <Section id="about" banded>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Label>About {profile.brand}</Label>
          </Reveal>

          <Reveal delay={70}>
            <h2 className="mt-5 text-3xl leading-[1.15] sm:text-4xl">
              Professional ICT service with a{" "}
              <span className="text-brand italic">personal touch</span>.
            </h2>
          </Reveal>

          {profile.bio.map((paragraph, index) => (
            <Reveal key={index} delay={120 + index * 70}>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={260}>
            <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm font-medium text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
                >
                  <Icon className="size-4 shrink-0 text-brand" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          {/* Expertise */}
          <Reveal delay={120}>
            <div className="card p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-xl font-bold">Expertise</h3>
                <span className="chip font-mono text-[0.65rem] tracking-widest uppercase">
                  Self-assessed
                </span>
              </div>
              <ul className="mt-7 flex flex-col gap-5">
                {expertise.map((skill, index) => (
                  <SkillBar key={skill.name} {...skill} delay={index * 90} />
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Experience timeline */}
          <Reveal delay={200}>
            <div className="card p-7">
              <div className="flex items-center gap-2.5">
                <IconBriefcase className="size-4 text-brand" />
                <h3 className="font-display text-xl font-bold">
                  Experience
                </h3>
              </div>

              <ol className="mt-7 flex flex-col">
                {timeline.map((entry, index) => (
                  <li key={entry.period} className="relative flex gap-4 pb-7 last:pb-0">
                    {/* rail */}
                    {index < timeline.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-3 bottom-0 left-[0.4375rem] w-px bg-line"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="relative mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-brand bg-canvas"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-[0.7rem] tracking-widest text-brand uppercase">
                        {entry.period}
                      </p>
                      <p className="mt-1.5 font-semibold text-ink">
                        {entry.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {entry.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/** "How I work" — four numbered steps. */
export function Process() {
  return (
    <Section id="process">
      <Reveal>
        <SectionHeading
          eyebrow="How I Work"
          title="Four clear steps. No surprises."
          description="Every engagement follows the same transparent path, so you always know what happens next and what it costs."
        />
      </Reveal>

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <Reveal key={step.step} as="li" delay={index * 90}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift">
              <span
                aria-hidden="true"
                className="font-display absolute -top-3 right-3 text-6xl font-bold text-brand/10 transition-colors duration-300 group-hover:text-brand/20"
              >
                {step.step}
              </span>
              <span className="relative grid size-11 place-items-center rounded-2xl bg-brand-soft font-display text-lg font-bold text-brand">
                {index + 1}
              </span>
              <h3 className="relative mt-5 font-display text-xl font-bold">
                {step.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}