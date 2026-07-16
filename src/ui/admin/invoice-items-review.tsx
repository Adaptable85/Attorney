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

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

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
  query,
  writesEnabled,
  databaseAvailable,
  saved,
  error
}: Readonly<{
  billingItems: readonly BillingItemTemplateListItem[];
  query?: string;
  writesEnabled: boolean;
  databaseAvailable: boolean;
  saved: boolean;
  error?: string;
}>) {
  const disabled = !writesEnabled || !databaseAvailable;
  const searchQuery = query?.trim() ?? "";
  const normalizedQuery = searchQuery.toLowerCase();
  const visibleBillingItems = normalizedQuery
    ? billingItems.filter((item) =>
        [
          item.label,
          item.description,
          item.category,
          item.vatTreatment,
          item.status,
          String(item.amountCents)
        ].some((value) => value.toLowerCase().includes(normalizedQuery))
      )
    : billingItems;

  return (
    <section className="client-review" aria-labelledby="invoice-items-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Reusable billing building blocks</p>
          <h1 id="invoice-items-title">Invoice Items</h1>
          <p>
            Load and edit reusable staging billing items for later draft invoice
            preparation inside matters. These are not official invoices.
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
          <span>Showing</span>
          <strong>{visibleBillingItems.length}</strong>
        </article>
        <article>
          <span>Search</span>
          <strong>{searchQuery ? "Active" : "Ready"}</strong>
        </article>
      </div>

      <section className="client-review-card practice-panel" aria-labelledby="invoice-items-filter-title">
        <div className="client-list-toolbar practice-toolbar">
          <div>
            <h2 id="invoice-items-filter-title">Item filters</h2>
            <p>Search reusable invoice items by label, category, amount or VAT treatment.</p>
          </div>
          {disabled ? (
            <span className="practice-action" aria-disabled="true">
              Add Invoice Item disabled
            </span>
          ) : (
            <a className="practice-action practice-action--primary" href="#add-invoice-item">
              Add Invoice Item
            </a>
          )}
        </div>
        <form className="client-search-form practice-filter-bar" action="/admin/invoice-items" role="search">
          <label>
            Search invoice items
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Consultation, drafting, disbursement, 85000"
            />
          </label>
          <button type="submit">Search</button>
          {searchQuery ? (
            <a className="practice-action" href="/admin/invoice-items">
              Clear
            </a>
          ) : null}
          <span className="practice-filter-note">
            Reusable templates appear in matter billing dropdowns.
          </span>
        </form>
      </section>

      <section
        className="client-file-table practice-table practice-table--invoice-items"
        role="table"
        aria-label="Invoice item register"
      >
        <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Category</span>
          <span role="columnheader">Description</span>
          <span role="columnheader">Amount</span>
          <span role="columnheader">VAT</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Updated</span>
          <span role="columnheader">Actions</span>
        </div>
        {visibleBillingItems.map((item) => (
          <div key={item.id} className="client-file-table__row practice-table__row" role="row">
            <span role="cell">
              <strong>{item.label}</strong>
              <small>{item.amountCents} cents</small>
            </span>
            <span role="cell">{formatBillingCategory(item.category)}</span>
            <span role="cell">{item.description}</span>
            <span role="cell">{formatRandFromCents(item.amountCents)}</span>
            <span role="cell">{formatVatTreatment(item.vatTreatment)}</span>
            <span role="cell"><span className="practice-status">{item.status}</span></span>
            <span role="cell">{formatDate(item.updatedAt)}</span>
            <span role="cell" className="client-file-actions">
              {disabled ? (
                <span aria-disabled="true">Edit disabled</span>
              ) : (
                <a href={`#edit-${item.id}`}>Edit</a>
              )}
            </span>
          </div>
        ))}
      </section>

      {billingItems.length === 0 ? (
        <article className="client-review-card">
          <h2>No billing items saved yet</h2>
          <p>Add consultation, drafting, correspondence, perusal, filing or admin-fee templates for staging tests.</p>
        </article>
      ) : null}
      {billingItems.length > 0 && visibleBillingItems.length === 0 ? (
        <article className="client-review-card">
          <h2>No invoice items match this search</h2>
          <p>Clear the filter to return to the full reusable item list.</p>
        </article>
      ) : null}

      <article className="client-review-card invoice-item-panel" id="add-invoice-item" aria-labelledby="new-billing-item-title">
        <div className="read-card__title-row">
          <h2 id="new-billing-item-title">Add Invoice Item</h2>
          <span>{disabled ? "Unavailable" : "Ready"}</span>
        </div>
        <form className="compact-admin-form" action="/admin/invoice-items/create" method="post">
          <BillingItemFields disabled={disabled} />
          <button type="submit" disabled={disabled}>
            Save Billing Item
          </button>
        </form>
      </article>

      <section className="invoice-item-edit-list" aria-label="Edit invoice items">
        {visibleBillingItems.map((item) => (
          <article key={item.id} id={`edit-${item.id}`} className="client-review-card invoice-item-panel">
            <div className="read-card__title-row">
              <h2>Edit {item.label}</h2>
              <a className="read-card__link" href="#invoice-items-title">Back to list</a>
            </div>
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
    </section>
  );
}
