import React from "react";
import "../../../assets/styles/intel.css"
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATS = [
  { label: "Health score", value: "78 / 100", hint: "" },
  { label: "Forecast confidence", value: "63%", hint: "" },
  { label: "Open actions", value: "7", hint: "" },
  { label: "Learned patterns", value: "5", hint: "business memory" },
];

const MEMORY = [
  "Every Friday before a holiday, chicken consumption rises about 16–21%.",
  "ABC Foods averages a 4.7% delivery shortage.",
  "Biryani complaints rise when volume exceeds 220 portions a day.",
  "T Nagar consistently runs 5 pts higher food cost than Anna Nagar.",
  "Sunday tawa waits at T Nagar exceed standard when one cook is on shift.",
];

const WORKSPACES = [
  { label: "Intelligence dashboard", target: "intel-dash" },
  { label: "What-if simulator", target: "ctl" },
  { label: "Recipes & SOP", target: "sop-recipes" },
];

// onNavigate replaces the old inline hubGo('dint','admin', target)
export default function Intel() {
  const navigate=useNavigate()
  return (
    <section className="intel-panel">
      <header className="intel-header">
        <h1 className="intel-title">
          12 Intelligence
          <span className="intel-badge">Intelligence, simulator, memory</span>
        </h1>
      </header>

      <div className="intel-scroll">
        <div className="intel-stats">
          {STATS.map((s) => (
            <div className="intel-stat" key={s.label}>
              <div className="intel-stat__label">{s.label}</div>
              <div className="intel-stat__value">{s.value}</div>
              <div className="intel-stat__hint">{s.hint}</div>
            </div>
          ))}
        </div>

        <div className="intel-body">
          <section className="intel-card">
            <h2 className="intel-card__title">✨ Ambient AI</h2>
            <p className="intel-row">
              Ask the BOS what needs to happen next — start from the Action Centre.
            </p>
          </section>

          <section className="intel-card">
            <h2 className="intel-card__title">
              🧠 Restaurant memory
              <span className="intel-card__note">
                illustrative until enough history is stored
              </span>
            </h2>
            {MEMORY.map((text) => (
              <p className="intel-row" key={text}>{text}</p>
            ))}
          </section>

          <section className="intel-card">
            <h2 className="intel-card__title">Open workspace</h2>
            <div className="intel-actions">
              {WORKSPACES.map((w) => (
                <button
                  key={w.target}
                  type="button"
                  className="intel-btn"
                  onClick={() => navigate(`/admin/${w.target}`)}
                >
                 <span>{w.label}</span>
                  <Play size={12} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
