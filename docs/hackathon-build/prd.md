# 3DA Product Requirements Document

## Product Summary

**3DA — The agent-ready fabrication room** is an open-source, local-first service for safely sharing one or more 3D printers. It gives makers, families, coworking-space members, technicians, managers, and AI agents one coherent workflow for discovering capacity, reserving a machine, attaching a print artifact, coordinating physical preparation, validating the job, approving consequential actions, submitting the print, monitoring the outcome, and clearing the printer for its next user.

3DA begins where design ends. A person may use Codex and existing design skills to create an enclosure for a XIAO MG24 electronic project, or may already have a print-ready OpenAI token. 3DA does not try to replace those design tools or the slicer. It owns the difficult final transition from artifact to accountable physical action in a shared environment.

The central competition moment is visible and real: Codex discovers the London Co-Working Space, recommends and reserves Samantha, prepares an OpenAI-token job, encounters an approval gate, receives explicit consent, and starts a real Bambu Lab A1 print while the 3DA Room and audit timeline update.

## Product Principles

1. **A shared printer is a bookable resource.** Availability, ownership, preparation, and collection must be explicit rather than assumed.
2. **The agent proposes; deterministic policy decides.** Compatibility, scheduling conflicts, reservation validity, and approval validity are not left to model judgement.
3. **Physical actions require specific consent.** Submitting, cancelling, retrying, and overriding a print require a clear human decision.
4. **Show the evidence.** Users should understand why a printer was recommended, why an action was refused, and what happened afterward.
5. **Real and simulated state never blur.** A judge can use the simulator safely without believing a physical action occurred.
6. **Privacy follows the job.** Availability can be shared broadly; artifacts, detailed job data, and camera evidence remain restricted.
7. **Completion includes the physical room.** A finished print does not make the printer available until the build plate is confirmed clear.

## Target Users And Roles

### Maker or job owner

A person who wants to turn an existing design into a print without manually coordinating several applications and people. The owner can create and view their reservations, upload and inspect their artifacts, satisfy preparation requirements, approve physical actions, monitor their jobs, receive notifications, and decide what happens after a failure.

### Member or household user

A person sharing the same printer fleet. Members can see the availability and capabilities needed to make a booking. They cannot inspect another owner’s artifact, private job details, or camera evidence.

### Technician

A person responsible for physical readiness. A technician can see preparation tasks assigned to them, the minimum job context needed to perform those tasks, relevant camera evidence, and current incidents. They can confirm that filament was loaded or the build plate was cleared without gaining unnecessary access to unrelated private artifacts.

### Space manager

An authorised operator who can see operational details across the space, manage incidents, extend reservations, provide or assign preparation, and override a booking when necessary. Every override requires a reason and remains visible in the audit history.

### Codex or another supported agent

An agent acting on behalf of an identified person. The agent can discover, reserve, prepare, and monitor through WebMCP. When an action requires consent, the agent must surface the exact decision to the person rather than assuming approval.

## Product Surfaces

### Room view

The default product view is a warm, character-led miniature fabrication room. Samantha, Simone, Sanda, Sacha, and Solange occupy stable positions and have readable nameplates, current states, and accessible text labels. The room makes availability and state changes immediately understandable without turning the product into a game.

The first-run overlay explains the core states and offers three clear actions: `Ask 3DA`, `Reserve`, and `Open Operations`. Returning users enter directly into the room without repeating onboarding.

### Operations view

The Operations view is a precise control surface for reservations, preparation tasks, active jobs, collection status, incidents, notifications, and audit events. Members see only their own detail plus shared availability. Technicians and managers see the additional information appropriate to their roles.

### Codex experience

Codex can complete discovery, recommendation, reservation, preparation, and monitoring conversationally. Responses show structured results in plain language. When visual inspection is helpful, Codex provides a deep link to the exact printer, reservation, job, approval, or incident—not merely the product homepage.

Approval can occur in Codex or on the web. Both surfaces present the same facts and create the same durable decision record.

