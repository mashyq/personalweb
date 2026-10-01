import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "../data/site";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { cn } from "../lib/cn";
import { IconArrowRight, IconQuote, IconStar } from "./Icons";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const count = testimonials.length;

  const go = useCallback(
    (direction) =>
      setIndex((current) => (current + direction + count) % count),
    [count],
  );

  // Autoplay, paused on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, count]);

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return (
    <Section id="testimonials" banded>
      <Reveal>
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients actually say."
          description="A few words from the people I've worked with."
        />
      </Reveal>

      <Reveal delay={100}>
        <div
          className="mx-auto mt-13 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          {/* Fixed height avoids layout jump between quotes of differing lengths. */}
          <div className="relative overflow-hidden rounded-4xl border border-line bg-surface p-8 shadow-soft sm:p-12">
            <IconQuote
              aria-hidden="true"
              className="absolute -top-2 -right-2 size-28 text-brand/10"
            />

            {/* Track */}
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((item, i) => (
                <figure
                  key={item.name}
                  aria-hidden={i !== index}
                  className="w-full shrink-0"
                >
                  <div
                    className="flex gap-1 text-brand"
                    aria-label="Rated 5 out of 5"
                  >
                    {Array.from({ length: 5 }, (_, star) => (
                      <IconStar key={star} className="size-4" />
                    ))}
                  </div>

                  <blockquote className="mt-6 font-display text-lg leading-relaxed font-medium text-ink sm:text-xl">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-7 flex items-center gap-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-on-brand">
                      {item.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {item.name}
                      </span>
                      <span className="block text-xs text-ink-subtle">
                        {item.role} · {item.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-between gap-6">
            {/* Position selector. Plain buttons with aria-current — the quotes aren't
                tabpanels, so aria-selected would misrepresent them. */}
            <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Testimonial from ${item.name}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    i === index
                      ? "w-8 bg-brand"
                      : "w-2 bg-ink-subtle/40 hover:bg-ink-subtle",
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
              >
                <IconArrowRight className="size-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
              >
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}