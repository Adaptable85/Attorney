import type { BillingItemTemplateListItem } from "@/server/staging-billing-items";
import {
  formatBillingCategory,
  formatRandFromCents,
  formatVatTreatment
} from "@/server/staging-billing-items";

const billingCategories = [
  "TIME",
  "FOLIO",
  "PAGE",
  "FIXED_TARIFF",
  "DISBURSEMENT",
  "ADJUSTMENT",
  "CORRECTION"
] as const;

const vatTreatments = ["VAT_ON_FEES", "NO_VAT", "VAT_EXEMPT", "CUSTOM"] as const;

function BillingItemFields({
  disabled,
  item
}: Readonly<{
  disabled: boolean;
  item?: BillingItemTemplateListItem;
}>) {
  return (
    <>
      <label>
        <span className="admin-form-field__label">Item label</span>
        <span className="admin-form-field__help">Short reusable billing item name shown in lists.</span>
        <input name="label" defaultValue={item?.label ?? ""} required disabled={disabled} />
      </label>
      <label>
        <span className="admin-form-field__label">Category</span>
        <span className="admin-form-field__help">Choose how this reusable item should be grouped.</span>
        <select name="category" defaultValue={item?.category ?? "TIME"} disabled={disabled}>
          {billingCategories.map((category) => (
            <option key={category} value={category}>
              {formatBillingCategory(category)}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-form-field--wide">
        <span className="admin-form-field__label">Description</span>
        <span className="admin-form-field__help">Explain when this billing item should be used.</span>
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={3}
          required
          disabled={disabled}
        />
      </label>
      <label>
        <span className="admin-form-field__label">Amount cents</span>
        <span className="admin-form-field__help">Store money as integer cents, for example 85000 for R 850.00.</span>
        <input
          name="amountCents"
          type="number"
          min="0"
          step="1"
          defaultValue={item?.amountCents ?? 0}
          required
          disabled={disabled}
        />
      </label>
      <label>
        <span className="admin-form-field__label">VAT treatment</span>
        <span className="admin-form-field__help">Select the default VAT handling for this reusable item.</span>
        <select name="vatTreatment" defaultValue={item?.vatTreatment ?? "VAT_ON_FEES"} disabled={disabled}>
          {vatTreatments.map((treatment) => (
            <option key={treatment} value={treatment}>
              {formatVatTreatment(treatment)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="admin-form-field__label">Status</span>
        <span className="admin-form-field__help">Archive only when this template should no longer be suggested.</span>
        <select name="status" defaultValue={item?.status ?? "ACTIVE"} disabled={disabled}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </label>
    </>
  );
}

export function InvoiceItemsReview({
  billingItems,
  writesEnabled,
  databaseAvailable,
  saved,
  error
}: Readonly<{
  billingItems: readonly BillingItemTemplateListItem[];
  writesEnabled: boolean;
  databaseAvailable: boolean;
  saved: boolean;
  error?: string;
}>) {
  const disabled = !writesEnabled || !databaseAvailable;

  return (
    <section className="client-review" aria-labelledby="invoice-items-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Reusable billing building blocks</p>
          <h1 id="invoice-items-title">Invoice Items</h1>
          <p>
            Load and edit reusable staging billing items for later draft invoice
            preparation inside client files. These are not official invoices.
          </p>
        </div>
        <span>{writesEnabled ? "Staging edit enabled" : "Edit gate off"}</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Staging billing templates only.</strong>
        <span>No invoice can be approved.</span>
        <span>No invoice number can be assigned.</span>
        <span>No statement can be sent.</span>
      </div>

      {saved ? (
        <div className="client-success-banner" role="status">
          Reusable billing item saved.
        </div>
      ) : null}
      {error ? (
        <div className="client-safety-banner" role="alert">
          <strong>Billing item not saved.</strong>
          <span>{error}</span>
        </div>
      ) : null}
      {!databaseAvailable ? (
        <div className="client-safety-banner" role="alert">
          <strong>Database unavailable.</strong>
          <span>Billing items cannot be loaded until DATABASE_URL is configured.</span>
        </div>
      ) : null}
      {!writesEnabled ? (
        <div className="client-safety-banner" role="note">
          <strong>Edit gate off.</strong>
          <span>Set BURGESS_STAGING_BILLING_ITEMS_ENABLED=true to edit reusable billing items.</span>
        </div>
      ) : null}

      <div className="client-review__summary" aria-label="Invoice item summary">
        <article>
          <span>Reusable items</span>
          <strong>{billingItems.length}</strong>
        </article>
        <article>
          <span>Amount storage</span>
          <strong>Cents</strong>
        </article>
        <article>
          <span>Invoice approval</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <article className="client-review-card" aria-labelledby="new-billing-item-title">
        <h2 id="new-billing-item-title">Add billing item</h2>
        <form className="compact-admin-form" action="/admin/invoice-items/create" method="post">
          <BillingItemFields disabled={disabled} />
          <button type="submit" disabled={disabled}>
            Save Billing Item
          </button>
        </form>
      </article>

      <section className="client-review__grid" aria-label="Reusable billing item list">
        {billingItems.map((item) => (
          <article key={item.id} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{item.label}</h2>
              <span>{item.status}</span>
            </div>
            <p>{item.description}</p>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{formatBillingCategory(item.category)}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{formatRandFromCents(item.amountCents)}</dd>
              </div>
              <div>
                <dt>Stored as</dt>
                <dd>{item.amountCents} cents</dd>
              </div>
              <div>
                <dt>VAT treatment</dt>
                <dd>{formatVatTreatment(item.vatTreatment)}</dd>
              </div>
            </dl>
            <form
              className="compact-admin-form"
              action={`/admin/invoice-items/${item.id}/update`}
              method="post"
              aria-label={`Edit ${item.label}`}
            >
              <BillingItemFields disabled={disabled} item={item} />
              <button type="submit" disabled={disabled}>
                Update Billing Item
              </button>
            </form>
          </article>
        ))}
      </section>
      {billingItems.length === 0 ? (
        <article className="client-review-card">
          <h2>No billing items saved yet</h2>
          <p>Add consultation, drafting, correspondence, perusal, filing or admin-fee templates for staging tests.</p>
        </article>
      ) : null}
    </section>
  );
}