## Core User Journeys

### Journey A: Immediate OpenAI-token print

1. The owner asks Codex to print an existing OpenAI token.
2. Codex discovers the available room and printers through 3DA.
3. 3DA recommends Samantha and states the availability, compatibility, material, duration, and policy reasons.
4. The owner reserves Samantha immediately and attaches the token artifact.
5. 3DA validates the artifact and determines whether technician preparation or a plate check is needed.
6. The owner sees the complete action summary and explicitly approves submission.
7. 3DA submits the job and Samantha changes from `Reserved` to `Printing`.
8. The owner monitors the job through Codex or the Room view.
9. When printing ends, Samantha becomes `Awaiting collection`, not `Available`.
10. Once the object is removed and the build plate is confirmed clear, the job becomes `Completed` and Samantha becomes `Available`.

### Journey B: Future XIAO MG24 enclosure reservation

1. The maker gives Codex context for an electronic device using a XIAO MG24.
2. Existing design tools produce an enclosure artifact outside 3DA.
3. Codex asks 3DA for a suitable future printing window.
4. The maker books a slot and uploads the enclosure artifact in advance.
5. 3DA records the required filament and creates a technician preparation task if the printer is not ready.
6. The technician completes the physical preparation and the maker is notified.
7. Preparation and approval occur against the final artifact and material details before the scheduled print.

### Journey C: Manager handles a failed job

1. Printer telemetry or advisory camera evidence indicates a possible failure.
2. 3DA changes the job to `Needs attention` and notifies the owner and authorised operations staff.
3. The incident screen shows the available evidence without claiming more certainty than it has.
4. An authorised person selects `Retry`, `Cancel`, `Release printer`, or `Request technician`.
5. Consequential choices require explicit confirmation. A retry also requires a current reservation, readiness, and renewed approval.
6. The selected action, actor, reason, and result appear in the audit timeline.

## State Language

Every surface uses the same human-readable states:

- `Available` — ready to be reserved
- `Reserved` — assigned to an owner and time window
- `Waiting for preparation` — booked but awaiting a technician or physical readiness task
- `Ready for approval` — all required checks completed and awaiting owner consent
- `Approved` — consent recorded and still valid, but physical submission not yet confirmed
- `Printing` — the printer reports an active job
- `Needs attention` — failure, uncertainty, or intervention requires a person’s decision
- `Awaiting collection` — printing ended but the build plate has not been confirmed clear
- `Offline` — current printer/bridge availability cannot support submission
- `Simulated` — provenance label applied in addition to the simulated printer’s operational state

No screen may use an optimistic state when current evidence is unavailable. Unknown and offline conditions are communicated explicitly.

## Epics And User Stories

### Epic 1: Discover The Room

#### Story 1.1 — Understand shared capacity

As a member, I want to see each named printer’s availability and useful capabilities so that I can understand my options without opening several printer applications.

Acceptance criteria:

- Opening the product shows the London Co-Working Space and all five named printers.
- Every printer has a visible name, operational state, next-available information, and real/simulated provenance.
- Status is communicated with text and shape/icon treatment as well as colour.
- A member can see availability without seeing another owner’s private artifact, camera feed, or detailed job information.
- If no printer data is current, the interface says that status is unavailable rather than presenting cached state as live.

#### Story 1.2 — Ask an agent to recommend a printer

As a maker, I want Codex to recommend an appropriate printer for my job so that I do not need to compare capacity and policy manually.

Acceptance criteria:

- The recommendation identifies the selected printer and explains the relevant availability, size/profile, material, duration, and policy factors.
- If more than one printer is suitable, the response identifies why the recommended option ranks first.
- If no printer is compatible, the response names the blocking requirement and the nearest valid alternative or preparation step.
- The recommendation itself does not create a reservation or physical side effect.

#### Story 1.3 — Move between Codex and the web

As a maker, I want a conversational result to open the exact visual context so that I can inspect or approve it without finding the job again.

Acceptance criteria:

