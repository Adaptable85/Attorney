import Link from "next/link";

import type { ClientFileListItem } from "@/server/staging-client-files";
import { demoInvoiceItemTemplates, formatPlaceholderRand } from "./invoice-items-review-data";

export function LiveClientFileDetail({
  client
}: Readonly<{
  client: ClientFileListItem;
}>) {
  return (
    <section className="client-review" aria-labelledby="client-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging client file</p>
          <h1 id="client-detail-title">{client.displayName}</h1>
          <p>
            This client file is saved in the Railway staging database. Only the
            client record and primary contact are live in this phase.
          </p>
        </div>
        <span>Staging test file</span>
      </div>

      <div className="client-file-tabs" aria-label="Client file sections">
        {["Overview", "Matters", "Documents", "Notes / Voice Notes", "Billing Items", "Invoices", "Statements", "Audit"].map(
          (tab) => (
            <span key={tab}>{tab}</span>
          )
        )}
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Overview</h2>
          <dl>
            <div>
              <dt>Account/reference number</dt>
              <dd>{client.accountNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{client.status}</dd>
            </div>
            <div>
              <dt>Primary contact</dt>
              <dd>{client.primaryContactName ?? "No contact saved"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{client.primaryContactEmail ?? "No email saved"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{client.primaryContactPhone ?? "No phone saved"}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{client.updatedAt.toISOString().slice(0, 10)}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Staging boundaries</h2>
          <ul className="client-disabled-actions">
            <li data-disabled="true">Matter creation unavailable</li>
            <li data-disabled="true">Document upload unavailable</li>
            <li data-disabled="true">LLM note processing unavailable</li>
            <li data-disabled="true">Invoice approval unavailable</li>
            <li data-disabled="true">Statement sending unavailable</li>
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Documents</h2>
          <p>
            Uploads are not active. Future document names should use the guided
            pattern Client_Matter_DocumentType_Date.
          </p>
        </article>

        <article className="client-review-card">
          <h2>Notes / Voice Notes</h2>
          <p>
            Opening notes are recorded as staging timeline context only. Voice
            note upload, transcription and LLM processing are not active.
          </p>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Reusable Billing Items</h2>
          <ul className="client-review-list">
            {demoInvoiceItemTemplates.slice(0, 3).map((item) => (
              <li key={item.slug}>
                <strong>{item.label}</strong>
                <span>{item.category}</span>
                <p>{formatPlaceholderRand(item.amountCentsPlaceholder)} - {item.vatTreatment}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="client-review-card">
          <h2>Invoices / Statements</h2>
          <p>
            Draft invoices and statements remain inactive. No official invoice
            number can be assigned and nothing can be sent from this client file.
          </p>
        </article>
      </div>

      <Link className="read-card__link" href="/admin/clients">
        Back to Client Files
      </Link>
    </section>
  );
}
