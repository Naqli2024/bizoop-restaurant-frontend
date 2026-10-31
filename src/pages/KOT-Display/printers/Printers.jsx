
import { useState } from "react";
import "../../../assets/styles/printers.css";

const INITIAL_PRINTERS = [
  {
    id: "p1",
    name: "Main Kitchen Printer",
    station: "Main Kitchen",
    model: "Epson TM-T82II",
    ip: "192.168.1.41",
    color: "#F59E0B",
    online: true,
    paperLow: false,
  },
  {
    id: "p2",
    name: "Tandoor Printer",
    station: "Tandoor",
    model: "Epson TM-T82II",
    ip: "192.168.1.42",
    color: "#F97316",
    online: true,
    paperLow: true,
  },
  {
    id: "p3",
    name: "Bar Printer",
    station: "Bar",
    model: "Xprinter XP-N160II",
    ip: "192.168.1.43",
    color: "#3B82F6",
    online: true,
    paperLow: false,
  },
  {
    id: "p4",
    name: "Dessert Counter Printer",
    station: "Dessert",
    model: "Xprinter XP-N160II",
    ip: "192.168.1.44",
    color: "#EC4899",
    online: true,
    paperLow: false,
  },
  {
    id: "p5",
    name: "Billing Counter (80mm)",
    station: "Billing",
    model: "Epson TM-T88VI",
    ip: "192.168.1.40",
    color: "#10B981",
    online: true,
    paperLow: false,
  },
];

const INITIAL_QUEUE = [
  { time: "16:58", kot: "KOT-0137", order: "DEL-01", type: "New", printer: "Tandoor Printer", status: "Printed" },
  { time: "16:58", kot: "KOT-0136", order: "DEL-01", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "17:08", kot: "KOT-0135", order: "TA-01", type: "New", printer: "Dessert Counter Printer", status: "Printed" },
  { time: "17:08", kot: "KOT-0134", order: "TA-01", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "17:15", kot: "KOT-0133", order: "R1", type: "New", printer: "Bar Printer", status: "Printed" },
  { time: "17:15", kot: "KOT-0132", order: "R1", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "16:35", kot: "KOT-0131", order: "F3", type: "New", printer: "Bar Printer", status: "Printed" },
  { time: "16:35", kot: "KOT-0130", order: "F3", type: "New", printer: "Tandoor Printer", status: "Printed" },
  { time: "16:35", kot: "KOT-0129", order: "F3", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "16:53", kot: "KOT-0128", order: "F2", type: "New", printer: "Bar Printer", status: "Printed" },
  { time: "16:53", kot: "KOT-0127", order: "F2", type: "New", printer: "Tandoor Printer", status: "Printed" },
  { time: "16:53", kot: "KOT-0126", order: "F2", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "17:10", kot: "KOT-0125", order: "T5", type: "New", printer: "Main Kitchen Printer", status: "Printed" },
  { time: "17:02", kot: "KOT-0124", order: "T4", type: "New", printer: "Bar Printer", status: "Printed" },
];

const ROUTING_RULES = [
  {
    category: "Starters",
    stations: [
      { name: "🍳 Main Kitchen", color: "#F59E0B" },
      { name: "🔥 Tandoor", color: "#F97316" },
    ],
  },
  {
    category: "Main Course",
    stations: [{ name: "🍳 Main Kitchen", color: "#F59E0B" }],
  },
  {
    category: "Biryani",
    stations: [{ name: "🍳 Main Kitchen", color: "#F59E0B" }],
  },
  {
    category: "Breads",
    stations: [
      { name: "🔥 Tandoor", color: "#F97316" },
      { name: "🍳 Main Kitchen", color: "#F59E0B" },
    ],
  },
  {
    category: "Tiffin",
    stations: [{ name: "🍳 Main Kitchen", color: "#F59E0B" }],
  },
  {
    category: "Beverages",
    stations: [{ name: "🍹 Bar", color: "#3B82F6" }],
  },
  {
    category: "Desserts",
    stations: [{ name: "🍨 Dessert", color: "#EC4899" }],
  },
];

const FLOW_STEPS = [
  { title: "Captain", description: "submits order" },
  { title: "KOT split", description: "by station" },
  { title: "Printers", description: "one per section" },
  { title: "Kitchen", description: "cooks & marks ready" },
  { title: "Billing", description: "KOT → bill" },
];

