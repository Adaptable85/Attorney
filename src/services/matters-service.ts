import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { hasAdminShellAccess } from "@/auth/admin-access";
import {
  type CreateMatterInput,
  validateMatterCreationInput
} from "@/domain/matters";
import type { MatterRecord, MattersRepository } from "@/repositories/matters-repository";
import { ZodError } from "zod";
import { executeAuditedMutation } from "./audited-service";
import type { ServiceContext } from "./service-context";
import type { TransactionBoundary } from "./transaction-boundary";
import type { AuditEventWriter } from "@/audit/audit-service";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess
} from "./service-result";

export type MatterSummary = {
  id: string;
  clientId: string;
  accountNumber: string;
  name: string;
  description: string;
  type: MatterRecord["type"];
  status: MatterRecord["status"];
  nextStepDueDate?: Date;
};

export type MattersServiceDependencies = {
  mattersRepository: Pick<MattersRepository, "create" | "findById" | "listOpen">;
  transactionBoundary?: TransactionBoundary<unknown>;
  createMattersRepositoryForTransaction?(
    scope: unknown
  ): Pick<MattersRepository, "create" | "findById" | "listOpen">;
  createAuditWriterForTransaction?(scope: unknown): AuditEventWriter;
};

function toMatterSummary(record: MatterRecord): MatterSummary {
  return {
    id: record.id,
    clientId: record.clientId,
    accountNumber: record.accountNumber,
    name: record.name,
    description: record.description,
    type: record.type,
    status: record.status,
    nextStepDueDate: record.nextStepDueDate
  };
}

function canAccessMatterServices(principal: AuthenticatedPrincipal | null): principal is AuthenticatedPrincipal {
  return hasAdminShellAccess(principal);
}

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Matter input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

export async function listMatterSummaries(
  principal: AuthenticatedPrincipal | null,
  dependencies: MattersServiceDependencies
): Promise<ServiceResult<readonly MatterSummary[]>> {
  if (!canAccessMatterServices(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot access admin matter records."
    });
  }

  try {
    const matters = await dependencies.mattersRepository.listOpen();

    return serviceSuccess(matters.map(toMatterSummary));
  } catch {
    return repositoryFailure();
  }
}

export async function getMatterSummary(
  principal: AuthenticatedPrincipal | null,
  id: string,
  dependencies: MattersServiceDependencies
): Promise<ServiceResult<MatterSummary>> {
  if (!canAccessMatterServices(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot access admin matter records."
    });
  }

  try {
    const matter = await dependencies.mattersRepository.findById(id);

    if (!matter) {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Matter record was not found."
      });
    }

    return serviceSuccess(toMatterSummary(matter));
  } catch {
    return repositoryFailure();
  }
}

export async function createMatterRecord(
  context: ServiceContext,
  input: CreateMatterInput,
  dependencies: MattersServiceDependencies
): Promise<ServiceResult<MatterSummary>> {
  try {
    const validated = validateMatterCreationInput(input);

    return executeAuditedMutation({
      context,
      requiredPermission: "create_matter",
      audit: {
        eventType: "matter_created",
        targetType: "matter",
        summary: "Matter create requested through audited service boundary",
        metadata: {
          accountNumber: validated.accountNumber,
          clientId: validated.clientId,
          status: validated.status,
          type: validated.type
        }
      },
      transaction: dependencies.transactionBoundary,
      createAuditWriterForTransaction: dependencies.createAuditWriterForTransaction,
      async run(scope) {
        const repository =
          dependencies.createMattersRepositoryForTransaction?.(scope) ?? dependencies.mattersRepository;
        const matter = await repository.create(validated, {
          actorId: context.actor.userId,
          reason: "Audited matter create service"
        });

        return toMatterSummary(matter);
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }
}
