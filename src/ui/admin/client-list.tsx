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
    <section className="client-review" aria-labelledby="clients-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging workspace</p>
          <h1 id="clients-title">Client Files</h1>
          <p>
            Search, open and create staging test client files. Matters,
            documents, notes, billing drafts, invoices, statements and audit
            history remain structured inside the client file.
          </p>
        </div>
        <span>{writesEnabled ? "Staging writes enabled" : "Writes disabled"}</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Staging test data only.</strong>
        <span>Do not enter real Burgess client data.</span>
        <span>Only new client file creation is enabled when the staging gate is on.</span>
        <span>No matters, uploads, invoices, statements, LLM calls or production writes are enabled.</span>
      </div>

      {created ? (
        <div className="client-success-banner" role="status">
          Client file created. You can find it in the list or by using search.
        </div>
      ) : null}

      {!databaseAvailable ? (
        <div className="client-safety-banner" role="alert">
          <strong>Database unavailable.</strong>
          <span>Client files cannot be loaded until DATABASE_URL is configured.</span>
        </div>
      ) : null}

      {!writesEnabled ? (
        <div className="client-safety-banner" role="note">
          <strong>Write gate off.</strong>
          <span>Set BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true to test creating client files.</span>
        </div>
      ) : null}

      <div className="client-review__summary" aria-label="Clients review summary">
        <article>
          <span>Client files loaded</span>
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

      <section className="client-review-card" aria-labelledby="client-search-title">
        <div className="client-list-toolbar">
          <div>
            <h2 id="client-search-title">Find a client file</h2>
            <p>Search by client name or account/reference number.</p>
          </div>
          {writesEnabled && databaseAvailable ? (
            <Link className="read-card__link" href="/admin/clients/new">
              Open New Client File
            </Link>
          ) : null}
        </div>
        <form className="client-search-form" action="/admin/clients" role="search">
          <label>
            Search client files
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Client name or reference number"
            />
          </label>
          <button type="submit">Search</button>
          {query ? (
            <Link className="read-card__link" href="/admin/clients">
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      <section className="client-review-card" aria-labelledby="client-list-title">
        <h2 id="client-list-title">Client file list</h2>
        {clients.length > 0 ? (
          <div className="client-file-table" role="table" aria-label="Client files">
            <div className="client-file-table__row client-file-table__row--header" role="row">
              <span role="columnheader">Client</span>
              <span role="columnheader">Reference</span>
              <span role="columnheader">Contact</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Updated</span>
            </div>
            {clients.map((client) => (
              <Link
                key={client.id}
                className="client-file-table__row"
                href={`/admin/clients/${client.id}`}
                role="row"
              >
                <span role="cell">{client.displayName}</span>
                <span role="cell">{client.accountNumber}</span>
                <span role="cell">{client.primaryContactName ?? "No contact yet"}</span>
                <span role="cell">{client.status}</span>
                <span role="cell">{client.updatedAt.toISOString().slice(0, 10)}</span>
              </Link>
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
