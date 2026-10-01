/**
 * Merge conditional class names. Falsy values are dropped.
 * @example cn("btn", isActive && "btn-primary")
 */
export function cn(...classes) {
  return classes.flat(Infinity).filter(Boolean).join(" ");
}