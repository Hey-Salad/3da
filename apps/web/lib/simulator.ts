import { printers, type ReservationWindow } from "@3da/domain";
import type { ExecutionMode, ToolResult } from "@3da/contracts";

type Reservation = ReservationWindow & {
  id: string;
  spaceId: string;
  status: "CONFIRMED";
  mode: "simulated";
};

type Job = {
  id: string;
  reservationId: string;
  printerId: string;
  fingerprint: string;
  state: "READY_FOR_APPROVAL" | "APPROVED" | "SUBMISSION_PENDING" | "PRINTING";
  approvalId?: string;
  progress: number;
};

type ApprovalChallenge = {
  id: string;
  jobId: string;
  fingerprint: string;
  status: "PENDING" | "APPROVED";
  approvalId?: string;
};

const reservations = new Map<string, Reservation>();
const jobs = new Map<string, Job>();
const challenges = new Map<string, ApprovalChallenge>();
const idempotency = new Map<string, ToolResult<unknown>>();

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

function result<T>(mode: ExecutionMode, data: T): ToolResult<T> {
  return { ok: true, data, provenance: { mode, observedAt: now() }, auditEventId: id("audit") };
}

function failure(mode: ExecutionMode, code: string, message: string, nextActions: string[], retryable = false): ToolResult<never> {
  return { ok: false, error: { code, message, retryable, nextActions }, provenance: { mode, observedAt: now() }, auditEventId: id("audit") };
}

function requireSimulation(mode: ExecutionMode) {
  return mode === "simulated" ? null : failure(mode, "REAL_MODE_DISABLED", "The public demo cannot issue real printer commands.", ["Use the protected operator deployment"]);
}

