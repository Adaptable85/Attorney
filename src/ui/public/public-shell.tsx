import Link from "next/link";
import type { ReactNode } from "react";

import { contactDetails } from "./public-content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" }
] as const;

export function PublicShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="Burgess Attorneys home">
          <span className="public-brand__name">Burgess Attorneys</span>
          <span className="public-brand__meta">Kuils River · Cape Town</span>
        </Link>
        <nav className="public-nav" aria-label="Public navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="public-footer">
        <div>
          <p className="public-footer__brand">Burgess Attorneys Inc</p>
          <p>Boutique legal services with personal attention and practical guidance.</p>
        </div>
        <address>
          <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
          <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a>
          <span>{contactDetails.address}</span>
        </address>
      </footer>
    </div>
  );
}
