import { validateClientCreationInput } from "@/domain/clients";

export const fakeClientInput = {
  accountNumber: "DEMO-CLIENT-001",
  displayName: "Example Orchard Holdings"
};

export const fakeClient = {
  id: "client_demo_001",
  ...validateClientCreationInput(fakeClientInput)
};

