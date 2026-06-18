import { execFileSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL ?? "";
const allowReset = process.env.BURGESS_ALLOW_DEV_DB_RESET === "true";
const expectedLocalDatabase = "burgess_attorneys_dev";

function isLocalDevDatabaseUrl(value: string): boolean {
  return (
    value.includes("localhost") &&
    value.includes(expectedLocalDatabase) &&
    !value.includes("prod") &&
    !value.includes("production")
  );
}

if (!allowReset) {
  console.log("Dev database reset skipped. Set BURGESS_ALLOW_DEV_DB_RESET=true locally.");
  process.exit(0);
}

if (!isLocalDevDatabaseUrl(databaseUrl)) {
  throw new Error("Refusing to reset database. DATABASE_URL must point to local burgess_attorneys_dev.");
}

execFileSync("pnpm", ["exec", "prisma", "migrate", "reset", "--force", "--skip-seed"], {
  stdio: "inherit",
  env: process.env
});
