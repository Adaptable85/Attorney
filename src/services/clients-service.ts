import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { hasAdminShellAccess } from "@/auth/admin-access";
import {
  type CreateClientInput,
  canCreateClientRecord,
  validateClientCreationInput
} from "@/domain/clients";
import type { ClientsRepository, ClientRecord } from "@/repositories/clients-repository";
import type { ActorContext } from "@/repositories/shared";
import { ZodError } from "zod";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess
} from "./service-result";

export type ClientSummary = {
  id: string;
  accountNumber: string;
  displayName: string;
  status: ClientRecord["status"];
};

export type ClientsServiceDependencies = {
  clientsRepository: Pick<ClientsRepository, "create" | "findById" | "listOpen">;
};

function actorFromPrincipal(principal: AuthenticatedPrincipal): ActorContext {
  return {
    actorId: principal.userId,
    reason: "Admin client service boundary"
  };
}

function toClientSummary(record: ClientRecord): ClientSummary {
  return {
    id: record.id,
    accountNumber: record.accountNumber,
    displayName: record.displayName,
    status: record.status
  };
}

function canAccessClientServices(principal: AuthenticatedPrincipal | null): principal is AuthenticatedPrincipal {
  return hasAdminShellAccess(principal);
}

function canCreateClient(principal: AuthenticatedPrincipal): boolean {
  return principal.roles.some(canCreateClientRecord);
}

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Client input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

export async function listClientSummaries(
  principal: AuthenticatedPrincipal | null,
  dependencies: ClientsServiceDependencies
): Promise<ServiceResult<readonly ClientSummary[]>> {
  if (!canAccessClientServices(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot access admin client records."
    });
  }

  try {
    const clients = await dependencies.clientsRepository.listOpen();

    return serviceSuccess(clients.map(toClientSummary));
  } catch {
    return repositoryFailure();
  }
}

export async function getClientSummary(
  principal: AuthenticatedPrincipal | null,
  id: string,
  dependencies: ClientsServiceDependencies
): Promise<ServiceResult<ClientSummary>> {
  if (!canAccessClientServices(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot access admin client records."
    });
  }

  try {
    const client = await dependencies.clientsRepository.findById(id);

    if (!client) {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Client record was not found."
      });
    }

    return serviceSuccess(toClientSummary(client));
  } catch {
    return repositoryFailure();
  }
}

export async function createClientRecord(
  principal: AuthenticatedPrincipal | null,
  input: CreateClientInput,
  dependencies: ClientsServiceDependencies
): Promise<ServiceResult<ClientSummary>> {
  if (!canAccessClientServices(principal) || !canCreateClient(principal)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "This user cannot create client records."
    });
  }

  try {
    const validated = validateClientCreationInput(input);
    const client = await dependencies.clientsRepository.create(
      validated,
      actorFromPrincipal(principal)
    );

    return serviceSuccess(toClientSummary(client));
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }
}
