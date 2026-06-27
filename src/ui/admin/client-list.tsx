import Link from "next/link";

import {
  clientFutureWorkflowSteps,
  clientReviewPrompts,
  type DemoClientReviewRecord
} from "./clients-review-data";

export function ClientList({ clients }: Readonly<{ clients: readonly DemoClientReviewRecord[] }>) {
  return (
    <section className="client-review" aria-labelledby="clients-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Read-only structure review</p>
          <h1 id="clients-title">Clients Review</h1>
          <p>
            Review the proposed Burgess client record structure before live client
            data, client creation or write access is enabled.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Demo data only.</strong>
        <span>Do not enter real client data.</span>
        <span>Create, edit, delete and archive actions are disabled.</span>
        <span>Client write paths are not enabled.</span>
      </div>

      <div className="client-review__summary" aria-label="Clients review summary">
        <article>
          <span>Demo clients</span>
          <strong>{clients.length}</strong>
        </article>
        <article>
          <span>Open demo matters</span>
          <strong>{clients.reduce((total, client) => total + client.openMatterCount, 0)}</strong>
        </article>
        <article>
          <span>Write access</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <div className="client-review__grid">
        {clients.map((client) => (
          <article key={client.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{client.displayName}</h2>
              <span>Demo only</span>
            </div>
            <p>{client.relationshipNote}</p>
            <dl>
              <div>
                <dt>Client type</dt>
                <dd>{client.clientType}</dd>
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
                <dt>Matter count</dt>
                <dd>{client.matterCount}</dd>
              </div>
              <div>
                <dt>Active/open matter count</dt>
                <dd>{client.openMatterCount}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{client.status}</dd>
              </div>
              <div>
                <dt>Responsible internal person</dt>
                <dd>{client.responsiblePersonPlaceholder}</dd>
              </div>
              <div>
                <dt>Last activity/review note</dt>
                <dd>{client.lastActivityNote}</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/clients/${client.slug}`}>
              Review demo client
            </Link>
          </article>
        ))}
      </div>

      <section className="client-review-card" aria-labelledby="client-review-prompts-title">
        <h2 id="client-review-prompts-title">Questions for Stephanie</h2>
        <ol className="client-review-list">
          {clientReviewPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
      </section>

      <section className="client-review-card" aria-labelledby="client-future-workflow-title">
        <h2 id="client-future-workflow-title">Future client workflow</h2>
        <p>
          This workflow is not live yet. No write path is enabled in this phase.
        </p>
        <ol className="client-review-list client-review-list--steps">
          {clientFutureWorkflowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </section>
  );
}