- Codex can return a deep link to the exact printer, reservation, job, approval, or incident.
- Opening the link restores the correct selected item and preserves the user’s authorised context.
- An unauthorised viewer receives an access explanation without private metadata leakage.

### Epic 2: Reserve Capacity

#### Story 2.1 — Reserve immediately

As a maker, I want to reserve an available printer now so that another agent or member cannot claim the same capacity.

Acceptance criteria:

- A successful result shows `Reserved for you`, printer name, owner, start/end time, preparation state, and expiry.
- The Room and Operations views show the same reservation state.
- Two competing requests for the same capacity produce exactly one successful reservation.
- The unsuccessful requester sees the conflict and the next suitable printer or time.
- A reservation alone never starts a print.

#### Story 2.2 — Reserve a future slot

As a maker, I want to schedule a future print window and upload my artifact early so that the room can prepare before I arrive or before an automated submission window.

Acceptance criteria:

- The user can select a future start time and see the estimated end time before confirming.
- Conflicting windows cannot be confirmed for the same printer.
- The reservation detail can hold an artifact, material requirement, and technician preparation request.
- The user can demonstrate an immediate and a future reservation during the public demo.

#### Story 2.3 — Queue fairly

As a member, I want contested capacity to be allocated transparently so that I understand when my job can run.

Acceptance criteria:

- Normal reservations use first-come-first-served ordering.
- A user can join a visible waitlist for a conflicting slot.
- The waitlist shows position and the condition that could make the slot available without exposing other users’ private job data.
- If capacity opens, the next eligible user receives a notification and a bounded opportunity to accept it.

#### Story 2.4 — Handle no-shows and manager overrides

As a manager, I want abandoned capacity to return to the room and exceptional changes to remain accountable.

Acceptance criteria:

- A reservation that has not progressed receives a warning before its grace period ends.
- The default grace period is 15 minutes after scheduled start.
- A manager can extend or override a reservation only after entering a reason.
- The affected owner is notified of an override.
- The actor, reason, previous state, new state, and time remain visible in the audit history.

### Epic 3: Prepare The Job

#### Story 3.1 — Attach and inspect an artifact

As a maker, I want my artifact associated with the reservation so that every later decision refers to the correct file.

Acceptance criteria:

- The reservation identifies the artifact by a human-readable name and version/fingerprint.
- The owner and authorised manager can see a preview or meaningful artifact summary before approval.
- Replacing the artifact visibly marks prior preparation and approval as stale.
- Invalid, missing, or unsupported artifacts cannot progress to approval.
- The user receives a specific corrective action rather than a generic upload failure.

#### Story 3.2 — Validate compatibility and material

As a maker, I want 3DA to explain whether the job fits the chosen printer and material so that I can resolve problems before occupying the machine.

Acceptance criteria:

- Preparation reports separate results for artifact readiness, printer/profile compatibility, material, reservation validity, and policy.
- Each failed check identifies the blocking fact and the next action.
- Estimated duration and material consumption are visible before approval.
- Material is associated with an owner or space-managed stock.
- An incompatible job remains non-destructive and cannot reach submission.

#### Story 3.3 — Coordinate technician preparation

As a technician, I want a concise readiness checklist so that I know what physical work is required without interpreting the owner’s entire project.

Acceptance criteria:

- A job that needs filament, plate, or other preparation enters `Waiting for preparation`.
- The task names the printer, required action, deadline, and only the job detail necessary to perform it.
- The technician can mark individual items complete and leave a short operational note.
- The owner is notified when required preparation is complete or blocked.
- A job cannot become `Ready for approval` while a required task remains incomplete.

#### Story 3.4 — Use camera evidence carefully

As an owner or technician, I want camera evidence to assist plate-readiness checks so that obvious physical blockers can be found remotely.

Acceptance criteria:

- A current image, capture time, and source are visible to authorised viewers when available.
- The product labels any inferred plate state as advisory and communicates confidence or uncertainty.
- An unavailable, stale, obscured, or uncertain image creates a human readiness requirement.
- Camera evidence alone cannot silently authorise submission.

