import Link from "next/link";

import { EmailLink, PhoneActions } from "./contact-links";

export function ContactCta({
  eyebrow = "Connect With Us",
  title = "Legal representation at your finger tips"
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
        <EmailLink className="public-button public-button--secondary">
          Email Stephanie
        </EmailLink>
        <PhoneActions compact />
      </div>
    </section>
  );
}
