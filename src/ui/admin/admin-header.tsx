import type { AuthenticatedPrincipal } from "@/auth/auth-provider";

import { RoleBadge } from "./role-badge";

export function AdminHeader({
  principal
}: Readonly<{ principal: AuthenticatedPrincipal }>) {
  const primaryRole = principal.roles[0];

  return (
    <header className="admin-header">
      <div>
        <h1>Burgess Attorneys Admin</h1>
        <p>
          Protected internal shell for future legal-admin, billing, approval, document and
          audit workflows. This phase contains placeholders only.
        </p>
      </div>
      {primaryRole ? <RoleBadge role={primaryRole} /> : null}
    </header>
  );
}
