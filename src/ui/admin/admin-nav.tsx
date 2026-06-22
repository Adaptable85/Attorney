import Link from "next/link";

import type { AdminModule } from "./admin-modules";

export function AdminNav({ modules }: Readonly<{ modules: readonly AdminModule[] }>) {
  return (
    <nav className="admin-nav" aria-label="Admin modules">
      <div className="admin-nav__brand">
        <p className="admin-nav__brand-name">Burgess Attorneys</p>
        <p className="admin-nav__brand-label">Internal admin shell</p>
      </div>
      <ul className="admin-nav__list">
        <li>
          <Link className="admin-nav__link" href="/admin/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="admin-nav__link" href="/admin/clients">
            Clients
          </Link>
        </li>
        <li>
          <Link className="admin-nav__link" href="/admin/matters">
            Matters
          </Link>
        </li>
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
