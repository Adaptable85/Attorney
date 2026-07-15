import Link from "next/link";

import { suggestDocumentFilename, type MatterDocumentListItem } from "@/server/staging-documents";
import {
  formatDraftInvoiceMoney,
  type StagingMatterBillingLineItem,
  type StagingMatterDraftInvoice
} from "@/server/staging-matter-invoices";
import type { StagingMatterTimelineItem } from "@/server/staging-matter-timeline";
import type { StagingMatterListItem } from "@/server/staging-matters";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatFileSize(sizeBytes: number | null): string {
  if (!sizeBytes) {
    return "Unknown";
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} bytes`;
  }

  return `${Math.round(sizeBytes / 1024)} KB`;
}

function metadataText(metadata: Record<string, unknown> | null, key: string): string | null {
  const value = metadata?.[key];

  return typeof value === "string" && value.trim() ? value : null;
}

export function StagingMatterDetail({
  matter,
  documents,
  timeline,
  billingLines,
  draftInvoices,
  documentUploadsEnabled,
  matterWritesEnabled,
  matterInvoicesEnabled,
  documentUploaded,
  documentError,
  timelineAdded,
  timelineError,
  billingLineAdded,
  billingError,
  invoiceCreated,
  invoiceError
}: Readonly<{
  matter: StagingMatterListItem;
  documents: readonly MatterDocumentListItem[];
  timeline: readonly StagingMatterTimelineItem[];
  billingLines: readonly StagingMatterBillingLineItem[];
  draftInvoices: readonly StagingMatterDraftInvoice[];
  documentUploadsEnabled: boolean;
  matterWritesEnabled: boolean;
  matterInvoicesEnabled: boolean;
  documentUploaded?: boolean;
  documentError?: string;
  timelineAdded?: boolean;
  timelineError?: string;
  billingLineAdded?: boolean;
  billingError?: string;
  invoiceCreated?: boolean;
  invoiceError?: string;
}>) {
  const today = new Date().toISOString().slice(0, 10);
  const draftUnbilledFeesCents = billingLines
    .filter((line) => line.status === "DRAFT" && line.category !== "DISBURSEMENT")
    .reduce((total, line) => total + line.totalAmountCents, 0);
  const draftDisbursementsCents = billingLines
    .filter((line) => line.status === "DRAFT" && line.category === "DISBURSEMENT")
    .reduce((total, line) => total + line.totalAmountCents, 0);
  const draftInvoiceTotalCents = draftInvoices.reduce((total, invoice) => total + invoice.totalCents, 0);
  const suggestedFilename = suggestDocumentFilename({
    clientName: matter.clientDisplayName ?? "Client",
    matterReference: matter.accountNumber,
    documentType: "Matter_Document",
    documentDate: today
  });

  return (
    <section className="client-review practice-page" aria-labelledby="matter-detail-title">
      <div className="practice-record-header">
        <div>
          <p className="review-hero__eyebrow">Matter workspace</p>
          <h1 id="matter-detail-title">{matter.name}</h1>
          <p>
            Matter {matter.accountNumber} sits inside{" "}
            {matter.clientDisplayName ?? "the saved client file"}. Documents,
            notes, billing and draft invoices are matter-specific.
          </p>
        </div>
        <span className="practice-chip">Staging test matter</span>
      </div>

      <div className="practice-summary-bar" aria-label="Matter operational summary">
        <div>
          <span>Matter ref</span>
          <strong>{matter.accountNumber}</strong>
        </div>
        <div>
          <span>Client</span>
          <strong>{matter.clientDisplayName ?? "Saved client"}</strong>
        </div>
        <div>
          <span>Type</span>
          <strong>{matter.type}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{matter.status}</strong>
        </div>
        <div>
          <span>Responsible</span>
          <strong>Staging reviewer</strong>
        </div>
        <div>
          <span>Next date</span>
          <strong>{matter.nextStepDueDate ? matter.nextStepDueDate.toISOString().slice(0, 10) : "Not set"}</strong>
        </div>
        <div>
          <span>Unbilled draft fees</span>
          <strong>{formatDraftInvoiceMoney(draftUnbilledFeesCents)}</strong>
        </div>
        <div>
          <span>Draft invoices</span>
          <strong>{formatDraftInvoiceMoney(draftInvoiceTotalCents)}</strong>
        </div>
      </div>

      <div className="practice-alert" role="note">
        <strong>Staging matter workspace.</strong>
        <span>
          Use test data only. No edit, close, archive, approve, send, LLM or sync
          action is enabled.
        </span>
      </div>

      <nav className="client-file-tabs practice-tabs" aria-label="Matter sections">
        <a href="#overview">Overview</a>
        <a href="#documents">Matter Documents</a>
        <a href="#timeline">Notes / Voice Notes</a>
        <a href="#billing">Billing</a>
        <a href="#draft-invoices">Draft Invoices</a>
        <a href="#statement-link">Statement Link</a>
        <a href="#audit">Audit</a>
      </nav>

      <article id="overview" className="client-review-card practice-panel">
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

      <article id="documents" className="client-review-card practice-panel">
        <div className="read-list__header">
          <div>
            <h2>Matter Documents</h2>
            <p>
              Use this only for documents related to this specific matter.
              Stored documents can be viewed and downloaded again from this page.
            </p>
          </div>
          <span>{documentUploadsEnabled ? "Upload enabled" : "Upload gate off"}</span>
        </div>

        {documentUploaded ? (
          <div className="client-safety-banner" role="status">
            Matter document uploaded and added to this matter.
          </div>
        ) : null}

        {documentError ? (
          <div className="client-safety-banner" role="alert">
            <strong>Document not uploaded.</strong>
            <span>{documentError}</span>
          </div>
        ) : null}

        {documentUploadsEnabled ? (
          <form
            className="compact-admin-form"
            action={`/admin/matters/${matter.id}/documents/upload`}
            method="post"
            encType="multipart/form-data"
            aria-label="Staging matter document upload form"
          >
            <input type="hidden" name="clientId" value={matter.clientId} />
            <input type="hidden" name="matterId" value={matter.id} />
            <label>
              <span className="admin-form-field__label">Document type</span>
              <span className="admin-form-field__help">Name what the file is, for example ID document, court notice or agreement.</span>
              <input name="documentType" placeholder="ID document, court notice, agreement" required />
            </label>
            <label>
              <span className="admin-form-field__label">Matter/reference label</span>
              <span className="admin-form-field__help">Keep the saved document tied to this matter reference.</span>
              <input name="matterReference" defaultValue={matter.accountNumber} required />
            </label>
            <label>
              <span className="admin-form-field__label">Document date</span>
              <span className="admin-form-field__help">Use the document date or today for staging tests.</span>
              <input name="documentDate" type="date" defaultValue={today} required />
            </label>
            <label className="admin-form-field--wide">
              <span className="admin-form-field__label">Confirm display filename</span>
              <span className="admin-form-field__help">Use the guided name format so files are easy to find later.</span>
              <input name="displayFilename" defaultValue={suggestedFilename} required />
            </label>
            <label className="admin-form-field--wide">
              <span className="admin-form-field__label">Select file</span>
              <span className="admin-form-field__help">Upload a small test file only. Real Burgess documents stay out of staging tests.</span>
              <input name="file" type="file" required />
            </label>
            <button type="submit">Upload Matter Document</button>
          </form>
        ) : (
          <div className="client-safety-banner" role="note">
            <strong>Document upload unavailable.</strong>
            <span>
              BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED=true and admin password
              access are required before matter test documents can be uploaded.
            </span>
          </div>
        )}

        {documents.length ? (
          <div className="client-file-table practice-table practice-table--documents" role="table" aria-label="Matter documents">
            <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
              <span role="columnheader">Filename</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Size</span>
              <span role="columnheader">Created</span>
              <span role="columnheader">Actions</span>
            </div>
            {documents.map((document) => (
              <div className="client-file-table__row practice-table__row" role="row" key={document.id}>
                <span role="cell">{document.filename}</span>
                <span role="cell">{document.contentType}</span>
                <span role="cell">{formatFileSize(document.sizeBytes)}</span>
                <span role="cell">{formatDate(document.createdAt)}</span>
                <span role="cell" className="client-file-actions">
                  <Link href={`/admin/matters/${matter.id}/documents/${document.id}/view`}>
                    View
                  </Link>
                  <Link href={`/admin/matters/${matter.id}/documents/${document.id}/download`}>
                    Download
                  </Link>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No test documents have been uploaded for this matter yet.</p>
        )}
      </article>

      <article id="timeline" className="client-review-card practice-panel">
        <div className="read-list__header">
          <div>
            <h2>Matter Notes / Voice Notes</h2>
            <p>
              Add dated notes, instructions or typed voice-note summaries for
              this specific matter. These are internal staging notes only and do
              not transcribe audio, call an LLM or send notifications.
            </p>
          </div>
          <span>{matterWritesEnabled ? "Matter notes enabled" : "Matter gate off"}</span>
        </div>

        {timelineAdded ? (
          <div className="client-safety-banner" role="status">
            Matter note added.
          </div>
        ) : null}

        {timelineError ? (
          <div className="client-safety-banner" role="alert">
            <strong>Matter note not saved.</strong>
            <span>{timelineError}</span>
          </div>
        ) : null}

        {matterWritesEnabled ? (
          <form
            className="compact-admin-form"
            action={`/admin/matters/${matter.id}/timeline/create`}
            method="post"
            aria-label="Staging matter notes and voice-note summary form"
          >
            <input type="hidden" name="matterId" value={matter.id} />
            <label>
              <span className="admin-form-field__label">Timeline title</span>
              <span className="admin-form-field__help">Short heading for the matter note, instruction or voice-note summary.</span>
              <input name="title" placeholder="Consultation held, notice received, draft sent" required />
            </label>
            <label>
              <span className="admin-form-field__label">Event date</span>
              <span className="admin-form-field__help">The date the event, note, instruction or voice note happened.</span>
              <input name="eventDate" type="date" defaultValue={today} required />
            </label>
            <label className="admin-form-field--wide">
              <span className="admin-form-field__label">Matter note / voice-note summary</span>
              <span className="admin-form-field__help">Type the details for this matter. Audio upload and automatic transcription are not active yet.</span>
              <textarea
                name="body"
                placeholder="Add the staging test note or summary for this matter."
                rows={4}
                required
              />
            </label>
            <button type="submit">Add Matter Note</button>
          </form>
        ) : (
          <div className="client-safety-banner" role="note">
            <strong>Matter notes unavailable.</strong>
            <span>
              BURGESS_STAGING_MATTER_WRITES_ENABLED=true and admin password
              access are required before matter timeline notes can be saved.
            </span>
          </div>
        )}

        {timeline.length ? (
          <ol className="client-timeline-list">
            {timeline.map((event) => (
              <li key={event.id}>
                <strong>{event.summary}</strong>
                <span>
                  {metadataText(event.metadata, "eventDate") ?? formatDate(event.createdAt)}
                  {" · "}
                  {event.eventType.replaceAll("_", " ").toLowerCase()}
                </span>
                {metadataText(event.metadata, "body") ? (
                  <p>{metadataText(event.metadata, "body")}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p>No matter notes or voice-note summaries have been added for this matter yet.</p>
        )}
      </article>

      <article id="billing" className="client-review-card practice-panel">
        <div className="read-list__header">
          <div>
            <h2>Billing</h2>
            <p>
              Add draft charge lines for this matter only. These lines can be
              pulled into a draft invoice, but they are not approved fees.
            </p>
          </div>
          <span>{matterInvoicesEnabled ? "Draft billing enabled" : "Invoice gate off"}</span>
        </div>

        {billingLineAdded ? (
          <div className="client-safety-banner" role="status">
            Draft billing line added to this matter.
          </div>
        ) : null}

        {billingError ? (
          <div className="client-safety-banner" role="alert">
            <strong>Billing line not saved.</strong>
            <span>{billingError}</span>
          </div>
        ) : null}

        {matterInvoicesEnabled ? (
          <form
            className="compact-admin-form"
            action={`/admin/matters/${matter.id}/billing-lines/create`}
            method="post"
            aria-label="Staging matter billing line form"
          >
            <input type="hidden" name="matterId" value={matter.id} />
            <label className="admin-form-field--wide">
              <span className="admin-form-field__label">Billing description</span>
              <span className="admin-form-field__help">Describe the work or disbursement for this matter.</span>
              <input name="description" placeholder="Consultation, drafting, filing fee" required />
            </label>
            <label>
              <span className="admin-form-field__label">Category</span>
              <span className="admin-form-field__help">Choose the billing type for this draft line.</span>
              <select name="category" defaultValue="TIME">
                <option value="TIME">Time</option>
                <option value="FOLIO">Folio</option>
                <option value="PAGE">Page</option>
                <option value="FIXED_TARIFF">Fixed tariff</option>
                <option value="DISBURSEMENT">Disbursement</option>
                <option value="ADJUSTMENT">Adjustment</option>
                <option value="CORRECTION">Correction</option>
              </select>
            </label>
            <label>
              <span className="admin-form-field__label">Quantity</span>
              <span className="admin-form-field__help">Use whole units only for staging tests.</span>
              <input name="quantity" type="number" min="1" step="1" defaultValue="1" required />
            </label>
            <label>
              <span className="admin-form-field__label">Unit amount cents</span>
              <span className="admin-form-field__help">Enter cents only. R850.00 is 85000.</span>
              <input name="unitAmountCents" type="number" min="0" step="1" placeholder="85000" required />
            </label>
            <label>
              <span className="admin-form-field__label">VAT treatment</span>
              <span className="admin-form-field__help">VAT stays draft/configurable and is not final tax advice.</span>
              <select name="vatTreatment" defaultValue="VAT_ON_FEES">
                <option value="VAT_ON_FEES">VAT on fees</option>
                <option value="NO_VAT">No VAT</option>
                <option value="VAT_EXEMPT">VAT exempt</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </label>
            <button type="submit">Add Draft Billing Line</button>
          </form>
        ) : (
          <div className="client-safety-banner" role="note">
            <strong>Matter invoice gate off.</strong>
            <span>Set BURGESS_STAGING_MATTER_INVOICES_ENABLED=true to test matter billing drafts.</span>
          </div>
        )}

        {billingLines.length ? (
          <div className="client-file-table practice-table practice-table--billing" role="table" aria-label="Matter billing lines">
            <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
              <span role="columnheader">Description</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Amount</span>
              <span role="columnheader">VAT</span>
            </div>
            {billingLines.map((line) => (
              <div className="client-file-table__row practice-table__row" role="row" key={line.id}>
                <span role="cell">{line.description}</span>
                <span role="cell">{line.category}</span>
                <span role="cell">{line.status}</span>
                <span role="cell">{formatDraftInvoiceMoney(line.totalAmountCents)}</span>
                <span role="cell">{formatDraftInvoiceMoney(line.vatAmountCents)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No draft billing lines have been added for this matter yet.</p>
        )}
      </article>

      <article id="draft-invoices" className="client-review-card practice-panel">
        <div className="read-list__header">
          <div>
            <h2>Draft Invoices</h2>
            <p>
              Create draft matter invoices from uninvoiced draft billing lines.
              Draft invoices have no official invoice number and cannot be sent.
            </p>
          </div>
          <span>Draft only</span>
        </div>

        {invoiceCreated ? (
          <div className="client-safety-banner" role="status">
            Draft invoice created and pulled into the client statement.
          </div>
        ) : null}

        {invoiceError ? (
          <div className="client-safety-banner" role="alert">
            <strong>Draft invoice not created.</strong>
            <span>{invoiceError}</span>
          </div>
        ) : null}

        {matterInvoicesEnabled && billingLines.some((line) => line.status === "DRAFT") ? (
          <form
            action={`/admin/matters/${matter.id}/invoices/create`}
            method="post"
            aria-label="Create staging matter draft invoice"
          >
            <button type="submit">Create Draft Invoice</button>
          </form>
        ) : (
          <div className="client-safety-banner" role="note">
            <strong>Draft invoice action unavailable.</strong>
            <span>Add uninvoiced draft billing lines and keep the staging invoice gate enabled.</span>
          </div>
        )}

        {draftInvoices.length ? (
          <div className="client-file-table practice-table practice-table--invoices" role="table" aria-label="Matter draft invoices">
            <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
              <span role="columnheader">Draft reference</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Total</span>
              <span role="columnheader">Official number</span>
            </div>
            {draftInvoices.map((invoice) => (
              <div className="client-file-table__row practice-table__row" role="row" key={invoice.id}>
                <span role="cell">{invoice.internalDraftReference}</span>
                <span role="cell">{invoice.status}</span>
                <span role="cell">{formatDraftInvoiceMoney(invoice.totalCents)}</span>
                <span role="cell">Not assigned</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No draft invoices have been created for this matter yet.</p>
        )}
      </article>

      <article id="statement-link" className="client-review-card practice-panel">
        <h2>Statement Link</h2>
        <p>
          Draft invoices from this matter pull through to the client statement
          automatically as draft-only debit lines. Statements cannot be approved,
          generated for sending or sent in this phase.
        </p>
        <Link className="read-card__link" href={`/admin/clients/${matter.clientId}#statements`}>
          View client statement draft
        </Link>
      </article>

      <article id="audit" className="client-review-card practice-panel">
        <h2>Audit</h2>
        <p>
          Matter document uploads, matter notes, draft billing lines and draft
          invoice creation are audit/timeline events in staging. Approval,
          official invoice numbering, PDF generation and sending remain absent.
        </p>
        <dl>
          <div>
            <dt>Draft disbursements</dt>
            <dd>{formatDraftInvoiceMoney(draftDisbursementsCents)}</dd>
          </div>
          <div>
            <dt>Numbering status</dt>
            <dd>Not assigned in staging draft flow</dd>
          </div>
        </dl>
      </article>

      <Link className="read-card__link" href="/admin/matters">
        Back to Matters
      </Link>
    </section>
  );
}
