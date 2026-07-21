import type { Metadata } from "next";

import { ContactCta } from "@/ui/public/contact-cta";
import { testimonials } from "@/ui/public/public-content";
import { PublicShell } from "@/ui/public/public-shell";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read public client feedback for Burgess Attorneys in Kuils River, Cape Town."
};

export default function TestimonialsPage() {
  return (
    <PublicShell>
      <main className="public-main public-main--narrow" aria-labelledby="testimonials-title">
        <section className="page-hero">
          <p className="public-eyebrow">What do our clients say</p>
          <h1 id="testimonials-title">In Our Testimonials</h1>
          <p>
            Public client feedback gives a sense of the firm&apos;s commitment to personal service.
            Each legal matter remains dependent on its own facts and no outcome is guaranteed.
          </p>
        </section>

        <section className="testimonial-section testimonial-section--list" aria-label="Public testimonials">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.author}>
              <p>{testimonial.quote}</p>
              <cite>{testimonial.author}</cite>
            </blockquote>
          ))}
        </section>

        <ContactCta />
      </main>
    </PublicShell>
  );
}
