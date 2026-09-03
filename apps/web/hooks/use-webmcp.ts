"use client";

import { useEffect, useState } from "react";
import { simulator, type ApprovalChallenge } from "@/lib/simulator";

type Activity = { title: string; detail: string };

const schemas = {
  list: { type: "object", properties: { spaceId: { type: "string" }, mode: { type: "string", enum: ["simulated", "real"] } }, required: ["spaceId"] },
  reserve: { type: "object", properties: { spaceId: { type: "string" }, printerId: { type: "string" }, start: { type: "string", format: "date-time" }, end: { type: "string", format: "date-time" }, mode: { type: "string", enum: ["simulated", "real"] }, idempotencyKey: { type: "string" } }, required: ["spaceId", "printerId", "start", "end", "mode", "idempotencyKey"] },
  prepare: { type: "object", properties: { reservationId: { type: "string" }, artifactVersionId: { type: "string" }, materialId: { type: "string" }, profile: { type: "string" }, idempotencyKey: { type: "string" } }, required: ["reservationId", "artifactVersionId", "materialId", "profile", "idempotencyKey"] },
  submit: { type: "object", properties: { jobId: { type: "string" }, expectedFingerprint: { type: "string" }, approvalId: { type: "string" }, idempotencyKey: { type: "string" } }, required: ["jobId", "expectedFingerprint", "idempotencyKey"] },
  status: { type: "object", properties: { jobId: { type: "string" } }, required: ["jobId"] }
} as const;

export function useWebMCP() {
  const [supported, setSupported] = useState(false);
  const [activity, setActivity] = useState<Activity>({ title: "WebMCP ready", detail: "Waiting for Codex to call a room tool." });
  const [challenge, setChallenge] = useState<ApprovalChallenge | null>(null);

  useEffect(() => {
    const onApproval = (event: Event) => setChallenge((event as CustomEvent<ApprovalChallenge>).detail);
    window.addEventListener("3da:approval-required", onApproval);
    return () => window.removeEventListener("3da:approval-required", onApproval);
  }, []);

  useEffect(() => {
    const modelContext = document.modelContext;
    setSupported(Boolean(modelContext));
    if (!modelContext) return;
    const controller = new AbortController();
    const register = async () => {
      const tools: WebMCP.ModelContextTool[] = [
        { name: "list_printers", title: "List fabrication room printers", description: "List authorised printer availability and recommend a compatible machine in the labelled 3DA simulation room. This never controls physical hardware.", inputSchema: schemas.list, annotations: { readOnlyHint: true }, execute: (input) => simulator.listPrinters(input as { spaceId: string; mode?: "simulated" | "real" }) },
        { name: "reserve_printer", title: "Reserve a shared printer", description: "Reserve one named shared printer for a half-open time window after deterministic conflict and availability checks.", inputSchema: schemas.reserve, execute: (input) => { setActivity({ title: "Reservation requested by Codex", detail: `${String(input.printerId)} · audit trail updated` }); return simulator.reservePrinter(input as never); } },
        { name: "prepare_print_job", title: "Prepare an existing printable artifact", description: "Validate an existing artifact against the reservation, material, A1 profile, duration, and cleanup window. Does not start a printer.", inputSchema: schemas.prepare, execute: async (input) => { const response = await simulator.preparePrintJob(input as never); setActivity({ title: "Job prepared safely", detail: "Compatibility, duration, material, and reservation checked" }); return response; } },
        { name: "submit_print_job", title: "Submit an approved print job", description: "Submit a prepared job only after a person approves the exact fingerprint. The public deployment is simulation-only and never controls real hardware.", inputSchema: schemas.submit, execute: (input) => { const response = simulator.submitPrintJob(input as never); setActivity({ title: response.ok ? "Submission accepted" : "Human approval required", detail: response.ok ? "Simulator command is pending acknowledgement" : "The agent is paused at the physical-action boundary" }); return response; } },
        { name: "get_print_status", title: "Get print status", description: "Read the authorised job state, progress, freshness, approval state, and next valid actions.", inputSchema: schemas.status, annotations: { readOnlyHint: true }, execute: (input) => simulator.getPrintStatus(input as { jobId: string }) }
      ];
      await Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })));
      setActivity({ title: "5 WebMCP tools registered", detail: "Codex can discover, reserve, prepare, submit, and monitor" });
    };
    void register().catch(() => setActivity({ title: "WebMCP unavailable", detail: "The visual simulator still works in this browser." }));
    return () => controller.abort();
  }, []);

  const approve = () => {
    if (!challenge) return null;
    const approved = simulator.approve(challenge.id);
    if (approved) {
      setChallenge(null);
      setActivity({ title: "Approved by Peter", detail: `One-time approval ${approved.approvalId.slice(0, 18)}… is ready for Codex` });
    }
    return approved;
  };

  const runDemo = async () => {
    setActivity({ title: "Codex is preparing the OpenAI token", detail: "Booking Samantha and validating the A1 profile…" });
    await simulator.runSafetyDemo();
    setActivity({ title: "Agent paused safely", detail: "A human must approve the exact simulated job before submission" });
  };

  return { supported, activity, challenge, approve, runDemo, decline: () => setChallenge(null) };
}
