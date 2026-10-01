import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useMediaQuery";

/**
 * Counts up to `target` once the element scrolls into view.
 *
 * Progress lives in state and the displayed number is derived during render,
 * so the animation never has to write state from an effect body. With reduced
 * motion the final value is returned immediately.
 */
export function useCountUp(target, { duration = 1800, start = false } = {}) {
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!start || reducedMotion) return;

    let frame;
    const begin = performance.now();

    const tick = (now) => {
      const next = Math.min((now - begin) / duration, 1);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, reducedMotion, duration]);

  if (!start) return 0;
  if (reducedMotion) return target;

  // easeOutExpo — fast start, gentle settle.
  const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
  return Math.round(target * eased);
}