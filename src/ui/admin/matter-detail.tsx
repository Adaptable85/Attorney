import Link from "next/link";

import {
  disabledMatterFutureActions,
  type DemoMatterReviewRecord
} from "./matters-review-data";

export function MatterDetail({ matter }: Readonly<{ matter: DemoMatterReviewRecord }>) {
  return (
    <section className="client-review" aria-labelledby="matter-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo matter preview</p>
          <h1 id="matter-detail-title">{matter.title}</h1>
          <p>
            Read-only preview of the proposed matter record structure. This is demo
            data only and no matter write path is enabled.
          </p>
        </div>
        <span>Demo only</span>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Matter details</h2>
          <dl>
            <div>
              <dt>Matter reference</dt>
              <dd>{matter.referencePlaceholder}</dd>
            </div>
            <div>
              <dt>Linked client</dt>
              <dd>
                <Link href={`/admin/clients/${matter.linkedClientSlug}`}>
                  {matter.linkedClient}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Matter type</dt>
              <dd>{matter.matterType}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{matter.status}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{matter.priority}</dd>
            </div>
            <div>
              <dt>Responsible person</dt>
              <dd>{matter.responsiblePersonPlaceholder}</dd>
            </div>
            <div>
              <dt>Opened date</dt>
              <dd>{matter.openedDatePlaceholder}</dd>
            </div>
            <div>
              <dt>Next key date</dt>
              <dd>{matter.nextKeyDatePlaceholder}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Linked document summary</h2>
          <ul className="client-review-list">
            {matter.linkedDocuments.map((document) => (
              <li key={document.name}>
                <strong>{document.name}</strong>
                <span>{document.status}</span>
                <p>{document.category}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Review notes</h2>
          <dl>
            <div>
              <dt>Document status</dt>
              <dd>{matter.documentStatus}</dd>
            </div>
            <div>
              <dt>Client communication summary</dt>
              <dd>{matter.communicationSummaryPlaceholder}</dd>
            </div>
            <div>
              <dt>Billing/statement summary</dt>
              <dd>{matter.billingSummaryPlaceholder}</dd>
            </div>
            <div>
              <dt>Audit/review note</dt>
              <dd>{matter.auditReviewNote}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Future actions disabled</h2>
          <ul className="client-disabled-actions">
            {disabledMatterFutureActions.map((action) => (
              <li key={action} data-disabled="true">
                {action}
              </li>
            ))}
          </ul>
          <p className="client-review-note">
            These labels are review prompts only. No active create, edit, close,
            upload, approval or audit-history action is available in this phase.
          </p>
        </article>
      </div>

      <Link className="read-card__link" href="/admin/matters">
        Back to Matters Review
      </Link>
    </section>
  );
}
