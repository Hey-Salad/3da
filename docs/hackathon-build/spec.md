# 3DA Technical Specification

## Overview

3DA is a local-first, open-source control plane for shared 3D printers. The hackathon implementation couples a public Next.js experience and browser-native WebMCP tools with a Cloudflare Worker control API, D1 system of record, private R2 artifact storage, and an outbound-polling Mac mini bridge connected to a real Bambu Lab A1.

The implementation must preserve one invariant above all others:

> No consequential physical action occurs unless the current actor, reservation, job version, readiness state, execution mode, and one-time approval all match.

The public deployment defaults to an isolated simulator. Real printer operation requires an authenticated operator and a configured local bridge; simulation state or approval can never cross into real mode.

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Shared contracts and parallel builds without duplicating types |
| Web | Next.js App Router + TypeScript | Reliable Vercel deployment and strong server/client separation |
| Visual room | React Three Fiber + Drei | Purpose-built lightweight 3D room with accessible DOM equivalents |
| Styling | Tailwind CSS + accessible headless primitives + Geist | Fast, consistent, keyboard-accessible UI |
| API | Cloudflare Worker using Hono | Small typed HTTP surface close to D1/R2 bindings |
| Validation | Zod + JSON Schema generation | One source for HTTP and WebMCP validation |
| Database | Cloudflare D1 | Transactional control records and simple local migrations |
| Private objects | Cloudflare R2 | Artifacts, sliced files, and authorised camera evidence |
| Local bridge | Node.js + TypeScript service | Reuses contracts and runs continuously on the Mac mini |
| Printer/slicer | Adapter boundary around verified Bambu A1 integration and Bambu Studio CLI | Keeps unreliable/versioned vendor behavior out of domain logic |
| Unit/contract tests | Vitest | Fast deterministic policy and adapter tests |
| Browser tests | Playwright | Web journeys, approval, privacy, and simulator verification |
| Deployment | Vercel + Cloudflare Workers/D1/R2 + existing Cloudflare Tunnel | Uses available accounts and keeps printer credentials local |

Render is not on the golden-path critical path. It may host a persistent CV or notification worker only after the core system is verified.

## Architecture

### Trust boundaries

1. **Browser boundary:** WebMCP input is untrusted and always revalidated by the API. Tool annotations improve agent behavior but do not grant authority.
2. **Control-plane boundary:** the Worker authenticates the user, authorises the role, applies deterministic policy, persists state, and appends audit events.
3. **Object boundary:** R2 remains private. The Worker issues short-lived, operation-specific object access and never stores presigned URLs in audit events.
4. **Site boundary:** the Mac mini holds printer credentials. The hosted system never receives the A1 access code or unrestricted LAN access.
5. **Physical boundary:** the bridge executes only claimed, unexpired, real-mode commands whose server-side approval and job fingerprint remain valid. A per-printer fencing token prevents two bridge processes from executing concurrently.
6. **Simulation boundary:** simulation uses separate IDs, commands, approvals, and provenance; it cannot resolve to the real adapter.

### Component topology

```text
Codex / browser agent
        │ WebMCP
        ▼
Next.js web app on Vercel
  Room · Operations · Approval · Tool registry
        │ HTTPS + authenticated session
        ▼
Cloudflare control Worker
  validation · policy · projections · object grants
        ├───────────────┐
        ▼               ▼
Cloudflare D1       Private R2
control records     artifacts/evidence
        │
        │ outbound claim/acknowledge polling
        ▼
Mac mini bridge
  slicer adapter · A1 adapter · reconciliation
        │ LAN/developer mode
        ▼
Bambu Lab A1
```

### Deployment modes

- `simulated`: public/judge-safe; identical API and state-machine contracts, seeded actors and deterministic scenarios.
- `real`: authenticated operator-only; commands must be claimed by the configured bridge.
- `local`: open-source single-machine setup; local web/Worker emulation/D1/R2 equivalents may run together, while retaining the same contracts.

Local reproducibility uses `wrangler dev --persist-to .wrangler/state`, local D1 migrations, local R2 bindings, and one documented seed command. `.env.example` contains names only; real secrets remain untracked. The README must provide a single path from clone to seeded simulator before the “local-first” claim is used in submission copy.

## PRD-to-Architecture Mapping