### Epic 4: Review And Approve

#### Story 4.1 — Understand the exact physical action

As a job owner, I want one complete approval summary so that I know exactly what will happen before the printer acts.

Acceptance criteria:

- The approval summary names the actor, artifact and fingerprint, printer, reservation window, material, estimated usage, estimated duration, readiness checks, and approval expiry.
- Risks, warnings, simulated provenance, and unresolved assumptions appear before the approval action.
- The primary action uses specific language such as `Approve & send to Samantha`, not a vague `Continue`.
- Dismissing or declining approval creates no printer-side action.

#### Story 4.2 — Approve from Codex or the web

As an owner, I want equivalent approval in my current surface so that I can complete the workflow without sacrificing safety.

Acceptance criteria:

- Codex and the web display equivalent decision facts.
- Approval records which surface requested and captured the decision.
- Approval is single-use, time-bounded, and tied to the displayed job details.
- A different person cannot reuse the owner’s approval.

#### Story 4.3 — Invalidate stale approval

As a job owner, I want changed job details to require a new review so that old consent cannot authorise a different action.

Acceptance criteria:

- Changing the artifact, filament/material, printer, reservation time, or consequential print settings invalidates preparation and approval.
- The interface identifies which change caused invalidation.
- Submission remains unavailable until checks run again and the owner re-approves.
- Refreshing, reopening, or retrying does not restore an invalid approval.

### Epic 5: Print, Monitor, And Collect

#### Story 5.1 — Submit only a valid approved job

As an owner, I want 3DA to submit exactly the job I approved so that an agent cannot send an unintended physical action.

Acceptance criteria:

- Submission succeeds only with a current matching reservation, completed preparation, and valid unused approval.
- A submission attempt without any one of those conditions creates no printer-side action and explains what is missing.
- Repeating the same request does not create a second physical job.
- A successful submission changes the job and printer to `Printing` and records the printer’s acknowledgement.

#### Story 5.2 — Monitor one truthful state

As an owner, I want Codex, Room, and Operations to agree on progress so that I can trust the status wherever I look.

Acceptance criteria:

- All surfaces show the same job identity, printer, state, progress/available status, and most recent update time.
- Stale telemetry is visibly labelled and never presented as current.
- The owner can ask Codex for status and receive the current state plus a deep link.
- Authorised camera evidence is associated with the current job rather than an ambiguous printer feed.

#### Story 5.3 — Handle an offline bridge or printer

As an owner, I want hardware outages to preserve my work safely so that a connection problem does not lose or duplicate a job.

Acceptance criteria:

- If the printer or local bridge becomes unavailable before acknowledgement, the job remains not sent.
- The reservation and prepared artifact are preserved.
- The user sees `Wait`, `Move to another printer`, and `Cancel` when each is valid.
- Restoring connectivity does not submit automatically without a still-valid approval and deliberate action.

#### Story 5.4 — Respond to failure

As an owner or manager, I want a failure to become a clear decision rather than an unexplained stopped job.

Acceptance criteria:

- A detected or suspected failure changes the job to `Needs attention`.
- The owner and relevant technician/manager receive an in-product notification; SMS is conditional on the golden path being complete.
- The incident shows printer status, available camera evidence, confidence/uncertainty, and recent audit events.
- `Retry`, `Cancel`, `Release printer`, and `Request technician` are shown only when valid for the actor and state.
- Retry, cancellation, and release require explicit confirmation and create audit events.

#### Story 5.5 — Keep the printer occupied until collection

As another member, I want finished jobs to retain the printer until the plate is clear so that I do not book unusable capacity.

Acceptance criteria:

- When printing ends, the job becomes `Awaiting collection` and the printer remains unavailable.
- The owner and relevant room staff are notified that collection/clearance is required.
- An authorised person confirms removal and a clear build plate.
- Only then does the job become `Completed` and the printer become `Available`.
- A camera may support this decision, but uncertain evidence requires a person to confirm.

