import Link from "next/link";

import {
  documentReviewPrompts,
  type DemoDocumentReviewRecord
} from "./documents-review-data";

export function DocumentList({
  documents
}: Readonly<{ documents: readonly DemoDocumentReviewRecord[] }>) {
  return (
    <section className="client-review" aria-labelledby="documents-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Read-only structure review</p>
          <h1 id="documents-title">Documents Review</h1>
          <p>
            Review the proposed private document metadata structure before uploads,
            downloads, storage or document write paths are enabled.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Demo metadata only.</strong>
        <span>No real upload.</span>
        <span>No real download.</span>
        <span>No real document storage.</span>
        <span>Document write paths are not enabled.</span>
      </div>

      <div className="client-review__summary" aria-label="Documents review summary">
        <article>
          <span>Demo document records</span>
          <strong>{documents.length}</strong>
        </article>
        <article>
          <span>Required examples</span>
          <strong>{documents.filter((document) => document.requiredFlag === "Required").length}</strong>
        </article>
        <article>
          <span>Storage access</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <div className="client-review__grid">
        {documents.map((document) => (
          <article key={document.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{document.name}</h2>
              <span>Demo only</span>
            </div>
            <p>{document.reviewNote}</p>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{document.category}</dd>
              </div>
              <div>
                <dt>Linked client</dt>
                <dd>{document.linkedClient}</dd>
              </div>
              <div>
                <dt>Linked matter</dt>
                <dd>{document.linkedMatter}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{document.status}</dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd>{document.lastReviewedPlaceholder}</dd>
              </div>
              <div>
                <dt>Required/optional</dt>
                <dd>{document.requiredFlag}</dd>
              </div>
              <div>
                <dt>Confidentiality marker</dt>
                <dd>{document.confidentialityMarker}</dd>
              </div>
              <div>
                <dt>Storage boundary</dt>
                <dd>{document.storageBoundary}</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/documents/${document.slug}`}>
              Review demo document
            </Link>
          </article>
        ))}
      </div>

      <section className="client-review-card" aria-labelledby="document-review-prompts-title">
        <h2 id="document-review-prompts-title">Questions for Stephanie</h2>
        <ol className="client-review-list">
          {documentReviewPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
      </section>
    </section>
  );
}
