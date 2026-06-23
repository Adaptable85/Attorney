import { SignJWT, exportJWK, generateKeyPair } from "jose";
import { describe, expect, it, vi } from "vitest";

import { verifyEntraJwtWithJose, type EntraJoseJwk } from "./entra-jose-verifier";

const now = new Date("2026-06-23T10:00:00.000Z");
const config = {
  issuerUrl: "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0",
  clientId: "22222222-2222-4222-8222-222222222222",
  tenantId: "11111111-1111-4111-8111-111111111111"
};
const expectedNonce = "nonce_11111111111111111111111111111111";

async function createFixture(options?: {
  kid?: string;
  issuer?: string;
  audience?: string;
  tenantId?: string;
  nonce?: string;
  expiresAt?: Date;
  algorithm?: "RS256" | "HS256";
}) {
  if (options?.algorithm === "HS256") {
    const secret = new TextEncoder().encode("local-test-secret-local-test-secret");
    const token = await new SignJWT({
      tid: options.tenantId ?? config.tenantId,
      nonce: options.nonce ?? expectedNonce,
      oid: "entra-user-1",
      email: "owner@example.test"
    })
      .setProtectedHeader({ alg: "HS256", kid: options.kid ?? "fake-key-1", typ: "JWT" })
      .setIssuer(options.issuer ?? config.issuerUrl)
      .setAudience(options.audience ?? config.clientId)
      .setExpirationTime(Math.floor((options.expiresAt ?? new Date("2026-06-23T10:10:00.000Z")).getTime() / 1000))
      .setNotBefore(Math.floor(new Date("2026-06-23T09:50:00.000Z").getTime() / 1000))
      .sign(secret);

    return { token, keys: [await createPublicJwk(options?.kid ?? "fake-key-1")] };
  }

  const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true });
  const kid = options?.kid ?? "fake-key-1";
  const publicJwk = {
    ...await exportJWK(publicKey),
    kid,
    alg: "RS256",
    use: "sig"
  } as EntraJoseJwk;
  const token = await new SignJWT({
    tid: options?.tenantId ?? config.tenantId,
    nonce: options?.nonce ?? expectedNonce,
    oid: "entra-user-1",
    email: "owner@example.test",
    roles: "OWNER_PRINCIPAL"
  })
    .setProtectedHeader({ alg: "RS256", kid, typ: "JWT" })
    .setIssuer(options?.issuer ?? config.issuerUrl)
    .setAudience(options?.audience ?? config.clientId)
    .setExpirationTime(Math.floor((options?.expiresAt ?? new Date("2026-06-23T10:10:00.000Z")).getTime() / 1000))
    .setNotBefore(Math.floor(new Date("2026-06-23T09:50:00.000Z").getTime() / 1000))
    .sign(privateKey);

  return { token, keys: [publicJwk] };
}

async function createPublicJwk(kid: string): Promise<EntraJoseJwk> {
  const { publicKey } = await generateKeyPair("RS256", { extractable: true });

  return {
    ...await exportJWK(publicKey),
    kid,
    alg: "RS256",
    use: "sig"
  } as EntraJoseJwk;
}

async function verifyFixture(options?: Parameters<typeof createFixture>[0] & {
  keys?: readonly EntraJoseJwk[];
}) {
  const fixture = await createFixture(options);

  return verifyEntraJwtWithJose({
    rawIdToken: fixture.token,
    config,
    expectedNonce,
    keys: options?.keys ?? fixture.keys,
    now
  });
}

describe("Microsoft Entra jose verifier adapter", () => {
  it("verifies a fake local RS256 token with injected key material only", async () => {
    await expect(verifyFixture()).resolves.toMatchObject({
      ok: true,
      data: {
        issuer: config.issuerUrl,
        audience: config.clientId,
        tenantId: config.tenantId,
        nonce: expectedNonce,
        subject: "entra-user-1",
        email: "owner@example.test"
      }
    });
  });

  it("rejects wrong issuer, audience, nonce and expired tokens", async () => {
    await expect(verifyFixture({ issuer: "https://issuer.example.test" })).resolves.toMatchObject({ ok: false });
    await expect(verifyFixture({ audience: "other-client" })).resolves.toMatchObject({ ok: false });
    await expect(verifyFixture({ nonce: "wrong_nonce_111111111111111111111111111" })).resolves.toMatchObject({ ok: false });
    await expect(verifyFixture({ expiresAt: new Date("2026-06-23T09:59:59.000Z") })).resolves.toMatchObject({ ok: false });
  });

  it("rejects wrong algorithm, unknown kid, malformed and unsigned tokens", async () => {
    await expect(verifyFixture({ algorithm: "HS256" })).resolves.toMatchObject({ ok: false });

    const fixture = await createFixture({ kid: "unknown-key" });
    await expect(
      verifyEntraJwtWithJose({
        rawIdToken: fixture.token,
        config,
        expectedNonce,
        keys: [await createPublicJwk("other-key")],
        now
      })
    ).resolves.toMatchObject({ ok: false });

    await expect(
      verifyEntraJwtWithJose({
        rawIdToken: "not-a-jwt",
        config,
        expectedNonce,
        keys: fixture.keys,
        now
      })
    ).resolves.toMatchObject({ ok: false });

    await expect(
      verifyEntraJwtWithJose({
        rawIdToken: "eyJhbGciOiJub25lIn0.e30.",
        config,
        expectedNonce,
        keys: fixture.keys,
        now
      })
    ).resolves.toMatchObject({ ok: false });
  });

  it("does not perform network calls or expose raw token values in errors", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const fixture = await createFixture();
    const rawToken = `${fixture.token.slice(0, -10)}bad-token`;
    const result = await verifyEntraJwtWithJose({
      rawIdToken: rawToken,
      config,
      expectedNonce,
      keys: fixture.keys,
      now
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain(rawToken);
    fetchSpy.mockRestore();
  });
});
