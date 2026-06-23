import {
  type CreateMatterInput,
  type ValidatedMatterInput,
  validateMatterCreationInput
} from "@/domain/matters";
import { normalizeSearchField } from "@/domain/clients";
import type { MatterRecord, MattersRepository } from "@/repositories/matters-repository";

type PrismaMatterRecord = {
  id: string;
  clientId: string;
  accountNumber: string;
  normalizedSearch: string;
  name: string;
  description: string;
  type:
    | "FAMILY_LAW"
    | "MAINTENANCE"
    | "DIVORCE"
    | "CARE_AND_CUSTODY"
    | "COMMERCIAL_LAW"
    | "FINANCIAL_DISTRESS"
    | "CONTRACTS"
    | "BUSINESS_RESCUE"
    | "CIVIL_LITIGATION"
    | "OTHER";
  status:
    | "OPEN"
    | "PENDING"
    | "WAITING_ON_CLIENT"
    | "WAITING_ON_COURT"
    | "WAITING_ON_PAYMENT"
    | "CLOSED"
    | "ARCHIVED";
  responsibleAttorneyId: string | null;
  supportUserId: string | null;
  nextStepDueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaMattersClient = {
  matter: {
    create(args: {
      data: {
        clientId: string;
        accountNumber: string;
        normalizedSearch: string;
        name: string;
        description: string;
        type: PrismaMatterRecord["type"];
        status: PrismaMatterRecord["status"];
        responsibleAttorneyId?: string;
        supportUserId?: string;
        nextStepDueDate?: Date;
      };
    }): Promise<PrismaMatterRecord>;
    update(args: {
      where: { id: string };
      data: Partial<{
        accountNumber: string;
        normalizedSearch: string;
        name: string;
        description: string;
        type: PrismaMatterRecord["type"];
        status: PrismaMatterRecord["status"];
        responsibleAttorneyId: string;
        supportUserId: string;
        nextStepDueDate: Date;
      }>;
    }): Promise<PrismaMatterRecord>;
    findUnique(args: { where: { id: string } }): Promise<PrismaMatterRecord | null>;
    findMany(args: {
      where: { status: { not: "ARCHIVED" } };
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }];
      take: number;
      cursor?: { id: string };
      skip?: number;
    }): Promise<PrismaMatterRecord[]>;
  };
};

function mapMatter(record: PrismaMatterRecord): MatterRecord {
  return {
    id: record.id,
    clientId: record.clientId,
    accountNumber: record.accountNumber,
    normalizedSearch: record.normalizedSearch,
    name: record.name,
    description: record.description,
    type: record.type,
    status: record.status,
    responsibleAttorneyId: record.responsibleAttorneyId ?? undefined,
    supportUserId: record.supportUserId ?? undefined,
    nextStepDueDate: record.nextStepDueDate ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function normalizePartialMatter(input: Partial<CreateMatterInput>): Partial<ValidatedMatterInput> {
  const accountNumber = typeof input.accountNumber === "string" ? input.accountNumber.trim() : undefined;
  const name = typeof input.name === "string" ? input.name.trim() : undefined;
  const description = typeof input.description === "string" ? input.description.trim() : undefined;
  const normalizedSearch =
    accountNumber || name || description || input.type || input.status
      ? normalizeSearchField(accountNumber, name, description, input.type, input.status)
      : undefined;

  return {
    ...(accountNumber ? { accountNumber } : {}),
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.responsibleAttorneyId ? { responsibleAttorneyId: input.responsibleAttorneyId } : {}),
    ...(input.supportUserId ? { supportUserId: input.supportUserId } : {}),
    ...(input.nextStepDueDate ? { nextStepDueDate: input.nextStepDueDate } : {}),
    ...(normalizedSearch ? { normalizedSearch } : {})
  };
}

export function createPrismaMattersRepository(prisma: PrismaMattersClient): MattersRepository {
  return {
    async create(input) {
      const matter = validateMatterCreationInput(input);
      const record = await prisma.matter.create({
        data: {
          clientId: matter.clientId,
          accountNumber: matter.accountNumber,
          normalizedSearch: matter.normalizedSearch,
          name: matter.name,
          description: matter.description,
          type: matter.type,
          status: matter.status,
          ...(matter.responsibleAttorneyId ? { responsibleAttorneyId: matter.responsibleAttorneyId } : {}),
          ...(matter.supportUserId ? { supportUserId: matter.supportUserId } : {}),
          ...(matter.nextStepDueDate ? { nextStepDueDate: matter.nextStepDueDate } : {})
        }
      });

      return mapMatter(record);
    },

    async updateOperationalFields(id, input) {
      const record = await prisma.matter.update({
        where: { id },
        data: normalizePartialMatter(input)
      });

      return mapMatter(record);
    },

    async archive(id) {
      const record = await prisma.matter.update({
        where: { id },
        data: { status: "ARCHIVED" }
      });

      return mapMatter(record);
    },

    async findById(id) {
      const record = await prisma.matter.findUnique({
        where: { id }
      });

      return record ? mapMatter(record) : null;
    },

    async listOpen(options) {
      const records = await prisma.matter.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: options?.limit ?? 25,
        ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {})
      });

      return records.map(mapMatter);
    }
  };
}
