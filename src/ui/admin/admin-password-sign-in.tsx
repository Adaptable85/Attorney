import type { AdminAccessDecision } from "@/auth/admin-access";

type AdminPasswordSignInProps = {
  reason: AdminAccessDecision["reason"];
  hasError?: boolean;
};

function accessMessage(reason: AdminAccessDecision["reason"]): string {
  if (reason === "password_access_disabled") {
    return "Staging password access is disabled.";
  }

  if (reason === "password_access_unconfigured") {
    return "Staging password access is not configured.";
  }

  return "Enter the staging admin password to continue.";
}

export function AdminPasswordSignIn({
  reason,
  hasError = false
}: Readonly<AdminPasswordSignInProps>) {
  const disabled = reason === "password_access_disabled" ||
    reason === "password_access_unconfigured";

  return (
    <main className="admin-password-page">
      <section className="admin-password-panel" aria-labelledby="admin-password-title">
        <p className="public-eyebrow">Staging Admin Access</p>
        <h1 id="admin-password-title">Burgess Attorneys Admin</h1>
        <p>{accessMessage(reason)}</p>
        {hasError ? (
          <p className="admin-password-panel__error" role="alert">
            The password could not be verified.
          </p>
        ) : null}
        <form method="post" action="/admin/password-session">
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={disabled}
              required
            />
          </label>
          <button type="submit" disabled={disabled}>
            Continue
          </button>
        </form>
        <p className="admin-password-panel__note">
          This staging gate does not enable Microsoft login, saves, client creation, matter
          creation, invoices or production writes.
        </p>
      </section>
    </main>
  );
}
