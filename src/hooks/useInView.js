import { useEffect, useRef, useState } from "react";

/** Environments without IntersectionObserver reveal content immediately. */
const isSupported = () => typeof IntersectionObserver !== "undefined";

/**
 * Reports when an element enters the viewport.
 *
 * @param {object}  options
 * @param {number}  options.threshold  Ratio of the element that must be visible.
 * @param {string}  options.rootMargin Extra margin around the root, e.g. "0px 0px -80px".
 * @param {boolean} options.once       Stop observing after the first intersection.
 */
export function useInView({
  threshold = 0.2,
  rootMargin = "0px 0px -60px 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  // Seeded so the unsupported-browser path never needs a state update.
  const [inView, setInView] = useState(!isSupported);

  useEffect(() => {
    if (!isSupported()) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}