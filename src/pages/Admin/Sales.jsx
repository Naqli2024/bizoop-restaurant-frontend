import React from "react";

import "../../assets/styles/sales.css"
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";


const SUMMARY_STATS = [
    { id: "actual", label: "Actual", value: "₹27,800", hint: "collected so far", tone: "green" },
    { id: "projected", label: "Projected close", value: "₹95,375", hint: "range ₹77,730–₹1.13L" },
    { id: "target", label: "Target", value: "₹97,936", hint: "28% achieved", tone: "blue" },
    { id: "pace", label: "Pace", value: "8.1%", hint: "vs normal · confidence 63%", tone: "green" },
];

const AI_INSIGHTS = [
    "Sales AI: projected close misses target by ₹2,561.",
    "Returns AI: refunds are 3.9% of sales.",
];

const CLASS_META = {
    star: { icon: "⭐", label: "High volume / High contribution" },
    warn: { icon: "⚠️", label: "High volume / Low contribution" },
    profit: { icon: "💰", label: "Profit driver" },
    review: { icon: "❌", label: "Review" },
};

const MENU_ITEMS = [
    { name: "Butter Chicken", price: 320, food: 71, packLabour: 37, aggregator: 23, contribution: 189, pct: 59, type: "star" },
    { name: "Mutton Biryani", price: 320, food: 234, packLabour: 37, aggregator: 23, contribution: 26, pct: 8, type: "warn" },
    { name: "Paneer Butter Masala", price: 280, food: 73, packLabour: 33, aggregator: 20, contribution: 154, pct: 55, type: "warn" },
    { name: "Tandoori Chicken (Half)", price: 300, food: 80, packLabour: 35, aggregator: 22, contribution: 163, pct: 54, type: "warn" },
    { name: "Chicken 65", price: 220, food: 52, packLabour: 28, aggregator: 16, contribution: 125, pct: 57, type: "star" },
    { name: "Paneer Tikka", price: 240, food: 56, packLabour: 30, aggregator: 18, contribution: 137, pct: 57, type: "profit" },
    { name: "Kothu Parotta", price: 190, food: 18, packLabour: 25, aggregator: 14, contribution: 133, pct: 70, type: "profit" },
    { name: "Chicken Biryani", price: 220, food: 96, packLabour: 28, aggregator: 16, contribution: 80, pct: 36, type: "review" },
];

const WORKSPACES = [
    { label: "Sales IQ", tab: "sales-iq" },
    { label: "Billing", tab: "billing" },
    { label: "Bills", tab: "bills" },
    { label: "Returns", tab: "returns" },
    { label: "Day-end", tab: "day-end" },
];

const rupee = (n) => `₹${n}`;

export default function Sales() {
    const navigate = useNavigate()
    return (
        <section className="scc-page">
            <header className="scc-header">
                <h2 className="scc-title">
                    02 Sales <span className="scc-badge">Sales command centre</span>
                </h2>
            </header>

            <div className="scc-body">
                {/* Summary stats */}
                <div className="scc-stats">
                    {SUMMARY_STATS.map((s) => (
                        <article key={s.id} className={`scc-stat ${s.tone ? `scc-stat--${s.tone}` : ""}`}>
                            <div className="scc-stat__label">{s.label}</div>
                            <div className="scc-stat__value">{s.value}</div>
                            <div className="scc-stat__hint">{s.hint}</div>
                        </article>
                    ))}
                </div>

                <div className="scc-content">
                    {/* Ambient AI */}
                    <div className="scc-panel">
                        <div className="scc-panel__head">✨ Ambient AI</div>
                        {AI_INSIGHTS.map((text) => (
                            <div key={text} className="scc-insight">
                                {text}
                            </div>
                        ))}
                    </div>

                    {/* Contribution table */}
                    <div className="scc-panel">
                        <div className="scc-panel__head scc-panel__head--split">
                            <span>Contribution intelligence (per plate)</span>
                            <span className="scc-panel__note">
                                packaging ₹8, labour 9% of price, aggregator 27% share × 22% commission (assumed)
                            </span>
                        </div>

                        <div className="scc-table-wrap">
                            <table className="scc-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="scc-right">Price</th>
                                        <th className="scc-right">Food</th>
                                        <th className="scc-right">Pack+labour</th>
                                        <th className="scc-right">Aggr.+disc.</th>
                                        <th className="scc-right">Contribution</th>
                                        <th>Class</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MENU_ITEMS.map((item) => {
                                        const meta = CLASS_META[item.type];
                                        return (
                                            <tr key={item.name}>
                                                <td>{item.name}</td>
                                                <td className="scc-num scc-right">{rupee(item.price)}</td>
                                                <td className="scc-num scc-right">{rupee(item.food)}</td>
                                                <td className="scc-num scc-right">{rupee(item.packLabour)}</td>
                                                <td className="scc-num scc-right">{rupee(item.aggregator)}</td>
                                                <td className="scc-num scc-right">
                                                    <b>{rupee(item.contribution)}</b> · {item.pct}%
                                                </td>
                                                <td>
                                                    <span className="scc-class">
                                                        <span className="scc-class__icon">{meta.icon}</span>
                                                        {meta.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Workspace shortcuts */}
                    <div className="scc-panel">
                        <div className="scc-panel__head">Open workspace</div>
                        <div className="scc-chips">
                            {WORKSPACES.map(({ label, tab }) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className="scc-chip"
                                    onClick={() => navigate(`/cashier/${tab}`)}
                                >
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