| PRD epic | Components |
|---|---|
| Epic 1: Discover The Room | Room projection, printer capability model, WebMCP registry, printer query service |
| Epic 2: Reserve Capacity | Reservation service, 15-minute slot locks, waitlist, notification outbox |
| Epic 3: Prepare The Job | Artifact service, R2 grants, preparation policy, technician tasks, slicer adapter |
| Epic 4: Review And Approve | Approval sheet, job fingerprinting, approval service, policy engine |
| Epic 5: Print, Monitor, And Collect | Command outbox, bridge, A1/simulator adapters, telemetry reconciliation, collection state |
| Epic 6: Operate And Audit | Operations projection, append-only events, incident service, role-based views |

## Domain Model

All IDs are opaque UUIDs. All timestamps use UTC ISO-8601 at boundaries and integer epoch milliseconds internally where convenient.

### Principal tables

- `spaces`: space identity, display name, timezone, configurable grace/retention policy.
- `memberships`: actor, space, role (`owner`, `member`, `technician`, `manager`).
- `printers`: stable name, adapter type, mode, capability JSON, current observed state, freshness time.
- `materials`: spool/stock identity, owner, type, colour, estimated remaining grams, location.
- `reservations`: owner, printer, start/end, status, mode, artifact reference, preparation status.
- `reservation_slots`: printer, 15-minute slot start, reservation ID; unique on `(printer_id, slot_start)`.
- `waitlist_entries`: requested window, order time, status, bounded offer expiry.
- `artifacts`: owner, R2 key, media type, size, checksum, retention/deletion state.
- `artifact_versions`: immutable checksum and metadata used by jobs.
- `print_jobs`: reservation, artifact version, printer, material, settings, state, fingerprint, estimates.
- `preparation_checks`: job version, check type, result, evidence, completing actor/time.
- `preparation_tasks`: job, assignee/role, task type, status, deadline, operational note.
- `approval_challenges`: actor, action, job fingerprint, mode, nonce hash, status, challenge expiry, creation time.
- `approvals`: challenge, actor, action, job fingerprint, mode, approval expiry, used time, user-activation evidence class.
- `bridge_commands`: job, printer, command type, idempotency key, claim/lease, fencing token, state, attempt, payload fingerprint.
- `printer_observations`: printer/job, state, progress, vendor job ID, observed time, provenance.
- `incidents`: job, type, confidence/evidence, state, resolution.
- `audit_events`: append-only actor/source/action/input summary/policy/result/time/correlation ID.
- `notifications`: recipient, channel, event type, delivery state, rendered summary.

### State transitions

Three state machines remain separate:

```text
Printer observation: AVAILABLE | BUSY | ATTENTION | OFFLINE | UNKNOWN
Reservation: HELD | CONFIRMED | EXPIRED | CANCELLED | COMPLETED
Job: DRAFT → WAITING_FOR_PREPARATION → READY_FOR_APPROVAL → APPROVED
     → SUBMISSION_PENDING → PRINTING → AWAITING_COLLECTION → COMPLETED
     Any active job → NEEDS_ATTENTION | NEEDS_RECONCILIATION | CANCELLED
```

Room availability is a projection, not a stored job state. A printer is bookable only when its observation is sufficiently fresh, no blocking job occupies it, and the requested half-open UTC interval `[start, end)` has no reserved slot. `OFFLINE` preserves reservation/job state rather than rewriting it.

Transitions are domain functions, not arbitrary database updates. Each accepted transition and each refusal appends an audit event within the same logical operation.

### Job fingerprint

The approval-bound SHA-256 fingerprint is computed over a canonical representation of:

- actor ID;
- execution mode;
- reservation ID and window;
- printer ID and capability/profile version;
- artifact-version checksum;
- material ID/type;
- consequential slice/print settings;
- preparation-check version.

Changing any input creates a different fingerprint, marks previous readiness stale, and prevents old approval reuse.

## Reservation Concurrency

Reservation windows are half-open UTC intervals `[start, end)` expanded outward to 15-minute `reservation_slots`. A D1 batched transaction inserts the reservation and every slot. The unique `(printer_id, slot_start)` constraint guarantees that simultaneous conflicts cannot both commit. Preparation and submission both require `expectedFinish + cleanupBuffer <= reservation.end`; otherwise the job is blocked or requires an audited manager decision. On conflict, the API queries the next compatible window and current waitlist option.

