import { validateMatterCreationInput } from "@/domain/matters";
import { fakeClient } from "./clients";

export const fakeMatterInput = {
  clientId: fakeClient.id,
  accountNumber: "DEMO-MATTER-001",
  name: "Example Orchard Contract Review",
  description: "Fake contract review matter for deterministic tests",
  type: "CONTRACTS" as const
};

export const fakeMatter = {
  id: "matter_demo_001",
  ...validateMatterCreationInput(fakeMatterInput)
};

