"use client";

import { useEffect, useMemo, useState } from "react";

type DemoStep = {
  label: string;
  tool?: string;
  status: "ready" | "running" | "complete" | "blocked";
  message: string;
  result?: string;
};

const timeline = [
  {
    label: "Understand the request",
    status: "complete",
    message: "Find an authorised printer for the OpenAI token enclosure.",
    result: "Requirements: A1 profile · Jade white PLA · 42 minutes"
  },
  {
    label: "Discover the fleet",
    tool: "list_printers",
    status: "complete",
    message: "Reading structured availability from the fabrication room.",
    result: "Samantha recommended · available now · compatible material"
  },
  {
    label: "Hold the machine",
    tool: "reserve_printer",
    status: "complete",
    message: "Checking the half-open booking window for conflicts.",
    result: "Reservation res_demo_3da · audit event recorded"
  },
  {
    label: "Prepare the job",
    tool: "prepare_print_job",
    status: "complete",
    message: "Validating artifact, material, duration and cleanup time.",
    result: "Fingerprint 8f4b…a19c · ready for human review"
  },
  {
    label: "Request human approval",
    tool: "submit_print_job",
    status: "blocked",
    message: "The agent cannot authorise a physical action.",
    result: "APPROVAL_REQUIRED · exact fingerprint must be approved"
  },
  {
    label: "Submit once",
    tool: "submit_print_job",
    status: "complete",
    message: "Using Peter’s one-time approval for this exact job.",
    result: "SUBMISSION_PENDING · simulated bridge acknowledged"
  },
  {
    label: "Monitor and notify",
    tool: "get_print_status",
    status: "complete",
    message: "Watching authorised state and the next valid action.",
    result: "Queued · member and space manager subscribed"
  }
] satisfies DemoStep[];

