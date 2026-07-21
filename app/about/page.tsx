import type { Metadata } from "next";
import Image from "next/image";

import { ContactCta } from "@/ui/public/contact-cta";
import { contactDetails, founderStory, stephanieProfile, trustSignals } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Burgess Attorneys Inc, a boutique law firm in Kuils River and the Northern Suburbs of Cape Town."
};

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="public-main public-main--narrow" aria-labelledby="about-title">
        <section className="page-hero">
          <p className="public-eyebrow">About Burgess Attorneys</p>
          <h1 id="about-title">A boutique firm built around personal attention.</h1>
          <p>
            Burgess Attorneys Inc is based in {contactDetails.region}. The firm keeps the client
            conversation close, practical and careful from the first enquiry through to the next
            legal step.
          </p>
        </section>

        <section className="content-stack content-stack--soft">
          <article>
            <h2>Firm background</h2>
            <p>
              Burgess Attorneys Inc was founded on 1 September 2021 after the incorporation of the
              sole proprietor Burgess Attorneys. The firm focuses on developing positive, sharing
              and productive lifelong relationships with clients and their business partners.
            </p>
            <p>
              Traditional values are not treated as old-fashioned. They are applied with modern
              responsiveness, clear communication and attention to the documents behind every
              matter.
            </p>
          </article>
          <article className="about-founder-card">
            <Image
              className="profile-card__photo"
              src="/brand/stephanie-burgess.jpg"
              alt="Stephanie Burgess"
              width={840}
              height={1078}
            />
            <div>
              <p className="public-eyebrow">About Stephanie</p>
              <h2>{stephanieProfile.name}</h2>
              <p>{founderStory.summary}</p>
              <p>{founderStory.philosophy}</p>
              <ul>
                {founderStory.credentials.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
          <article className="trust-grid trust-grid--about" aria-label="Burgess Attorneys trust signals">
            {trustSignals.map((signal) => (
              <div key={signal.label}>
                <h2>{signal.label}</h2>
                <p>{signal.value}</p>
              </div>
            ))}
          </article>
          <article>
            <h2>Personal attention</h2>
            <p>
              Services are rendered on a personal level by the firm&apos;s attorneys because every
              client requires personal attention to detail and advice at all times.
            </p>
          </article>
          <article>
            <h2>Traditional values, applied innovatively</h2>
            <p>
              The firm aims to utilise the strengths of hard-earned experience in such a manner that
              traditional values are not lost, but applied innovatively.
            </p>
          </article>
          <article>
            <h2>No overpromises</h2>
            <p>
              Every matter depends on its own facts, documents and legal context. The firm can help
              clients understand their options, but no website statement should be read as a
              guarantee of outcome.
            </p>
          </article>
        </section>

        <ContactCta title="Legal representation at your finger tips" />
      </main>
    </PublicShell>
  );
}
