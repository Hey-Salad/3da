# Project Scope

## Project Name Candidates

- **3DA** — confirmed product name; spoken “Three-D-A”
- Product descriptor: **The agent-ready fabrication room**
- Demo space: **London Co-Working Space**

## One-Line Summary

3DA is an open-source, local-first operating layer that lets people and agents safely reserve, prepare, approve, submit, and monitor jobs on shared 3D printers through WebMCP.

## Time Budget

- Hard deadline: September 3, 2026 at 9:00 PM Europe/London.
- Execution strategy: use the remaining wall-clock time rather than a fixed personal-hours budget; parallelise code generation where practical, with Codex reviewing architecture, diffs, tests, and commits.
- Non-parallel critical path: real-printer verification, deployment verification, recovery testing, screenshots, and demo recording.
- Scope rule: the four-tool real-printer golden path must work before conditional features receive build time.

## Target User

### Primary users

- A maker or family member sharing one or two printers at home
- A coworking-space member who needs a printer for a project
- A school, lab, or makerspace member using a shared fabrication room
- A fabrication-room technician or manager preparing and supervising jobs
- A small fleet operator who needs scheduling, accountability, and repeatable configurations

### Demo actors

- **Maker/job owner:** supplies project context and an artifact, books a printer, and approves physical actions
- **Technician/space manager:** prepares filament or the machine, sees operational evidence, and handles incidents
- **Codex/agent:** discovers capacity, recommends a machine, prepares the job, and orchestrates the workflow through WebMCP
- **3DA local bridge:** performs approved printer-side actions and reports state

## Problem

Moving a finished design into a real shared print is fragmented. A person may need to export files, open Bambu Studio, restore the right printer and material settings, check whether the machine is available, coordinate with other users, load filament, start the job, and monitor it in separate tools. In shared spaces, informal assumptions about availability and material ownership create conflicts and make responsibility difficult to establish.

Existing slicers and printer-control tools operate machines, but they do not provide one agent-native contract for reservations, preparation, permission, material accountability, physical approval, and audit history.

3DA begins where design ends. Codex may use existing CAD tools or skills to produce an artifact—for example, an enclosure for a XIAO MG24 device—but 3DA owns the safe transition from that artifact to a booked and observable physical job.

## Core Workflow

1. The maker gives Codex project context and identifies or produces a printable artifact.
2. Codex calls 3DA through WebMCP to discover the London space, named printers, availability, capabilities, materials, and policy.
3. 3DA recommends a suitable printer using deterministic compatibility, scheduling, material, duration, and policy checks.
4. The maker reserves the printer immediately or for a future slot and uploads the artifact.
5. If physical preparation is needed, 3DA creates a technician task such as loading the correct filament or checking the build plate.
6. 3DA prepares the job and presents the selected printer, artifact, material, estimated duration, estimated consumption, cost if configured, risks, and readiness evidence.
7. Camera evidence may help determine whether the plate appears clear, but uncertain or unavailable evidence produces a human readiness check rather than a safety claim.
8. The maker explicitly approves the physical submission.
9. The Mac mini bridge sends the approved job to the reserved Bambu Lab A1 and reports status.
10. Room and Operations views show the same printer state and a readable WebMCP audit timeline.
11. Completion or failure notifies the job owner and relevant manager/technician. A failed job enters an attention state while stakeholders choose retry, cancel, release, or intervention.

## Reservation Model

- Support both immediate and future reservations in the product and demo.
- A reservation may contain uploaded artifacts and preparation requests for a technician.
- 3DA rejects agent/API print submission without a valid reservation for that actor, printer, artifact, and time window.
- The default no-show grace period is 15 minutes after the scheduled start and is configurable by the space; a manager may extend it.
- Direct operation from a printer screen cannot always be technically prevented. When observable, it is recorded as a manual or unreserved event rather than falsely attributed to a booked user.

## What We Are Building

### Required golden path

