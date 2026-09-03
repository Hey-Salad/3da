# 3DA — The agent-ready fabrication room

Book a shared 3D printer from Codex or the web, validate the job, approve the physical action, and watch it complete through one safe WebMCP workflow.

3DA is being built for [The WebMCP Challenge](https://webmcp.devpost.com/) by [HeySalad](https://github.com/Hey-Salad).

## The idea

A meeting room can be booked. Why not a 3D printer?

3DA turns a shared fabrication room into an agent-ready service. People and agents can discover capacity, reserve a named printer, validate and prepare a job, explicitly approve the physical action, monitor the outcome, and recover safely from failure.

The product centres shared-space orchestration and safe WebMCP control—not AI-generated CAD.

## Current status

The first implementation slice is underway: a Next.js fabrication Room, shared WebMCP contracts, seeded simulator printers, and deterministic reservation policy. Real Bambu discovery has passed for two LAN devices; physical execution remains deliberately gated until binding and a controlled printer test pass.

## Planned golden path

1. Discover the London co-working fabrication room and its printers.
2. Reserve an available named printer.
3. Validate and prepare an existing printable model.
4. Review the exact machine, material, duration, cost, and risks.
5. Explicitly approve and submit the physical print.
6. Monitor progress and receive a completion or failure notification.

## Run the simulator locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The public build stays in labelled simulation mode. In a WebMCP-enabled browser, the page registers five tools: `list_printers`, `reserve_printer`, `prepare_print_job`, `submit_print_job`, and `get_print_status`. Without WebMCP support, use **Run safety demo** to inspect the same human approval boundary.

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Challenge-period work

The 3DA app, WebMCP tools, contracts, policy tests, documentation, and simulator were created during The WebMCP Challenge (August 25–September 3, 2026). An older HeySalad Sally3D relay informed the local-network topology but is not included or represented as new challenge code. See the dated [build notes](docs/hackathon-build/build-notes.md) for the distinction and hardware evidence.

## Trust model

- Deterministic code decides printer compatibility, scheduling conflicts, and policy.
- The agent explains, proposes, and orchestrates through structured WebMCP tools.
- A human confirms consequential physical actions.
- A local Mac mini bridge keeps printer credentials and LAN control on site.
- Every material action is recorded in an audit trail.

## Research

- [`research/3da-winner-style-and-quality-bar.md`](research/3da-winner-style-and-quality-bar.md)
- [`research/openai-hackathon-winner-patterns.md`](research/openai-hackathon-winner-patterns.md)
- [`research/webmcp-official-resources.md`](research/webmcp-official-resources.md)
- [`devpost-submission.md`](devpost-submission.md)

## Licence

MIT — see [`LICENSE`](LICENSE).
