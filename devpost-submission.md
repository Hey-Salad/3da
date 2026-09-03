# 3DA — Devpost Submission Draft

Status: **draft — do not submit until the final gate below is green**

## Links

- Live app: https://3da-zeta.vercel.app/
- Public source: https://github.com/Hey-Salad/3da
- Demo video: TODO — public YouTube URL, under 3:00

## Tagline

The agent-ready fabrication room: book a shared 3D printer from Codex, validate the job, approve the physical action, and watch it complete safely.

## Inspiration

A meeting room can be booked by anyone in a shared space. A 3D printer usually cannot. People juggle slicer settings, informal queues, material ownership, machine availability, and physical hand-offs. Agents can help with the planning, but letting an agent act on hardware without a clear human boundary creates a new problem.

3DA makes a printer fleet legible to both people and agents. Each printer is a named room resource—Samantha, Simone, Sanda, Sacha, and Solange—with availability, material, readiness, booking ownership, and an auditable state.

## What it does

From Codex or the web, a member can:

1. discover compatible printers and see why one is recommended;
2. reserve a conflict-free time window;
3. prepare an existing 3MF against the printer, material, duration, and cleanup window;
4. pause at a trusted approval sheet showing the exact artifact, printer, material, time, and execution mode;
5. submit only the approved fingerprint and monitor the resulting job.

The public app is visibly and technically isolated in simulation mode. A separate local bridge keeps real printer credentials on site and is designed to claim narrowly scoped commands outbound. No browser tool accepts a raw host, access code, shell command, or arbitrary hardware instruction.

## Why WebMCP

This workflow is a poor fit for screenshot-driven automation. Availability changes, bookings conflict, prepared files become stale, and pressing the wrong control can move real hardware. WebMCP lets 3DA expose the same safe domain operations that drive the visible room:

- `list_printers`
- `reserve_printer`
- `prepare_print_job`
- `submit_print_job`
- `get_print_status`

The tools return structured provenance, audit IDs, retry guidance, and explicit execution mode. Read-only tools are annotated. Consequential submission is deliberately incomplete until a person approves the exact job fingerprint on screen; approval is not an agent-callable tool.

## How we built it

3DA uses Next.js and TypeScript on Vercel, shared Zod contracts, deterministic reservation policy, and the imperative `document.modelContext.registerTool(...)` WebMCP API. The simulator and real adapter share the same intended contract, while IDs and policy prevent mixed-mode execution.

The real-site capability investigation reused a local HeySalad relay behind Cloudflare Tunnel. Read-only discovery found two Bambu printers on the private LAN and verified both through BBL Technologies TLS certificates. Printer access codes stay local and were never copied into the hosted app or repository.

## What is new during the challenge

The 3DA product, repository, research, specifications, room UI, shared contracts, reservation policy, WebMCP registrations, approval interaction, and simulator were created during the August 25–September 3, 2026 challenge period. The pre-existing Sally printer relay is documented as prior work and is not presented as challenge-period code; 3DA only reuses its deployment topology and will replace its legacy Creality-specific adapter with the guarded A1 command protocol.

## Challenges

The hardest part was not generating tool schemas. It was deciding where agent authority must end. A printer can accept a command even when the booking, build plate, material, or job version is wrong. We separated planning from approval, bound approval to a SHA-256 job fingerprint, labelled simulation everywhere, and made unknown acknowledgement a reconciliation state instead of an invitation to retry blindly.

## Accomplishments

- A coherent character-led room rather than a generic admin dashboard.
- Five imperative browser-native tools backed by the same simulator domain flow.
- Deterministic first-come-first-served conflict behavior.
- A human-activated, one-time, fingerprint-bound approval surface.
- A production URL and public MIT-licensed repository.
- Real discovery and vendor identity proof for two Bambu devices without exposing LAN credentials.

## What we learned

WebMCP is strongest when the website is not merely a collection of buttons. It becomes a negotiated workspace: the agent can do structured preparation, the person can see and decide at the consequential boundary, and both continue from the same state and audit trail.

## What is next

Next comes durable D1/R2 state, the outbound bridge claim/ack protocol, camera-assisted plate readiness, technician preparation tasks, SMS notifications, and adapters for more printer families. The longer-term opportunity is an open operating layer for shared fabrication—from households with two machines to schools, makerspaces, and distributed print farms.

## Judge testing instructions

1. Open https://3da-zeta.vercel.app/ in ChatGPT’s in-app browser or Chrome 149+ with WebMCP testing enabled.
2. Ask the agent to list printers in `london-coworking` using simulation mode.
3. Ask it to reserve Samantha, prepare the OpenAI token demo artifact, and submit the job.
4. Confirm that submission stops with `APPROVAL_REQUIRED` and opens the human approval sheet.
5. Approve the exact simulated job on screen, then ask for status.
6. Confirm the returned provenance remains `simulated` and no physical side effect is claimed.

Fallback: select **Run safety demo** in the green Codex activity strip to inspect the same approval boundary without an enabled WebMCP client.

## 2:40 demo script

**0:00–0:18 — The problem**  
“A meeting room can be booked. Why not a 3D printer? In a shared space, printer access is still a mix of chat messages, slicer settings, assumptions, and unclear ownership.”

**0:18–0:35 — The room**  
Open the London Co-Working Space. Select Samantha, Simone, and Sanda to show clear availability, material, and intervention states.

**0:35–1:18 — Codex uses WebMCP**  
Ask: “Find a printer for my XIAO MG24 enclosure, reserve the next suitable slot, and prepare the OpenAI token 3MF.” Show `list_printers`, `reserve_printer`, and `prepare_print_job` calls and the structured estimates/audit IDs.

**1:18–1:50 — The safety moment**  
Ask Codex to submit. Show `APPROVAL_REQUIRED`. Focus the approval sheet: exact artifact, Samantha, 18.4 g PLA, 42 minutes, and explicit mode. Say: “Approval is not a tool the agent can call. It is a one-time human decision bound to this fingerprint.” Approve.

**1:50–2:15 — Real-world proof**  
Cut to the two live Bambu printers and the OpenAI token on the build plate. Show status/acknowledgement only if the controlled hardware test passed; otherwise describe this honestly as the local hand-off path.

**2:15–2:40 — Why it matters**  
Show the activity/audit surface. “3DA gives families, makerspaces, schools, and print farms one fair queue and one safe language for people and agents. It is open source and local-first.” End on the physical token and URL.

## Final submission gate

- [x] Production URL returns 200.
- [x] Public GitHub repository and MIT licence.
- [x] Five WebMCP tool registrations exist in challenge-period source.
- [x] Visual fallback demonstrates the approval boundary.
- [ ] Tools enumerated and invoked in a WebMCP-enabled ChatGPT/Chrome build.
- [ ] One A1 is bound locally and live status is observed.
- [ ] Tiny physical print or honest Bambu Studio hand-off is filmed.
- [ ] Public YouTube video under three minutes is uploaded.
- [ ] Screenshots and final testing instructions are added to Devpost.
- [ ] Final Devpost submission is reviewed and submitted before Sep 3, 2026 at 1:00 PM PDT (9:00 PM BST).
