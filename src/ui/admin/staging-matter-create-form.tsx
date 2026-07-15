import Link from "next/link";

import { matterStatuses, matterTypes } from "@/domain/matters";
import type { ClientFileListItem } from "@/server/staging-client-files";

function formatOption(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function StagingMatterCreateForm({
  client,
  writesEnabled,
  databaseAvailable,
  error
}: Readonly<{
  client: ClientFileListItem;
  writesEnabled: boolean;
  databaseAvailable: boolean;
  error?: string;
}>) {
  const disabled = !writesEnabled || !databaseAvailable;

  return (
    <section className="form-foundation" aria-labelledby="matter-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="matter-create-title">Open New Matter</h1>
          <p>
            Create a staging test matter inside {client.displayName}. Do not enter
            real Burgess matter data. Matter editing, closing, billing, invoices,
            statements and production writes remain disabled.
          </p>
        </div>
        <span>{disabled ? "Matter gate off" : "Staging matter save enabled"}</span>
      </div>

      {error ? (
        <div className="client-safety-banner" role="alert">
          <strong>Matter not saved.</strong>
          <span>{error}</span>
        </div>
      ) : null}

      {disabled ? (
        <div className="client-safety-banner" role="note">
          <strong>Matter creation unavailable.</strong>
          <span>
            DATABASE_URL and BURGESS_STAGING_MATTER_WRITES_ENABLED=true are required
            before staging matters can be saved.
          </span>
        </div>
      ) : null}

      <form
        action={`/admin/clients/${client.id}/matters/create`}
        method="post"
        aria-label="Staging matter create form"
      >
        <input type="hidden" name="clientId" value={client.id} />
        <label>
          Client file
          <input value={client.displayName} disabled />
        </label>
        <label>
          Matter/reference number
          <input
            name="accountNumber"
            placeholder="TEST-MATTER-001"
            required
            disabled={disabled}
          />
        </label>
        <label>
          Matter name
          <input
            name="name"
            placeholder="TEST Matter - Delete Later"
            required
            disabled={disabled}
          />
        </label>
        <label>
          Matter type
          <select name="type" defaultValue="OTHER" disabled={disabled}>
            {matterTypes.map((type) => (
              <option key={type} value={type}>
                {formatOption(type)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue="OPEN" disabled={disabled}>
            {matterStatuses.map((status) => (
              <option key={status} value={status}>
                {formatOption(status)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Optional next step due date
          <input name="nextStepDueDate" type="date" disabled={disabled} />
        </label>
        <label>
          Matter description
          <textarea
            name="description"
            placeholder="Clearly marked staging test matter only."
            required
            disabled={disabled}
            rows={4}
          />
        </label>
        <button type="submit" disabled={disabled}>
          Save Staging Matter
        </button>
      </form>

      <Link className="read-card__link" href={`/admin/clients/${client.id}#matters`}>
        Back to Client File
      </Link>
    </section>
  );
}
