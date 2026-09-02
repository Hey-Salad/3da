# OpenAI hackathon winner patterns

## Scope and method

This is a normalized sample of 20 publicly documented winners across four OpenAI-hosted, co-hosted, or official startup hackathon cohorts:

- OpenAI x GovTech Singapore (2024): 3 winners
- OpenAI Open Model Hackathon (2025): 6 unique winning projects across 7 prize slots
- NYC GPT-5 Startup Hackathon (2025): 3 winners
- OpenAI Build Week (2026): 8 winners

It is not a claim to cover every private meetup, university sponsor prize, or undocumented OpenAI event. Project attributes were coded from official OpenAI, Devpost, and public winner descriptions. The future-path column is an inference from each project's stated roadmap and product form, not a verified company-survival study.

## Winner inventory

| Cohort | Winners |
|---|---|
| GovTech Singapore | Automated OneService; Excalibur; Medicine Adherence |
| Open Model Hackathon | RoboChef; A Printer for Smell; Steam Print; Memory Palace; Dental Assessment GPT; bota |
| NYC GPT-5 Startup Hackathon | Bell Hop; Fathom; Ego |
| Build Week | Mechanica; Dau; veTriage; Pulse; Second Voice; AirBridge; Echo Canvas; Sentinel |

The row-level dataset is in `openai-hackathon-winners.csv`.

## Common project themes

| Theme | Count | Share | What it looks like in winners |
|---|---:|---:|---|
| Health, accessibility, public service | 7 | 35% | Elder access, medication, veterinary triage, resuscitation, speech assistance, dental reasoning |
| Physical systems or operational action | 10 | 50% | Filing cases, running care workflows, controlling robots/printers/audio devices, operational business agents |
| Voice or audio is central | 10 | 50% | Multilingual voice, pronunciation, clinical listening, assistive speech, device control, spatial audio |
| Explicit safety, validation, privacy, or human control | 12 | 60% | Deterministic state machines, confirmation gates, citations, constrained schemas, sandboxing, local privacy |
| Education or cultural learning | 3 | 15% | Voice learning, interactive 3D history, educational games |
| Developer or creator tools | 3 | 15% | Codebase understanding, MCP security, spatial-audio authoring |
| Memorable physical or spatial interface | 6 | 30% | Robots, scent hardware, 3D printing, 3D museum, spatial audio, device streaming |

Counts overlap. For example, Pulse is both health-focused and voice-driven, with explicit deterministic safety boundaries.

## What the judges appear to reward

| Signal | Evidence in winners | Practical interpretation |
|---|---|---|
| A painfully specific user and moment | Vet receptionist handling a sick-pet call; dysarthric speaker approving a sentence; developer scanning an MCP server | Name the person, pressure, and task. Avoid broad “AI for makers” language. |
| AI is essential but bounded | LLM coaches while DSP grades; speech becomes evidence while deterministic code owns clinical state | Give AI the fuzzy work and deterministic code the irreversible work. |
| A visible, non-trivial interaction | Robot cooks; Steam Deck sends a print; 3D museum mechanisms move; audio changes in a spatial scene | The demo should show a state change that cannot be confused with a chatbot answer. |
| Complete product experience | Winners expose onboarding, controls, feedback, failure states, evidence, and working links | A narrow polished loop tends to beat a wide collection of half-built features. |
| Trust is a feature | Confirmation before speaking, source citations, sandboxed probes, safety-first scent controls | Show the judge why an agent is allowed to act and exactly where it must stop. |
| Honest technical depth | Deterministic fallbacks, validators, test suites, local modes, clear architecture | Demonstrate the hard part directly and disclose what is simulated. |
| Memorable identity | Ancient machines, scent songs, a cooking robot, a Dota agent, voice restored to a person | The project should be explainable in one vivid sentence after the judging session ends. |

These observed patterns line up with OpenAI's published Build Week judging criteria: non-trivial technical implementation, coherent design, credible impact for a real audience, and novelty. The WebMCP Challenge uses the parallel criteria WebMCP Leverage, Execution, Potential Impact, and Creativity & Ambition.

## Where winners appear headed

| Inferred destination | Approx. projects | Examples |
|---|---:|---|
| Vertical product or real-world pilot | 12 | veTriage is already in a veterinary workflow; Pulse seeks clinical validation; Second Voice and Dau are focused assistive/learning products; Bell Hop is vertical SaaS |
| Platform, developer, or maker tool | 5 | Steam Print, Echo Canvas, Sentinel, Fathom, Mechanica's reusable exhibit architecture |
| Hardware R&D or continuing public demo | 3 | RoboChef, scent printer, bota |

The important pattern is not that every winner becomes a venture-backed company. The durable projects leave the hackathon with a clear next environment: a workplace pilot, a specialist user community, an open-source toolchain, a research program, or a focused product roadmap.

## Implications for 3DA

3DA has unusually strong precedent. Steam Print already proved that voice-to-print plus real 3D-printer control is memorable enough to win a hardware category. Echo Canvas shows that browser-based 3D authoring can win. AirBridge shows judges value software that bridges an ecosystem gap and controls real devices. veTriage and Pulse show that operational workflows become stronger when AI is constrained by deterministic state and explicit human control.

That precedent is also the main risk: “AI sends a model to a printer” is no longer novel on its own.

The winning differentiation should be:

> 3DA turns a shared fabrication room into an agent-ready service: people and agents can discover capacity, reserve a named printer, validate and submit a job, monitor the physical outcome, and recover from failure through one auditable WebMCP workflow.

### Recommended competition scope

Build one complete golden path:

1. The user asks Codex to make and print a small object.
2. WebMCP exposes named printers and real availability from a London coworking space.
3. The agent books a suitable printer and explains its choice.
4. The user reviews a 3D preview and print-risk summary.
5. A confirmation gate authorizes the physical print.
6. The Mac mini bridge submits the job to one real printer.
7. The web room and Codex both show live state.
8. A camera event produces a completion or failure notification.

### Features to postpone

- General-purpose text-to-CAD quality across arbitrary objects
- Full Bambu fleet support before one end-to-end adapter works
- Complex billing, memberships, inventory, and marketplace flows
- Photorealistic metaverse navigation unrelated to the print decision
- Unsupervised physical actions without a confirmation and policy layer

### Demo framing

Open with the physical result, then show the agent workflow that created it. The key proof is not the dashboard: it is a WebMCP tool call causing a safe, observable change in a real shared fabrication system. The interface should make the machine names and state memorable, while the serious dashboard exposes queue, material, ETA, camera evidence, audit log, and recovery controls.

## Primary sources

- OpenAI Build Week winners: https://openai.com/build-week/
- OpenAI Build Week winner announcement: https://openai.devpost.com/updates/45225-and-the-winner-is
- OpenAI Build Week rules and criteria: https://openai.devpost.com/rules
- OpenAI Open Model Hackathon and criteria: https://openai2025.devpost.com/
- OpenAI x GovTech Singapore winners: https://community.openai.com/t/openai-s-first-hackathon-in-asia-in-conjunction-with-govtechsg/1028468
- NYC GPT-5 Startup Hackathon winners: https://www.linkedin.com/posts/openai-for-startups_200-startup-teams-were-able-to-ship-fast-activity-7379230155635892224-yv0_
- Current WebMCP Challenge rules and criteria: https://webmcp.devpost.com/rules
