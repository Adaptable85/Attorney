import type { Metadata } from "next";

import { contactDetails } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Burgess Attorneys in Kuils River, Cape Town by email or phone. No online form or live data collection is enabled."
};

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="public-main public-main--narrow" aria-labelledby="contact-title">
        <section className="page-hero">
          <p className="public-eyebrow">Contact Burgess Attorneys</p>
          <h1 id="contact-title">Speak to the firm about your matter</h1>
          <p>
            Use the email or phone details below to contact Burgess Attorneys. This website does not
            collect private matter information and does not provide an active contact form.
          </p>
        </section>

        <section className="contact-panel" aria-label="Contact details">
          <a href={`mailto:${contactDetails.email}`}>
            <span>Email</span>
            {contactDetails.email}
          </a>
          <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>
            <span>Phone</span>
            {contactDetails.phone}
          </a>
          <p>
            <span>Address</span>
            {contactDetails.address}
          </p>
        </section>

        <section className="legal-note" aria-labelledby="contact-note-title">
          <h2 id="contact-note-title">Please do not send urgent or sensitive detail first</h2>
          <p>
            Initial contact should be used to arrange the appropriate next step. An attorney-client
            relationship is only formed after the firm has agreed to act and the necessary conflict,
            instruction and engagement steps have been completed.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}
