import { useScrolled } from "../hooks/useScrollProgress";
import { cn } from "../lib/cn";
import { IconArrowUp } from "./Icons";

/** Appears once the visitor is well into the page. */
export function BackToTop() {
  const visible = useScrolled(700);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full",
        "border border-line bg-surface/85 text-ink shadow-lift backdrop-blur",
        "transition-all duration-400 hover:-translate-y-1 hover:border-brand/50 hover:text-brand",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <IconArrowUp className="size-5" />
    </button>
  );
}