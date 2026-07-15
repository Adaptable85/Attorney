import Link from "next/link";

export function ClientCreateForm({
  writesEnabled,
  databaseAvailable,
  error
}: Readonly<{
  writesEnabled: boolean;
  databaseAvailable: boolean;
  error?: string;
}>) {
  const disabled = !writesEnabled || !databaseAvailable;

  return (
    <section className="form-foundation" aria-labelledby="client-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="client-create-title">Open New Client File</h1>
          <p>
            Create staging test client files only. Do not enter real Burgess
            client data. This does not enable matters, document uploads,
            invoices, statements, LLM calls or production writes.
          </p>
        </div>
        <span>{disabled ? "Staging write gate off" : "Staging test save enabled"}</span>
      </div>

      {error ? (
        <div className="client-safety-banner" role="alert">
          <strong>Client file not saved.</strong>
          <span>{error}</span>
        </div>
      ) : null}

      {disabled ? (
        <div className="client-safety-banner" role="note">
          <strong>Creation unavailable.</strong>
          <span>
            DATABASE_URL and BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true are required
            before staging client files can be saved.
          </span>
        </div>
      ) : null}

      <form
        action="/admin/clients/create"
        method="post"
        aria-label="Staging client file create form"
      >
        <label>
          Account/reference number
          <input
            name="accountNumber"
            placeholder="TEST-CLIENT-001"
            required
            disabled={disabled}
          />
        </label>
        <label>
          Client display name
          <input
            name="displayName"
            placeholder="TEST Client File - Delete Later"
            required
            disabled={disabled}
          />
        </label>
        <label>
          Status
          <select name="status" disabled={disabled} defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
        <label>
          Primary contact name
          <input
            name="contactName"
            placeholder="Test Contact"
            disabled={disabled}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="test.client@example.test"
            disabled={disabled}
          />
        </label>
        <label>
          Phone
          <input
            name="phone"
            placeholder="+27 00 000 0000"
            disabled={disabled}
          />
        </label>
        <label>
          Opening note
          <textarea
            name="openingNote"
            placeholder="Clearly marked staging test note only."
            disabled={disabled}
            rows={4}
          />
        </label>
        <button type="submit" disabled={disabled}>
          Save Staging Client File
        </button>
      </form>
      <Link className="read-card__link" href="/admin/clients">
        Back to Client Files
      </Link>
    </section>
  );
}
