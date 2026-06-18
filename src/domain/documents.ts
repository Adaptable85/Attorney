import { z } from "zod";

import {
  canDownloadDocuments,
  canRolePerform,
  canViewDocumentMetadata
} from "./permission-policy";
import type { RoleKey } from "./roles";

export const documentVisibilities = ["PRIVATE", "INTERNAL"] as const;
export const documentStatuses = ["ACTIVE", "SUPERSEDED", "ARCHIVED"] as const;

export const documentMetadataInputSchema = z.object({
  clientId: z.string().trim().min(1).optional(),
  matterId: z.string().trim().min(1).optional(),
  storageKey: z.string().trim().min(1, "Storage key is required"),
  filename: z.string().trim().min(1, "Filename is required"),
  contentType: z.string().trim().min(1, "Content type is required"),
  sizeBytes: z.number().int().nonnegative().optional(),
  visibility: z.enum(documentVisibilities).default("PRIVATE"),
  status: z.enum(documentStatuses).default("ACTIVE"),
  uploadedById: z.string().trim().min(1).optional()
});

export type DocumentMetadataInput = z.input<typeof documentMetadataInputSchema>;
export type ValidatedDocumentMetadata = z.output<typeof documentMetadataInputSchema>;

export function validateDocumentMetadataInput(
  input: DocumentMetadataInput
): ValidatedDocumentMetadata {
  return documentMetadataInputSchema.parse(input);
}

export function canCreateDocumentMetadata(role: RoleKey): boolean {
  return canRolePerform(role, "upload_document");
}

export function canAccessDocumentMetadata(role: RoleKey): boolean {
  return canViewDocumentMetadata(role);
}

export function canDownloadDocument(role: RoleKey): boolean {
  return canDownloadDocuments(role);
}

export function documentAccessRequiresPermissionCheck(): true {
  return true;
}

export function documentRecordStoresMetadataOnly(): true {
  return true;
}

