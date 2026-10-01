import { useInView } from "../../hooks/useInView";
import { cn } from "../../lib/cn";

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * `delay` staggers siblings; `as` lets the wrapper element be swapped.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  as: Tag = "div",
}) {
  const [ref, inView] = useInView({ threshold, rootMargin });

  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}