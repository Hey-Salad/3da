# WebMCP Challenge official resources for 3DA

Source inspected live through Chrome Computer Use on 2 September 2026:
https://webmcp.devpost.com/resources

## Recommended hosting split

| Layer | Host | Reason |
|---|---|---|
| 3DA web experience and WebMCP registration | Vercel Pro | Best use of the account already available; fast preview deployments; React/Next.js-friendly; simple public judge URL |
| Booking and control-plane API | Vercel initially | Keep the MVP deployable as one coherent product; move only long-running work elsewhere |
| Printer bridge | Existing local Linux bridge through Cloudflare Tunnel | It already reaches the real printer relay and keeps LAN devices off the public internet |
| Long-running camera/CV worker | Render only if the golden path needs it | The available $50 credit is useful for a persistent worker, but adding another platform before the core print workflow works would increase demo risk |
| Database | Lightweight managed Postgres or existing project store | Store printers, bookings, jobs, events, approvals, and audit records; do not store printer credentials in the browser |

Decision: deploy the primary app on Vercel. Keep the local printer bridge behind Cloudflare. Reserve Render for a persistent computer-vision or notification worker after the booking-to-print path is stable.

## Highest-priority WebMCP references

1. [WebMCP specification and explainer](https://github.com/webmachinelearning/webmcp)
2. [Chrome WebMCP developer documentation](https://developer.chrome.com/docs/ai/webmcp)
3. [Secure WebMCP tools](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
4. [WebMCP evaluations](https://developer.chrome.com/docs/ai/webmcp/evals)
5. [Debug WebMCP tools in Chrome DevTools](https://developer.chrome.com/docs/devtools/application/webmcp)
6. [Google Chrome WebMCP demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos)
7. [React useWebMCPTool hook](https://www.npmjs.com/package/use-webmcp-tool)

## OpenAI resources

- [WebMCP Showcase](https://developers.openai.com/showcase?view=webmcp-apps) — examples of agent-native applications.
- [ChatGPT Sites](https://learn.chatgpt.com/docs/sites?surface=app) — official site-building material. The challenge FAQ notes that Sites is unavailable in the UK/EEA/Switzerland, so Vercel is the safer route for this London project.

## Cloudflare resources

- [Cloudflare WebMCP overview](https://blog.cloudflare.com/webmcp/)
- [WebMCP on Browser Run](https://developers.cloudflare.com/browser-run/features/webmcp/)
- [Coffee-store WebMCP demo](https://webmcp-coffee.jilles.fyi/)
- [Cloudflare challenge examples](https://webmcp-challenge.examples.workers.dev/)
- [WebMCP React template for Workers](https://github.com/cloudflare/agents/tree/main/examples/webmcp-react)
- [Cloudflare Pages and Workers](https://developers.cloudflare.com/pages/)

Use for 3DA: the existing Cloudflare Tunnel remains the secure route to the local printer bridge. The Workers template is useful as an implementation reference, but it should not force a hosting migration away from Vercel.

## Vercel resources

- [Vercel storefront source](https://github.com/vercel/shop)
- [Reference WebMCP implementation](https://github.com/vercel/shop/pull/498)
- [Live WebMCP storefront example](https://template.vercel.shop/)
- [Vercel pricing](https://vercel.com/pricing)
- [Challenge credit redemption](https://credits.vercel.sh/redeem) — first 1,000 builders; code `OAIWEBMH-9E2F-MUT4`. The project already has Vercel Pro, so this is optional.

Use for 3DA: study the reference implementation for registration patterns and deploy the frontend/control plane to the existing Pro account.

## Render resources

- [Render Workflows](https://render.com/workflows)
- [Workflows documentation](https://render.com/docs/workflows)
- [Render templates](https://render.com/templates)
- [Render credit documentation](https://render.com/docs/credits)
- [Challenge participant credit](https://credits-portal-mmdm.onrender.com/claim/openai-hackathon)

Use for 3DA: the existing $50 credit can run a persistent job or camera-analysis worker. Do not add it to the critical path unless Vercel's execution limits block a required feature.

## Additional supporter references

### Shopify

- [Shopify WebMCP tools](https://shopify.dev/docs/api/web-mcp)
- [Shopify agentic tools](https://shopify.dev/docs/agents)

These are lower priority because 3DA is not a storefront submission.

### Netlify

- [Netlify](https://www.netlify.com/)
- [Choose a deployment path](https://docs.netlify.com/start/choose-your-path/)
- [Netlify WebMCP starter](https://webmcp-starter.netlify.app/)

These are useful references but not required when Vercel Pro is already available.

### Angular and agent guidance

- [WebMCP with Angular](https://angular.dev/ai/webmcp)
- [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance)

Use the Angular reference only if the selected frontend stack is Angular; the current recommendation is React/Next.js.

## Support channels

- [OpenAI Discord](https://discord.gg/openai)
- [WebMCP Challenge discussion board](https://webmcp.devpost.com/forum_topics)
- [Participant directory](https://webmcp.devpost.com/participants)

## Resource-derived implementation rules

1. Register real browser tools through `document.modelContext.registerTool(...)`.
2. Test in ChatGPT's in-app browser and Chrome 149+ with the WebMCP testing flag enabled.
3. Treat tool descriptions and returned content as security boundaries; avoid exposing credentials, raw LAN addresses, or unrestricted command execution.
4. Build evaluation cases before the demo: normal booking, booking conflict, unsafe job, unavailable printer, approval denied, bridge offline, and print failure.
5. Keep irreversible actions behind explicit confirmation. Read-only discovery and planning may be automatic.
6. Ensure the public repository contains the WebMCP implementation, setup instructions, an open-source licence, and a clear explanation of what was added during the challenge period.
7. Follow the official rules where the Resources FAQ conflicts with them. A public demo video under three minutes is required.

## First implementation slice

The first vertical slice should expose four WebMCP tools:

- `list_printers` — returns named printers, capabilities, material, state, queue, and estimated availability.
- `reserve_printer` — creates a time-bounded reservation after checking conflicts and job compatibility.
- `prepare_print_job` — validates a supplied demo model and returns slice metadata, risk flags, time, material, and cost estimate without starting hardware.
- `submit_print_job` — requires a reservation and explicit approval token, then sends the prepared job to the bridge and creates an auditable job record.

Monitoring and cancellation follow after this slice works end to end.
