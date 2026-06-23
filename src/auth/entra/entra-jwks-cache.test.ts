import { describe, expect, it, vi } from "vitest";

import { type EntraJwksMetadata, createInMemoryEntraJwksCache } from "./entra-jwks-cache";
import { serviceFailure, serviceSuccess } from "@/services/service-result";

const now = new Date("2026-06-23T10:00:00.000Z");
const issuerUrl = "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0";
const metadata: EntraJwksMetadata = {
  issuerUrl,
  jwksUrl: `${issuerUrl}/discovery/v2.0/keys`,
  keyIds: ["fake-key-1"],
  fetchedAt: new Date("2026-06-23T09:55:00.000Z"),
  expiresAt: new Date("2026-06-23T10:55:00.000Z")
};

describe("Microsoft Entra JWKS cache boundary", () => {
  it("fails closed when JWKS metadata is missing", async () => {
    const cache = createInMemoryEntraJwksCache();

    await expect(cache.get(issuerUrl, now)).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed when JWKS metadata is expired", async () => {
    const cache = createInMemoryEntraJwksCache([
      {
        ...metadata,
        expiresAt: new Date("2026-06-23T09:59:59.000Z")
      }
    ]);

    await expect(cache.get(issuerUrl, now)).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong issuer metadata", async () => {
    const cache = createInMemoryEntraJwksCache();

    await expect(cache.refresh(issuerUrl, async () => serviceSuccess({
      ...metadata,
      issuerUrl: "https://issuer.example.test"
    }), now)).resolves.toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("uses an injected fake fetcher to populate cache", async () => {
    const cache = createInMemoryEntraJwksCache();
    const fetcher = vi.fn(async () => serviceSuccess(metadata));

    await expect(cache.refresh(issuerUrl, fetcher, now)).resolves.toMatchObject({
      ok: true,
      data: {
        issuerUrl,
        keyIds: ["fake-key-1"]
      }
    });
    await expect(cache.get(issuerUrl, now)).resolves.toMatchObject({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(issuerUrl);
  });

  it("fails closed when fetcher errors or is missing", async () => {
    const cache = createInMemoryEntraJwksCache();

    await expect(cache.refresh(issuerUrl, undefined, now)).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    await expect(
      cache.refresh(issuerUrl, async () => serviceFailure({
        code: "SERVICE_CONTEXT_ERROR",
        message: "fake fetch failure"
      }), now)
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("does not make network calls by default", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const cache = createInMemoryEntraJwksCache([metadata]);

    await cache.get(issuerUrl, now);
    await cache.refresh(issuerUrl, undefined, now);

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

