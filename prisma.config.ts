import { defineConfig } from "prisma/config";

const localDevelopmentDatabaseUrl =
  "postgresql://user:password@localhost:5432/burgess_attorneys";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? localDevelopmentDatabaseUrl
  }
});
