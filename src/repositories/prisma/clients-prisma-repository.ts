import {
  type CreateClientInput,
  type ValidatedClientInput,
  normalizeSearchField,
  validateClientCreationInput
} from "@/domain/clients";
import type { ClientRecord, ClientsRepository } from "@/repositories/clients-repository";

type PrismaClientRecord = {
  id: string;
  accountNumber: string;
  displayName: string;
  normalizedSearch: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

type PrismaClientsClient = {
  client: {
    create(args: {
      data: {
        accountNumber: string;
        displayName: string;
        normalizedSearch: string;
        status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
      };
    }): Promise<PrismaClientRecord>;
    update(args: {
      where: { id: string };
      data: Partial<{
        accountNumber: string;
        displayName: string;
        normalizedSearch: string;
        status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
      }>;
    }): Promise<PrismaClientRecord>;
    findUnique(args: { where: { id: string } }): Promise<PrismaClientRecord | null>;
    findMany(args: {
      where: { status: { not: "ARCHIVED" } };
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }];
      take: number;
      cursor?: { id: string };
      skip?: number;
    }): Promise<PrismaClientRecord[]>;
  };
};

function mapClient(record: PrismaClientRecord): ClientRecord {
  return {
    id: record.id,
    accountNumber: record.accountNumber,
    displayName: record.displayName,
    normalizedSearch: record.normalizedSearch,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function normalizePartialClient(input: Partial<CreateClientInput>): Partial<ValidatedClientInput> {
  const accountNumber = typeof input.accountNumber === "string" ? input.accountNumber.trim() : undefined;
  const displayName = typeof input.displayName === "string" ? input.displayName.trim() : undefined;
  const normalizedSearch =
    accountNumber || displayName ? normalizeSearchField(accountNumber, displayName) : undefined;

  return {
    ...(accountNumber ? { accountNumber } : {}),
    ...(displayName ? { displayName } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(normalizedSearch ? { normalizedSearch } : {})
  };
}

export function createPrismaClientsRepository(prisma: PrismaClientsClient): ClientsRepository {
  return {
    async create(input) {
      const client = validateClientCreationInput(input);
      const record = await prisma.client.create({
        data: {
          accountNumber: client.accountNumber,
          displayName: client.displayName,
          normalizedSearch: client.normalizedSearch,
          status: client.status
        }
      });

      return mapClient(record);
    },

    async updateDraftableFields(id, input) {
      const record = await prisma.client.update({
        where: { id },
        data: normalizePartialClient(input)
      });

      return mapClient(record);
    },

    async archive(id) {
      const record = await prisma.client.update({
        where: { id },
        data: { status: "ARCHIVED" }
      });

      return mapClient(record);
    },

    async findById(id) {
      const record = await prisma.client.findUnique({
        where: { id }
      });

      return record ? mapClient(record) : null;
    },

    async listOpen(options) {
      const records = await prisma.client.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: options?.limit ?? 25,
        ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {})
      });

      return records.map(mapClient);
    }
  };
}
