import { describe, expect, it } from "vitest";

import {
  evaluateStagingBillingItemsGate,
  evaluateStagingDocumentUploadGate,
  evaluateStagingMatterInvoicesGate
} from "./staging-admin-live-gates";

const stagingPasswordPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER" as const],
  provider: "staging_admin_password" as const
};

describe("staging admin live gates", () => {
  it("keeps document uploads disabled by default", () => {
    expect(evaluateStagingDocumentUploadGate(stagingPasswordPrincipal, {})).toEqual({
      enabled: false,
      reason: "staging_gate_disabled"
    });
  });

  it("keeps billing items disabled by default", () => {
    expect(evaluateStagingBillingItemsGate(stagingPasswordPrincipal, {})).toEqual({
      enabled: false,
      reason: "staging_gate_disabled"
    });
  });

  it("keeps matter invoices disabled by default", () => {
    expect(evaluateStagingMatterInvoicesGate(stagingPasswordPrincipal, {})).toEqual({
      enabled: false,
      reason: "staging_gate_disabled"
    });
  });

  it("requires the staging admin password principal", () => {
    expect(
      evaluateStagingDocumentUploadGate(
        {
          ...stagingPasswordPrincipal,
          provider: "local_dev_placeholder"
        },
        {
          BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
        }
      )
    ).toEqual({
      enabled: false,
      reason: "staging_password_admin_required"
    });
  });

  it("enables each gate only when explicitly configured", () => {
    expect(
      evaluateStagingDocumentUploadGate(stagingPasswordPrincipal, {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      })
    ).toEqual({
      enabled: true,
      reason: "enabled_for_staging_password_admin"
    });
    expect(
      evaluateStagingBillingItemsGate(stagingPasswordPrincipal, {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      })
    ).toEqual({
      enabled: true,
      reason: "enabled_for_staging_password_admin"
    });
    expect(
      evaluateStagingMatterInvoicesGate(stagingPasswordPrincipal, {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      })
    ).toEqual({
      enabled: true,
      reason: "enabled_for_staging_password_admin"
    });
  });
});
