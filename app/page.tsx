import Image from "next/image";
import Link from "next/link";

import { ContactCta } from "@/ui/public/contact-cta";
import {
  contactDetails,
  founderStory,
  homepageSections,
  processSteps,
  servicePathways,
  testimonial,
  trustSignals
} from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";

export default function Home() {
  return (
    <PublicShell>
      <main className="public-main public-main--premium" aria-labelledby="home-title">
        <section className="premium-hero">
          <div className="premium-hero__copy">
            <Image
              className="public-hero__logo"
              src="/brand/burgess-logo-header.png"
              alt="Burgess Attorneys"
              width={254}
              height={182}
              priority
            />
            <p className="public-eyebrow">{homepageSections.heroEyebrow}</p>
            <h1 id="home-title">{homepageSections.heroTitle}</h1>
            <p>
              Burgess Attorneys is a boutique firm for people and businesses who need clear legal
              advice, careful document work and a calm explanation of what should happen next.
            </p>
            <div className="public-hero__actions">
              <Link className="public-button public-button--primary" href="/contact">
                {homepageSections.heroCta}
              </Link>
              <Link className="public-button public-button--secondary" href="/services">
                {homepageSections.serviceCta}
              </Link>
            </div>
          </div>
          <aside className="premium-hero__panel" aria-label="Burgess Attorneys client pathway">
            <p className="public-eyebrow">How the firm works</p>
            <h2>Personal attention before legal action.</h2>
            <div className="premium-hero__steps">
              {processSteps.map((step, index) => (
                <article key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="intent-strip" aria-labelledby="client-intent-title">
          <div className="public-section__header">
            <p className="public-eyebrow">Start with the right path</p>
            <h2 id="client-intent-title">{homepageSections.intentTitle}</h2>
            <p>
              Choose the closest starting point. The first conversation can then confirm whether
              Burgess Attorneys is able to assist with your specific facts and documents.
            </p>
          </div>
          <div className="pathway-grid">
            {servicePathways.map((pathway) => (
              <article className="pathway-card" key={pathway.title}>
                <p>{pathway.audience}</p>
                <h3>{pathway.title}</h3>
                <span>{pathway.summary}</span>
                <ul>
                  {pathway.services.slice(0, 4).map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                <Link href="/contact">{pathway.ctaLabel}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="founder-feature" aria-labelledby="founder-title">
          <div className="founder-feature__portrait" aria-hidden="true">
            <span>SB</span>
          </div>
          <div className="founder-feature__copy">
            <p className="public-eyebrow">About Stephanie</p>
            <h2 id="founder-title">{homepageSections.founderTitle}</h2>
            <p>{founderStory.summary}</p>
            <p>{founderStory.philosophy}</p>
            <ul>
              {founderStory.credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
            <Link className="public-text-link" href="/team">
              Meet Stephanie
            </Link>
          </div>
        </section>

        <section className="trust-band" aria-labelledby="trust-title">
          <div>
            <p className="public-eyebrow">Trust signals</p>
            <h2 id="trust-title">{homepageSections.trustTitle}</h2>
          </div>
          <div className="trust-grid">
            {trustSignals.map((signal) => (
              <article key={signal.label}>
                <h3>{signal.label}</h3>
                <p>{signal.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonial-section testimonial-section--premium" aria-labelledby="home-testimonial-title">
          <p className="public-eyebrow">What do our clients say</p>
          <h2 id="home-testimonial-title">Client words, responsibly presented.</h2>
          <blockquote>
            <p>{testimonial.quote}</p>
            <cite>{testimonial.author}</cite>
          </blockquote>
        </section>

        <section className="contact-ribbon" aria-labelledby="home-contact-title">
          <div>
            <p className="public-eyebrow">Direct contact</p>
            <h2 id="home-contact-title">{homepageSections.contactTitle}</h2>
            <p>
              Initial contact should be used to arrange the appropriate next step. Please do not
              send urgent or sensitive detail before the firm confirms how it can assist.
            </p>
          </div>
          <address>
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a>
            <span>{contactDetails.address}</span>
          </address>
        </section>

        <ContactCta title="Legal representation at your finger tips" />
      </main>
    </PublicShell>
  );
}
