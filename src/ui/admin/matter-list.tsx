import Link from "next/link";

import {
  matterFutureWorkflowSteps,
  matterReviewPrompts,
  type DemoMatterReviewRecord
} from "./matters-review-data";

export function MatterList({ matters }: Readonly<{ matters: readonly DemoMatterReviewRecord[] }>) {
  return (
    <section className="client-review" aria-labelledby="matters-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Read-only structure review</p>
          <h1 id="matters-title">Matters Review</h1>
          <p>
            Review the proposed Burgess matter structure before live matter data,
            matter creation or workflow actions are enabled.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Demo data only.</strong>
        <span>Do not enter real matter data.</span>
        <span>Create, edit, close, upload and approval actions are disabled.</span>
        <span>Matter write paths are not enabled.</span>
      </div>

      <div className="client-review__summary" aria-label="Matters review summary">
        <article>
          <span>Demo matters</span>
          <strong>{matters.length}</strong>
        </article>
        <article>
          <span>High-priority examples</span>
          <strong>{matters.filter((matter) => matter.priority === "High").length}</strong>
        </article>
        <article>
          <span>Write access</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <div className="client-review__grid">
        {matters.map((matter) => (
          <article key={matter.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{matter.title}</h2>
              <span>Demo only</span>
            </div>
            <p>{matter.reviewNote}</p>
            <dl>
              <div>
                <dt>Matter reference</dt>
                <dd>{matter.referencePlaceholder}</dd>
              </div>
              <div>
                <dt>Linked client</dt>
                <dd>{matter.linkedClient}</dd>
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
              <div>
                <dt>Document status</dt>
                <dd>{matter.documentStatus}</dd>
              </div>
              <div>
                <dt>Billing/statement context</dt>
                <dd>{matter.billingSummaryPlaceholder}</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/matters/${matter.slug}`}>
              Review demo matter
            </Link>
          </article>
        ))}
      </div>

      <section className="client-review-card" aria-labelledby="matter-review-prompts-title">
        <h2 id="matter-review-prompts-title">Questions for Stephanie</h2>
        <ol className="client-review-list">
          {matterReviewPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
      </section>

      <section className="client-review-card" aria-labelledby="matter-future-workflow-title">
        <h2 id="matter-future-workflow-title">Future matter workflow</h2>
        <p>
          This workflow is not live yet. No write path is enabled in this phase.
        </p>
        <ol className="client-review-list client-review-list--steps">
          {matterFutureWorkflowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </section>
  );
}