Manager overrides never mutate history silently: the prior reservation is transitioned, the reason is mandatory, affected actors receive notifications, and new slot ownership is committed with audit records.

## Artifact And Evidence Storage

- R2 buckets are private.
- Upload begins with a short-lived PUT grant restricted to one generated object key, expected content type, and size policy.
- The client proposes a checksum during finalisation, but the object is not trusted from that claim alone. The Worker verifies object presence, size, and controlled metadata; the bridge computes SHA-256 over downloaded bytes and compares it with the immutable artifact-version checksum before execution. A mismatch is refused and audited.
- Download/preview grants are short-lived and issued only after record-level authorisation.
- R2 URLs, credentials, raw private filenames, and camera bytes do not enter general audit summaries.
- Retention defaults to seven days after terminal job state; owner deletion removes private content while retaining minimal non-content audit facts.

## WebMCP Registration

The active page registers imperative tools through `document.modelContext.registerTool(...)`. Registration code imports JSON Schemas generated from the shared Zod contracts. It uses an `AbortController` for lifecycle cleanup and registers read-only annotations for discovery/status tools.

Tool execution calls the same authenticated Worker API as the visible UI, then updates/revalidates the selected Room/Operations context. Browser hints and `requestUserInteraction` may improve presentation, but the server-side approval record is the security boundary.

Cross-origin exposure is disabled by default. If required for a trusted integration, `exposedTo` contains an explicit allowlist of secure origins.

## Shared Tool Result

```ts
type ToolResult<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
    nextActions: string[];
  };
  provenance: {
    mode: "real" | "simulated";
    observedAt: string;
  };
  auditEventId: string;
};
```

Errors must state whether a physical side effect occurred. Unknown acknowledgement never reports success or invites blind retry.

## WebMCP Tool Contracts

### `list_printers`

Implements: `prd.md > Epic 1 > Stories 1.1–1.2`

- Read-only.
- Input: `spaceId`, optional time window, artifact requirements, material preference, mode.
- Output: authorised availability summaries, capabilities, current/next state, freshness, ranked recommendation factors.
- Errors: `SPACE_NOT_FOUND`, `STATUS_STALE`, `NO_COMPATIBLE_PRINTER`.

### `reserve_printer`

Implements: `prd.md > Epic 2 > Stories 2.1–2.4`

- Mutable; requires authenticated actor and idempotency key.
- Input: `spaceId`, `printerId`, start/end, mode, optional artifact/material/preparation request.
- Output: reservation, occupied slots, grace expiry, preparation status, conflict alternative/waitlist offer.
- Errors: `RESERVATION_CONFLICT`, `PRINTER_UNAVAILABLE`, `POLICY_DENIED`, `INVALID_WINDOW`.

### `prepare_print_job`

Implements: `prd.md > Epic 3`

- Mutable control-plane operation but non-destructive to hardware.
- Input: reservation ID, artifact version ID, material ID, selected profile/settings, idempotency key.
- Output: immutable job version/fingerprint, compatibility checks, readiness tasks, duration/material estimates, warnings.
- Errors: `ARTIFACT_NOT_READY`, `INCOMPATIBLE_PROFILE`, `MATERIAL_UNAVAILABLE`, `RESERVATION_INVALID`, `PREPARATION_REQUIRED`.

### `get_print_job`

Implements: `prd.md > Stories 1.3, 4.1, 5.2`

- Read-only and record-authorised.
- Input: job ID.
- Output: authorised job summary, preparation, approval requirement, next valid actions, deep-link target.
- Errors: `NOT_FOUND`, `FORBIDDEN` without metadata leakage.

### User-activated approval challenge

Implements: `prd.md > Epic 4`

Approval is **not** a freely callable WebMCP tool. `submit_print_job` may return an action-specific approval challenge and deep link. A user-activated control in the trusted approval surface finalises the challenge. The server ignores client claims about the interaction surface and binds the resulting approval to actor, action, job fingerprint, mode, nonce, and expiry. The same challenge mechanism protects cancel, retry, release, and override.

- Challenge request: job ID, intended action, expected fingerprint.
- Human finalisation: server-issued nonce plus explicit user activation in an authenticated approval surface.
- Output: one-time approval ID/expiry or recorded decline.
- Errors: `JOB_CHANGED`, `NOT_READY`, `FORBIDDEN`, `CHALLENGE_EXPIRED`, `APPROVAL_EXPIRED`.

### `submit_print_job`

