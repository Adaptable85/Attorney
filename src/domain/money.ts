import { z } from "zod";

export const currencySchema = z.string().trim().length(3).default("ZAR");

export const moneyCentsSchema = z
  .number()
  .int("Money must be stored as integer cents")
  .nonnegative("Money cents cannot be negative");

export type MoneyCents = z.output<typeof moneyCentsSchema>;

export function validateMoneyCents(value: number): MoneyCents {
  return moneyCentsSchema.parse(value);
}

export function centsToMajorUnitString(cents: number, currency = "ZAR"): string {
  const validCents = validateMoneyCents(cents);
  return `${currency} ${(validCents / 100).toFixed(2)}`;
}

