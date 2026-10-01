import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useMediaQuery";

/**
 * Types out and rotates through a list of phrases.
 *
 * The timer callback drives the animation; the returned text is derived
 * during render so reduced-motion users get the first phrase outright.
 */
export function useTypewriter(
  phrases,
  { typeSpeed = 55, deleteSpeed = 32, pause = 1900 } = {},
) {
  const reducedMotion = usePrefersReducedMotion();
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length || reducedMotion) return;

    const current = phrases[index % phrases.length];
    const atEnd = !deleting && text === current;
    const atStart = deleting && text === "";

    let delay = deleting ? deleteSpeed : typeSpeed;
    if (atEnd) delay = pause;
    if (atStart) delay = 320;

    const timer = window.setTimeout(() => {
      if (atEnd) {
        setDeleting(true);
        return;
      }
      if (atStart) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
        return;
      }
      setText(current.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, phrases, reducedMotion, typeSpeed, deleteSpeed, pause]);

  return {
    text: reducedMotion ? (phrases[0] ?? "") : text,
    isDeleting: deleting,
    currentIndex: index,
  };
}