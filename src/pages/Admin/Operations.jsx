import { useNavigate } from "react-router-dom";
import "../../assets/styles/operation.css";
import { Play } from "lucide-react";

const STATS = [
    { label: "Tables in service", value: "7 / 12", hint: "live floor" },
    { label: "Reservations", value: "1", hint: "held tables" },
    { label: "Cancellations & returns", value: "8", hint: "today", tone: "warn" },
    { label: "Kitchen SLA", value: "91%", hint: "target 90%", tone: "ok" },
];

const SHORTCUTS = [
    { label: "Floor", hub: "captain", tab: "floor" },
    { label: "Orders", hub: "captain", tab: "orders" },
    { label: "Self-order", hub: "cashier", tab: "self-order" },
    { label: "Returns", hub: "cashier", tab: "returns" },
];

export default function Operations() {
    const navigate = useNavigate()
    return (
        <section className="ops-panel" id="ops-panel">
            <header className="ops-header">
                <h2 className="ops-title">
                    03 Operations
                    <span className="ops-tag">Floor, orders and service</span>
                </h2>
            </header>

            <div className="ops-body">
                <div className="ops-stats">
                    {STATS.map((s) => (
                        <article
                            key={s.label}
                            className={`ops-stat${s.tone ? ` ops-stat--${s.tone}` : ""}`}
                        >
                            <p className="ops-stat__label">{s.label}</p>
                            <p className="ops-stat__value">{s.value}</p>
                            <p className="ops-stat__hint">{s.hint}</p>
                        </article>
                    ))}
                </div>

                <div className="ops-content">
                    <section className="ops-box">
                        <h3 className="ops-box__title">✨ Ambient AI</h3>
                        <p className="ops-box__text">
                            Ops AI: peak window 12:45–1:45 PM and 7–9 PM; keep runners on Zone C.
                        </p>
                    </section>

                    <section className="ops-box">
                        <h3 className="ops-box__title">Open workspace</h3>
                        <div className="ops-actions">
                            {SHORTCUTS.map((s) => (
                                <button
                                    key={s.label}
                                    type="button"
                                    className="ops-chip"
                                    onClick={() => navigate(`/${s.hub}/${s.tab}`)}
                                >
                                    <span>{s.label}</span>
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
