export function ClientCreateForm() {
  return (
    <section className="form-foundation" aria-labelledby="client-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="client-create-title">Client Creation Disabled</h1>
          <p>
            Read-only review is active. Do not enter real client data. Future
            client creation requires explicit approval, production auth readiness,
            audited write gates and transaction validation.
          </p>
        </div>
        <span>No write access</span>
      </div>
      <form aria-label="Disabled client create foundation">
        <label>
          Account number
          <input name="accountNumber" placeholder="DEMO-CLIENT-NEW" disabled />
        </label>
        <label>
          Client display name
          <input name="displayName" placeholder="Demo Client Name" disabled />
        </label>
        <label>
          Status
          <select name="status" disabled defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
          </select>
        </label>
        <button type="button" disabled>
          Disabled - no save action
        </button>
      </form>
    </section>
  );
}