Implements: `prd.md > Stories 5.1–5.3`

- Consequential; never infers consent.
- Input: job ID, expected fingerprint, approval ID, idempotency key.
- Output: accepted bridge command ID and `SUBMISSION_PENDING`; later verified acknowledgement supplies the vendor job ID and transitions to `PRINTING`.
- Errors: `APPROVAL_REQUIRED`, `APPROVAL_MISMATCH`, `APPROVAL_USED`, `RESERVATION_INVALID`, `BRIDGE_OFFLINE`, `NEEDS_RECONCILIATION`.
- The operation atomically consumes approval and creates at most one command for the idempotency key. A command that has ever been claimed cannot become executable again merely because its lease expired; it transitions to `NEEDS_RECONCILIATION`.

### `get_print_status`

Implements: `prd.md > Story 5.2`

- Read-only.
- Input: job ID.
- Output: job/printer state, progress when available, freshness, authorised evidence summary, next actions.
- Errors: `NOT_FOUND`, `FORBIDDEN`, `STATUS_STALE`.

### `cancel_print_job`

Implements: `prd.md > Stories 5.3–5.4`

- Consequential; requires fresh human confirmation and idempotency key.
- Input: job ID, expected state/fingerprint, reason, approval ID.
- Output: command/result or `NEEDS_RECONCILIATION`.
- Errors: `INVALID_STATE`, `APPROVAL_REQUIRED`, `BRIDGE_OFFLINE`, `NEEDS_RECONCILIATION`.

### `resolve_print_incident`

Implements: `prd.md > Story 5.4`

- Input: incident ID, resolution (`retry`, `cancel`, `release`, `request_technician`), reason, approval when consequential, idempotency key.
- Output: new state/task/command and stakeholder notification records.
- Retry creates a new job attempt/fingerprint and requires fresh readiness and approval.

### `confirm_plate_clear`

Implements: `prd.md > Story 5.5`

- Consequential availability transition with authenticated owner/technician/manager.
- Input: job ID, evidence type (`human`, `camera_assisted`), optional note, idempotency key.
- Output: completed job and newly available printer.
- Uncertain camera evidence cannot supply confirmation by itself.

## HTTP API

The Worker exposes versioned endpoints corresponding to domain services, not arbitrary database access:

```text
GET    /v1/spaces/:spaceId/printers
POST   /v1/reservations
POST   /v1/reservations/:id/waitlist
POST   /v1/artifacts/upload-grant
POST   /v1/artifacts/:id/finalize
POST   /v1/jobs/prepare
GET    /v1/jobs/:id
POST   /v1/jobs/:id/approval-challenges
POST   /v1/jobs/:id/approval-challenges/:challengeId/finalize
POST   /v1/jobs/:id/submit
GET    /v1/jobs/:id/status
POST   /v1/jobs/:id/cancel
POST   /v1/jobs/:id/plate-clear
POST   /v1/incidents/:id/resolve
GET    /v1/operations
GET    /v1/audit

POST   /v1/bridge/commands/claim
POST   /v1/bridge/commands/:id/ack
POST   /v1/bridge/observations
POST   /v1/bridge/evidence/upload-grant
```

All mutable endpoints accept `Idempotency-Key`. Bridge endpoints use a separate machine credential and narrow scope. No endpoint accepts raw printer host, access code, shell command, or arbitrary R2 key from a browser client.

## Authentication And Authorisation

For the hackathon, public sessions can select only seeded simulator identities and roles. Real sessions are server-minted, short-lived cookies with `HttpOnly`, `Secure`, and `SameSite=Strict`; mutation endpoints enforce origin/CSRF checks. Real-mode privileges are granted only through an operator bootstrap secret/session that is not exposed in the repository or public demo. The bridge credential is scoped to one space, real mode, supported adapter, and explicit printer allowlist.

Authorisation is enforced in the Worker for every record. UI hiding is not access control. Production-grade identity, invitations, and organisation administration remain post-hackathon work.

## Bridge Protocol

The Mac mini initiates all control traffic:

1. Authenticate to `/bridge/commands/claim` with a narrow machine credential.
2. Long-poll or poll with supported adapter names and last observation cursor.
3. Atomically claim one unexpired command under a short lease and acquire the current per-printer fencing token.
4. Revalidate command mode, fingerprint, type, and local adapter capability.
5. Retrieve a short-lived artifact grant, hash the downloaded bytes, and compare them to the immutable approved checksum.
6. Execute through the A1 or slicer adapter only while holding the valid fencing token.
7. Acknowledge with success, deterministic failure, or indeterminate status plus vendor job ID/evidence.
8. Continue publishing observations independently of commands.

