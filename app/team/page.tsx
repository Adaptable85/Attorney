import type { Metadata } from "next";
import Image from "next/image";

import { ContactCta } from "@/ui/public/contact-cta";
import { EmailLink, PhoneActions } from "@/ui/public/contact-links";
import { contactDetails, founderStory, stephanieProfile } from "@/ui/public/public-content";
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
          <p>{founderStory.summary}</p>
        </section>

        <section className="profile-card profile-card--premium" aria-labelledby="profile-title">
          <Image
            className="profile-card__photo"
            src="/brand/stephanie-burgess.jpg"
            alt="Stephanie Burgess"
            width={1024}
            height={1535}
            quality={95}
            sizes="120px"
          />
          <div>
            <p className="public-eyebrow">{founderStory.eyebrow}</p>
            <h2 id="profile-title">{founderStory.title}</h2>
            <p>{founderStory.philosophy}</p>
            <ul>
              {stephanieProfile.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="contact-ribbon" aria-labelledby="team-contact-title">
          <div>
            <p className="public-eyebrow">Direct attorney contact</p>
            <h2 id="team-contact-title">Speak to Stephanie about the right next step.</h2>
            <p>
              The website does not replace legal advice. Initial contact helps the firm understand
              whether it can assist and what documents may be needed.
            </p>
          </div>
          <address>
            <EmailLink />
            <span>{contactDetails.phone}</span>
            <PhoneActions />
          </address>
        </section>

        <ContactCta title="Contact Stephanie Burgess" />
      </main>
    </PublicShell>
  );
}
