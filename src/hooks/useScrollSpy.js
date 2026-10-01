import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, for nav highlighting.
 * Picks the last section whose top has crossed `offset` px from the viewport top.
 */
export function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY + offset;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= position) current = id;
      }

      // At the very bottom of the page the last section may be too short to
      // ever reach the offset — pin it so the nav can't get "stuck".
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2;
      if (atBottom) current = ids[ids.length - 1];

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ids, offset]);

  return active;
}