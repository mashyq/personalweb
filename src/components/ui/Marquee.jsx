import { marqueeItems } from "../../data/site";

/**
 * Infinite horizontal ticker. The item list is rendered twice and the track is
 * translated by -50%, so the seam lands exactly where the copy repeats.
 */
export function Marquee() {
  const row = (offset) => (
    <ul
      aria-hidden={offset > 0 ? "true" : undefined}
      className="flex shrink-0 items-center gap-4 pr-4"
    >
      {marqueeItems.map((item) => (
        <li
          key={`${offset}-${item}`}
          className="flex shrink-0 items-center gap-4 text-sm font-medium tracking-wide whitespace-nowrap text-ink-subtle"
        >
          {item}
          <span aria-hidden="true" className="size-1 rounded-full bg-brand/60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mask-fade-x group relative flex overflow-hidden border-y border-line bg-surface-2/40 py-5">
      <div className="animate-marquee flex min-w-full group-hover:[animation-play-state:paused]">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}