If the bridge crashes after claim or execution but before acknowledgement, the command enters reconciliation and is never automatically reclaimed for execution. The adapter queries the printer for a matching vendor job/fingerprint. Only verified vendor state or an explicit authorised operator resolution can move it forward; a blind retry is forbidden.

### A1 capability gate

Before building the full control plane, the exact Mac mini/A1 setup must prove a bounded capability spike using the verified token file and record the installed firmware and Bambu Studio versions:

1. Observe current printer state.
2. Upload/start the verified file.
3. Obtain or derive a stable vendor job identifier.
4. Poll progress and completion.
5. Reconcile after deliberately withholding the server acknowledgement.
6. Cancel safely.

If stable identification or reconciliation cannot be proven, the live demo must use a human-operated Bambu Studio handoff and describe it honestly; it must not claim autonomous safe submission.

### A1 adapter

The adapter interface exposes:

```ts
interface PrinterAdapter {
  capabilities(): Promise<PrinterCapabilities>;
  observe(): Promise<PrinterObservation>;
  submit(job: PreparedLocalJob): Promise<SubmissionAck>;
  cancel(vendorJobId: string): Promise<CommandAck>;
  captureEvidence?(): Promise<EvidenceCapture>;
  reconcile(command: BridgeCommand): Promise<ReconciliationResult>;
}
```

The A1 host/access code and any vendor networking details live only in the bridge secret store. Developer/LAN mode is required for the demo configuration.

### Slicer adapter

The initial reliable real path accepts a verified, pre-sliced `.3mf` for the OpenAI token. Automated Bambu Studio CLI slicing is isolated behind `SlicerAdapter` and is enabled only after a local fixture proves deterministic output for the installed version and A1 profile.

Slicer output includes checksum, Bambu Studio version, printer profile, material profile, duration estimate, material estimate, and captured logs. CLI failure never falls through to unsliced submission.

## Simulator

The simulator implements `PrinterAdapter` using a deterministic virtual clock/state machine. Seeded scenarios include:

- successful immediate reservation and print;
- future reservation and technician preparation;
- simultaneous conflict;
- bridge/printer offline;
- failure requiring intervention;
- completion awaiting collection.

All simulator IDs carry mode in the record, every visual surface shows a persistent `SIMULATED` badge, and API policy rejects mixed-mode references.

## UI Components And Responsibilities

### Room shell

Implements: `prd.md > Product Surfaces > Room view`, Epic 1, and visible portions of Epic 5.

- Renders lightweight spatial printers and status halos.
- Maintains accessible DOM cards containing the same names/states/actions.
- Opens printer/job drawers through URL-addressable state.
- Shows persistent mode and freshness indicators.

### Operations console

Implements: `prd.md > Epic 6`.

- Queue, preparation, active print, attention, and collection sections.
- Role-filtered detail and action controls.
- Audit timeline with WebMCP/human/bridge/printer source markers.

### Approval sheet

Implements: `prd.md > Epic 4`.

- Fetches the current server-computed fingerprint summary.
- Requires explicit decision; never approves from a generic navigation action.
- Detects stale details and reloads rather than presenting an outdated confirmation.

### WebMCP registry

Implements: all agent-facing stories.

- Registers stable tools once per active document lifecycle.
- Executes through generated clients and renders/deep-links relevant result context.
- Returns concise structured results; it never embeds private object grants in model-visible text.

## File Structure

