import Link from "next/link";

import { suggestDocumentFilename, type MatterDocumentListItem } from "@/server/staging-documents";
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
  documentUploadsEnabled,
  matterWritesEnabled,
  documentUploaded,
  documentError,
  timelineAdded,
  timelineError
}: Readonly<{
  matter: StagingMatterListItem;
  documents: readonly MatterDocumentListItem[];
  timeline: readonly StagingMatterTimelineItem[];
  documentUploadsEnabled: boolean;
  matterWritesEnabled: boolean;
  documentUploaded?: boolean;
  documentError?: string;
  timelineAdded?: boolean;
  timelineError?: string;
}>) {
  const today = new Date().toISOString().slice(0, 10);
  const suggestedFilename = suggestDocumentFilename({
    clientName: matter.clientDisplayName ?? "Client",
    matterReference: matter.accountNumber,
    documentType: "Matter_Document",
    documentDate: today
  });

  return (
    <section className="client-review" aria-labelledby="matter-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging matter</p>
          <h1 id="matter-detail-title">{matter.name}</h1>
          <p>
            This matter is saved in Railway staging. You can upload test
            documents and add legal timeline notes for this matter. Editing,
            closing, billing, invoices and statements remain disabled.
          </p>
        </div>
        <span>Staging test matter</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Staging matter workspace.</strong>
        <span>
          Use test data only. No edit, close, archive, approve, send, LLM or sync
          action is enabled.
        </span>
      </div>

      <nav className="client-file-tabs" aria-label="Matter sections">
        <a href="#overview">Overview</a>
        <a href="#documents">Documents</a>
        <a href="#timeline">Legal Timeline</a>
        <a href="#disabled-actions">Disabled Actions</a>
      </nav>

      <article id="overview" className="client-review-card">
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

      <article id="documents" className="client-review-card">
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
          <div className="client-file-table" role="table" aria-label="Matter documents">
            <div className="client-file-table__row client-file-table__row--header" role="row">
              <span role="columnheader">Filename</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Size</span>
              <span role="columnheader">Created</span>
              <span role="columnheader">Actions</span>
            </div>
            {documents.map((document) => (
              <div className="client-file-table__row" role="row" key={document.id}>
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

      <article id="timeline" className="client-review-card">
        <div className="read-list__header">
          <div>
            <h2>Legal Timeline</h2>
            <p>
              Add dated staging notes for what happened in this matter. These
              are internal test notes only and do not send notifications.
            </p>
          </div>
          <span>{matterWritesEnabled ? "Timeline enabled" : "Matter gate off"}</span>
        </div>

        {timelineAdded ? (
          <div className="client-safety-banner" role="status">
            Legal timeline note added.
          </div>
        ) : null}

        {timelineError ? (
          <div className="client-safety-banner" role="alert">
            <strong>Timeline note not saved.</strong>
            <span>{timelineError}</span>
          </div>
        ) : null}

        {matterWritesEnabled ? (
          <form
            className="compact-admin-form"
            action={`/admin/matters/${matter.id}/timeline/create`}
            method="post"
            aria-label="Staging legal timeline form"
          >
            <input type="hidden" name="matterId" value={matter.id} />
            <label>
              <span className="admin-form-field__label">Timeline title</span>
              <span className="admin-form-field__help">Short heading for what happened on this matter.</span>
              <input name="title" placeholder="Consultation held, notice received, draft sent" required />
            </label>
            <label>
              <span className="admin-form-field__label">Event date</span>
              <span className="admin-form-field__help">The date the event, note or instruction happened.</span>
              <input name="eventDate" type="date" defaultValue={today} required />
            </label>
            <label className="admin-form-field--wide">
              <span className="admin-form-field__label">Timeline detail</span>
              <span className="admin-form-field__help">Enter the note, instruction, voice-note summary or next-step context.</span>
              <textarea
                name="body"
                placeholder="Add the staging test note or summary for this matter."
                rows={4}
                required
              />
            </label>
            <button type="submit">Add Timeline Note</button>
          </form>
        ) : (
          <div className="client-safety-banner" role="note">
            <strong>Legal timeline unavailable.</strong>
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
          <p>No legal timeline notes have been added for this matter yet.</p>
        )}
      </article>

      <article id="disabled-actions" className="client-review-card">
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
