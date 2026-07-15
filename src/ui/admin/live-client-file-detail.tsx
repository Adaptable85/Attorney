import Link from "next/link";

import type { BillingItemTemplateListItem } from "@/server/staging-billing-items";
import {
  formatBillingCategory,
  formatRandFromCents,
  formatVatTreatment
} from "@/server/staging-billing-items";
import type { ClientDocumentListItem } from "@/server/staging-documents";
import { suggestDocumentFilename } from "@/server/staging-documents";
import type { ClientFileListItem } from "@/server/staging-client-files";

export function LiveClientFileDetail({
  client,
  documents,
  billingItems,
  documentUploadsEnabled,
  billingItemsEnabled,
  uploaded,
  uploadError
}: Readonly<{
  client: ClientFileListItem;
  documents: readonly ClientDocumentListItem[];
  billingItems: readonly BillingItemTemplateListItem[];
  documentUploadsEnabled: boolean;
  billingItemsEnabled: boolean;
  uploaded: boolean;
  uploadError?: string;
}>) {
  const today = new Date().toISOString().slice(0, 10);
  const suggestedFilename = suggestDocumentFilename({
    clientName: client.displayName,
    documentType: "Document",
    documentDate: today
  });

  return (
    <section className="client-review" aria-labelledby="client-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging client file</p>
          <h1 id="client-detail-title">{client.displayName}</h1>
          <p>
            This client file is saved in the Railway staging database. Client
            creation, test document uploads and reusable billing templates are
            live for staging only.
          </p>
        </div>
        <span>Staging test file</span>
      </div>

      <div className="client-file-tabs" aria-label="Client file sections">
        {[
          ["#overview", "Overview"],
          ["#matters", "Matters"],
          ["#documents", "Documents"],
          ["#notes", "Notes / Voice Notes"],
          ["#billing-items", "Billing Items"],
          ["#invoices", "Invoices"],
          ["#statements", "Statements"],
          ["#audit", "Audit"]
        ].map(([href, tab]) => (
          <a key={href} href={href}>
            {tab}
          </a>
        ))}
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="overview">
          <h2>Overview</h2>
          <dl>
            <div>
              <dt>Account/reference number</dt>
              <dd>{client.accountNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{client.status}</dd>
            </div>
            <div>
              <dt>Primary contact</dt>
              <dd>{client.primaryContactName ?? "No contact saved"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{client.primaryContactEmail ?? "No email saved"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{client.primaryContactPhone ?? "No phone saved"}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{client.updatedAt.toISOString().slice(0, 10)}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Staging boundaries</h2>
          <ul className="client-disabled-actions">
            <li data-disabled="true">Matter creation unavailable</li>
            <li data-disabled={documentUploadsEnabled ? "false" : "true"}>
              {documentUploadsEnabled ? "Test document upload enabled" : "Document upload unavailable"}
            </li>
            <li data-disabled="true">LLM note processing unavailable</li>
            <li data-disabled="true">Invoice approval unavailable</li>
            <li data-disabled="true">Statement sending unavailable</li>
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="matters">
          <h2>Matters</h2>
          <p>
            Matter creation is still blocked. Future matters will sit inside this
            client file before billing or document workflows are expanded.
          </p>
        </article>

        <article className="client-review-card" id="documents">
          <h2>Documents</h2>
          <p>Use test documents only. View and download stay private to the staging admin session.</p>
          {uploaded ? (
            <div className="client-success-banner" role="status">
              Test document uploaded and added to this client file.
            </div>
          ) : null}
          {uploadError ? (
            <div className="client-safety-banner" role="alert">
              <strong>Document not uploaded.</strong>
              <span>{uploadError}</span>
            </div>
          ) : null}
          {documentUploadsEnabled ? (
            <form
              className="compact-admin-form"
              action={`/admin/clients/${client.id}/documents/upload`}
              method="post"
              encType="multipart/form-data"
              aria-label="Staging document upload form"
            >
              <input type="hidden" name="clientId" value={client.id} />
              <label>
                Document type
                <input name="documentType" placeholder="Identity document" required />
              </label>
              <label>
                Matter/reference label
                <input name="matterReference" placeholder="General" />
              </label>
              <label>
                Document date
                <input name="documentDate" type="date" defaultValue={today} required />
              </label>
              <label>
                Confirm display filename
                <input
                  name="displayFilename"
                  defaultValue={suggestedFilename}
                  aria-describedby="document-name-help"
                  required
                />
              </label>
              <p id="document-name-help" className="client-review-note">
                Suggested format: ClientName_MatterName_DocumentType_Date.
              </p>
              <label>
                Test document
                <input name="file" type="file" required />
              </label>
              <button type="submit">Upload Test Document</button>
            </form>
          ) : (
            <div className="client-safety-banner" role="note">
              <strong>Upload gate off.</strong>
              <span>Set BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED=true for staging document tests.</span>
            </div>
          )}
          {documents.length > 0 ? (
            <div className="client-file-table" role="table" aria-label="Uploaded documents">
              <div className="client-file-table__row client-file-table__row--header" role="row">
                <span role="columnheader">Filename</span>
                <span role="columnheader">Type</span>
                <span role="columnheader">Size</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Actions</span>
              </div>
              {documents.map((document) => (
                <div key={document.id} className="client-file-table__row" role="row">
                  <span role="cell">{document.filename}</span>
                  <span role="cell">{document.contentType}</span>
                  <span role="cell">{document.sizeBytes ?? 0} bytes</span>
                  <span role="cell">{document.status}</span>
                  <span role="cell" className="document-actions">
                    <Link
                      className="read-card__link"
                      href={`/admin/clients/${client.id}/documents/${document.id}/view`}
                      target="_blank"
                    >
                      View
                    </Link>
                    <Link
                      className="read-card__link"
                      href={`/admin/clients/${client.id}/documents/${document.id}/download`}
                    >
                      Download
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No test documents have been uploaded for this client file yet.</p>
          )}
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="notes">
          <h2>Notes / Voice Notes</h2>
          <p>
            Opening notes are recorded as staging timeline context only. Voice
            note upload, transcription and LLM processing are not active.
          </p>
        </article>

        <article className="client-review-card" id="billing-items">
          <div className="read-card__title-row">
            <h2>Billing Items</h2>
            <Link className="read-card__link" href="/admin/invoice-items">
              Manage list
            </Link>
          </div>
          <p>
            Reusable staging billing templates can be managed from the sidebar
            list. They do not create official invoices.
          </p>
          {billingItems.length > 0 ? (
            <ul className="client-review-list">
              {billingItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.label}</strong>
                  <span>{formatBillingCategory(item.category)}</span>
                  <p>{formatRandFromCents(item.amountCents)} - {formatVatTreatment(item.vatTreatment)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reusable billing items have been saved yet.</p>
          )}
          {!billingItemsEnabled ? (
            <div className="client-safety-banner" role="note">
              <strong>Billing item edit gate off.</strong>
              <span>Set BURGESS_STAGING_BILLING_ITEMS_ENABLED=true to edit reusable billing items.</span>
            </div>
          ) : null}
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="invoices">
          <h2>Invoices</h2>
          <p>
            Draft invoice preparation remains inactive. No official invoice
            number can be assigned and nothing can be approved or sent.
          </p>
        </article>

        <article className="client-review-card" id="statements">
          <h2>Statements</h2>
          <p>
            Statements remain inactive. No statement can be approved, generated
            for sending or sent from this client file.
          </p>
        </article>
      </div>

      <article className="client-review-card" id="audit">
        <h2>Audit</h2>
        <p>
          Client creation, test document uploads and billing template edits are
          audit logged in staging.
        </p>
      </article>

      <aside className="client-review-card billing-sidebar" aria-labelledby="billing-sidebar-title">
        <div className="read-card__title-row">
          <h2 id="billing-sidebar-title">Reusable Billing Items</h2>
          <Link className="read-card__link" href="/admin/invoice-items">
            Edit list
          </Link>
        </div>
        {billingItems.length > 0 ? (
          <ul className="client-review-list">
            {billingItems.slice(0, 5).map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span>{formatBillingCategory(item.category)}</span>
                <p>{formatRandFromCents(item.amountCents)} - {formatVatTreatment(item.vatTreatment)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No billing items saved yet. Use the manage list action to add test templates.</p>
        )}
      </aside>

      <Link className="read-card__link" href="/admin/clients">
        Back to Client Files
      </Link>
    </section>
  );
}
