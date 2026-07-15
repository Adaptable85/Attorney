import Link from "next/link";

import type { StagingMatterListItem } from "@/server/staging-matters";

export function StagingMatterList({
  matters,
  query,
  databaseAvailable
}: Readonly<{
  matters: readonly StagingMatterListItem[];
  query: string;
  databaseAvailable: boolean;
}>) {
  return (
    <section className="client-review practice-page" aria-labelledby="matters-title">
      <div className="practice-header">
        <div>
          <p className="review-hero__eyebrow">Practice matters</p>
          <h1 id="matters-title">Matters</h1>
          <p>
            Search matter workspaces opened inside client files. Matter billing,
            documents and notes are managed from the matter; approvals, sending
            and official numbering remain disabled.
          </p>
        </div>
        <span className="practice-chip">Staging matter index</span>
      </div>

      <div className="practice-alert" role="note">
        <strong>Staging test data only.</strong>
        <span>Open new matters from inside a saved client file.</span>
        <span>No edit, close, archive, invoice approval or statement sending action is enabled.</span>
      </div>

      {!databaseAvailable ? (
        <div className="practice-alert" role="alert">
          <strong>Database unavailable.</strong>
          <span>Matters cannot be loaded until DATABASE_URL is configured.</span>
        </div>
      ) : null}

      <section className="client-review-card practice-panel" aria-labelledby="matter-search-title">
        <h2 id="matter-search-title">Matter filters</h2>
        <form className="client-search-form practice-filter-bar" action="/admin/matters" role="search">
          <label>
            Search matters
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Matter name or reference number"
            />
          </label>
          <button type="submit">Search</button>
          {query ? (
            <Link className="practice-action" href="/admin/matters">
              Clear
            </Link>
          ) : null}
          <span className="practice-filter-note">Status: open staging matters</span>
          <span className="practice-filter-note">Owner: staging reviewer</span>
        </form>
      </section>

      <section className="client-review-card practice-panel" aria-labelledby="matter-list-title">
        <h2 id="matter-list-title">Matter list</h2>
        {matters.length > 0 ? (
          <div className="client-file-table practice-table practice-table--matter-index" role="table" aria-label="Staging matters">
            <div className="client-file-table__row client-file-table__row--header practice-table__row" role="row">
              <span role="columnheader">Matter ref</span>
              <span role="columnheader">Client</span>
              <span role="columnheader">Matter</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Unbilled draft fees</span>
              <span role="columnheader">Draft invoices</span>
              <span role="columnheader">Updated</span>
              <span role="columnheader">Actions</span>
            </div>
            {matters.map((matter) => (
              <div
                key={matter.id}
                className="client-file-table__row practice-table__row"
                role="row"
              >
                <span role="cell">{matter.accountNumber}</span>
                <span role="cell">{matter.clientDisplayName ?? "Saved client"}</span>
                <span role="cell">{matter.name}</span>
                <span role="cell">{matter.type}</span>
                <span role="cell"><span className="practice-status">{matter.status}</span></span>
                <span role="cell">Open matter</span>
                <span role="cell">Open matter</span>
                <span role="cell">{matter.updatedAt.toISOString().slice(0, 10)}</span>
                <span role="cell" className="client-file-actions">
                  <Link href={`/admin/matters/${matter.id}`}>Open</Link>
                  <Link href={`/admin/matters/${matter.id}#documents`}>Docs</Link>
                  <Link href={`/admin/matters/${matter.id}#billing`}>Billing</Link>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>
            {query
              ? "No staging matters match this search."
              : "No staging matters have been opened yet. Open a client file first."}
          </p>
        )}
      </section>
    </section>
  );
}
