import Link from "next/link";

import { ContactCta } from "@/ui/public/contact-cta";
import { serviceGroups, stephanieProfile, testimonial } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";
import { ServiceCard } from "@/ui/public/service-card";

export default function Home() {
  return (
    <PublicShell>
      <main className="public-main" aria-labelledby="home-title">
        <section className="public-hero">
          <div className="public-hero__copy">
            <p className="public-eyebrow">Boutique legal services in Kuils River</p>
            <h1 id="home-title">Burgess Attorneys</h1>
            <p>
              Personal attention, practical legal solutions and clear support for clients in Cape
              Town and the Northern Suburbs.
            </p>
            <div className="public-hero__actions">
              <Link className="public-button public-button--primary" href="/contact">
                Contact Us
              </Link>
              <Link className="public-button public-button--secondary" href="/services">
                View Services
              </Link>
            </div>
          </div>
          <div className="public-hero__visual" aria-label="Burgess Attorneys legal services">
            <span>Litigation</span>
            <span>Family Law</span>
            <span>Commercial Law</span>
            <span>Trusts & Estates</span>
          </div>
        </section>

        <section className="public-section" aria-labelledby="home-services-title">
          <div className="public-section__header">
            <p className="public-eyebrow">How we assist</p>
            <h2 id="home-services-title">Focused legal support for individuals and businesses</h2>
            <p>
              Burgess Attorneys assists across dispute resolution, family and property matters,
              commercial legal work, insolvency and selected claims.
            </p>
          </div>
          <div className="service-grid">
            {serviceGroups.slice(0, 3).map((group) => (
              <ServiceCard key={group.title} group={group} />
            ))}
          </div>
        </section>

        <section className="public-split" aria-labelledby="home-about-title">
          <div>
            <p className="public-eyebrow">About the firm</p>
            <h2 id="home-about-title">A boutique firm with personal attention</h2>
            <p>
              Burgess Attorneys Inc provides timely, reliable legal service focused on each
              client&apos;s needs and instructions. The firm combines traditional professional
              values with practical, modern support.
            </p>
            <Link className="public-text-link" href="/about">
              Learn more about the firm
            </Link>
          </div>
          <aside className="profile-highlight" aria-labelledby="home-profile-title">
            <p className="public-eyebrow">Our Team</p>
            <h2 id="home-profile-title">{stephanieProfile.name}</h2>
            <p>{stephanieProfile.title}</p>
            <ul>
              {stephanieProfile.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="testimonial-section" aria-labelledby="home-testimonial-title">
          <p className="public-eyebrow">Client feedback</p>
          <h2 id="home-testimonial-title">Trusted support when it matters</h2>
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