```text
3da/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Room route
│   │   │   ├── operations/page.tsx      # Operations route
│   │   │   ├── jobs/[jobId]/page.tsx    # Job/deep-link route
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── room/                    # 3D scene + accessible printer cards
│   │   │   ├── operations/              # queues, incidents, audit
│   │   │   └── approval/                # consequential-action sheet
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   ├── session.ts
│   │   │   └── webmcp/register-tools.ts
│   │   └── public/models/               # optimised visual assets only
│   ├── control-worker/
│   │   ├── src/
│   │   │   ├── index.ts                 # Hono entry point
│   │   │   ├── middleware/              # auth, idempotency, correlation
│   │   │   ├── routes/                  # versioned user + bridge routes
│   │   │   ├── services/                # reservations, jobs, approval, audit
│   │   │   └── projections/             # Room/Operations read models
│   │   ├── migrations/                   # D1 schema
│   │   └── wrangler.jsonc
│   └── bridge/
│       ├── src/
│       │   ├── main.ts                   # poll/claim/ack loop
│       │   ├── config.ts                 # secret-backed local config
│       │   ├── adapters/bambu-a1.ts
│       │   ├── adapters/bambu-slicer.ts
│       │   └── reconciliation.ts
│       └── launchd/                      # Mac mini service definition/template
├── packages/
│   ├── contracts/src/                    # Zod schemas, JSON schemas, API types
│   ├── domain/src/                       # pure state/policy/fingerprint logic
│   ├── simulator/src/                    # deterministic PrinterAdapter
│   └── ui/src/                           # tokens and shared UI primitives
├── assets/demo/                          # non-secret demo metadata/fixtures
├── tests/
│   ├── contracts/
│   ├── safety/
│   ├── integration/
│   └── e2e/
├── docs/hackathon-build/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Primary Data Flow

1. The Next.js page loads an authorised Room projection and registers WebMCP tools.
2. Codex invokes `list_printers`; the browser validates shape and sends an authenticated query to the Worker.
3. The Worker validates again, reads current printer projection/slots, appends the discovery audit event, and returns mode/freshness.
4. `reserve_printer` atomically writes a reservation plus slot locks; conflict returns alternatives without partial state.
5. The browser obtains a short-lived upload grant, sends the artifact directly to R2, then finalises checksum/metadata.
6. `prepare_print_job` creates a fingerprinted job version and deterministic checks. Optional slicing becomes a bridge task; the reliable demo uses a verified pre-sliced artifact.
7. The server renders the approval facts for that fingerprint. Human approval creates a one-time record.
8. `submit_print_job` atomically consumes approval, enqueues exactly one bridge command, and transitions to `SUBMISSION_PENDING`.
9. The Mac mini claims the command, verifies downloaded bytes, sends it to the A1, and acknowledges the vendor job identity. Only this verified acknowledgement transitions the job to `PRINTING`; timeout becomes `NEEDS_RECONCILIATION`.
10. Observations update the job/printer projection and append events; Room, Operations, and Codex read that same projection.
11. Completion becomes `AWAITING_COLLECTION`; human or camera-assisted human confirmation releases the printer.

## AI Usage

AI is bounded to tasks where ambiguity is useful:

- Codex interprets project context and chooses which structured tool to call.
- An optional model explains recommendations and validation results using authoritative structured facts.
- Optional vision produces advisory plate/failure evidence with confidence and uncertainty.

AI does not decide reservation uniqueness, permission, job compatibility rules, approval validity, idempotency, command execution, or printer release. These are deterministic domain operations.

## Security And Privacy

- Secrets exist only in platform secret stores or the Mac mini configuration.
- No real printer credentials, access codes, raw LAN addresses, presigned URLs, or private model contents enter tool responses or logs.
- Tool descriptions and artifact-derived text are treated as untrusted content and cannot alter policy.
- Worker rate limits protect mutable and bridge endpoints.
- CORS is restricted to configured app origins; bridge routes use separate authentication.
- Real-mode operator privileges are unavailable in public simulator sessions.
- Every consequential refusal records why and whether any side effect occurred.

## Testing And Verification

### Deterministic tests

- State-transition tables cover every allowed and forbidden transition.
- Fingerprint tests prove every consequential change invalidates approval.
- Concurrent reservation tests prove only one slot set commits.
- Idempotency tests prove duplicate requests create at most one command.
- Mixed-mode tests prove simulator references cannot authorise real actions.
- Authorisation tests cover owner/member/technician/manager views and deep links.

### Contract tests

- Generated WebMCP schemas and HTTP contracts share the same fixtures.
- The simulator and A1 adapter pass the same adapter contract suite.
- Tool responses always contain provenance, observation time, audit ID, and side-effect clarity.
- Claimed commands never become executable again solely because a lease expires, and fencing rejects a second executor.
- The bridge rejects bytes whose computed checksum differs from the approved artifact version.

### End-to-end tests

- Immediate reserve → prepare → approval-required refusal → approve → submit → print → collect.
- Future reservation with technician preparation.
- Conflict with alternative/waitlist.
- Artifact/material change invalidates approval.
- Bridge offline preserves unsent state.
- Indeterminate acknowledgement blocks retry pending reconciliation.
- Unauthorised user cannot retrieve private artifact/evidence detail.
- Public simulator is fully usable and persistently labelled.

### WebMCP evaluations

At least ten runs per golden prompt family measure intended tool selection and valid argument construction. Target: intended tool chosen in at least 9/10 runs. Deterministic operations retain normal tests regardless of eval result.

## Risks And Mitigations

| Risk | Mitigation / verification |
|---|---|
| Bambu Studio CLI varies by installed version | Use verified pre-sliced 3MF for live proof; gate automatic slicing behind a fixture test |
| Vendor/LAN protocol changes | Isolate A1 behavior in one adapter and document verified firmware/software versions |
| Bridge executes but acknowledgement is lost | Non-reclaimable reconciliation state, fencing token, and vendor-job query before any operator resolution |
| D1 concurrency assumptions | Unique slot constraints plus concurrent integration test; never rely only on preflight reads |
| WebMCP API is emerging | Feature detection, stable fallback UI, schema fixtures, Chrome/Codex live verification |
| Public judges cannot reach hardware | Complete simulator with identical contracts and recorded real-printer evidence |
| 3D scene consumes schedule/performance | Start with primitives/low-poly assets and accessible DOM; cap rendering complexity |
| Camera falsely declares safety | Advisory-only confidence; uncertain results require human confirmation |
| Multi-platform deployment increases failure surface | Keep Worker/DB/object control together; do not add Render before golden-path proof |
| Demo identity is mistaken for production auth | Clearly document seeded sessions and protect real mode separately |

## Architecture Self-Review

1. Nine WebMCP tools are the complete eventual product surface. Approval is intentionally not an agent-callable tool. Only five (`list_printers`, `reserve_printer`, `prepare_print_job`, `submit_print_job`, `get_print_status`) plus the user-activated approval surface belong in the submission MVP.
2. Full automated slicing is the highest avoidable demo risk. The pre-sliced token proves orchestration honestly while leaving slicing as a separately verified adapter.
3. A custom auth product would not improve the judge story. Seeded simulator identities and protected operator mode satisfy the MVP while Worker-side authorisation preserves the correct boundary.
4. Real-time streaming is optional. Polling/revalidation is sufficient for the demo if state freshness is visible and meets the PRD target; WebSockets should not precede safety tests.
5. Future booking, waitlists, technician tasks, arbitrary uploads, incidents, SMS/CV, and a full Operations console are stretch implementations. Seeded data may illustrate them, but submission claims must distinguish demonstrated behavior from roadmap behavior.

## Demo And Submission Flow

1. Seed London Co-Working Space, five named printers, roles, materials, and deterministic simulator scenarios.
2. Keep the public Vercel URL in simulator mode by default.
3. Record the real A1 path using an authenticated operator session and verified OpenAI-token 3MF.
4. Show WebMCP discovery/recommendation and the immediate token booking. The future XIAO enclosure appears only as a clearly labelled seeded product preview unless future booking has passed its end-to-end tests.
5. Demonstrate an unapproved submission refusal.
6. Approve the exact token fingerprint, submit once, and show bridge/printer acknowledgement plus the audit timeline.
7. Show the physical token and `AWAITING_COLLECTION` → `COMPLETED` plate-clear transition.
8. Finish with a deterministic simulator failure/offline recovery and one architecture frame.

## External APIs And Primary References

- WebMCP specification: https://github.com/webmachinelearning/webmcp
- Chrome imperative WebMCP API: https://developer.chrome.com/docs/ai/webmcp/imperative-api
- Chrome WebMCP security guidance: https://developer.chrome.com/docs/ai/webmcp/secure-tools
- Chrome WebMCP evaluations: https://developer.chrome.com/docs/ai/webmcp/evals
- Cloudflare D1 Worker API and transactional batch behavior: https://developers.cloudflare.com/d1/worker-api/d1-database/
- Cloudflare R2 Worker API: https://developers.cloudflare.com/r2/api/workers/workers-api-reference/
- Cloudflare R2 presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- Bambu Studio source: https://github.com/bambulab/BambuStudio
- Bambu Studio command-line usage: https://github.com/bambulab/BambuStudio/wiki/Command-Line-Usage
