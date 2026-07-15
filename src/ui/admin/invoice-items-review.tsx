import {
  demoInvoiceItemTemplates,
  disabledInvoiceItemActions,
  formatPlaceholderRand
} from "./invoice-items-review-data";

export function InvoiceItemsReview() {
  return (
    <section className="client-review" aria-labelledby="invoice-items-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Reusable billing building blocks</p>
          <h1 id="invoice-items-title">Invoice Items Review</h1>
          <p>
            Review reusable billing item labels that can later help build draft
            invoices inside a client file. These are template placeholders only.
          </p>
        </div>
        <span>Draft library only</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Demo only.</strong>
        <span>No invoice item can be created or edited.</span>
        <span>No official invoice number can be assigned.</span>
        <span>Owner/principal approval remains mandatory.</span>
      </div>

      <div className="client-review__summary" aria-label="Invoice item review summary">
        <article>
          <span>Template placeholders</span>
          <strong>{demoInvoiceItemTemplates.length}</strong>
        </article>
        <article>
          <span>Amount storage rule</span>
          <strong>Cents</strong>
        </article>
        <article>
          <span>Write access</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <div className="client-review__grid">
        {demoInvoiceItemTemplates.map((item) => (
          <article key={item.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{item.label}</h2>
              <span>{item.category}</span>
            </div>
            <p>{item.description}</p>
            <dl>
              <div>
                <dt>Placeholder amount</dt>
                <dd>{formatPlaceholderRand(item.amountCentsPlaceholder)}</dd>
              </div>
              <div>
                <dt>Stored as</dt>
                <dd>{item.amountCentsPlaceholder} cents</dd>
              </div>
              <div>
                <dt>VAT treatment</dt>
                <dd>{item.vatTreatment}</dd>
              </div>
              <div>
                <dt>Typical source</dt>
                <dd>{item.typicalSource}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <article className="client-review-card">
        <h2>Future actions disabled</h2>
        <ul className="client-disabled-actions">
          {disabledInvoiceItemActions.map((action) => (
            <li key={action} data-disabled="true">
              {action}
            </li>
          ))}
        </ul>
        <p className="client-review-note">
          AI may suggest draft invoice items from client file notes later, but it
          may not approve, send, number or finalize invoices or statements.
        </p>
      </article>
    </section>
  );
}
