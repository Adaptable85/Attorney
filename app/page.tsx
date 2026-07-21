import Image from "next/image";
import Link from "next/link";

import { ContactCta } from "@/ui/public/contact-cta";
import { processSteps, serviceGroups, stephanieProfile, testimonial } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";
import { ServiceCard } from "@/ui/public/service-card";

export default function Home() {
  return (
    <PublicShell>
      <main className="public-main" aria-labelledby="home-title">
        <section className="public-hero">
          <div className="public-hero__copy">
            <Image
              className="public-hero__logo"
              src="/brand/burgess-logo-header.png"
              alt="Burgess Attorneys"
              width={254}
              height={182}
              priority
            />
            <p className="public-eyebrow">Welcome to Burgess Attorneys</p>
            <h1 id="home-title">How can we be of assistance?</h1>
            <p>
              Practical legal support from a boutique firm in Kuils River and the Northern Suburbs
              of Cape Town. The flow is personal and clear: understand the matter, decide on the
              next step and move forward with careful guidance.
            </p>
            <div className="public-hero__actions">
              <Link className="public-button public-button--primary" href="/contact">
                Speak to Stephanie
              </Link>
              <Link className="public-button public-button--secondary" href="/services">
                View Services
              </Link>
            </div>
          </div>
          <div className="public-hero__visual" aria-label="Burgess Attorneys legal services">
            <p className="public-eyebrow">How the firm helps</p>
            {processSteps.map((step) => (
              <article key={step.title}>
                <span>{step.title}</span>
                <p>{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process-strip" aria-label="Burgess Attorneys process">
          {processSteps.map((step) => (
            <article key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.summary}</p>
            </article>
          ))}
        </section>

        <section className="public-split" aria-labelledby="home-about-title">
          <div>
            <p className="public-eyebrow">About the firm</p>
            <h2 id="home-about-title">A short insight about Burgess Attorneys</h2>
            <p>
              Burgess Attorneys Inc was founded on 1 September 2021 after the incorporation of the
              sole proprietor Burgess Attorneys. The firm is intentionally boutique: clients are not
              treated like file numbers, and matters are approached with careful attention to the
              people, documents and decisions involved.
            </p>
            <p>
              The aim is to keep traditional values present while applying experience in a
              practical, modern and responsive way.
            </p>
            <Link className="public-text-link" href="/about">
              Learn more about the firm
            </Link>
          </div>
          <aside className="profile-highlight" aria-labelledby="home-profile-title">
            <p className="public-eyebrow">Ladies with a passion for justice</p>
            <h2 id="home-profile-title">About Stephanie</h2>
            <p>
              <strong>{stephanieProfile.name}</strong> · {stephanieProfile.title}
            </p>
            <p>
              Stephanie brings together litigation experience, insolvency knowledge and a grounded
              client-facing style shaped by her journey from Pretoria to Cape Town.
            </p>
            <ul>
              {stephanieProfile.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="public-section public-section--services" aria-labelledby="home-services-title">
          <div className="public-section__header">
            <p className="public-eyebrow">Have a look at</p>
            <h2 id="home-services-title">Our Services</h2>
            <p>
              Providing timely and reliable service that is focused and sensitive to our
              clients&apos; specific needs and instructions.
            </p>
          </div>
          <div className="service-grid">
            {serviceGroups.slice(0, 3).map((group) => (
              <ServiceCard key={group.title} group={group} />
            ))}
          </div>
        </section>

        <section className="public-flow-band" aria-labelledby="home-commitment-title">
          <p className="public-eyebrow">Your success drives our commitment</p>
          <h2 id="home-commitment-title">Information, support and practical legal direction.</h2>
          <p>
            The public website should feel calm, welcoming and easy to move through, while the
            protected admin platform remains separate for client files, matters, documents and
            billing workflows.
          </p>
          <Link className="public-button public-button--primary" href="/contact">
            Contact Us
          </Link>
        </section>

        <section className="testimonial-section" aria-labelledby="home-testimonial-title">
          <p className="public-eyebrow">What do our clients say</p>
          <h2 id="home-testimonial-title">In Our Testimonials</h2>
          <blockquote>
            <p>{testimonial.quote}</p>
            <cite>{testimonial.author}</cite>
          </blockquote>
        </section>

        <ContactCta />
      </main>
    </PublicShell>
  );
}
