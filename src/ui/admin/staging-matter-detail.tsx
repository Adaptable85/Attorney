import Link from "next/link";

import type { StagingMatterListItem } from "@/server/staging-matters";

export function StagingMatterDetail({ matter }: Readonly<{ matter: StagingMatterListItem }>) {
  return (
    <section className="client-review" aria-labelledby="matter-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging matter</p>
          <h1 id="matter-detail-title">{matter.name}</h1>
          <p>
            This matter is saved in Railway staging. Editing, closing, document
            linking, billing, invoices and statements remain disabled.
          </p>
        </div>
        <span>Staging test matter</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Read-focused matter view.</strong>
        <span>No edit, close, archive, approve, send or sync action is enabled.</span>
      </div>

      <article className="client-review-card">
        <h2>Overview</h2>
        <dl>
          <div>
            <dt>Reference</dt>
            <dd>{matter.accountNumber}</dd>
          </div>
          <div>
            <dt>Client</dt>
            <dd>
              <Link href={`/admin/clients/${matter.clientId}`}>
                {matter.clientDisplayName ?? "Saved client"}
              </Link>
            </dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{matter.type}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{matter.status}</dd>
          </div>
          <div>
            <dt>Next step due date</dt>
            <dd>{matter.nextStepDueDate ? matter.nextStepDueDate.toISOString().slice(0, 10) : "Not set"}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{matter.updatedAt.toISOString().slice(0, 10)}</dd>
          </div>
        </dl>
        <p>{matter.description}</p>
      </article>

      <article className="client-review-card">
        <h2>Disabled actions</h2>
        <ul className="client-disabled-actions">
          <li data-disabled="true">Edit matter unavailable</li>
          <li data-disabled="true">Close matter unavailable</li>
          <li data-disabled="true">Archive matter unavailable</li>
          <li data-disabled="true">Invoice approval unavailable</li>
          <li data-disabled="true">Statement sending unavailable</li>
        </ul>
      </article>

      <Link className="read-card__link" href="/admin/matters">
        Back to Matters
      </Link>
    </section>
  );
}