### Epic 6: Operate And Audit

#### Story 6.1 — See the operational queue

As a technician or manager, I want one view of upcoming and active work so that I can prepare the room and resolve blockers.

Acceptance criteria:

- Operations shows printer, owner or privacy-safe identity, scheduled window, job state, material, preparation, estimated duration, and next required action.
- Attention states and overdue collection are visually prioritised.
- Selecting an item opens its authorised detail without losing queue context.
- Empty queues explain that no work is scheduled and offer an appropriate next action.

#### Story 6.2 — Understand agent and human actions

As an owner or manager, I want a readable audit timeline so that I can reconstruct material decisions and physical actions.

Acceptance criteria:

- Reservation, preparation, approval, submission, cancellation, retry, release, and override events record actor, source, input summary, policy decision, result, and time.
- The timeline distinguishes user, agent, manager, local bridge, printer, and simulator events.
- Sensitive artifact contents are not copied into broadly visible audit summaries.
- The demo can visibly show WebMCP calls and resulting state changes in chronological order.

#### Story 6.3 — Flag observable manual activity

As a manager, I want direct printer activity to be distinguished from 3DA submissions so that the audit record does not falsely attribute it.

Acceptance criteria:

- If printer activity is observed without a matching submitted 3DA job, it may be labelled `Manual/unreserved activity`.
- 3DA does not guess which member initiated the activity.
- The event includes only the evidence actually observed and invites authorised reconciliation.
- This story is conditional after the core golden path because physical-screen enforcement is outside 3DA’s reliable control.

#### Story 6.4 — Demonstrate safely with a simulator

As a judge or developer, I want a complete simulator path so that I can evaluate the workflow without access to the participant’s home printer.

Acceptance criteria:

- The simulator supports the same visible workflow and product rules as real mode.
- Every simulated printer, camera frame, audit event, notification, and result is labelled `SIMULATED`.
- Switching mode cannot cause a simulated approval to authorise a real action.
- The public demo can reproduce success, conflict, offline, and failure states predictably.

## Cross-Cutting Acceptance Criteria

### Privacy and permissions

- Job owners can see their own artifacts, detailed job data, approvals, and camera evidence.
- Authorised technicians/managers see only the detail required by their role.
- Other members see shared availability and next-available information but not private job content.
- Uploaded artifacts and private camera snapshots use configurable retention with a seven-day default.
- The owner can request immediate deletion after the job reaches a terminal state, subject to clearly disclosed minimal audit retention.

### Consistency and persistence

- Closing and reopening Codex or the web preserves reservations, artifacts, preparation state, approvals, notifications, and audit history according to access rights.
- State names and permitted actions remain consistent across Room, Operations, and Codex.
- The system does not show `Available` while a valid reservation, active print, attention state, or uncleared completed job occupies the printer.

### Accessibility and comprehension

- Printer state is never communicated by colour alone.
- Consequential actions use specific verbs and identify the affected printer/job.
- Error and refusal messages state what happened, why, whether any physical action occurred, and what the user can do next.
- A fresh tester can complete the web reservation and approval path without verbal coaching.

### Judge-visible quality bar

- A supported agent can discover and use 3DA’s WebMCP tools without DOM guessing.
- The best visual and physical proof appears within the first 30 seconds of the video.
- A refusal without approval is demonstrated before the successful real submission.
- The real A1 path and simulator path are clearly distinguishable.
- The demo and README enable a judge to answer who needs 3DA, why WebMCP matters, what physical action happened, what prevents unsafe action, and where the product goes next.

## Edge Cases

