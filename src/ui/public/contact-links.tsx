import type { ReactNode } from "react";

import { contactDetails } from "./public-content";

export function EmailLink({ children, className }: Readonly<{ children?: ReactNode; className?: string }>) {
  return (
    <a className={className} href={`mailto:${contactDetails.email}`}>
      {children ?? contactDetails.email}
    </a>
  );
}

export function PhoneActions({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <span className={compact ? "contact-actions contact-actions--compact" : "contact-actions"}>
      <a href={contactDetails.phoneHref}>Call</a>
      <a href={contactDetails.whatsappHref} rel="noopener noreferrer" target="_blank">
        WhatsApp
      </a>
    </span>
  );
}
