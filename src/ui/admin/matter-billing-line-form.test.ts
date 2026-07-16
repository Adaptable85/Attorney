import { describe, expect, it } from "vitest";

import { findBillingTemplateDraftValues, type MatterBillingTemplateOption } from "./matter-billing-line-form";

const billingItems: MatterBillingTemplateOption[] = [{
  id: "template_1",
  label: "Consultation",
  description: "Consultation with client",
  category: "TIME",
  amountCents: 85000,
  vatTreatment: "VAT_ON_FEES",
  displayAmount: "R 850,00"
}];

describe("matter billing line form", () => {
  it("maps a selected reusable invoice item to editable draft billing fields", () => {
    expect(findBillingTemplateDraftValues(billingItems, "template_1")).toEqual({
      description: "Consultation with client",
      category: "TIME",
      unitAmountCents: "85000",
      vatTreatment: "VAT_ON_FEES"
    });
  });

  it("keeps manual billing entry available when no template is selected", () => {
    expect(findBillingTemplateDraftValues(billingItems, "")).toBeNull();
    expect(findBillingTemplateDraftValues(billingItems, "missing")).toBeNull();
  });
});
