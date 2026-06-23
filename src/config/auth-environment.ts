import { readProductionAuthReadiness, type ProductionAuthReadiness } from "@/auth/auth-readiness";

export type AuthEnvironmentState = {
  productionAuth: ProductionAuthReadiness;
};

export function readAuthEnvironment(
  environment: Partial<Record<string, string | undefined>> = process.env
): AuthEnvironmentState {
  return {
    productionAuth: readProductionAuthReadiness(environment)
  };
}
