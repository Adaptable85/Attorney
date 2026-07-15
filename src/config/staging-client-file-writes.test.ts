import { describe, expect, it } from "vitest";

import { evaluateStagingClientFileWriteGate } from "./staging-client-file-writes";

const stagingPasswordPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER" as const],
  provider: "staging_admin_password" as const
};

describe("staging client file write gate", () => {
  it("defaults off", () => {
    expect(evaluateStagingClientFileWriteGate(stagingPasswordPrincipal, {})).toEqual({
      enabled: false,
      reason: "staging_client_file_writes_disabled"
    });
  });

  it("requires the staging admin password principal", () => {
    expect(
      evaluateStagingClientFileWriteGate(
        {
          ...stagingPasswordPrincipal,
          provider: "local_dev_placeholder"
        },
        {
          BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
        }
      )
    ).toEqual({
      enabled: false,
      reason: "staging_password_admin_required"
    });
  });

  it("enables only for staging admin password sessions when explicitly configured", () => {
    expect(
      evaluateStagingClientFileWriteGate(stagingPasswordPrincipal, {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      })
    ).toEqual({
      enabled: true,
      reason: "enabled_for_staging_password_admin"
    });
  });
});
