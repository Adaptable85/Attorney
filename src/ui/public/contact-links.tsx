import type { ReactNode } from "react";

import { contactDetails } from "./public-content";

function ContactIcon({ type }: Readonly<{ type: "email" | "call" | "whatsapp" }>) {
  if (type === "email") {
    return (
      <svg aria-hidden="true" className="contact-icon" focusable="false" viewBox="0 0 24 24">
        <path d="M4.75 6.75h14.5v10.5H4.75z" />
        <path d="m5.25 7.25 6.75 5.5 6.75-5.5" />
      </svg>
    );
  }

  if (type === "call") {
    return (
      <svg aria-hidden="true" className="contact-icon" focusable="false" viewBox="0 0 24 24">
        <path d="M8.2 5.25 10 9.1l-1.45 1.35c.7 1.45 1.85 2.6 3.25 3.35L13.2 12.4l3.7 1.75-.65 3.35c-.12.65-.7 1.1-1.35 1.05-5.15-.42-9.05-4.32-9.45-9.45-.05-.67.4-1.25 1.05-1.38z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="contact-icon" focusable="false" viewBox="0 0 24 24">
      <path d="M12 4.75a7.28 7.28 0 0 0-6.2 11.1l-.85 3.2 3.25-.82A7.3 7.3 0 1 0 12 4.75Z" />
      <path d="M9.35 8.45c-.18-.42-.35-.43-.52-.43h-.45c-.15 0-.4.06-.62.3-.2.24-.82.8-.82 1.95s.85 2.27.97 2.42c.12.16 1.65 2.62 4.08 3.56 2.02.78 2.43.62 2.87.58.43-.04 1.4-.57 1.6-1.12.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28l-1.38-.68c-.2-.08-.37-.12-.52.12-.15.23-.6.72-.73.87-.13.16-.27.18-.5.06-.23-.12-.98-.36-1.86-1.14-.68-.6-1.15-1.36-1.28-1.58-.13-.24-.02-.36.1-.48.1-.1.23-.27.35-.4.12-.14.16-.24.24-.4.08-.15.04-.3-.02-.42z" />
    </svg>
  );
}

export function EmailLink({
  children,
  className,
  icon = true
}: Readonly<{ children?: ReactNode; className?: string; icon?: boolean }>) {
  return (
    <a className={className} href={`mailto:${contactDetails.email}`}>
      {icon ? <ContactIcon type="email" /> : null}
      {children ?? contactDetails.email}
    </a>
  );
}

export function PhoneActions({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <span className={compact ? "contact-actions contact-actions--compact" : "contact-actions"}>
      <a aria-label={`Call ${contactDetails.phone}`} href={contactDetails.phoneHref}>
        <ContactIcon type="call" />
        <span>Call</span>
      </a>
      <a href={contactDetails.whatsappHref} rel="noopener noreferrer" target="_blank">
        <ContactIcon type="whatsapp" />
        <span>WhatsApp</span>
      </a>
    </span>
  );
}
