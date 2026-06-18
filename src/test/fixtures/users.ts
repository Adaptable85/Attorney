import type { RoleKey } from "@/domain/roles";

export type FakeUserFixture = {
  id: string;
  email: string;
  name: string;
  roles: readonly RoleKey[];
};

export const fakeUsers = {
  owner: {
    id: "user_owner_demo",
    email: "owner.demo@example.test",
    name: "Demo Principal Attorney",
    roles: ["OWNER_PRINCIPAL"]
  },
  supportAdmin: {
    id: "user_support_demo",
    email: "support.demo@example.test",
    name: "Demo Support Admin",
    roles: ["SUPPORT_ADMIN"]
  },
  agent: {
    id: "user_agent_demo",
    email: "agent.demo@example.test",
    name: "Demo Agent Service",
    roles: ["AGENT_SERVICE"]
  },
  reviewer: {
    id: "user_reviewer_demo",
    email: "reviewer.demo@example.test",
    name: "Demo Read Only Reviewer",
    roles: ["READ_ONLY_REVIEWER"]
  }
} as const satisfies Record<string, FakeUserFixture>;

