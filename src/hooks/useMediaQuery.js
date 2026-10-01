import { useCallback, useSyncExternalStore } from "react";

/**
 * Reads a media query and stays in sync with it.
 *
 * Built on useSyncExternalStore so the value is subscribed to rather than
 * polled, and so reading it never requires a setState-in-effect cascade.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Assumed false during SSR/static prerender so markup matches the client.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the user has asked the OS to minimise animation. */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** True on pointer devices that can hover — used to gate tilt/hover effects. */
export const useCanHover = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");