export function DemoConsole() {
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [approved, setApproved] = useState(false);
  const approvalStep = 4;
  const finished = step === timeline.length - 1;

  useEffect(() => {
    if (!playing || !entered || finished || (step === approvalStep && !approved)) return;
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, timeline.length - 1)), 2100);
    return () => window.clearTimeout(timer);
  }, [approved, entered, finished, playing, step]);

  useEffect(() => {
    if (step === approvalStep && !approved) setPlaying(false);
  }, [approved, step]);

  const visibleSteps = useMemo(() => timeline.slice(0, step + 1), [step]);

  const reset = () => {
    setStep(0);
    setApproved(false);
    setPlaying(false);
  };

  const approve = () => {
    setApproved(true);
    setStep(approvalStep + 1);
    setPlaying(true);
  };

  if (!entered) {
    return (
      <main className="demo-entry">
        <section className="demo-entry__card">
          <div className="demo-entry__brand"><span aria-hidden="true">✦</span> 3DA</div>
          <span className="demo-kicker">Recording workspace</span>
          <h1>Show how an agent earns permission to print.</h1>
          <p>This guided walkthrough uses the live WebMCP product contract with simulated printer execution. No physical machine command will be sent.</p>
          <div className="identity-card">
            <span className="demo-avatar">PM</span>
            <div><strong>Peter Machona</strong><small>Member · Space manager for this demo</small></div>
            <span className="identity-card__status">Verified</span>
          </div>
          <button className="demo-primary" onClick={() => setEntered(true)}>Enter guided demo <span aria-hidden="true">→</span></button>
          <small className="demo-entry__note">London Co-Working Space · Public safety demo</small>
        </section>
      </main>
    );
  }

  return (
    <main className="demo-console">
      <header className="demo-console__topbar">
        <a href="/" className="demo-console__brand"><span aria-hidden="true">✦</span> 3DA</a>
        <div><span className="demo-kicker">London Co-Working Space</span><strong>Guided WebMCP demonstration</strong></div>
        <div className="demo-console__badges"><span className="demo-badge demo-badge--live"><i /> WebMCP connected</span><span className="demo-badge">Simulation</span></div>
      </header>

      <section className="hardware-proof" aria-label="Verified Bambu hardware connection">
        <div className="hardware-proof__intro">
          <span className="demo-kicker">Hardware proof · Mac mini bridge</span>
          <strong>2 real Bambu A1 printers verified on the private LAN</strong>
          <small>Read-only discovery + BBL Technologies device identity. Credentials remain on site.</small>
        </div>
        <article className="hardware-printer">
          <span className="hardware-printer__icon" aria-hidden="true"><i /><b /></span>
          <div><strong>Samantha</strong><small>Bambu Lab A1 · LAN Developer Mode</small></div>
          <span className="hardware-printer__state"><i /> Paired</span>
        </article>
        <article className="hardware-printer">
          <span className="hardware-printer__icon" aria-hidden="true"><i /><b /></span>
          <div><strong>Simone</strong><small>Bambu Lab A1 · LAN Developer Mode</small></div>
          <span className="hardware-printer__state"><i /> Paired</span>
        </article>
        <span className="hardware-proof__boundary">Live connectivity proof · simulated command execution</span>
      </section>

      <section className="demo-stage" aria-live="polite">
        <aside className="demo-panel demo-brief">
          <div className="demo-panel__heading"><span className="demo-kicker">01 · Member</span><h2>The request</h2></div>
          <div className="member-message">
            <span className="demo-avatar">PM</span>
            <p>Book a suitable printer for my OpenAI token enclosure, use Jade white PLA, and prepare it for printing today.</p>
          </div>
          <dl className="brief-facts">
            <div><dt>Artifact</dt><dd>openai-token-v7.3mf</dd></div>
            <div><dt>Estimate</dt><dd>42 min + cleanup</dd></div>
            <div><dt>Priority</dt><dd>First available</dd></div>
          </dl>
          <div className="brief-rule"><strong>Member intent</strong><span>The agent may plan and prepare. It may not approve a physical action.</span></div>
        </aside>

        <section className="demo-panel demo-agent">
          <div className="demo-panel__heading demo-panel__heading--row">
            <div><span className="demo-kicker">02 · Codex</span><h2>Agent workspace</h2></div>
            <span className="agent-state"><i /> Working through WebMCP</span>
          </div>
          <div className="agent-timeline">
            {visibleSteps.map((item, index) => {
              const current = index === step;
              const blocked = index === approvalStep && !approved;
              return (
                <article className={`agent-event ${current ? "agent-event--current" : ""} ${blocked ? "agent-event--blocked" : ""}`} key={item.label}>
                  <span className="agent-event__number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="agent-event__title"><strong>{item.label}</strong>{item.tool ? <code>{item.tool}</code> : null}</div>
                    <p>{item.message}</p>
                    {item.result ? <small>{blocked ? "!" : "✓"} {item.result}</small> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className={`demo-panel demo-boundary ${step >= approvalStep ? "demo-boundary--active" : ""}`}>
          <div className="demo-panel__heading"><span className="demo-kicker">03 · Space manager</span><h2>Physical-action boundary</h2></div>
          {step < approvalStep ? (
            <div className="boundary-waiting"><span aria-hidden="true">⌁</span><strong>Waiting for a complete plan</strong><p>Approval stays unavailable until the agent provides the exact printer, artifact, material and fingerprint.</p></div>
          ) : (
            <>
              <span className={`approval-state ${approved ? "approval-state--approved" : ""}`}>{approved ? "Approved once" : "Human decision required"}</span>
              <h3>{approved ? "Peter approved this exact job" : "Send this job to Samantha?"}</h3>
              <dl className="approval-facts">
                <div><dt>Printer</dt><dd>Samantha · Bambu Lab A1</dd></div>
                <div><dt>Material</dt><dd>18.4 g · Jade white PLA</dd></div>
                <div><dt>Artifact</dt><dd>OpenAI token · verified 3MF</dd></div>
                <div><dt>Fingerprint</dt><dd><code>8f4b…a19c</code></dd></div>
                <div><dt>Execution</dt><dd>Simulation · no physical action</dd></div>
              </dl>
              {!approved ? <button className="demo-primary" onClick={approve}>Approve this exact job</button> : <p className="approval-note">Any consequential change invalidates this approval. The production bridge keeps printer credentials on site.</p>}
            </>
          )}
        </aside>
      </section>

      <footer className="demo-controls">
        <div><span className="demo-kicker">Recording controls</span><strong>{finished ? "Walkthrough complete" : step === approvalStep && !approved ? "Paused for Peter" : timeline[step]?.label}</strong></div>
        <div className="demo-progress" aria-label={`Step ${step + 1} of ${timeline.length}`}>{timeline.map((_, index) => <i className={index <= step ? "is-active" : ""} key={index} />)}</div>
        <div className="demo-controls__actions"><button onClick={reset}>Reset</button><button className="demo-primary" disabled={step === approvalStep && !approved || finished} onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : step === 0 ? "Start walkthrough" : "Continue"}</button></div>
      </footer>
    </main>
  );
}
