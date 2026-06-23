import type { ClientListItem } from "./client-matter-read-model";

export function ClientList({ clients }: Readonly<{ clients: readonly ClientListItem[] }>) {
  return (
    <section className="read-list" aria-labelledby="clients-title">
      <div className="read-list__header">
        <div>
          <h1 id="clients-title">Clients</h1>
          <p>Read-only demo client placeholders. No create, edit or delete actions exist here.</p>
        </div>
        <span>Read-only</span>
      </div>
      <div className="read-list__grid">
        {clients.map((client) => (
          <article key={client.id} className="read-card">
            <div className="read-card__title-row">
              <h2>{client.displayName}</h2>
              <span>{client.demoLabel}</span>
            </div>
            <dl>
              <div>
                <dt>Account number</dt>
                <dd>{client.accountNumber}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{client.statusLabel}</dd>
              </div>
              <div>
                <dt>Matters</dt>
                <dd>{client.matterCountLabel}</dd>
              </div>
              <div>
                <dt>Latest statement balance</dt>
                <dd>{client.latestStatementBalancePlaceholder}</dd>
              </div>
              <div>
                <dt>Payment status</dt>
                <dd>{client.paymentStatusPlaceholder}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
