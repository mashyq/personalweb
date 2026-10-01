import { cn } from "../../lib/cn";

/**
 * Standard section wrapper: consistent vertical rhythm and an optional
 * alternating background band.
 */
export function Section({
  id,
  children,
  className,
  banded = false,
  containerClassName,
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28",
        banded && "border-y border-line bg-surface-2/40",
        className,
      )}
    >
      <div className={cn("shell", containerClassName)}>{children}</div>
    </section>
  );
}

/**
 * Centred (or left-aligned) heading block used at the top of each section.
 */
export function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}