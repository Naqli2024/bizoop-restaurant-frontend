import { useState } from "react";
import { Play, Printer, Plus, Check } from "lucide-react";
import "../../../assets/styles/kitchen.css"
import { useNavigate } from "react-router-dom";


const INITIAL_PLAN = [
    { id: "biryani", item: "Biryani", required: 47, ready: 32, unit: "portions", batch: 20 },
    { id: "gravy", item: "Gravy", required: 86, ready: 65, unit: "L", batch: 10 },
    { id: "chutney", item: "Chutney", required: 21, ready: 18, unit: "kg", batch: 5 },
];

const WORKSPACE_LINKS = [
    { label: "KOT display", target: "/kot-display/display" },
    { label: "SOP & recipes", target: "/admin/sop-recipes" },
    { label: "Kitchen perf", target: "/kot-display/perf" },
    { label: "Printers", target: "/kot-display/printers", icon: Printer },
];

function MetricCard({ label, value, hint, alert }) {
    return (
        <div className={`kp-metric${alert ? " kp-metric--alert" : ""}`}>
            <div className="kp-metric-label">{label}</div>
            <div className="kp-metric-value">{value}</div>
            <div className="kp-metric-hint">{hint}</div>
        </div>
    );
}

export default function Kitchen() {
    const [plan, setPlan] = useState(INITIAL_PLAN);
    const navigate = useNavigate();

    const addBatch = (id) =>
        setPlan((rows) =>
            rows.map((r) => (r.id === id ? { ...r, ready: r.ready + r.batch } : r))
        );

    const biryani = plan.find((r) => r.id === "biryani");
    const biryaniGap = Math.max(biryani.required - biryani.ready, 0);

    const totalRequired = plan.reduce((s, r) => s + r.required, 0);
    const totalReady = plan.reduce((s, r) => s + Math.min(r.ready, r.required), 0);
    const behindPct = Math.round((1 - totalReady / totalRequired) * 100);

    return (
        <section className="kp-root">
            <header className="kp-header">
                <h1 className="kp-title">
                    04 Kitchen
                    <span className="kp-tag">Kitchen OS — plan, produce, control</span>
                </h1>
            </header>

            <div className="kp-scroll">
                <div className="kp-metrics">
                    <MetricCard label="Dinner demand forecast" value="+7%" hint="vs normal" />
                    <MetricCard label="Biryani gap" value={`${biryaniGap} portions`} hint={`required ${biryani.required}`} alert />
                    <MetricCard label="KOT open" value="2" hint="live" />
                    <MetricCard label="SOP versions" value="22" hint="recipes mapped" />
                </div>

                <div className="kp-body">
                    <div className="kp-card">
                        <div className="kp-card-head">✨ Ambient AI</div>
                        <div className="kp-ai-line">
                            Kitchen AI: dinner preparation is {behindPct}% behind demand.
                        </div>
                    </div>

                    <div className="kp-card">
                        <div className="kp-card-head">
                            Production plan
                            <span className="kp-card-note">
                                required = forecast demand × recipe; log batches as they are produced
                            </span>
                        </div>
                        <div className="kp-table-wrap">
                            <table className="kp-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="kp-right">Required</th>
                                        <th className="kp-right">Ready</th>
                                        <th className="kp-right">Gap</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {plan.map((r) => {
                                        const gap = r.ready - r.required;
                                        return (
                                            <tr key={r.id}>
                                                <td>{r.item}</td>
                                                <td className="kp-num kp-right">{r.required} {r.unit}</td>
                                                <td className="kp-num kp-right">{r.ready} {r.unit}</td>
                                                <td className={`kp-num kp-right${gap < 0 ? " kp-gap" : ""}`}>
                                                    {gap >= 0 ? (
                                                        <Check size={15} className="kp-success-icon" />
                                                    ) : (
                                                        `−${Math.abs(gap)}`
                                                    )}
                                                </td>
                                                <td>
                                                    <button type="button" className="kp-btn" onClick={() => addBatch(r.id)}>
                                                        <Plus className="kp-btn-icon" size={14} aria-hidden="true" /> batch
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="kp-card">
                        <div className="kp-card-head">Open workspace</div>
                        <div className="kp-links">
                            {WORKSPACE_LINKS.map(({ label, target, icon: Icon }) => (
                                <button key={label} type="button" className="kp-btn"  onClick={() => navigate(target)}>
                                    {Icon && <Icon className="kp-btn-icon" size={14} aria-hidden="true" />}
                                    <span>{label}</span>
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
