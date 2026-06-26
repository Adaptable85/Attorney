import type { MatterDetailItem } from "./client-matter-read-model";

export function MatterDetail({ matter }: Readonly<{ matter: MatterDetailItem }>) {
  return (
    <section className="read-detail" aria-labelledby="matter-detail-title">
      <div className="read-list__header">
        <div>
          <h1 id="matter-detail-title">{matter.name}</h1>
          <p>{matter.description}</p>
        </div>
        <span>{matter.demoLabel}</span>
      </div>
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
      <p className="read-detail__future">{matter.futureActionsLabel}</p>
    </section>
  );
}