- A public, deployed web application with a local-development path
- A character-led Room view showing five named printers: Samantha, Simone, Sanda, Sacha, and Solange
- A serious Operations view for reservations, job state, preparation, incidents, and audit evidence
- Seeded maker/member/manager personas sufficient to demonstrate ownership and permissions
- WebMCP tools for printer discovery, reservation, job preparation, approval-aware submission, and monitoring
- Deterministic scheduling, compatibility, policy, and material validation
- Immediate and future reservations with technical submission enforcement
- Artifact upload associated with a private job
- Technician preparation tasks, including filament-loading/readiness work
- Explicit approval for submit, cancel, retry, and override actions
- Material ownership and estimated job consumption
- A local Mac mini bridge connected to at least one real Bambu Lab A1
- A hosted simulator implementing the identical contracts with unmistakable simulated-state labels
- A readable audit timeline covering actor, source, request, policy result, approval, outcome, and time
- Stakeholder notifications or an in-product notification surface for completion and failure
- Automated contract, concurrency, safety, and golden-path tests

### Conditional after the golden path

- SMS delivery for completion and failure notifications
- Camera-based build-plate and print-failure suspicion
- Detection and flagging of manual or unreserved printer activity
- Additional Bambu model adapters
- Rich material reconciliation beyond estimated consumption

## What We Are Not Building

- A general-purpose text-to-CAD or AI-generated CAD system; existing design tools provide artifacts
- A replacement for Bambu Studio’s slicing engine
- Autonomous cancellation based only on computer vision
- Production-grade payments, billing, or marketplace flows
- Full organisation administration and enterprise identity management
- Photorealistic metaverse navigation
- Guaranteed control of every Bambu Lab model
- A claim that 3DA can prevent all use initiated directly on a printer’s physical interface

These exclusions protect the competition story: one complete, safe physical workflow is more valuable than many partially integrated features.

## Privacy And Access

- Uploaded models and job-camera footage are private to the job owner and authorised space managers/technicians.
- Other members may see only the availability information needed to coordinate shared capacity.
- Camera inference is labelled as advisory evidence with confidence or uncertainty; it is not presented as ground truth.
- Real and simulated events are never mixed without explicit provenance.

## Inspiration And References

- **Mechanica:** one cinematic 3D stage supported by sourced evidence and strong verification
- **Dấu:** a focused task surface where deterministic processing judges and the model assists
- **AirBridge:** a bridge across an ecosystem boundary with an activity inspector
- **Echo Canvas:** a spatial workbench that keeps AI assistance, the physical model, and diagnostics distinct
- **veTriage and Pulse:** high-consequence workflows strengthened by deterministic safety and human control
- **Bambu Studio:** the existing slicing and device-operation layer 3DA orchestrates rather than replaces
- **OctoPrint-style local control:** evidence that local printer bridges are useful, while leaving shared scheduling and WebMCP governance as 3DA’s differentiation

Winner-pattern evidence used for the direction: 50% of the sampled winners performed physical or operational actions, 60% foregrounded safety/validation/human control, and 30% used a memorable physical or spatial interface.

## Demo Path

1. Open on a physical OpenAI token beside the real A1: “A meeting room can be booked. Why not a 3D printer?”
2. In Codex, show project context for an electronic device using a XIAO MG24 and its enclosure artifact.
3. Ask 3DA for a suitable available printer; WebMCP discovers the room and recommends Samantha with an explanation.
4. Demonstrate both a future reservation for the enclosure and an immediate reservation for the OpenAI token.
5. Upload/attach the print artifact and show material ownership, estimated consumption, and any technician preparation task.
6. Prepare the token job and show deterministic checks plus camera/readiness evidence.
7. Attempt submission without approval and show a safe refusal.
8. Approve the exact physical action; submit through the Mac mini bridge; show Samantha change to Printing and the audit timeline update.
9. Show real printer footage or status, then a completion notification and the physical result.
10. Briefly switch to the clearly labelled simulator or failure state to prove the same workflow fails safely when hardware is unreachable.

## Submission Story

**Hook:** A meeting room can be booked. Why not a 3D printer?

**Problem:** The final metre between a finished design and a shared printer is still manual, fragmented, and socially ambiguous.

**WebMCP leverage:** 3DA gives agents a structured, contextual, inspectable way to coordinate availability, preparation, permission, and monitoring instead of guessing through Bambu Studio or a dashboard.

**Technical proof:** A WebMCP call produces a safe, observable state change in a real printer through a local Mac mini bridge, with reservation enforcement, deterministic policy, explicit consent, simulator parity, and an audit trail.

**Memorable outcome:** Codex safely books Samantha and starts a real OpenAI-token print while the character-led room and serious operations timeline update together.

**Future:** The same open-source local service can support households, maker groups, schools, coworking spaces, labs, and larger fabrication fleets through model-specific adapters.
