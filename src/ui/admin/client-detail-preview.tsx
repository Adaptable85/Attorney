import Link from "next/link";

import {
  disabledClientFutureActions,
  type DemoClientReviewRecord
} from "./clients-review-data";
import { demoInvoiceItemTemplates, formatPlaceholderRand } from "./invoice-items-review-data";

export function ClientDetailPreview({
  client
}: Readonly<{ client: DemoClientReviewRecord }>) {
  return (
    <section className="client-review" aria-labelledby="client-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo client file</p>
          <h1 id="client-detail-title">{client.displayName}</h1>
          <p>
            Read-only preview of a single client file. Client-level documents,
            matter list, reusable billing templates, client statement and audit
            history are shown here as demo structure only. Matter notes,
            voice-note summaries and draft invoices belong inside each matter.
          </p>
        </div>
        <span>Client file first</span>
      </div>

      <div className="client-file-tabs" aria-label="Client file sections">
        {["Overview", "Matters", "Client General Documents", "Billing Item Library", "Client Statement", "Audit"].map(
          (tab) => (
            <span key={tab}>{tab}</span>
          )
        )}
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" aria-labelledby="client-overview-title">
          <h2 id="client-overview-title">Overview</h2>
          <p>
            One file holds the client relationship, matter history, document
            register, billing draft context and audit trail.
          </p>
          <h2>Client details</h2>
          <dl>
            <div>
              <dt>Client type</dt>
              <dd>{client.clientType}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{client.status}</dd>
            </div>
            <div>
              <dt>Contact person</dt>
              <dd>{client.contactPerson}</dd>
            </div>
            <div>
              <dt>Email placeholder</dt>
              <dd>{client.emailPlaceholder}</dd>
            </div>
            <div>
              <dt>Phone placeholder</dt>
              <dd>{client.phonePlaceholder}</dd>
            </div>
            <div>
              <dt>Responsible internal person</dt>
              <dd>{client.responsiblePersonPlaceholder}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card" aria-labelledby="client-matters-title">
          <h2 id="client-matters-title">Matters inside this file</h2>
          <p>
            Open a matter to work with its matter-specific documents, notes,
            voice-note summaries, draft billing lines and draft invoices.
          </p>
          <ul className="client-review-list">
            {client.linkedMatters.map((matter) => (
              <li key={matter.name}>
                <strong>{matter.name}</strong>
                <span>{matter.status}</span>
                <p>{matter.context}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" aria-labelledby="client-documents-title">
          <h2 id="client-documents-title">Client General Documents</h2>
          <p>
            Use this area for general client documents such as ID, proof of
            address, FICA, mandates and general correspondence. Matter-specific
            documents belong inside the relevant matter.
          </p>
          <ul className="client-review-list">
            {client.fileDocuments.map((document) => (
              <li key={document.suggestedFilename}>
                <strong>{document.name}</strong>
                <span>{document.status}</span>
                <p>{document.category} linked to {document.matterName}</p>
                <code>{document.suggestedFilename}</code>
              </li>
            ))}
          </ul>
        </article>

        <article className="client-review-card" aria-labelledby="client-billing-items-title">
          <h2 id="client-billing-items-title">Billing Item Library</h2>
          <p>
            These reusable billing examples are shared building blocks. Matter
            draft invoice lines are created inside each matter.
          </p>
          <ul className="client-review-list">
            {client.billingDrafts.map((draft) => (
              <li key={draft.title}>
                <strong>{draft.title}</strong>
                <span>{draft.status}</span>
                <p>Source: {draft.sourceNote}</p>
                <p>{draft.amountPlaceholder} - {draft.approvalState}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="client-review-card" aria-labelledby="client-invoice-library-title">
          <h2 id="client-invoice-library-title">Reusable Invoice Items</h2>
          <p>
            These are shared billing building blocks. Amounts are represented as
            cents and VAT remains configurable.
          </p>
          <ul className="client-review-list">
            {demoInvoiceItemTemplates.slice(0, 4).map((item) => (
              <li key={item.slug}>
                <strong>{item.label}</strong>
                <span>{item.category}</span>
                <p>{formatPlaceholderRand(item.amountCentsPlaceholder)} - {item.vatTreatment}</p>
              </li>
            ))}
          </ul>
          <Link className="read-card__link" href="/admin/invoice-items">
            Review invoice item library
          </Link>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" aria-labelledby="client-statements-title">
          <h2 id="client-statements-title">Client Statement</h2>
          <p>
            Draft matter invoices pull through here for client-level statement
            review. No statement can be sent from this preview.
          </p>
          <ul className="client-review-list">
            {client.statementDrafts.map((statement) => (
              <li key={statement.title}>
                <strong>{statement.title}</strong>
                <span>{statement.status}</span>
                <p>{statement.summary}</p>
                <p>{statement.approvalState}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" aria-labelledby="client-audit-title">
          <h2 id="client-audit-title">Audit History</h2>
          <ul className="client-review-list">
            {client.auditItems.map((item) => (
              <li key={`${item.event}-${item.actor}`}>
                <strong>{item.event}</strong>
                <span>{item.actor}</span>
                <p>{item.result}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="client-review-card" aria-labelledby="client-disabled-title">
          <h2 id="client-disabled-title">Future actions disabled</h2>
          <ul className="client-disabled-actions">
            {disabledClientFutureActions.map((action) => (
              <li key={action} data-disabled="true">
                {action}
              </li>
            ))}
          </ul>
          <p className="client-review-note">
            These labels are review prompts only. No active create, edit,
            archive, save, upload, approval, invoice send, statement send,
            Lexpro sync or LLM call is available in this phase.
          </p>
        </article>
      </div>

      <Link className="read-card__link" href="/admin/clients">
        Back to Client Files
      </Link>
    </section>
  );
}
