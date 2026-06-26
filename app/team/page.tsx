import type { Metadata } from "next";

import { ContactCta } from "@/ui/public/contact-cta";
import { stephanieProfile } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet Stephanie Burgess, admitted attorney and insolvency practitioner at Burgess Attorneys in Kuils River, Cape Town."
};

export default function TeamPage() {
  return (
    <PublicShell>
      <main className="public-main public-main--narrow" aria-labelledby="team-title">
        <section className="page-hero">
          <p className="public-eyebrow">Ladies with a passion for justice</p>
          <h1 id="team-title">{stephanieProfile.name}</h1>
          <p>{stephanieProfile.summary}</p>
        </section>

        <section className="profile-card" aria-labelledby="profile-title">
          <div className="profile-card__mark" aria-hidden="true">
            SB
          </div>
          <div>
            <p className="public-eyebrow">{stephanieProfile.title}</p>
            <h2 id="profile-title">Pretoria to Cape Town</h2>
            <p>
              After many years of practicing in Pretoria and Cape Town, Stephanie settled in Cape
              Town and the firm found its home in the Northern Suburbs. As a boutique firm, Burgess
              Attorneys strives to deliver personal, attention-to-detail legal solutions.
            </p>
            <ul>
              {stephanieProfile.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <ContactCta title="Contact Stephanie Burgess" />
      </main>
    </PublicShell>
  );
}
