import Link from "next/link";

import type { ClientDocumentListItem } from "@/server/staging-documents";
import {
  formatDraftInvoiceMoney,
  type StagingClientStatementLine
} from "@/server/staging-matter-invoices";
import { suggestClientGeneralDocumentFilename } from "@/server/staging-documents";
import type { ClientFileListItem } from "@/server/staging-client-files";
import type { StagingMatterListItem } from "@/server/staging-matters";

export function LiveClientFileDetail({
  client,
  matters,
  documents,
  statementLines,
  matterWritesEnabled,
  documentUploadsEnabled,
  uploaded,
  matterCreated,
  matterError,
  uploadError
}: Readonly<{
  client: ClientFileListItem;
  matters: readonly StagingMatterListItem[];
  documents: readonly ClientDocumentListItem[];
  statementLines: readonly StagingClientStatementLine[];
  matterWritesEnabled: boolean;
  documentUploadsEnabled: boolean;
  uploaded: boolean;
  matterCreated?: boolean;
  matterError?: string;
  uploadError?: string;
}>) {
  const today = new Date().toISOString().slice(0, 10);
  const suggestedFilename = suggestClientGeneralDocumentFilename({
    clientName: client.displayName,
    documentType: "Identity_Document",
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
            creation, matter opening, test document uploads and reusable billing
            templates are live for staging only.
          </p>
        </div>
        <span>Staging test file</span>
      </div>

      <div className="client-file-tabs" aria-label="Client file sections">
        {[
          ["#overview", "Overview"],
          ["#matters", "Matters"],
          ["#documents", "Client General Documents"],
          ["#statements", "Client Statement"],
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
            <li data-disabled={matterWritesEnabled ? "false" : "true"}>
              {matterWritesEnabled ? "Staging matter creation enabled" : "Matter creation unavailable"}
            </li>
            <li data-disabled={documentUploadsEnabled ? "false" : "true"}>
              {documentUploadsEnabled ? "Test document upload enabled" : "Document upload unavailable"}
            </li>
            <li data-disabled="true">Matter voice-note transcription unavailable</li>
            <li data-disabled="true">Official invoice approval unavailable</li>
            <li data-disabled="true">Statement sending unavailable</li>
          </ul>
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="matters">
          <div className="read-card__title-row">
            <h2>Matters</h2>
            {matterWritesEnabled ? (
              <Link className="read-card__link" href={`/admin/clients/${client.id}/matters/new`}>
                Open New Matter
              </Link>
            ) : null}
          </div>
          <p>
            Matters are saved inside this client file. Open a matter to add
            matter-specific documents, notes, voice-note summaries, billing
            lines and draft invoices.
          </p>
          {matterCreated ? (
            <div className="client-success-banner" role="status">
              Staging matter opened and added to this client file.
            </div>
          ) : null}
          {matterError ? (
            <div className="client-safety-banner" role="alert">
              <strong>Matter not saved.</strong>
              <span>{matterError}</span>
            </div>
          ) : null}
          {!matterWritesEnabled ? (
            <div className="client-safety-banner" role="note">
              <strong>Matter gate off.</strong>
              <span>Set BURGESS_STAGING_MATTER_WRITES_ENABLED=true to test opening matters.</span>
            </div>
          ) : null}
          {matters.length > 0 ? (
            <div className="client-file-table" role="table" aria-label="Client matters">
              <div className="client-file-table__row client-file-table__row--header" role="row">
                <span role="columnheader">Matter</span>
                <span role="columnheader">Reference</span>
                <span role="columnheader">Type</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Updated</span>
              </div>
              {matters.map((matter) => (
                <Link
                  key={matter.id}
                  className="client-file-table__row"
                  href={`/admin/matters/${matter.id}`}
                  role="row"
                >
                  <span role="cell">{matter.name}</span>
                  <span role="cell">{matter.accountNumber}</span>
                  <span role="cell">{matter.type}</span>
                  <span role="cell">{matter.status}</span>
                  <span role="cell">{matter.updatedAt.toISOString().slice(0, 10)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p>No staging matters have been opened for this client file yet.</p>
          )}
        </article>

        <article className="client-review-card" id="documents">
          <h2>Client General Documents</h2>
          <p>
            Use this for client-level documents like ID, proof of address, FICA
            and general client file documents. Matter-specific documents must be
            uploaded inside the relevant matter.
          </p>
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
                <span className="admin-form-field__label">Document type</span>
                <span className="admin-form-field__help">Choose the general client document type, for example ID, proof of address, FICA or authority document.</span>
                <input name="documentType" placeholder="Identity document" required />
              </label>
              <label>
                <span className="admin-form-field__label">Client document category</span>
                <span className="admin-form-field__help">Use categories such as ID, proof of address, FICA, company registration, authority / mandate or general correspondence.</span>
                <input name="matterReference" placeholder="ID / Proof of address / FICA" />
              </label>
              <label>
                <span className="admin-form-field__label">Document date</span>
                <span className="admin-form-field__help">Use the date on the document or today for staging tests.</span>
                <input name="documentDate" type="date" defaultValue={today} required />
              </label>
              <label>
                <span className="admin-form-field__label">Confirm display filename</span>
                <span className="admin-form-field__help">Check the suggested name before saving the test document.</span>
                <input
                  name="displayFilename"
                  defaultValue={suggestedFilename}
                  aria-describedby="document-name-help"
                  required
                />
              </label>
              <p id="document-name-help" className="client-review-note">
                Suggested format: ClientName_ClientDocumentType_Date.
              </p>
              <label>
                <span className="admin-form-field__label">Test document</span>
                <span className="admin-form-field__help">Upload one small staging file. Do not upload real Burgess documents.</span>
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
            <div className="client-file-table" role="table" aria-label="Client general documents">
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
            <p>No general client documents have been uploaded for this client file yet.</p>
          )}
        </article>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card" id="statements">
          <h2>Client Statement</h2>
          <p>
            Draft statement lines pull through from draft invoices created inside
            this client&apos;s matters. Draft only - not approved, not sent.
          </p>
          {statementLines.length ? (
            <div className="client-file-table" role="table" aria-label="Client draft statement lines">
              <div className="client-file-table__row client-file-table__row--header" role="row">
                <span role="columnheader">Matter</span>
                <span role="columnheader">Draft invoice</span>
                <span role="columnheader">Description</span>
                <span role="columnheader">Debit</span>
                <span role="columnheader">Balance</span>
              </div>
              {statementLines.map((line) => (
                <div className="client-file-table__row" role="row" key={line.id}>
                  <span role="cell">{line.matterReference ?? "Client"}</span>
                  <span role="cell">{line.draftInvoiceReference ?? "Draft invoice"}</span>
                  <span role="cell">{line.description}</span>
                  <span role="cell">{formatDraftInvoiceMoney(line.debitCents)}</span>
                  <span role="cell">{formatDraftInvoiceMoney(line.balanceCents)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No matter draft invoices have pulled through to this client statement yet.</p>
          )}
        </article>
      </div>

      <article className="client-review-card" id="audit">
        <h2>Audit</h2>
        <p>
          Client creation, matter opening, test document uploads and draft
          matter billing activity are audit logged in staging.
        </p>
      </article>

      <Link className="read-card__link" href="/admin/clients">
        Back to Client Files
      </Link>
    </section>
  );
}
