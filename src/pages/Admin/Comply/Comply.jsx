import { Play } from "lucide-react";
import "../../../assets/styles/comply.css"
import { useNavigate } from "react-router-dom";

const METRICS = [
  { label: "Opening SOP", value: "96%", tone: "green" },
  { label: "Kitchen SOP", value: "91%", tone: "green" },
  { label: "Cleaning", value: "87%", tone: "amber" },
  { label: "Fridge temp checks", value: "4 days missed", tone: "red" },
];

const WORKSPACES = [
  { label: "Compliance", tab: "back-office", target: "comply" },
  { label: "Cold chain", tab: "admin", target: "ctl" },
];

export default function Comply() {
    const navigate=useNavigate()
  return (
    <section className="comply-panel" id="p-dcmp">
      <header className="comply-header">
        <span className="comply-title">
          11 Compliance
          <span className="comply-badge">SOP, food safety, licences</span>
        </span>
      </header>

      <div className="comply-scroll">
        <div className="comply-metrics">
          {METRICS.map((m) => (
            <div key={m.label} className={`comply-metric comply-metric--${m.tone}`}>
              <div className="comply-metric-label">{m.label}</div>
              <div className="comply-metric-value">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="comply-pad">
          <div className="comply-card">
            <div className="comply-card-header">✨ Ambient AI</div>
            <div className="comply-row">
              <span>Compliance AI: chicken marination SOP deviated 3 times this week.</span>
            </div>
          </div>

          <div className="comply-card">
            <div className="comply-card-header">Open workspace</div>
            <div className="comply-actions">
              {WORKSPACES.map((w) => (
                <button
                  key={w.label}
                  type="button"
                  className="comply-btn"
                  onClick={()=>navigate(`/${w.tab}/${w.target}`)}
                >
                  <span>{w.label}</span>
                  <Play size={12} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
