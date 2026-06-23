export function ClientCreateForm() {
  return (
    <section className="form-foundation" aria-labelledby="client-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="client-create-title">Create Client Foundation</h1>
          <p>
            Live save remains disabled until production auth provider is selected, audited write release gate is approved, and transaction tests pass.
          </p>
        </div>
        <span>Future phase only</span>
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
          Future phase only - no save action
        </button>
      </form>
    </section>
  );
}
