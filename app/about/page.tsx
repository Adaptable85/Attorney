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
          <h1 id="about-title">Personal legal service with practical focus</h1>
          <p>
            Burgess Attorneys Inc is a boutique law firm based in Kuils River, serving clients in
            Cape Town and the Northern Suburbs with careful attention to detail.
          </p>
        </section>

        <section className="content-stack">
          <article>
            <h2>Firm background</h2>
            <p>
              Burgess Attorneys Inc was incorporated after the sole proprietor practice Burgess
              Attorneys. The firm focuses on developing lasting relationships with clients and
              providing legal support that is personal, responsive and clear.
            </p>
          </article>
          <article>
            <h2>How the firm works</h2>
            <p>
              The practice aims to provide timely and reliable service that is sensitive to each
              client&apos;s instructions. Legal matters are approached with a balance of professional
              values, practical planning and careful communication.
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

        <ContactCta title="Discuss your matter with the firm" />
      </main>
    </PublicShell>
  );
}