async function fingerprint(parts: string[]) {
  const bytes = new TextEncoder().encode(parts.join("|"));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const simulator = {
  listPrinters(input: { spaceId: string; mode?: ExecutionMode }) {
    const mode = input.mode ?? "simulated";
    const denied = requireSimulation(mode);
    if (denied) return denied;
    return result(mode, {
      space: { id: input.spaceId, name: "London Co-Working Space" },
      printers: printers.map((printer) => ({ ...printer, recommendation: printer.id === "samantha" ? "Best fit: available now with PLA loaded" : undefined }))
    });
  },

  reservePrinter(input: { spaceId: string; printerId: string; start: string; end: string; mode: ExecutionMode; idempotencyKey: string }) {
    const denied = requireSimulation(input.mode);
    if (denied) return denied;
    const cached = idempotency.get(input.idempotencyKey);
    if (cached) return cached;
    const printer = printers.find((candidate) => candidate.id === input.printerId);
    if (!printer || printer.state !== "AVAILABLE") {
      return failure(input.mode, "PRINTER_UNAVAILABLE", "That printer cannot accept this reservation.", ["Call list_printers for current alternatives"]);
    }
    const overlaps = [...reservations.values()].some((current) => current.printerId === input.printerId && Date.parse(input.start) < Date.parse(current.end) && Date.parse(current.start) < Date.parse(input.end));
    if (overlaps) return failure(input.mode, "RESERVATION_CONFLICT", "The requested half-open time window conflicts with an existing booking.", ["Choose Sacha", "Request the next available slot"]);
    const reservation: Reservation = { id: id("res"), spaceId: input.spaceId, printerId: input.printerId, start: input.start, end: input.end, status: "CONFIRMED", mode: "simulated" };
    reservations.set(reservation.id, reservation);
    const response = result(input.mode, { reservation, graceExpiresAt: new Date(Date.parse(input.start) + 15 * 60_000).toISOString() });
    idempotency.set(input.idempotencyKey, response);
    return response;
  },

  async preparePrintJob(input: { reservationId: string; artifactVersionId: string; materialId: string; profile: string; idempotencyKey: string }) {
    const cached = idempotency.get(input.idempotencyKey);
    if (cached) return cached;
    const reservation = reservations.get(input.reservationId);
    if (!reservation) return failure("simulated", "RESERVATION_INVALID", "A confirmed reservation is required before preparation.", ["Reserve Samantha first"]);
    const jobFingerprint = await fingerprint([reservation.id, reservation.printerId, input.artifactVersionId, input.materialId, input.profile, reservation.mode]);
    const job: Job = { id: id("job"), reservationId: reservation.id, printerId: reservation.printerId, fingerprint: jobFingerprint, state: "READY_FOR_APPROVAL", progress: 0 };
    jobs.set(job.id, job);
    const response = result("simulated", { job, estimate: { durationMinutes: 42, materialGrams: 18.4, costGbp: 0.72 }, checks: ["A1 profile matches", "PLA available", "Fits reservation with cleanup"], warning: "A human must approve before submission." });
    idempotency.set(input.idempotencyKey, response);
    return response;
  },

  submitPrintJob(input: { jobId: string; expectedFingerprint: string; approvalId?: string; idempotencyKey: string }) {
    const job = jobs.get(input.jobId);
    if (!job) return failure("simulated", "NOT_FOUND", "The print job does not exist.", ["Prepare a print job"]);
    if (job.fingerprint !== input.expectedFingerprint) return failure("simulated", "JOB_CHANGED", "The approved job details no longer match.", ["Prepare and review the new job version"]);
    if (!input.approvalId || job.approvalId !== input.approvalId) {
      const existing = [...challenges.values()].find((challenge) => challenge.jobId === job.id && challenge.status === "PENDING");
      const challenge = existing ?? { id: id("challenge"), jobId: job.id, fingerprint: job.fingerprint, status: "PENDING" as const };
      challenges.set(challenge.id, challenge);
      window.dispatchEvent(new CustomEvent("3da:approval-required", { detail: challenge }));
      return failure("simulated", "APPROVAL_REQUIRED", "A person must review and approve this exact physical action.", ["Open the approval sheet", "Ask the user to confirm on screen"]);
    }
    const cached = idempotency.get(input.idempotencyKey);
    if (cached) return cached;
    job.state = "SUBMISSION_PENDING";
    const response = result("simulated", { jobId: job.id, commandId: id("cmd"), state: job.state, physicalSideEffect: false });
    idempotency.set(input.idempotencyKey, response);
    window.setTimeout(() => { job.state = "PRINTING"; job.progress = 12; window.dispatchEvent(new CustomEvent("3da:simulator-updated", { detail: job })); }, 900);
    return response;
  },

  getPrintStatus(input: { jobId: string }) {
    const job = jobs.get(input.jobId);
    if (!job) return failure("simulated", "NOT_FOUND", "The print job does not exist.", ["Prepare a print job"]);
    return result("simulated", { job, approvalId: job.approvalId, freshness: "live simulator observation", nextActions: job.state === "READY_FOR_APPROVAL" ? ["Request human approval"] : ["Monitor progress"] });
  },

  async runSafetyDemo() {
    const start = new Date(Date.now() + 60 * 60_000);
    const end = new Date(start.getTime() + 60 * 60_000);
    const suffix = crypto.randomUUID();
    const reserved = this.reservePrinter({ spaceId: "london-coworking", printerId: "samantha", start: start.toISOString(), end: end.toISOString(), mode: "simulated", idempotencyKey: `demo-reserve-${suffix}` });
    if (!reserved.ok || !reserved.data) return reserved;
    const reservation = (reserved.data as { reservation: Reservation }).reservation;
    const prepared = await this.preparePrintJob({ reservationId: reservation.id, artifactVersionId: "openai-token-v1", materialId: "jade-white-pla", profile: "Bambu A1 0.20mm Standard", idempotencyKey: `demo-prepare-${suffix}` });
    if (!prepared.ok || !prepared.data) return prepared;
    const job = (prepared.data as { job: Job }).job;
    return this.submitPrintJob({ jobId: job.id, expectedFingerprint: job.fingerprint, idempotencyKey: `demo-submit-${suffix}` });
  },

  approve(challengeId: string) {
    const challenge = challenges.get(challengeId);
    if (!challenge || challenge.status !== "PENDING") return null;
    const job = jobs.get(challenge.jobId);
    if (!job || job.fingerprint !== challenge.fingerprint) return null;
    const approvalId = id("approval");
    challenge.status = "APPROVED";
    challenge.approvalId = approvalId;
    job.approvalId = approvalId;
    job.state = "APPROVED";
    return { approvalId, jobId: job.id, fingerprint: job.fingerprint };
  }
};

export type { ApprovalChallenge };
