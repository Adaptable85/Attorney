import { z } from "zod";

import { currencySchema, moneyCentsSchema } from "./money";

export const billingCategories = [
  "TIME",
  "FOLIO",
  "PAGE",
  "FIXED_TARIFF",
  "DISBURSEMENT",
  "ADJUSTMENT",
  "CORRECTION"
] as const;

export const vatTreatments = ["VAT_ON_FEES", "NO_VAT", "VAT_EXEMPT", "CUSTOM"] as const;

export type BillingCategory = (typeof billingCategories)[number];
export type VatTreatment = (typeof vatTreatments)[number];

const feeCategories = new Set<BillingCategory>([
  "TIME",
  "FOLIO",
  "PAGE",
  "FIXED_TARIFF",
  "ADJUSTMENT",
  "CORRECTION"
]);

export function defaultVatTreatmentForCategory(category: BillingCategory): VatTreatment {
  return feeCategories.has(category) ? "VAT_ON_FEES" : "NO_VAT";
}

export const billingLineItemInputSchema = z.object({
  matterId: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum(billingCategories),
  quantity: z.number().int().positive().default(1),
  unitAmountCents: moneyCentsSchema,
  totalAmountCents: moneyCentsSchema,
  currency: currencySchema,
  vatTreatment: z.enum(vatTreatments).optional(),
  vatOverrideReason: z.string().trim().min(1).optional(),
  vatAmountCents: moneyCentsSchema.default(0)
});

export type BillingLineItemInput = z.input<typeof billingLineItemInputSchema>;
export type ValidatedBillingLineItem = z.output<typeof billingLineItemInputSchema> & {
  vatTreatment: VatTreatment;
};

export function validateBillingLineItemInput(
  input: BillingLineItemInput
): ValidatedBillingLineItem {
  const parsed = billingLineItemInputSchema.parse(input);
  const defaultVatTreatment = defaultVatTreatmentForCategory(parsed.category);
  const vatTreatment = parsed.vatTreatment ?? defaultVatTreatment;

  if (vatTreatment !== defaultVatTreatment && !parsed.vatOverrideReason) {
    throw new Error("VAT override requires a reason");
  }

  return {
    ...parsed,
    vatTreatment
  };
}

