import { useTheme } from "../../hooks/useTheme";
import { IconMoon, IconSun } from "../Icons";

/** Light/dark switch. Announced to screen readers via aria-pressed. */
export function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative grid size-10 place-items-center rounded-full border border-line bg-surface/70 text-ink-muted backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand ${className ?? ""}`}
    >
      <IconSun
        className={`absolute size-[18px] transition-all duration-400 ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <IconMoon
        className={`absolute size-[18px] transition-all duration-400 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}