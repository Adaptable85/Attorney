import { z } from "zod";

export const timelineEventTypes = [
  "CLIENT_CREATED",
  "CLIENT_EDITED",
  "MATTER_CREATED",
  "MATTER_EDITED",
  "MATTER_NOTE_ADDED",
  "DOCUMENT_METADATA_CREATED",
  "DOCUMENT_UPLOADED",
  "DOCUMENT_DOWNLOADED",
  "DOCUMENT_ACCESSED",
  "AUDIT_EVENT_RECORDED"
] as const;

export const timelineEventInputSchema = z.object({
  eventType: z.enum(timelineEventTypes),
  actorId: z.string().trim().min(1, "Actor id is required"),
  subjectType: z.string().trim().min(1, "Subject type is required"),
  subjectId: z.string().trim().min(1, "Subject id is required"),
  clientId: z.string().trim().min(1).optional(),
  matterId: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1, "Summary is required"),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type TimelineEventInput = z.input<typeof timelineEventInputSchema>;
export type TimelineEventPayload = z.output<typeof timelineEventInputSchema>;

export function createTimelineEventPayload(input: TimelineEventInput): TimelineEventPayload {
  return timelineEventInputSchema.parse(input);
}

