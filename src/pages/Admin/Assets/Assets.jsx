import { Play } from "lucide-react";
import React from "react";
import "../../../assets/styles/assets.css";
import { useNavigate } from "react-router-dom";

const STATUS = {
  ok: "assets-dot--ok",
  critical: "assets-dot--critical",
  warn: "assets-dot--warn",
};

const METRICS = [
  { id: "cold", label: "Cold-chain alerts", value: "0", hint: "all units in range", accent: "green" },
  { id: "freezer1", label: "Freezer 1", status: "ok", hint: "−19°C" },
  { id: "oven1", label: "Oven 1", status: "critical", hint: "4 breakdowns in 60 days" },
  { id: "ac3", label: "AC 3", status: "warn", hint: "service due" },
];

export default function Assets() {
    const navigate=useNavigate();
  return (
    <section className="assets-panel" id="assets-panel">
      <header className="assets-header">
        <h2 className="assets-title">
          10 Assets
          <span className="assets-badge">Equipment health and cold chain</span>
        </h2>
      </header>

      <div className="assets-scroll">
        <div className="assets-metrics">
          {METRICS.map((m) => (
            <div
              key={m.id}
              className={`assets-metric ${m.accent ? `assets-metric--${m.accent}` : ""}`}
            >
              <div className="assets-metric-label">{m.label}</div>
              <div className="assets-metric-value">
                {m.status ? (
                  <span className={`assets-dot ${STATUS[m.status]}`} aria-label={m.status} />
                ) : (
                  m.value
                )}
              </div>
              <div className="assets-metric-hint">{m.hint}</div>
            </div>
          ))}
        </div>

        <div className="assets-content">
          <div className="assets-card">
            <div className="assets-card-header">✨ Ambient AI</div>
            <div className="assets-row">
              <span>Asset AI: Oven 1 — replacement may be cheaper than further repair.</span>
            </div>
          </div>

          <div className="assets-card">
            <div className="assets-card-header">Open workspace</div>
            <button type="button" className="assets-btn" onClick={()=>navigate('/admin/ctl')}>
              <span>Cold chain</span>
              <Play size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
