import { z } from "zod";

export const executionModeSchema = z.enum(["simulated", "real"]);

export const listPrintersInput = z.object({
  spaceId: z.string().min(1),
  mode: executionModeSchema.default("simulated")
});

export const reservePrinterInput = z.object({
  spaceId: z.string().min(1),
  printerId: z.string().min(1),
  start: z.iso.datetime(),
  end: z.iso.datetime(),
  mode: executionModeSchema,
  idempotencyKey: z.string().min(8)
}).refine(({ start, end }) => Date.parse(start) < Date.parse(end), {
  message: "The reservation end must be after its start"
});

export const preparePrintJobInput = z.object({
  reservationId: z.string().min(1),
  artifactVersionId: z.string().min(1),
  materialId: z.string().min(1),
  profile: z.string().min(1),
  idempotencyKey: z.string().min(8)
});

export const submitPrintJobInput = z.object({
  jobId: z.string().min(1),
  expectedFingerprint: z.string().min(12),
  approvalId: z.string().min(1).optional(),
  idempotencyKey: z.string().min(8)
});

export const getPrintStatusInput = z.object({ jobId: z.string().min(1) });

export type ExecutionMode = z.infer<typeof executionModeSchema>;

export type ToolResult<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
    nextActions: string[];
  };
  provenance: { mode: ExecutionMode; observedAt: string };
  auditEventId: string;
};
