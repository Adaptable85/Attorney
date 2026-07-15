import Link from "next/link";

import type { ClientFileListItem } from "@/server/staging-client-files";

export function ClientList({
  clients,
  query,
  writesEnabled,
  databaseAvailable,
  created
}: Readonly<{
  clients: readonly ClientFileListItem[];
  query: string;
  writesEnabled: boolean;
  databaseAvailable: boolean;
  created: boolean;
}>) {
  return (
    <section className="client-review practice-page" aria-labelledby="clients-title">
      <div className="practice-header">
        <div>
          <p className="review-hero__eyebrow">Practice files</p>
          <h1 id="clients-title">Files</h1>
          <p>
            Search and open Burgess staging files. Each file carries the client,
            primary matter context, general documents, draft statement position
            and operational actions in one dense workspace.
          </p>
        </div>
        <span className="practice-chip">{writesEnabled ? "Staging writes enabled" : "Writes disabled"}</span>
      </div>

      <div className="practice-alert" role="note">
        <strong>Staging test data only.</strong>
        <span>Do not enter real Burgess client data.</span>
        <span>Writes remain limited to explicit staging gates; no production writes, approvals, sending, payments, AI calls or accounting integration actions are enabled.</span>
      </div>

      {created ? (
        <div className="client-success-banner practice-success" role="status">
          Client file created. You can find it in the list or by using search.
        </div>
      ) : null}

      {!databaseAvailable ? (
        <div className="practice-alert" role="alert">
          <strong>Database unavailable.</strong>
          <span>Client files cannot be loaded until DATABASE_URL is configured.</span>
        </div>
      ) : null}

      {!writesEnabled ? (
        <div className="practice-alert" role="note">
          <strong>Write gate off.</strong>
          <span>Set BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true to test creating client files.</span>
        </div>
      ) : null}

      <div className="client-review__summary practice-metrics" aria-label="Files review summary">
        <article>
          <span>Files loaded</span>
          <strong>{clients.length}</strong>
        </article>
        <article>
          <span>Search</span>
          <strong>{query ? "Active" : "Ready"}</strong>
        </article>
        <article>
          <span>New client file</span>
          <strong>{writesEnabled ? "Enabled" : "Disabled"}</strong>
        </article>
      </div>

      <section className="client-review-card practice-panel" aria-labelledby="client-search-title">
        <div className="client-list-toolbar practice-toolbar">
          <div>
            <h2 id="client-search-title">File filters</h2>
            <p>Search by file reference, client name or primary contact.</p>
          </div>
          {writesEnabled && databaseAvailable ? (
            <Link className="practice-action practice-action--primary" href="/admin/clients/new">
              Open New Client File
            </Link>
          ) : null}
        </div>
        <form className="client-search-form practice-filter-bar" action="/admin/clients" role="search">
          <label>
            Search files
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Client name or reference number"
            />
          </label>
          <button type="submit">Search</button>
          {query ? (
            <Link className="practice-action" href="/admin/clients">
              Clear
            </Link>
          ) : null}
          <span className="practice-filter-note">Status: active staging files</span>
          <span className="practice-filter-note">Responsible: staging reviewer</span>
        </form>
      </section>

      <section className="client-review-card practice-panel" aria-labelledby="client-list-title">
        <h2 id="client-list-title">Files list</h2>
        {clients.length > 0 ? (
          <div className="client-file-table practice-table practice-table--files" role="table" aria-label="Files">
            <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
              <span role="columnheader">File ref</span>
              <span role="columnheader">Client</span>
              <span role="columnheader">Primary matter</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">A/R draft</span>
              <span role="columnheader">Draft statement balance</span>
              <span role="columnheader">Unbilled fees</span>
              <span role="columnheader">Disbursements</span>
              <span role="columnheader">Responsible</span>
              <span role="columnheader">Updated</span>
              <span role="columnheader">Actions</span>
            </div>
            {clients.map((client) => (
              <div
                key={client.id}
                className="client-file-table__row practice-table__row"
                role="row"
              >
                <span role="cell">{client.accountNumber}</span>
                <span role="cell">
                  <strong>{client.displayName}</strong>
                  <small>{client.primaryContactName ?? "No contact yet"}</small>
                </span>
                <span role="cell">Open file for matters</span>
                <span role="cell"><span className="practice-status">{client.status}</span></span>
                <span role="cell">Not calculated</span>
                <span role="cell">Open statement</span>
                <span role="cell">Matter billing</span>
                <span role="cell">Matter billing</span>
                <span role="cell">{client.primaryContactName ?? "Staging reviewer"}</span>
                <span role="cell">{client.updatedAt.toISOString().slice(0, 10)}</span>
                <span role="cell" className="client-file-actions">
                  <Link href={`/admin/clients/${client.id}`}>Open</Link>
                  <Link href={`/admin/clients/${client.id}#documents`}>Docs</Link>
                  <Link href={`/admin/clients/${client.id}#statements`}>Statement</Link>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>
            {query
              ? "No client files match this search."
              : writesEnabled && databaseAvailable
                ? "No client files are available yet. Use the new-client action when staging writes are enabled."
                : "No client files are available yet."}
          </p>
        )}
      </section>
    </section>
  );
}
