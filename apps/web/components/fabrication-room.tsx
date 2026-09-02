"use client";

import { useState } from "react";
import { printers, type Printer } from "@3da/domain";

const statusCopy = {
  AVAILABLE: "Ready to book",
  BUSY: "Printing",
  ATTENTION: "Needs a plate check",
  OFFLINE: "Offline",
  UNKNOWN: "Checking"
} as const;

function PrinterPod({ printer, selected, onSelect }: { printer: Printer; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={`printer-pod printer-pod--${printer.state.toLowerCase()} ${selected ? "printer-pod--selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${printer.name}, ${printer.model}, ${statusCopy[printer.state]}`}
    >
      <span className="printer-pod__light" aria-hidden="true" />
      <span className="printer-pod__machine" aria-hidden="true">
        <span className="printer-pod__gantry" />
        <span className="printer-pod__head" />
        <span className="printer-pod__plate" />
      </span>
      <span className="printer-pod__name">{printer.name}</span>
      <span className="printer-pod__status">{statusCopy[printer.state]}</span>
    </button>
  );
}

export function FabricationRoom() {
  const [selectedId, setSelectedId] = useState("samantha");
  const [reserved, setReserved] = useState(false);
  const selected = printers.find((printer) => printer.id === selectedId) ?? printers[0]!;
  const availableCount = printers.filter((printer) => printer.state === "AVAILABLE").length;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#room" aria-label="3DA home">
          <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
          <span>3DA</span>
        </a>
        <div className="space-title">
          <span className="eyebrow">London Co-Working Space</span>
          <strong>Fabrication Room</strong>
        </div>
        <div className="topbar__actions">
          <span className="mode-pill"><i /> Simulation</span>
          <button className="avatar" aria-label="Open Peter's account menu">PM</button>
        </div>
      </header>

      <section className="hero" id="room">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--green">The room is listening</span>
          <h1>Book a printer.<br />Bring an idea to life.</h1>
          <p>Five named machines, one fair queue, and a human decision before anything physical begins.</p>
          <div className="hero__stats" aria-label="Room summary">
            <div><strong>{availableCount}</strong><span>ready now</span></div>
            <div><strong>1</strong><span>printing</span></div>
            <div><strong>1</strong><span>needs help</span></div>
          </div>
        </div>

        <div className="room-shell" aria-label="Interactive fabrication room">
          <div className="room-shell__ceiling" aria-hidden="true" />
          <div className="room-shell__wall room-shell__wall--left" aria-hidden="true" />
          <div className="room-shell__wall room-shell__wall--right" aria-hidden="true" />
          <div className="room-shell__floor" aria-hidden="true" />
          <div className="room-shell__sign" aria-hidden="true">FAB LAB · LDN</div>
          <div className="printer-grid">
            {printers.map((printer) => (
              <PrinterPod key={printer.id} printer={printer} selected={selected.id === printer.id} onSelect={() => { setSelectedId(printer.id); setReserved(false); }} />
            ))}
          </div>
        </div>
      </section>

      <section className="control-deck" aria-live="polite">
        <div className="selected-machine">
          <span className={`status-dot status-dot--${selected.state.toLowerCase()}`} />
          <div>
            <span className="eyebrow">Selected machine</span>
            <h2>{selected.name}</h2>
          </div>
          <span className="machine-model">{selected.model}</span>
        </div>

        <dl className="machine-facts">
          <div><dt>Status</dt><dd>{statusCopy[selected.state]}</dd></div>
          <div><dt>Loaded</dt><dd>{selected.material}</dd></div>
          <div><dt>Next slot</dt><dd>{selected.nextAvailable}</dd></div>
          <div><dt>Safety</dt><dd>Approval required</dd></div>
        </dl>

        <div className="booking-card">
          <div>
            <span className="eyebrow">Suggested booking</span>
            <strong>{reserved ? "Reserved for Peter" : "Today · 11:30–12:30"}</strong>
            <small>{reserved ? "Audit event recorded · simulator" : "Fits the 42 min estimate + cleanup"}</small>
          </div>
          <button
            className="primary-action"
            disabled={selected.state !== "AVAILABLE" || reserved}
            onClick={() => setReserved(true)}
          >
            {reserved ? "Reservation held" : selected.state === "AVAILABLE" ? `Reserve ${selected.name}` : "Choose an available printer"}
          </button>
        </div>
      </section>

      <footer>
        <p><strong>3DA keeps the risky bit visible.</strong> Agents can plan and prepare; people approve physical actions.</p>
        <a href="#room">View operations <span aria-hidden="true">→</span></a>
      </footer>
    </main>
  );
}
