# 3DA — The agent-ready fabrication room

Book a shared 3D printer from Codex or the web, validate the job, approve the physical action, and watch it complete through one safe WebMCP workflow.

3DA is being built for [The WebMCP Challenge](https://webmcp.devpost.com/) by [HeySalad](https://github.com/Hey-Salad).

## The idea

A meeting room can be booked. Why not a 3D printer?

3DA turns a shared fabrication room into an agent-ready service. People and agents can discover capacity, reserve a named printer, validate and prepare a job, explicitly approve the physical action, monitor the outcome, and recover safely from failure.

The product centres shared-space orchestration and safe WebMCP control—not AI-generated CAD.

## Current status

Planning and validation are in progress. The repository currently contains the official-resource research, winner analysis, and the emerging product quality bar. The implementation will be developed through small, verifiable commits.

## Planned golden path

1. Discover the London co-working fabrication room and its printers.
2. Reserve an available named printer.
3. Validate and prepare an existing printable model.
4. Review the exact machine, material, duration, cost, and risks.
5. Explicitly approve and submit the physical print.
6. Monitor progress and receive a completion or failure notification.

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

## Licence

MIT — see [`LICENSE`](LICENSE).
