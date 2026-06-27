import Link from "next/link";

import {
  disabledDocumentFutureActions,
  type DemoDocumentReviewRecord
} from "./documents-review-data";

export function DocumentDetailPreview({
  document
}: Readonly<{ document: DemoDocumentReviewRecord }>) {
  return (
    <section className="client-review" aria-labelledby="document-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo document preview</p>
          <h1 id="document-detail-title">{document.name}</h1>
          <p>
            Read-only preview of proposed private document metadata. No upload,
            download, file storage or document write path is enabled.
          </p>
        </div>
        <span>Demo only</span>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Document metadata</h2>
          <dl>
            <div>
              <dt>Category</dt>
              <dd>{document.category}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{document.status}</dd>
            </div>
            <div>
              <dt>Linked client</dt>
              <dd>
                <Link href={`/admin/clients/${document.linkedClientSlug}`}>
                  {document.linkedClient}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Linked matter</dt>
              <dd>
                <Link href={`/admin/matters/${document.linkedMatterSlug}`}>
                  {document.linkedMatter}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Last reviewed</dt>
              <dd>{document.lastReviewedPlaceholder}</dd>
            </div>
            <div>
              <dt>Required/optional</dt>
              <dd>{document.requiredFlag}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Storage and confidentiality</h2>
          <dl>
            <div>
              <dt>Metadata summary</dt>
              <dd>{document.metadataSummary}</dd>
            </div>
            <div>
              <dt>Confidentiality note</dt>
              <dd>{document.confidentialityMarker}</dd>
            </div>
            <div>
              <dt>Storage boundary</dt>
              <dd>{document.storageBoundary}</dd>
            </div>
            <div>
              <dt>Audit/review note</dt>
              <dd>{document.auditReviewNote}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="client-review-card">
        <h2>Future actions disabled</h2>
        <ul className="client-disabled-actions">
          {disabledDocumentFutureActions.map((action) => (
            <li key={action} data-disabled="true">
              {action}
            </li>
          ))}
        </ul>
        <p className="client-review-note">
          These labels are review prompts only. No upload, replace, download, link,
          review, archive or audit-history action is available in this phase.
        </p>
      </article>

      <Link className="read-card__link" href="/admin/documents">
        Back to Documents Review
      </Link>
    </section>
  );
}
