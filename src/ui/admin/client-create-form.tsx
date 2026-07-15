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
        className="compact-admin-form"
        action="/admin/clients/create"
        method="post"
        aria-label="Staging client file create form"
      >
        <label>
          <span className="admin-form-field__label">Account/reference number</span>
          <span className="admin-form-field__help">Use a staging test reference that you can search later.</span>
          <input
            name="accountNumber"
            placeholder="TEST-CLIENT-001"
            required
            disabled={disabled}
          />
        </label>
        <label>
          <span className="admin-form-field__label">Client display name</span>
          <span className="admin-form-field__help">The name shown in the client-file list and client header.</span>
          <input
            name="displayName"
            placeholder="TEST Client File - Delete Later"
            required
            disabled={disabled}
          />
        </label>
        <label>
          <span className="admin-form-field__label">Status</span>
          <span className="admin-form-field__help">Keep new staging test files active unless you are testing inactive records.</span>
          <select name="status" disabled={disabled} defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
        <label>
          <span className="admin-form-field__label">Primary contact name</span>
          <span className="admin-form-field__help">Optional staging contact for this client file.</span>
          <input
            name="contactName"
            placeholder="Test Contact"
            disabled={disabled}
          />
        </label>
        <label>
          <span className="admin-form-field__label">Email</span>
          <span className="admin-form-field__help">Use a test email address only.</span>
          <input
            type="email"
            name="email"
            placeholder="test.client@example.test"
            disabled={disabled}
          />
        </label>
        <label>
          <span className="admin-form-field__label">Phone</span>
          <span className="admin-form-field__help">Optional test phone number for review.</span>
          <input
            name="phone"
            placeholder="+27 00 000 0000"
            disabled={disabled}
          />
        </label>
        <label className="admin-form-field--wide">
          <span className="admin-form-field__label">Opening note</span>
          <span className="admin-form-field__help">Add a short staging note that explains why this test file exists.</span>
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
