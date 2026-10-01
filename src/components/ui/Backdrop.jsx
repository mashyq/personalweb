import { cn } from "../../lib/cn";

/**
 * Decorative page background: soft blurred colour fields and a masked grid.
 * Flat fills only — no gradients — so it reads as clean and professional.
 * Purely presentational, so it is hidden from assistive technology.
 */
export function Backdrop({ className, withGlow = true }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {withGlow && (
        <>
          <div className="animate-drift absolute -top-40 -left-32 size-[30rem] rounded-full bg-brand/8 blur-3xl" />
          <div className="animate-drift-slow absolute top-1/4 -right-36 size-[32rem] rounded-full bg-brand/6 blur-3xl" />
        </>
      )}
    </div>
  );
}

/** Small pill used for availability / status indicators. */
export function StatusPill({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line",
        "bg-surface/70 px-4 py-2 text-xs font-medium text-ink-muted backdrop-blur",
        className,
      )}
    >
      <span className="animate-pulse-ring size-2 rounded-full bg-success" />
      {children}
    </span>
  );
}

/** Section-level eyebrow label with a leading rule. */
export function Label({ children, className }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span aria-hidden="true" className="h-px w-8 bg-brand/50" />
      {children}
    </p>
  );
}