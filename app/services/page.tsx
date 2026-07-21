import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/ui/public/contact-cta";
import { serviceGroups, servicePathways } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";
import { ServiceCard } from "@/ui/public/service-card";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Burgess Attorneys services including litigation, family law, insolvency, commercial law, property law, trusts and estates, labour law and RAF claims."
};

export default function ServicesPage() {
  return (
    <PublicShell>
      <main className="public-main" aria-labelledby="services-title">
        <section className="page-hero">
          <p className="public-eyebrow">Find the right legal starting point</p>
          <h1 id="services-title">Services grouped around the problem you need to solve.</h1>
          <p>
            Burgess Attorneys assists across personal, commercial, litigation and property-related
            matters. The categories below are starting points only; advice depends on your facts,
            documents and the firm&apos;s ability to accept the instruction.
          </p>
        </section>

        <section className="pathway-grid pathway-grid--services" aria-label="Client service pathways">
          {servicePathways.map((pathway) => (
            <article className="pathway-card" key={pathway.title}>
              <p>{pathway.audience}</p>
              <h2>{pathway.title}</h2>
              <span>{pathway.summary}</span>
              <ul>
                {pathway.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <Link href="/contact">{pathway.ctaLabel}</Link>
            </article>
          ))}
        </section>

        <section className="service-grid service-grid--wide" aria-label="Service categories">
          {serviceGroups.map((group) => (
            <ServiceCard key={group.title} group={group} />
          ))}
        </section>

        <section className="legal-note" aria-labelledby="services-note-title">
          <h2 id="services-note-title">Advice depends on your specific matter</h2>
          <p>
            The services listed here are general practice areas. They are not a guarantee that a
            matter will have a particular outcome, and they are not a substitute for legal advice
            on your own facts and documents.
          </p>
        </section>

        <ContactCta title="Ask which service applies to your situation" />
      </main>
    </PublicShell>
  );
}
