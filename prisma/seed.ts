import { fakeClient, fakeMatter, fakeUsers } from "../src/test/fixtures";

const isDevSeedEnabled = process.env.BURGESS_ALLOW_DEV_SEED === "true";

if (!isDevSeedEnabled) {
  console.log("Dev seed skipped. Set BURGESS_ALLOW_DEV_SEED=true for local development only.");
  process.exit(0);
}

if (process.env.NODE_ENV === "production") {
  throw new Error("Dev seed must never run in production.");
}

if (!process.env.DATABASE_URL) {
  console.log("Dev seed skipped. DATABASE_URL is not configured.");
  process.exit(0);
}

console.log("Dev seed skeleton ready.");
console.log("Fake users:", Object.keys(fakeUsers).join(", "));
console.log("Fake client:", fakeClient.accountNumber);
console.log("Fake matter:", fakeMatter.accountNumber);
console.log("Actual database writes are deferred until Phase 1E local DB setup.");

