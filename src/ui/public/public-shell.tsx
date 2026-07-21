import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { contactDetails } from "./public-content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "People" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact Us" }
] as const;

export function PublicShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="Burgess Attorneys home">
          <Image
            className="public-brand__logo"
            src="/brand/burgess-logo-header.png"
            alt="Burgess Attorneys"
            width={254}
            height={182}
            priority
          />
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
          <Image
            className="public-footer__logo"
            src="/brand/burgess-logo-header.png"
            alt="Burgess Attorneys"
            width={254}
            height={182}
          />
          <p>Traditional values applied innovatively, with personal attention to detail.</p>
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
