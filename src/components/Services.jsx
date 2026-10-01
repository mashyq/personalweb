import { useState } from "react";
import { services } from "../data/site";
import { cn } from "../lib/cn";
import { iconMap } from "../lib/iconMap";
import { IconArrowRight, IconCheck } from "./Icons";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";
import { TiltCard } from "./ui/TiltCard";

export function Services() {
  // Only one service expands at a time; null means everything is collapsed.
  const [expanded, setExpanded] = useState(null);

  return (
    <Section id="services" banded>
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="Smart ICT services tailored to your needs."
          description="Clear solutions, friendly guidance and dependable delivery. Open any service to see exactly what's included."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon];
          const isOpen = expanded === service.id;

          return (
            <Reveal key={service.id} delay={(index % 3) * 90}>
              <TiltCard className="h-full" intensity={5}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border bg-surface p-6 shadow-soft transition-colors duration-300",
                    isOpen
                      ? "border-brand/50"
                      : "border-line hover:border-brand/30",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-2xl transition-all duration-300",
                      isOpen
                        ? "bg-brand text-on-brand"
                        : "bg-brand-soft text-brand",
                    )}
                  >
                    <Icon className="size-6" />
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                    {service.summary}
                  </p>

                  {/* Expanded detail */}
                  <div
                    id={`service-panel-${service.id}`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-400 ease-out",
                      isOpen
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-1 text-sm leading-relaxed text-ink-muted">
                        {service.details}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {service.points.map((point) => (
                          <li
                            key={point}
                            className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
                          >
                            <IconCheck className="size-3 text-brand" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : service.id)}
                    aria-expanded={isOpen}
                    aria-controls={`service-panel-${service.id}`}
                    className="mt-5 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
                  >
                    {isOpen ? "Hide details" : "Learn more"}
                    <IconArrowRight
                      className={cn(
                        "size-4 transition-transform duration-300",
                        isOpen && "rotate-90",
                      )}
                    />
                  </button>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-16">
        <Marquee />
      </div>
    </Section>
  );
}