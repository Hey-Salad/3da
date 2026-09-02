# 3DA winner-informed style and quality bar

Status: research draft. This is not the formal guided PRD/spec/build plan; those remain gated by rules acknowledgment.

## Strategic centre

3DA is not an AI CAD generator. It is the trusted operating layer for a shared fabrication room.

> A meeting room can be booked. Why not a 3D printer?

> 3DA turns a shared fabrication room into an agent-ready service: people and agents can discover capacity, reserve a named printer, validate and submit a job, monitor the physical outcome, and recover from failure through one auditable WebMCP workflow.

The first end-to-end story is deliberately narrow:

1. A user asks Codex to print an existing, printable model.
2. Codex calls 3DA's WebMCP tools to inspect the London space and its printers.
3. 3DA checks material, duration, compatibility, queue conflicts, and policy.
4. The user sees the exact machine, cost, time, risks, and irreversible action, then confirms.
5. 3DA reserves the printer and sends the approved job through the local Mac mini bridge.
6. The user sees live status, an audit trail, and a completion or failure notification.

## What winning OpenAI projects signal

| Reference | What the presentation does well | What 3DA should borrow |
|---|---|---|
| Mechanica | A single museum-like 3D stage, restrained typography, sourced claims, and a README with live demo, tests, and explicit verification | Make the printer room the memorable hero; keep proof and safety visible |
| Dấu | One precise user problem, a strong task verb, immediate visual feedback, and a clean boundary between deterministic judging and LLM coaching | Use deterministic printer/policy logic; let the agent explain and orchestrate |
| veTriage / Pulse | Domain credibility, safety-first wording, auditability, and real operational context | Treat physical actions as high-consequence; show confirmation, refusal, and recovery |
| AirBridge | Frames the product as a bridge across a missing ecosystem boundary and exposes an activity inspector | Position WebMCP + the Mac mini relay as the bridge; show every agent action |
| Echo Canvas | A professional spatial workbench where the model, diagnostics, and AI assistance occupy distinct areas | Use a dual-view product: playful Room view plus precise Operations view |
| Sentinel | Exact threat model, layered architecture, mapped findings, and reproducible checks | Give every tool a policy contract, validation result, and audit event |

The common submission language is concrete rather than promotional:

- name one user and one painful moment;
- describe the system using observable verbs;
- state where AI is allowed and where deterministic code decides;
- show the proof, tests, and failure behaviour;
- make the first screenshot understandable without reading the full story.

## Recommended 3DA visual direction

Working name: **3DA** (spoken "Three-D-A"). Product descriptor: **The agent-ready fabrication room**.

Design idea: **playful digital twin, serious control surface**. It may borrow the warmth and block-like legibility of Minecraft, but it should not look like a game or use pixel-art textures. Use simplified physical forms, crisp CAD edges, tactile materials, and clear status lighting.

### Visual system

| Role | Direction |
|---|---|
| Background | Carbon `#0D1117` and workshop graphite `#171C22` |
| Surface | Warm paper `#F4F0E8` for confirmations and human-readable summaries |
| Primary accent | Electric chartreuse `#C7F464` for safe/available/approved actions |
| Agent accent | Cobalt `#5B6CFF` for WebMCP calls and Codex activity |
| Warning / failure | Amber `#FFB547` and coral `#FF665C`; never rely on colour alone |
| Typography | Geist Sans for UI; Geist Mono for tool calls, printer IDs, and telemetry |
| 3D treatment | Soft studio lighting, dark floor grid, slightly exaggerated status halos, low-detail but recognisable Bambu-style printer silhouettes |
| Motion | Slow camera drift only at rest; direct, short transitions during actions; no decorative particle effects |

### Primary screen: Room

- Header: `3DA · London Co-Working Space`, connection health, and `Room / Operations` switch.
- Centre: a navigable 3D room with Samantha, Simone, Sanda, Sacha, and Solange in stable physical positions.
- Each printer has a readable nameplate and status halo: Available, Reserved, Printing, Attention, or Offline.
- Left rail: people/agent intent in plain language, for example `Make 2 cable clips before 16:00`.
- Right drawer: selected job with thumbnail, material, estimated duration, cost, compatibility, and safety checks.
- Bottom timeline: WebMCP calls and resulting audit events, readable by a judge at a glance.
- The irreversible `Approve & send to Samantha` action uses a warm confirmation sheet, not a small modal.

### Secondary screen: Operations

- Dense queue table for staff: printer, owner, job, progress, ETA, material, policy state, and next action.
- Incident strip for bridge loss, spool mismatch, suspected spaghetti failure, or door/open-zone alerts.
- Tool activity inspector with inputs, policy decision, human confirmation, result, and timestamp.
- Camera tile appears only for a selected active job; computer-vision output is labelled as a suspicion with confidence, never as ground truth.

### Logo direction

Use a custom `3DA` wordmark where the `D` is also a printer gantry and the counter of the `A` becomes a small build plate or extruded layer. It should work as one colour first. Avoid a generic cube, robot head, sparkle, or gradient infinity mark.

## Submission wording

### Title and one-line pitch

**3DA — The agent-ready fabrication room**

Book a shared 3D printer from Codex or the web, validate the job, approve the physical action, and watch it complete through one safe WebMCP workflow.

### Three proof statements

