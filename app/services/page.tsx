import type { Metadata } from "next";

import { ContactCta } from "@/ui/public/contact-cta";
import { serviceGroups } from "@/ui/public/public-content";
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
          <p className="public-eyebrow">Have a look at</p>
          <h1 id="services-title">Our Services</h1>
          <p>
            Providing timely and reliable service that is focused and sensitive to each
            client&apos;s specific needs and instructions.
          </p>
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
