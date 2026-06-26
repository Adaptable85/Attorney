import type { Metadata } from "next";

import { ContactCta } from "@/ui/public/contact-cta";
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
          <h1 id="about-title">A short insight About Us</h1>
          <p>
            Burgess Attorneys Inc is a boutique law firm based in Kuils River, serving clients in
            Cape Town and the Northern Suburbs with careful attention to detail.
          </p>
        </section>

        <section className="content-stack">
          <article>
            <h2>Firm background</h2>
            <p>
              Burgess Attorneys Inc was founded on 1 September 2021 after the incorporation of the
              sole proprietor Burgess Attorneys. The firm focuses on developing positive, sharing
              and productive lifelong relationships with clients and their business partners.
            </p>
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
