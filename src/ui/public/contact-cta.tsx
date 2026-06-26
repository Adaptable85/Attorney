import Link from "next/link";

import { contactDetails } from "./public-content";

export function ContactCta({
  eyebrow = "Speak to Burgess Attorneys",
  title = "Need practical legal guidance?"
}: Readonly<{ eyebrow?: string; title?: string }>) {
  return (
    <section className="contact-cta" aria-labelledby="contact-cta-title">
      <p className="public-eyebrow">{eyebrow}</p>
      <h2 id="contact-cta-title">{title}</h2>
      <p>
        Contact the firm to discuss your circumstances. Browsing this website does not create an
        attorney-client relationship, and advice should be requested for your specific matter.
      </p>
      <div className="contact-cta__actions">
        <Link className="public-button public-button--primary" href="/contact">
          Contact Us
        </Link>
        <a className="public-button public-button--secondary" href={`mailto:${contactDetails.email}`}>
          Email Stephanie
        </a>
      </div>
    </section>
  );
}
