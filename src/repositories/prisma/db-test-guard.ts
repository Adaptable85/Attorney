export function isSafeLocalDatabaseUrl(databaseUrl: string): boolean {
  try {
    const url = new URL(databaseUrl);
    const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isBurgessDevDatabase = url.pathname.includes("burgess_attorneys_dev");

    return url.protocol === "postgresql:" && isLocalHost && isBurgessDevDatabase;
  } catch {
    return false;
  }
}

export function requireSafeLocalDatabaseUrl(): string | null {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  if (!isSafeLocalDatabaseUrl(databaseUrl)) {
    throw new Error("Refusing to run DB tests unless DATABASE_URL points to local burgess_attorneys_dev.");
  }

  return databaseUrl;
}
