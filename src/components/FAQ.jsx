import { useState } from "react";
import { faqs } from "../data/site";
import { cn } from "../lib/cn";
import { IconChevronDown } from "./Icons";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";

export function FAQ() {
  // Multiple answers can be open at once — this is a disclosure list, not an accordion.
  const [open, setOpen] = useState(() => new Set([0]));

  const toggle = (index) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <Section id="faq" banded>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Questions, answered."
              description="Can't find what you're after? Send a message and I'll be happy to help."
            />
          </Reveal>
          <Reveal delay={120}>
            <a href="#contact" className="btn-ghost mt-8">
              Ask me directly
            </a>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <ul className="flex flex-col gap-3">
            {faqs.map((item, index) => {
              const isOpen = open.has(index);

              return (
                <li
                  key={item.question}
                  className={cn(
                    "overflow-hidden rounded-3xl border transition-colors duration-300",
                    isOpen
                      ? "border-brand/40 bg-surface shadow-soft"
                      : "border-line bg-surface/50 hover:border-brand/25",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-trigger-${index}`}
                      className="flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold text-ink">
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "rotate-180 border-brand bg-brand text-on-brand"
                            : "border-line text-ink-subtle",
                        )}
                      >
                        <IconChevronDown className="size-4" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-400 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-ink-muted">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}