| Situation | Required user-visible behaviour |
|---|---|
| No printers configured | Room explains the empty state and offers local setup or simulator mode; it does not invent printers |
| No current telemetry | Printer shows unknown/offline with the last update time |
| No compatible printer | Explain the blocking requirement and offer a valid alternative or preparation step |
| Simultaneous reservation attempts | One succeeds; others receive a conflict plus alternative/waitlist options |
| Reservation reaches grace limit | Warn owner, then expire or allow a reasoned manager extension |
| Artifact missing or invalid | Stop preparation and show a specific corrective action |
| Artifact changes | Mark preparation and approval stale; require re-check and re-approval |
| Required technician task incomplete | Keep job in `Waiting for preparation`; submission unavailable |
| Camera unavailable or unclear | Require human readiness confirmation; never infer clear plate silently |
| Approval expired or reused | Refuse submission with no physical action and request fresh approval |
| Bridge fails before acknowledgement | Preserve as not sent; expose deliberate retry/move/cancel choices |
| Response is uncertain after send | Show an indeterminate attention state and reconcile before permitting retry |
| Printer completes but plate remains occupied | Keep `Awaiting collection` and printer unavailable |
| Unauthorised deep link | Explain access denial without revealing owner/artifact metadata |
| Manual printer-screen activity | When observable, flag without attributing an unverified user |
| Simulator is active | Label every affected surface and event; never reuse simulation approval in real mode |

## What We Are Building

The submission build includes the six epics above for the narrow real A1 golden path, with a polished Room view, functional Operations view, Codex/WebMCP interaction, immediate and future reservations, preparation and approval, truthful monitoring, collection clearance, privacy boundaries, audit evidence, and a contract-equivalent simulator.

Features marked conditional—SMS delivery, camera-based inference, manual-activity detection, and additional Bambu adapters—are included only after the core path is verified.

## What We Would Add With More Time

- Production identity, organisations, invitations, and granular custom roles
- Multi-site scheduling and larger fleet optimisation
- Calibrated material inventory with spool weighing and reconciliation
- Advanced waitlist policies, quotas, recurring reservations, and service levels
- Broader printer adapters and a published adapter SDK
- More sophisticated technician workflows and maintenance schedules
- Privacy-preserving computer vision for readiness and failure assistance
- Notification-channel preferences and escalation policies
- Usage reporting, sustainability metrics, and optional billing integrations
- Design-tool handoffs for additional CAD environments without making 3DA a CAD generator

## Explicit Non-Goals

- General-purpose AI-generated CAD
- Replacing the slicer
- Unsupervised destructive action based on camera inference
- Claiming physical-screen access can always be prevented
- Production payments or a print marketplace
- Photorealistic virtual-world navigation
- Universal printer compatibility in the hackathon build

## Submission Proof Points

1. **WebMCP leverage:** Codex discovers, reserves, prepares, submits, and monitors through structured site tools rather than UI guessing.
2. **Execution:** A valid approval produces a real Bambu Lab A1 print through the local Mac mini bridge.
3. **Safety and trust:** The same workflow visibly refuses an unapproved submission and handles offline/failed states without duplicate physical action.
4. **Shared-space impact:** Immediate/future booking, preparation tasks, material ownership, collection clearance, and privacy address households and managed fabrication rooms.
5. **Creativity and memorability:** Samantha lives in a warm character-led digital room; the OpenAI token emerges physically while the data-rich audit surface proves what happened.
6. **Honesty:** Simulator provenance and advisory camera evidence are unmistakably labelled, while limitations are stated directly.

## Product Success Criteria

- A new viewer understands the product’s purpose from the first screen and one-sentence pitch.
- A maker completes an immediate web reservation and reaches a valid approval decision in under 90 seconds without coaching.
- A supported agent selects the intended golden-path tool in at least 9 of 10 controlled prompt trials.
- A reservation conflict never produces two confirmed owners for the same printer window.
- A missing, stale, mismatched, or reused approval never produces printer-side action.
- A repeated submission request creates at most one acknowledged physical job.
- The Room, Operations view, and agent response agree on the selected demo job’s state.
- A judge can complete the simulator path without private hardware or credentials.
- The public video stays under three minutes and demonstrates the physical result, WebMCP workflow, refusal, real submission, and recovery/simulator evidence.
