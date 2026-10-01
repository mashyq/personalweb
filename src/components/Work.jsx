import { useMemo, useState } from "react";
import { projectCategories, projects } from "../data/site";
import { cn } from "../lib/cn";
import { iconMap } from "../lib/iconMap";
import { IconArrowUpRight } from "./Icons";
import { Reveal } from "./ui/Reveal";
import { Section, SectionHeading } from "./ui/Section";
import { TiltCard } from "./ui/TiltCard";

export function Work() {
  const [category, setCategory] = useState("All");

  const visible = useMemo(
    () =>
      category === "All"
        ? projects
        : projects.filter((project) => project.category === category),
    [category],
  );

  return (
    <Section id="work">
      <Reveal>
        <SectionHeading
          eyebrow="Selected Work"
          title="Recent projects and outcomes."
          description="A sample of the kind of problems I've solved. Filter by discipline to narrow it down."
        />
      </Reveal>

      {/* Filters. These are buttons, not tabs — the grid below isn't a
          tabpanel, so aria-pressed is the honest signal. */}
      <Reveal delay={90}>
        <div
          aria-label="Filter projects by category"
          className="no-scrollbar mt-11 flex gap-2 overflow-x-auto pb-2"
        >
          {projectCategories.map((option) => {
            const isActive = category === option;
            const count =
              option === "All"
                ? projects.length
                : projects.filter((p) => p.category === option).length;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCategory(option)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-brand text-on-brand shadow-glow"
                    : "border border-line bg-surface text-ink-muted hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink",
                )}
              >
                {option}
                <span
                  className={cn(
                    "font-mono text-[0.65rem]",
                    isActive ? "opacity-75" : "text-ink-subtle",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Grid */}
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => {
          const Icon = iconMap[project.icon];
          return (
            <Reveal key={project.id} delay={(index % 3) * 80}>
              <TiltCard className="h-full" intensity={6}>
                <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-colors duration-300 hover:border-brand/40">
                  {/* Thumbnail area */}
                  <div className="relative grid h-40 place-items-center overflow-hidden bg-brand-soft">
                    <Icon className="relative size-12 text-brand transition-transform duration-500 group-hover/tilt:scale-110" />
                    <span className="absolute top-3 left-3 rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[0.6rem] tracking-widest text-brand uppercase backdrop-blur">
                      {project.category}
                    </span>
                    <span className="absolute right-3 bottom-3 rounded-full bg-brand px-2.5 py-1 text-[0.7rem] font-semibold text-on-brand">
                      {project.metric}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg leading-snug font-bold">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">
                      {project.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <ul className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-subtle"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <IconArrowUpRight className="size-4 shrink-0 text-ink-subtle transition-all duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:translate-x-0.5 group-hover/tilt:text-brand" />
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-ink-subtle">
          No projects in this category yet.
        </p>
      )}
    </Section>
  );
}