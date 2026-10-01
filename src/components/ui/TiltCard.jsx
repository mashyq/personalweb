import { useRef } from "react";
import { useCanHover, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/cn";

/**
 * Card that tilts toward the cursor, with a flat brand wash on hover.
 * Disabled on touch devices and when the user prefers reduced motion.
 */
export function TiltCard({ children, className, intensity = 8, glow = true }) {
  const ref = useRef(null);
  const canHover = useCanHover();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = canHover && !reducedMotion;

  const handlePointerMove = (event) => {
    const node = ref.current;
    if (!node || !enabled) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    node.style.setProperty("--tilt-x", `${(0.5 - y) * intensity * 2}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * intensity * 2}deg`);
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ "--tilt-x": "0deg", "--tilt-y": "0deg" }}
      className={cn(
        "group/tilt relative rounded-3xl transition-transform duration-300 ease-out",
        "[transform:perspective(900px)_rotateX(var(--tilt-x))_rotateY(var(--tilt-y))]",
        "motion-reduce:!transform-none",
        enabled && "hover:-translate-y-1",
        className,
      )}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl bg-brand/6 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      )}
      {children}
    </div>
  );
}