- **Native agent control:** 3DA exposes printer discovery, reservation, preparation, approval, submission, and monitoring as structured WebMCP tools.
- **Safe physical action:** deterministic policy checks and explicit human confirmation separate planning from sending a real print.
- **Real shared-space infrastructure:** a local Mac mini bridge keeps printer credentials and LAN control on site while the hosted control plane remains available to members and staff.

### README order

1. Hero screenshot and one-sentence outcome.
2. Live demo, 2-minute video, and quick-start links.
3. `Why WebMCP?` with the exact browser-to-room workflow.
4. A 30-second golden-path walkthrough.
5. Tool table with read/write/risk/confirmation semantics.
6. Architecture diagram: Vercel control plane, WebMCP surface, Cloudflare tunnel, Mac mini bridge, printer.
7. Safety and trust model.
8. Automated test/evaluation commands and latest results.
9. Known limitations and honest fallbacks.
10. What was built during the hackathon versus reused.

## Demo video structure (target 2:10–2:30)

| Time | Evidence on screen |
|---|---|
| 0:00–0:10 | A physical finished object beside the printer; hook: `A meeting room can be booked. Why not a 3D printer?` |
| 0:10–0:25 | Five people, five named printers, conflicting demand, and the old fragmented workflow |
| 0:25–1:15 | Codex discovers the room, finds capacity, reserves Samantha, and prepares a real job through visible WebMCP calls |
| 1:15–1:35 | 3DA blocks submission until checks pass and the user confirms the exact physical action |
| 1:35–1:55 | Mac mini bridge sends the job; Room view changes to Printing; real camera/printer footage confirms it |
| 1:55–2:12 | Failure or bridge-offline path produces a safe refusal plus staff notification and audit record |
| 2:12–2:25 | Architecture in one diagram and final physical result |

Do not begin with a talking-head introduction, a long logo animation, or architecture. Put the physical result and the agent action first.

## Draft acceptance and satisfaction gates

These become the formal acceptance criteria after the guided PRD/spec flow is unlocked.

| ID | Criterion | Passing evidence |
|---|---|---|
| WEB-01 | WebMCP discovery works in the deployed app | A supported agent lists 3DA tools and calls `list_printers` without DOM guessing |
| WEB-02 | Tool descriptions are unambiguous | Blind prompt test selects the intended tool in at least 9 of 10 golden-path runs |
| OPS-01 | Availability is truthful | UI, WebMCP response, and persistence agree on all five printer states |
| OPS-02 | Double booking is impossible | Two concurrent reservations yield one success and one deterministic conflict response |
| JOB-01 | Preparation is non-destructive | `prepare_print_job` performs validation and creates no printer-side job |
| SAFE-01 | Physical submission requires consent | `submit_print_job` without a current approval token causes no printer/network side effect |
| SAFE-02 | Approval is specific | Confirmation names printer, file, material, estimate, cost, user, and expiry |
| SAFE-03 | Unsafe or incompatible jobs fail closed | Invalid material/profile, excessive duration, missing slice, or policy breach returns an actionable refusal |
| EDGE-01 | Bridge failure is safe | With the Mac mini bridge offline, the job remains queued/not-sent, the UI explains why, and retry is idempotent |
| EDGE-02 | Duplicate send is prevented | Repeating a submission with the same idempotency key creates at most one physical job |
| AUD-01 | Every material action is traceable | Reservation, approval, submission, cancellation, and override record actor, source, inputs, decision, and timestamp |
| MON-01 | Monitoring reconciles state | Printer/bridge status updates the hosted UI and tool response within 15 seconds under demo conditions |
| CV-01 | Vision is advisory | A suspected failure includes confidence/evidence and requires policy-defined confirmation before cancellation |
| UX-01 | The golden path is legible | A fresh tester can reserve and approve a prepared job from the web in under 90 seconds without coaching |
| DEMO-01 | Public demo is judge-ready | Public YouTube with audio, under 3 minutes, best material in first 30 seconds, no login or local setup required to understand it |
| REL-01 | Deployment survives judge access | Vercel app loads in a clean browser; a mock/simulator path remains available if physical hardware is temporarily unreachable |
| DOC-01 | Reproduction is credible | Public repo includes licence, setup, architecture, tool contract, tests, limitations, and hackathon-new-work disclosure |

### Definition of judge satisfaction

A submission build is ready only when a judge can answer all five questions from the demo and README:

1. Who needs this and why now?
2. Why does WebMCP materially improve the workflow?
3. What real physical action happened?
4. What prevents an agent from doing the wrong thing?
5. Can this become useful beyond the demo?

## Scope discipline

### Must ship

- deployed Room view and Operations view;
- real WebMCP discovery and four-tool golden path: list, reserve, prepare, submit;
- explicit confirmation and audit log;
- working Mac mini bridge to at least one real printer, plus simulator fallback;
- visible status monitoring;
- automated contract, concurrency, safety, and end-to-end tests;
- polished README, screenshots, and sub-3-minute video.

### Ship only after the golden path

- SMS completion/failure notifications;
- camera-based failure suspicion;
- staff cancellation/retry flow;
- multiple material/spool profiles.

### Defer

- AI-generated CAD as a core feature;
- full slicer replacement;
- printer marketplace, payments, or multi-site administration;
- autonomous cancellation based solely on computer vision;
- photorealistic metaverse room.

