import Link from "next/link";

import type { MatterListItem } from "./client-matter-read-model";

export function MatterList({ matters }: Readonly<{ matters: readonly MatterListItem[] }>) {
  return (
    <section className="read-list" aria-labelledby="matters-title">
      <div className="read-list__header">
        <div>
          <h1 id="matters-title">Matters</h1>
          <p>Read-only demo matter placeholders. No edit, delete, send or approval actions exist here.</p>
        </div>
        <span>Read-only</span>
      </div>
      <div className="read-list__grid">
        {matters.map((matter) => (
          <article key={matter.id} className="read-card">
            <div className="read-card__title-row">
              <h2>{matter.name}</h2>
              <span>{matter.demoLabel}</span>
            </div>
            <p>{matter.description}</p>
            <dl>
              <div>
                <dt>Account number</dt>
                <dd>{matter.accountNumber}</dd>
              </div>
              <div>
                <dt>Client</dt>
                <dd>{matter.clientDisplayName}</dd>
              </div>
              <div>
                <dt>Matter type</dt>
                <dd>{matter.typeLabel}</dd>
              </div>
              <div>
                <dt>Matter status</dt>
                <dd>{matter.statusLabel}</dd>
              </div>
              <div>
                <dt>Next step due date</dt>
                <dd>{matter.nextStepDueDateLabel}</dd>
              </div>
              <div>
                <dt>Responsible user</dt>
                <dd>{matter.responsibleUserPlaceholder}</dd>
              </div>
              <div>
                <dt>Latest invoice status</dt>
                <dd>{matter.latestInvoiceStatusPlaceholder}</dd>
              </div>
              <div>
                <dt>Latest statement balance</dt>
                <dd>{matter.latestStatementBalancePlaceholder}</dd>
              </div>
              <div>
                <dt>Last communication</dt>
                <dd>{matter.lastCommunicationPlaceholder}</dd>
              </div>
              <div>
                <dt>Accounting status</dt>
                <dd>{matter.accountingStatusPlaceholder}</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/matters/${matter.id}`}>
              View read-only detail
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
