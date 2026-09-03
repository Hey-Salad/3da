# 3DA Hackathon Build Checklist

## Gate 0 — Real Bambu capability

- [x] Reach the remote relay host through the protected VNC route.
- [x] Verify the existing Cloudflare tunnel and local agent are running.
- [x] Discover two LAN devices exposing Bambu FTPS, camera, and MQTT-TLS ports.
- [x] Verify both devices present BBL Technologies TLS certificates.
- [ ] Bind one A1 in Bambu Studio using a user-entered LAN access code.
- [ ] Observe live state and identify the selected physical printer.
- [ ] Transfer a tiny pre-sliced 3MF and verify its checksum.
- [ ] Start only after action-time human approval.
- [ ] Observe the vendor job ID and progress, then reconcile completion.
- [ ] Verify guarded pause/cancel with a deliberately safe test artifact.

Gate status: **PARTIAL**. Discovery and identity passed. Execution remains disabled until binding and a controlled physical test pass.

## Critical product slice

- [x] Scaffold pnpm workspace, Next.js app, shared contracts, and domain package.
- [x] Build the first recognisable London fabrication-room interface.
- [x] Seed Samantha, Simone, Sanda, Sacha, and Solange in explicit simulator mode.
- [x] Add deterministic half-open reservation conflict policy and tests.
- [x] Register the five browser-native WebMCP tools.
- [ ] Implement simulator API with idempotency and audit events.
- [x] Add approval challenge sheet and fingerprint invalidation in the simulator slice.
- [ ] Add Operations timeline and collection state.
- [ ] Add Cloudflare Worker, D1 migration, and private R2 artifact path.
- [ ] Adapt the existing Sally relay into the 3DA outbound claim/ack bridge.

## Submission gate

- [ ] Public Vercel URL defaults to labelled simulation mode.
- [ ] Protected real-mode operator route cannot be reached anonymously.
- [ ] README clone-to-demo path succeeds on a clean machine.
- [ ] Automated tests cover reservation conflict, mode isolation, approval reuse, stale fingerprint, and claimed-command reconciliation.
- [ ] Demo video is public, under three minutes, and leads with the Codex → reservation → human approval → physical print moment.
- [ ] Devpost copy, screenshots, repository, MIT licence, and live URL are complete.
