import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  createAuditWriterFromRepository,
  createPrismaAuditRepository
} from "@/repositories/prisma/audit-prisma-repository";
import { createPrismaClientsRepository } from "@/repositories/prisma/clients-prisma-repository";
import { createPrismaMattersRepository } from "@/repositories/prisma/matters-prisma-repository";
import { createPrismaTransactionBoundary } from "@/repositories/prisma/prisma-transaction-boundary";
import {
  type ServiceResult,
  serviceFailure,
  serviceSuccess
} from "./service-result";
import { createServiceContext, type ServiceContext } from "./service-context";
import type { ClientsServiceDependencies } from "./clients-service";
import type { MattersServiceDependencies } from "./matters-service";

type LocalDevPrismaRootClient = Parameters<typeof createPrismaClientsRepository>[0] &
  Parameters<typeof createPrismaMattersRepository>[0] &
  Parameters<typeof createPrismaAuditRepository>[0] & {
    $transaction<T>(work: (client: LocalDevPrismaTransactionClient) => Promise<T>): Promise<T>;
  };

type LocalDevPrismaTransactionClient = Parameters<typeof createPrismaClientsRepository>[0] &
  Parameters<typeof createPrismaMattersRepository>[0] &
  Parameters<typeof createPrismaAuditRepository>[0];

export type LocalDevClientMatterServiceComposition = {
  kind: "local-dev-client-matter-service-composition";
  source: string;
  exposesUiHandlers: false;
  createServiceContext(principal: AuthenticatedPrincipal | null): ServiceResult<ServiceContext>;
  clientDependencies: ClientsServiceDependencies;
  matterDependencies: MattersServiceDependencies;
};

function isLocalDevEnvironment(environment: string | undefined): boolean {
  return environment !== "production";
}

export function createLocalDevClientMatterServiceComposition(options: {
  prisma?: unknown;
  source?: string;
  environment?: string;
}): ServiceResult<LocalDevClientMatterServiceComposition> {
  const source = options.source ?? "local-dev-client-matter-service-composition";

  if (!isLocalDevEnvironment(options.environment ?? process.env.NODE_ENV)) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Local/dev service composition is disabled in production."
    });
  }

  if (!options.prisma) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "A Prisma client is required for local/dev service composition."
    });
  }

  const prisma = options.prisma as LocalDevPrismaRootClient;
  const transactionBoundary = createPrismaTransactionBoundary<LocalDevPrismaTransactionClient>(prisma);
  const createAuditWriterForTransaction = (scope: unknown) =>
    createAuditWriterFromRepository(
      createPrismaAuditRepository(scope as LocalDevPrismaTransactionClient)
    );

  return serviceSuccess({
    kind: "local-dev-client-matter-service-composition",
    source,
    exposesUiHandlers: false,

    createServiceContext(principal) {
      return createServiceContext(principal, {
        auditWriter: createAuditWriterFromRepository(createPrismaAuditRepository(prisma)),
        source
      });
    },

    clientDependencies: {
      clientsRepository: createPrismaClientsRepository(prisma),
      transactionBoundary,
      createClientsRepositoryForTransaction(scope) {
        return createPrismaClientsRepository(scope as LocalDevPrismaTransactionClient);
      },
      createAuditWriterForTransaction
    },

    matterDependencies: {
      mattersRepository: createPrismaMattersRepository(prisma),
      transactionBoundary,
      createMattersRepositoryForTransaction(scope) {
        return createPrismaMattersRepository(scope as LocalDevPrismaTransactionClient);
      },
      createAuditWriterForTransaction
    }
  });
}
