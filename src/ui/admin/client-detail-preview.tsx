import Link from "next/link";

import { demoDocumentReviewRecords } from "./documents-review-data";
import {
  disabledClientFutureActions,
  type DemoClientReviewRecord
} from "./clients-review-data";

export function ClientDetailPreview({
  client
}: Readonly<{ client: DemoClientReviewRecord }>) {
  const linkedDocuments = demoDocumentReviewRecords.filter(
    (document) => document.linkedClient === client.displayName
  );

  return (
    <section className="client-review" aria-labelledby="client-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo client preview</p>
          <h1 id="client-detail-title">{client.displayName}</h1>
          <p>
            Read-only preview of the proposed client record structure. This is demo
            data only and no client write path is enabled.
          </p>
        </div>
        <span>Demo only</span>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
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

        <article className="client-review-card">
          <h2>Linked demo matters</h2>
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

      <article className="client-review-card">
        <h2>Linked demo documents</h2>
        {linkedDocuments.length > 0 ? (
          <ul className="client-review-list">
            {linkedDocuments.map((document) => (
              <li key={document.slug}>
                <strong>{document.name}</strong>
                <span>{document.status}</span>
                <p>{document.category}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No linked demo document metadata for this client preview.</p>
        )}
      </article>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Review notes</h2>
          <dl>
            <div>
              <dt>Relationship/context note</dt>
              <dd>{client.relationshipNote}</dd>
            </div>
            <div>
              <dt>Document status summary</dt>
              <dd>{client.documentStatusSummary}</dd>
            </div>
            <div>
              <dt>Billing/statement summary</dt>
              <dd>{client.billingSummaryPlaceholder}</dd>
            </div>
            <div>
              <dt>Audit/review note</dt>
              <dd>{client.auditReviewNote}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Future actions disabled</h2>
          <ul className="client-disabled-actions">
            {disabledClientFutureActions.map((action) => (
              <li key={action} data-disabled="true">
                {action}
              </li>
            ))}
          </ul>
          <p className="client-review-note">
            These labels are review prompts only. No active create, edit, archive,
            upload, statement or audit-history action is available in this phase.
          </p>
        </article>
      </div>

      <Link className="read-card__link" href="/admin/clients">
        Back to Clients Review
      </Link>
    </section>
  );
}
