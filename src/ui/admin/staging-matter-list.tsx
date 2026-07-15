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
    <section className="client-review" aria-labelledby="matters-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Live staging matter list</p>
          <h1 id="matters-title">Matters</h1>
          <p>
            Search and open staging test matters that were created inside client files.
            Matter editing, closing, billing and approval actions remain disabled.
          </p>
        </div>
        <span>Staging read list</span>
      </div>

      <div className="client-safety-banner" role="note">
        <strong>Staging test data only.</strong>
        <span>Open new matters from inside a saved client file.</span>
        <span>No edit, close, archive, invoice approval or statement sending action is enabled.</span>
      </div>

      {!databaseAvailable ? (
        <div className="client-safety-banner" role="alert">
          <strong>Database unavailable.</strong>
          <span>Matters cannot be loaded until DATABASE_URL is configured.</span>
        </div>
      ) : null}

      <section className="client-review-card" aria-labelledby="matter-search-title">
        <h2 id="matter-search-title">Find a matter</h2>
        <form className="client-search-form" action="/admin/matters" role="search">
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
            <Link className="read-card__link" href="/admin/matters">
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      <section className="client-review-card" aria-labelledby="matter-list-title">
        <h2 id="matter-list-title">Matter list</h2>
        {matters.length > 0 ? (
          <div className="client-file-table" role="table" aria-label="Staging matters">
            <div className="client-file-table__row client-file-table__row--header" role="row">
              <span role="columnheader">Matter</span>
              <span role="columnheader">Reference</span>
              <span role="columnheader">Client</span>
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
                <span role="cell">{matter.clientDisplayName ?? "Saved client"}</span>
                <span role="cell">{matter.status}</span>
                <span role="cell">{matter.updatedAt.toISOString().slice(0, 10)}</span>
              </Link>
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
