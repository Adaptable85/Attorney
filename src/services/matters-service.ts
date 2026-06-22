import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { hasAdminShellAccess } from "@/auth/admin-access";
import {
  type CreateMatterInput,
  canCreateMatterRecord,
  validateMatterCreationInput
} from "@/domain/matters";
import type { MatterRecord, MattersRepository } from "@/repositories/matters-repository";
import type { ActorContext } from "@/repositories/shared";
import { ZodError } from "zod";
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
};

function actorFromPrincipal(principal: AuthenticatedPrincipal): ActorContext {
  return {
    actorId: principal.userId,
    reason: "Admin matter service boundary"
  };
}

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

function canCreateMatter(principal: AuthenticatedPrincipal): boolean {
  return principal.roles.some(canCreateMatterRecord);
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
  principal: AuthenticatedPrincipal | null,
  input: CreateMatterInput,
  dependencies: MattersServiceDependencies
): Promise<ServiceResult<MatterSummary>> {
  if (!canAccessMatterServices(principal) || !canCreateMatter(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot create matter records."
    });
  }

  try {
    const validated = validateMatterCreationInput(input);
    const matter = await dependencies.mattersRepository.create(
      validated,
      actorFromPrincipal(principal)
    );

    return serviceSuccess(toMatterSummary(matter));
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }
}
