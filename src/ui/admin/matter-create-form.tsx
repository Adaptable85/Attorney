export function MatterCreateForm() {
  return (
    <section className="form-foundation" aria-labelledby="matter-create-title">
      <div className="read-list__header">
        <div>
          <h1 id="matter-create-title">Create Matter Foundation</h1>
          <p>
            Live save requires production auth, audited transaction gate and release approval.
          </p>
        </div>
        <span>Future phase only</span>
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
          Future phase only - no save action
        </button>
      </form>
    </section>
  );
}
