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
          <p className="public-eyebrow">Our Team</p>
          <h1 id="team-title">{stephanieProfile.name}</h1>
          <p>{stephanieProfile.summary}</p>
        </section>

        <section className="profile-card" aria-labelledby="profile-title">
          <div className="profile-card__mark" aria-hidden="true">
            SB
          </div>
          <div>
            <p className="public-eyebrow">{stephanieProfile.title}</p>
            <h2 id="profile-title">Boutique practice, direct attorney attention</h2>
            <p>
              Stephanie&apos;s professional path includes study at the University of Pretoria,
              admission as an attorney, practice experience in Pretoria, Stellenbosch and Cape Town,
              and further insolvency law and practice training.
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
