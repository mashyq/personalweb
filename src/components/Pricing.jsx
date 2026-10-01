import { pricing } from "../data/site";
import { cn } from "../lib/cn";
import { IconCheck, IconSparkle } from "./Icons";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";

const KES = new Intl.NumberFormat("en-KE");

export function Pricing() {
  return (
    <Section id="pricing">
      <Reveal>
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward per-visit pricing."
          description="Every job is charged per visit — no retainers, no subscriptions, nothing running in the background. Quotes are confirmed in writing before any work starts."
        />
      </Reveal>

      <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {pricing.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 100}>
            <div
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-4xl border p-7 transition-all duration-300 sm:p-8",
                plan.featured
                  ? "border-brand/50 bg-surface shadow-glow lg:-mt-4 lg:mb-[-1rem] lg:py-11"
                  : "border-line bg-surface shadow-soft hover:-translate-y-1 hover:border-brand/30",
                )}
              >
                {plan.featured && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -top-24 -right-16 size-56 rounded-full bg-brand/12 blur-3xl"
                    />
                    <span className="relative mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-mono text-[0.6rem] tracking-[0.18em] text-on-brand uppercase">
                      <IconSparkle className="size-3" />
                      Most popular
                    </span>
                  </>
                )}

                <div className="relative">
                  <h3 className="font-display text-2xl font-bold">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {plan.blurb}
                  </p>
                </div>

                <div className="relative mt-7">
                  {typeof plan.price === "number" ? (
                    <>
                      <div className="flex items-end gap-1.5">
                        <span className="font-display text-4xl font-bold">
                          {KES.format(plan.price)}
                        </span>
                        <span className="pb-1.5 text-sm text-ink-subtle">
                          / visit
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-[0.65rem] tracking-widest text-ink-subtle uppercase">
                        KES · excluding parts
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-end gap-1.5">
                        <span className="font-display text-4xl font-bold">
                          Custom
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-[0.65rem] tracking-widest text-ink-subtle uppercase">
                        Quoted per project
                      </p>
                    </>
                  )}
                </div>

                <ul className="relative mt-7 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand-soft">
                        <IconCheck className="size-2.5 text-brand" />
                      </span>
                      <span className="text-ink-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={cn(
                    "relative mt-8 w-full",
                    plan.featured ? "btn-primary" : "btn-ghost",
                  )}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-10 text-center text-xs text-ink-subtle">
          All rates are per visit and exclude replacement parts. Travel outside
          Nairobi is quoted separately, and every job is confirmed in writing
          before work begins.
        </p>
      </Reveal>
    </Section>
  );
}