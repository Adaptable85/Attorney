import { describe, expect, it } from "vitest";

import {
  canCreateClientRecord,
  canEditClientRecord,
  protectedClientRecordsAreSoftDeletedOnly,
  validateClientCreationInput
} from "./clients";
import {
  canCreateMatterRecord,
  canEditMatterRecord,
  protectedMatterRecordsAreSoftDeletedOnly,
  validateMatterCreationInput
} from "./matters";

describe("client and matter foundation", () => {
  it("accepts valid client creation input and creates normalized search text", () => {
    const client = validateClientCreationInput({
      accountNumber: " BA-1001 ",
      displayName: " Smith Family Trust "
    });

    expect(client).toMatchObject({
      accountNumber: "BA-1001",
      displayName: "Smith Family Trust",
      status: "ACTIVE",
      normalizedSearch: "ba-1001 smith family trust"
    });
  });

  it("rejects invalid client creation input", () => {
    expect(() =>
      validateClientCreationInput({
        accountNumber: "",
        displayName: ""
      })
    ).toThrow();
  });

  it("accepts valid matter creation input", () => {
    const matter = validateMatterCreationInput({
      clientId: "client_1",
      accountNumber: "BA-1001",
      name: "Smith divorce",
      description: "Divorce matter",
      type: "DIVORCE"
    });

    expect(matter).toMatchObject({
      clientId: "client_1",
      accountNumber: "BA-1001",
      name: "Smith divorce",
      status: "OPEN",
      type: "DIVORCE"
    });
    expect(matter.normalizedSearch).toContain("divorce");
  });

  it("rejects missing matter type", () => {
    expect(() =>
      validateMatterCreationInput({
        clientId: "client_1",
        accountNumber: "BA-1001",
        name: "Smith matter",
        description: "Matter without type"
      } as never)
    ).toThrow();
  });

  it("rejects invalid matter type", () => {
    expect(() =>
      validateMatterCreationInput({
        clientId: "client_1",
        accountNumber: "BA-1001",
        name: "Smith matter",
        description: "Matter with bad type",
        type: "INVALID_TYPE"
      } as never)
    ).toThrow();
  });

  it("allows owner and support admin to create and edit client/matter records", () => {
    expect(canCreateClientRecord("OWNER_PRINCIPAL")).toBe(true);
    expect(canEditClientRecord("OWNER_PRINCIPAL")).toBe(true);
    expect(canCreateMatterRecord("OWNER_PRINCIPAL")).toBe(true);
    expect(canEditMatterRecord("OWNER_PRINCIPAL")).toBe(true);

    expect(canCreateClientRecord("SUPPORT_ADMIN")).toBe(true);
    expect(canEditClientRecord("SUPPORT_ADMIN")).toBe(true);
    expect(canCreateMatterRecord("SUPPORT_ADMIN")).toBe(true);
    expect(canEditMatterRecord("SUPPORT_ADMIN")).toBe(true);
  });

  it("blocks read-only reviewers and agent service users from client/matter edits", () => {
    expect(canEditClientRecord("READ_ONLY_REVIEWER")).toBe(false);
    expect(canEditMatterRecord("READ_ONLY_REVIEWER")).toBe(false);
    expect(canCreateClientRecord("AGENT_SERVICE")).toBe(false);
    expect(canEditClientRecord("AGENT_SERVICE")).toBe(false);
    expect(canCreateMatterRecord("AGENT_SERVICE")).toBe(false);
    expect(canEditMatterRecord("AGENT_SERVICE")).toBe(false);
  });

  it("keeps protected client and matter records soft-delete only", () => {
    expect(protectedClientRecordsAreSoftDeletedOnly()).toBe(true);
    expect(protectedMatterRecordsAreSoftDeletedOnly()).toBe(true);
  });
});

