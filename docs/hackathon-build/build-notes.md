# 3DA Build Notes

## 2026-09-02 — Guided build onboarding

- Rules acknowledgment completed and the optional guided build workflow activated.
- Repository created at `Hey-Salad/3da` as a public MIT-licensed project.
- Project name confirmed: `3DA`.
- Project centre confirmed: safe shared-printer orchestration through WebMCP, not AI-generated CAD.
- Primary audience expanded from coworking spaces to anyone sharing a printer or fleet: households, makers, schools/labs, coworking spaces, and fabrication managers.
- First real adapter confirmed: Bambu Lab A1. Future compatibility will use printer-family capabilities rather than pretending all models behave identically.
- Human confirmation boundary confirmed: submit, cancel, retry, and override require approval; discovery and reservation do not.
- Local-first, open-source operation and a clearly labelled hosted simulator fallback confirmed.
- Winner-informed design decision: lead with one memorable spatial/physical interaction and reinforce it with a serious data/audit surface. Supporting sample signals: physical or operational action 50%, explicit safety/validation/control 60%, memorable physical/spatial interfaces 30%.
- Identity decision: warmer and character-led.
- Final demo object: an OpenAI token.
- Central wow moment confirmed: a Codex WebMCP workflow reserves Samantha and safely starts a real print while the audit timeline updates.
- Onboarding interview completed in three rounds. Deepening rounds are not applicable to onboarding.

## 2026-09-02 — Scope

- The participant’s brain dump established the core transition: Codex holds the electronic-project context and existing CAD skills produce the artifact; 3DA replaces the fragmented sequence from finished artifact through Bambu Studio, shared booking, readiness, approval, and monitoring.
- Concrete example: an enclosure for a XIAO MG24 electronic device.
- Time-budget decision: the participant preferred deadline-driven parallel execution rather than a personal-hours estimate. Scope uses the remaining wall-clock time, while acknowledging that hardware verification, deployment, filming, and recovery tests remain sequential.
- Current-capability assumption: the participant reports all discussed foundations are available. Each remains subject to verification before the build depends on it.
- Booking enforcement accepted: 3DA rejects agent/API submissions without a matching valid reservation.
- Demo decision: use both the XIAO MG24 enclosure workflow and an OpenAI token physical reveal.
- Default policy decisions accepted: deterministic printer recommendation, material ownership/estimated use, identically contracted labelled simulator, and seeded demo personas.
- Deepening round count: 1.
- Deepening results: immediate and future reservations; artifact upload; technician preparation tasks; camera-assisted plate checks; private models/footage for owners and managers; and stakeholder notification with a decision state after failures.
- Codex added a configurable 15-minute no-show grace period and a fail-safe human check whenever camera evidence is uncertain.
- Scope cut: AI CAD, slicer replacement, autonomous CV cancellation, production billing/admin, photorealistic navigation, and universal Bambu support are explicit non-goals.

## 2026-09-02 — Product requirements

- PRD epics confirmed: Discover the Room; Reserve Capacity; Prepare the Job; Review and Approve; Print, Monitor, and Collect; Operate and Audit.
- First-open behaviour confirmed: enter the Room directly with a short first-run overlay and clear actions.
- Codex-to-web behaviour confirmed: conversational discovery/reservation plus deep links to exact visual review, approval, and incident contexts.
- Reservation detail confirmed: machine, time, owner, artifact, material, preparation, and expiry remain consistent across Room and Operations.
- Technician workflow confirmed: required physical preparation keeps the job waiting until checklist completion.
- Equivalent approval in Codex and web confirmed; approval is specific, single-use, time-bounded, and invalidated by consequential changes.
- Conflict behaviour confirmed: exactly one reservation succeeds and alternatives are offered to the other requester.
- Offline/failure behaviour confirmed: preserve the job, avoid automatic submission, and present deliberate next actions.
- Privacy and persistence defaults confirmed: availability is shared; detailed artifacts/camera/job information is restricted; state persists across surfaces.
- Deepening round count: 1.
- Deepening decisions: printers remain `Awaiting collection` until the plate is clear; managers can override with a recorded reason; preparation/approval become stale when job details change; first-come-first-served plus a transparent waitlist; private artifact/camera retention defaults to seven days with owner deletion.
- Active shaping: the participant repeatedly selected the recommended safety and fairness defaults and requested evidence-led decisions rather than subjective design choices.
