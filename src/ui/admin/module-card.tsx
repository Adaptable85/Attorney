import type { AdminModule } from "./admin-modules";

export function ModuleCard({ module }: Readonly<{ module: AdminModule }>) {
  return (
    <article className="module-card" id={module.id}>
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      <div className="module-card__meta" aria-label={`${module.title} status`}>
        <span className="module-card__tag">{module.status}</span>
        <span className="module-card__tag">{module.phaseLabel}</span>
      </div>
    </article>
  );
}