function PrinterTag({ children, color }) {
  return (
    <span
      className="kp-tag kp-station-tag"
      style={{
        backgroundColor: `${color}22`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function StatusTag({ children, offline = false }) {
  return (
    <span className={`kp-tag ${offline ? "kp-tag-error" : "kp-tag-ok"}`}>
      {children}
    </span>
  );
}

function PrinterRow({ printer, onToggleFault, onTest }) {
  return (
    <div className="kp-printer-row">
      <div className="kp-printer-info">
        <div className="kp-printer-name">
          {printer.name}{" "}
          {printer.station !== "Billing" && (
            <PrinterTag color={printer.color}>
              {printer.station}
            </PrinterTag>
          )}
        </div>

        <div className="kp-muted kp-mono kp-printer-details">
          {printer.model} · {printer.ip}
          {printer.paperLow && (
            <span className="kp-paper-low"> · paper low</span>
          )}
        </div>
      </div>

      <div className="kp-printer-actions">
        <StatusTag offline={!printer.online}>
          {printer.online ? "Online" : "Offline"}
        </StatusTag>

        {printer.id !== "p5" && (
          <button
            type="button"
            className="kp-btn kp-btn-sm"
            onClick={() => onToggleFault(printer.id)}
          >
            {printer.online ? "Simulate fault" : "Restore printer"}
          </button>
        )}

        <button
          type="button"
          className="kp-btn kp-btn-sm"
          onClick={() => onTest(printer.id)}
        >
          Test
        </button>
      </div>
    </div>
  );
}

export default function Printers() {
  const [printers, setPrinters] = useState(INITIAL_PRINTERS);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [notice, setNotice] = useState("");

  const togglePrinterFault = (printerId) => {
    const selected = printers.find((printer) => printer.id === printerId);

    if (!selected) return;

    const nextOnline = !selected.online;

    setPrinters((current) =>
      current.map((printer) =>
        printer.id === printerId
          ? { ...printer, online: nextOnline }
          : printer
      )
    );

    setNotice(
      nextOnline
        ? `${selected.name} restored successfully.`
        : `${selected.name} is offline. Its KOTs will use the Main Kitchen printer.`
    );
  };

  const testPrinter = (printerId) => {
    const printer = printers.find((item) => item.id === printerId);

    if (!printer) return;

    if (printer.online) {
      setNotice(`Test print sent successfully to ${printer.name}.`);
      return;
    }

    const mainPrinter = printers.find((item) => item.id === "p1");

    if (printerId === "p1" || !mainPrinter?.online) {
      setNotice(
        `${printer.name} is offline. No test print could be sent because the Main Kitchen printer is unavailable.`
      );
      return;
    }

    setNotice(
      `${printer.name} is offline. Test print routed to Main Kitchen Printer.`
    );
  };

  const queueWithFallback = queue.map((job) => {
    const targetPrinter = printers.find(
      (printer) => printer.name === job.printer
    );

    if (targetPrinter?.online) {
      return job;
    }

    const mainPrinter = printers.find((printer) => printer.id === "p1");

    if (mainPrinter?.online && targetPrinter?.id !== "p1") {
      return {
        ...job,
        printer: "Main Kitchen Printer (fallback)",
      };
    }

    if (!targetPrinter) {
      return job;
    }

    return {
      ...job,
      status: "Failed",
    };
  });

  return (
    <section className="kp-panel">
      <div className="kp-panel-header">
        <span className="kp-panel-title">
          🖨 KOT printers &amp; routing
        </span>
      </div>

      <div className="kp-scroll kp-panel-body">
        <div className="kp-flow">
          {FLOW_STEPS.map((step) => (
            <div className="kp-flow-step kp-flow-active" key={step.title}>
              <b>{step.title}</b>
              <span>{step.description}</span>
            </div>
          ))}
        </div>

        {notice && (
          <div className="kp-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              className="kp-notice-close"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="kp-grid">
          <div className="kp-card">
            <div className="kp-card-header">Printers</div>

            <div className="kp-printer-list">
              {printers.map((printer) => (
                <PrinterRow
                  key={printer.id}
                  printer={printer}
                  onToggleFault={togglePrinterFault}
                  onTest={testPrinter}
                />
              ))}
            </div>

            <p className="kp-muted kp-help-text">
              If a station printer goes offline, its KOTs print at the Main
              Kitchen printer and still appear on the KOT display, tagged
              "via Main printer".
            </p>
          </div>

          <div className="kp-card">
            <div className="kp-card-header">Item routing rules</div>

            <div className="kp-table-wrap">
              <table className="kp-table">
                <thead>
                  <tr>
                    <th>Menu category</th>
                    <th>Prints at</th>
                  </tr>
                </thead>

                <tbody>
                  {ROUTING_RULES.map((rule) => (
                    <tr key={rule.category}>
                      <td>{rule.category}</td>
                      <td>
                        <div className="kp-routing-tags">
                          {rule.stations.map((station) => (
                            <PrinterTag
                              key={station.name}
                              color={station.color}
                            >
                              {station.name}
                            </PrinterTag>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="kp-muted kp-routing-note">
              Routing is set per dish in Admin → Menu (e.g. Butter Naan →
              Tandoor, Mojito → Bar).
            </p>
          </div>
        </div>

        <div className="kp-card kp-queue-card">
          <div className="kp-card-header kp-queue-header">
            <span>Print queue</span>
            <span className="kp-muted kp-queue-count">20 jobs today</span>
          </div>

          <div className="kp-table-wrap">
            <table className="kp-table kp-queue-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>KOT</th>
                  <th>Order</th>
                  <th>Type</th>
                  <th>Printer</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {queueWithFallback.map((job) => (
                  <tr key={job.kot}>
                    <td className="kp-num">{job.time}</td>
                    <td className="kp-num">{job.kot}</td>
                    <td>{job.order}</td>
                    <td>{job.type}</td>
                    <td>
                      {job.printer}
                      {job.printer.includes("(fallback)") && (
                        <span className="kp-fallback-tag">
                          via Main printer
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusTag offline={job.status === "Failed"}>
                        {job.status}
                      </StatusTag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
