import { validateClientCreationInput } from "@/domain/clients";
import { validateMatterCreationInput } from "@/domain/matters";
import type { ClientsRepository } from "@/repositories/clients-repository";
import type { MattersRepository } from "@/repositories/matters-repository";

const now = new Date("2026-06-18T00:00:00.000Z");

const demoClientInputs = [
  {
    id: "client_demo_001",
    accountNumber: "DEMO-CLIENT-001",
    displayName: "Demo Client A"
  },
  {
    id: "client_demo_002",
    accountNumber: "DEMO-CLIENT-002",
    displayName: "Demo Client B"
  }
] as const;

const demoMatterInputs = [
  {
    id: "matter_demo_001",
    clientId: "client_demo_001",
    accountNumber: "DEMO-MATTER-001",
    name: "Demo Contract Review",
    description: "Fake read-only matter summary for layout validation.",
    type: "CONTRACTS" as const,
    status: "OPEN" as const,
    responsibleAttorneyId: "demo_attorney",
    supportUserId: "demo_support",
    nextStepDueDate: new Date("2026-07-03T00:00:00.000Z")
  },
  {
    id: "matter_demo_002",
    clientId: "client_demo_002",
    accountNumber: "DEMO-MATTER-002",
    name: "Demo Property Transfer",
    description: "Fake read-only matter detail for table and detail states.",
    type: "OTHER" as const,
    status: "WAITING_ON_CLIENT" as const,
    responsibleAttorneyId: "demo_attorney",
    supportUserId: "demo_support",
    nextStepDueDate: new Date("2026-07-10T00:00:00.000Z")
  }
] as const;

export const demoClientRecords = demoClientInputs.map((client) => ({
  id: client.id,
  ...validateClientCreationInput(client),
  createdAt: now,
  updatedAt: now
}));

export const demoMatterRecords = demoMatterInputs.map((matter) => ({
  id: matter.id,
  ...validateMatterCreationInput(matter),
  createdAt: now,
  updatedAt: now
}));

export const demoClientsRepository: ClientsRepository = {
  async create() {
    throw new Error("Demo client repository is read-only.");
  },
  async updateDraftableFields() {
    throw new Error("Demo client repository is read-only.");
  },
  async archive() {
    throw new Error("Demo client repository is read-only.");
  },
  async findById(id) {
    return demoClientRecords.find((client) => client.id === id) ?? null;
  },
  async listOpen() {
    return demoClientRecords;
  }
};

export const demoMattersRepository: MattersRepository = {
  async create() {
    throw new Error("Demo matter repository is read-only.");
  },
  async updateOperationalFields() {
    throw new Error("Demo matter repository is read-only.");
  },
  async archive() {
    throw new Error("Demo matter repository is read-only.");
  },
  async findById(id) {
    return demoMatterRecords.find((matter) => matter.id === id) ?? null;
  },
  async listOpen() {
    return demoMatterRecords;
  }
};

export function getDemoClientName(clientId: string): string {
  return (
    demoClientRecords.find((client) => client.id === clientId)?.displayName ??
    "Demo client placeholder"
  );
}
