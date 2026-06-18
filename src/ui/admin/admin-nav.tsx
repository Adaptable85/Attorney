import type { AdminModule } from "./admin-modules";

export function AdminNav({ modules }: Readonly<{ modules: readonly AdminModule[] }>) {
  return (
    <nav className="admin-nav" aria-label="Admin modules">
      <div className="admin-nav__brand">
        <p className="admin-nav__brand-name">Burgess Attorneys</p>
        <p className="admin-nav__brand-label">Internal admin shell</p>
      </div>
      <ul className="admin-nav__list">
        {modules.map((module) => (
          <li key={module.id}>
            <a className="admin-nav__link" href={`#${module.id}`}>
              {module.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
