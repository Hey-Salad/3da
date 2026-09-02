export type PrinterState = "AVAILABLE" | "BUSY" | "ATTENTION" | "OFFLINE" | "UNKNOWN";

export type Printer = {
  id: string;
  name: string;
  model: string;
  state: PrinterState;
  material: string;
  nextAvailable: string;
  mode: "simulated" | "real";
};

export type ReservationWindow = {
  printerId: string;
  start: string;
  end: string;
};

export const printers: Printer[] = [
  { id: "samantha", name: "Samantha", model: "Bambu Lab A1", state: "AVAILABLE", material: "PLA · Jade white", nextAvailable: "Now", mode: "simulated" },
  { id: "simone", name: "Simone", model: "Bambu Lab A1", state: "BUSY", material: "PLA · Black", nextAvailable: "14:20", mode: "simulated" },
  { id: "sanda", name: "Sanda", model: "Bambu Lab A1 mini", state: "ATTENTION", material: "PETG · Orange", nextAvailable: "Plate check", mode: "simulated" },
  { id: "sacha", name: "Sacha", model: "Bambu Lab P1S", state: "AVAILABLE", material: "PLA · Blue", nextAvailable: "Now", mode: "simulated" },
  { id: "solange", name: "Solange", model: "Bambu Lab X1C", state: "OFFLINE", material: "ABS · Grey", nextAvailable: "Technician", mode: "simulated" }
];

export function windowsOverlap(a: ReservationWindow, b: ReservationWindow): boolean {
  if (a.printerId !== b.printerId) return false;
  return Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end);
}

export function canReserve(printer: Printer, requested: ReservationWindow, existing: ReservationWindow[]) {
  if (printer.state !== "AVAILABLE") return { ok: false as const, reason: "PRINTER_UNAVAILABLE" };
  if (existing.some((window) => windowsOverlap(window, requested))) {
    return { ok: false as const, reason: "RESERVATION_CONFLICT" };
  }
  return { ok: true as const };
}
