import { MessageSquare, Play } from "lucide-react";
import "../../../assets/styles/customers.css";
import { useNavigate } from "react-router-dom";

const METRICS = [
    { id: "open", label: "Open conversations", value: "9", hint: "8 unanswered" },
    { id: "rating", label: "Rating", value: "4.4 ⭐", hint: "286 reviews this month" },
    { id: "risk", label: "At-risk customers", value: "2", hint: "inactive 30+ days", tone: "danger" },
    { id: "cx", label: "CX score", value: "81", hint: "↓5 vs last week", tone: "alt" },
];

const WORKSPACE_LINKS = [
    { id: "inbox", label: "Unified inbox", role: "admin", target: "inbox" },
    { id: "crm", label: "CRM", role: "admin", target: "crm" },
    { id: "marketing", label: "Marketing", role: "admin", target: "marketing" },
    { id: "whatsapp", label: "WhatsApp", role: "cashier", target: "whatsapp", icon: true },
];

export default function Customers() {
    const navigate=useNavigate()
    return (
        <section className="cx-panel" id="panel-customers">
            <header className="cx-header">
                <h1 className="cx-title">
                    08 Customers
                    <span className="cx-tag">CRM, inbox, reputation, loyalty</span>
                </h1>
            </header>

            <div className="cx-body">
                <div className="cx-metrics">
                    {METRICS.map((m) => (
                        <article
                            key={m.id}
                            className={`cx-metric${m.tone ? ` cx-metric--${m.tone}` : ""}`}
                        >
                            <div className="cx-metric__label">{m.label}</div>
                            <div className="cx-metric__value">{m.value}</div>
                            <div className="cx-metric__hint">{m.hint}</div>
                        </article>
                    ))}
                </div>

                <div className="cx-content">
                    <section className="cx-box">
                        <h2 className="cx-box__title">✨ Ambient AI</h2>
                        <div className="cx-box__row">
                            <span>Customer AI: 38% of negative reviews mention waiting time.</span>
                        </div>
                    </section>

                    <section className="cx-box">
                        <h2 className="cx-box__title">Open workspace</h2>
                        <div className="cx-actions">
                            {WORKSPACE_LINKS.map((l) => (
                                <button
                                    key={l.id}
                                    type="button"
                                    className="cx-pill"
                                    onClick={() => navigate(`/${l.role}/${l.target}`)}
                                >
                                    {l.icon && <MessageSquare size={12} />}
                                    <span>{l.label}</span>
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
