export function MatterCreateForm() {
  return (
    <section className="form-foundation" aria-labelledby="matter-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="matter-create-title">Matter Creation Disabled</h1>
          <p>
            Read-only review is active. Do not enter real matter data. Future
            matter creation requires explicit approval, production auth readiness,
            audited write gates and transaction validation.
          </p>
        </div>
        <span>No write access</span>
      </div>
      <form aria-label="Disabled matter create foundation">
        <label>
          Client
          <input name="clientId" placeholder="Demo client placeholder" disabled />
        </label>
        <label>
          Account number
          <input name="accountNumber" placeholder="DEMO-MATTER-NEW" disabled />
        </label>
        <label>
          Matter name
          <input name="name" placeholder="Demo Matter Name" disabled />
        </label>
        <label>
          Matter description
          <textarea name="description" placeholder="Demo matter description" disabled />
        </label>
        <label>
          Matter type
          <select name="type" disabled defaultValue="CONTRACTS">
            <option value="CONTRACTS">CONTRACTS</option>
          </select>
        </label>
        <button type="button" disabled>
          Disabled - no save action
        </button>
      </form>
    </section>
  );
}
