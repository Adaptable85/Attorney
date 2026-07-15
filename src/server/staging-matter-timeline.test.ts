import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  addStagingMatterTimelineNote,
  loadMatterTimeline,
  listMatterTimeline,
  parseMatterTimelineFormData
} from "./staging-matter-timeline";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createFakePrisma() {
  const matters = [{
    id: "matter_1",
    clientId: "client_1",
    name: "TEST Matter",
    accountNumber: "TEST-MATTER-001"
  }];
  const matterNotes: unknown[] = [];
  const timelineEvents: Array<{
    id: string;
    eventType: string;
    subjectType: string;
    subjectId: string;
    summary: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
  }> = [];
  const auditLogs: unknown[] = [];

  const tx = {
    user: {
      async upsert() {
        return { id: "staging_admin_password_reviewer" };
      }
    },
    matter: {
      async findUnique({ where }: { where: { id: string } }) {
        return matters.find((matter) => matter.id === where.id) ?? null;
      }
    },
    matterNote: {
      async create({ data }: { data: { body: string } }) {
        const note = {
          id: `note_${matterNotes.length + 1}`,
          body: data.body
        };
        matterNotes.push(note);
        return note;
      }
    },
    timelineEvent: {
      async create({ data }: { data: Omit<(typeof timelineEvents)[number], "id" | "createdAt"> }) {
        const event = {
          id: `timeline_${timelineEvents.length + 1}`,
          createdAt: new Date("2026-07-15T09:00:00.000Z"),
          ...data
        };
        timelineEvents.push(event);
        return event;
      },
      async findMany() {
        return timelineEvents;
      }
    },
    auditLog: {
      async create({ data }: { data: unknown }) {
        auditLogs.push(data);
        return data;
      }
    }
  };

  return {
    matterNotes,
    timelineEvents,
    auditLogs,
    prisma: {
      ...tx,
      async $transaction<T>(work: (scope: typeof tx) => Promise<T>) {
        return work(tx);
      }
    }
  };
}

describe("staging matter timeline", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.burgessPrismaClient = undefined;
  });

  it("parses legal timeline form data", () => {
    const formData = new FormData();
    formData.set("matterId", "matter_1");
    formData.set("title", "Consultation held");
    formData.set("eventDate", "2026-07-15");
    formData.set("body", "Client gave staging test instructions.");

    expect(parseMatterTimelineFormData(formData)).toEqual({
      matterId: "matter_1",
      title: "Consultation held",
      eventDate: "2026-07-15",
      body: "Client gave staging test instructions."
    });
  });

  it("fails closed when the matter write gate is off", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        title: "Consultation held",
        eventDate: "2026-07-15",
        body: "Client gave staging test instructions."
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "false"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHORIZED"
      }
    });
    expect(fake.timelineEvents).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        title: "Consultation held",
        eventDate: "2026-07-15",
        body: "Client gave staging test instructions."
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("validates required legal timeline fields", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        title: "",
        eventDate: "not-a-date",
        body: ""
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("creates a matter note, audit log and timeline event when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        title: "Consultation held",
        eventDate: "2026-07-15",
        body: "Client gave staging test instructions."
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        id: "timeline_1"
      }
    });
    expect(fake.matterNotes).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toMatchObject([
      {
        eventType: "MATTER_NOTE_ADDED",
        summary: "Consultation held",
        metadata: {
          eventDate: "2026-07-15",
          body: "Client gave staging test instructions."
        }
      }
    ]);
  });

  it("returns not found when the matter is missing", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "missing_matter",
        title: "Consultation held",
        eventDate: "2026-07-15",
        body: "Client gave staging test instructions."
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("returns transaction failure when the timeline note cannot commit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await addStagingMatterTimelineNote({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      input: {
        matterId: "matter_1",
        title: "Consultation held",
        eventDate: "2026-07-15",
        body: "Client gave staging test instructions."
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("lists matter timeline events", async () => {
    const fake = createFakePrisma();
    fake.timelineEvents.push({
      id: "timeline_1",
      eventType: "MATTER_CREATED",
      subjectType: "matter",
      subjectId: "matter_1",
      summary: "Opened staging matter",
      metadata: {},
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    await expect(listMatterTimeline({
      prisma: fake.prisma,
      matterId: "matter_1"
    })).resolves.toMatchObject({
      ok: true,
      data: [
        {
          summary: "Opened staging matter"
        }
      ]
    });
  });

  it("returns repository failure when timeline events cannot be listed", async () => {
    const result = await listMatterTimeline({
      prisma: {
        timelineEvent: {
          async findMany() {
            throw new Error("database unavailable");
          }
        }
      },
      matterId: "matter_1"
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("loads matter timeline through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.timelineEvents.push({
      id: "timeline_1",
      eventType: "MATTER_CREATED",
      subjectType: "matter",
      subjectId: "matter_1",
      summary: "Opened staging matter",
      metadata: {},
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadMatterTimeline("matter_1")).resolves.toMatchObject([
      {
        summary: "Opened staging matter"
      }
    ]);
  });

  it("returns empty timeline when DATABASE_URL or Prisma access is unavailable", async () => {
    await expect(loadMatterTimeline("matter_1")).resolves.toEqual([]);

    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      timelineEvent: {
        async findMany() {
          throw new Error("database unavailable");
        }
      }
    } as never;

    await expect(loadMatterTimeline("matter_1")).resolves.toEqual([]);
  });
});
