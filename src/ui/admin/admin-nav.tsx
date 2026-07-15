import Link from "next/link";

import type { AdminModule } from "./admin-modules";

export function AdminNav({ modules }: Readonly<{ modules: readonly AdminModule[] }>) {
  const navItems = [
    { href: "/admin", label: "Admin Home" },
    ...modules.map((module) => ({ href: module.href, label: module.navLabel }))
  ];
  const uniqueNavItems = navItems.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index
  );

  return (
    <nav className="admin-nav" aria-label="Admin modules">
      <div className="admin-nav__brand">
        <p className="admin-nav__brand-name">Burgess Attorneys</p>
        <p className="admin-nav__brand-label">Practice file workspace</p>
      </div>
      <ul className="admin-nav__list">
        {uniqueNavItems.map((item) => (
          <li key={item.href}>
            <Link className="admin-nav__link" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
