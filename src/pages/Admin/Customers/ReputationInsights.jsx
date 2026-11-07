import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const METRICS = [
    { label: "Overall rating", value: "4.4 ⭐", tone: "amber" },
    { label: "Reviews this month", value: "286", tone: "plain" },
    { label: "Sentiment", value: "78% · 14% · 8%", tone: "good" },
    { label: "CX score", value: "82 / 100 🔴 ↓5", tone: "bad" },
];

const TOP_ISSUES = [
    { label: "Service speed", mentions: 31, prev: 18 },
    { label: "Parking", mentions: 18, prev: 17 },
    { label: "Food temperature", mentions: 13, prev: 6 },
    { label: "Staff behaviour", mentions: 9, prev: 10 },
    { label: "Ambience", mentions: 7, prev: 7 },
];

const CX_PARTS = [
    ["Wait time", 74], ["Order accuracy", 93], ["Service speed", 68], ["Complaints", 80],
    ["Review sentiment", 84], ["Repeat visits", 88], ["Compensation given", 90],
];

const SEGMENTS = [
    { name: "VIP experience", rule: "High-value + frequent (20+ visits)", n: 3 },
    { name: "Win-back", rule: "Previously frequent, inactive 30+ days", n: 2 },
    { name: "Birthday offer", rule: "Birthday in next 14 days", n: 4 },
    { name: "Biryani campaign", rule: "Favourite dish is a biryani", n: 5 },
    { name: "Resolve first (no promos)", rule: "Open complaint or negative review", n: 5 },
];

function trend({ mentions, prev }) {
    const pct = Math.round(((mentions - prev) / prev) * 100);
    return {
        text: `${prev}→${mentions}` + (pct > 0 ? ` +${pct}%` : ""),
        hot: pct >= 25,
    };
}

export default function ReputationInsights() {
    const [toast, setToast] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <div className="cx-rep">
            <div className="cx-rep-metrics">
                {METRICS.map((m) => (
                    <div key={m.label} className={"cx-rep-metric cx-rep-metric--" + m.tone}>
                        <div className="cx-rep-metric-label">{m.label}</div>
                        <div className="cx-rep-metric-value">{m.value}</div>
                    </div>
                ))}
            </div>

            <div className="cx-rep-pair">
                <section className="cx-rep-card">
                    <h4 className="cx-rep-card-title">Top issues (AI) <span>vs last month</span></h4>
                    {TOP_ISSUES.map((it, i) => {
                        const t = trend(it);
                        return (
                            <div key={it.label} className="cx-rep-row">
                                <span>{i + 1}. {it.label} — {it.mentions} mentions</span>
                                <span className={"cx-rep-num" + (t.hot ? " cx-rep-num--hot" : "")}>{t.text}</span>
                            </div>
                        );
                    })}
                </section>

                <section className="cx-rep-card">
                    <h4 className="cx-rep-card-title">Review → root cause</h4>
                    <b>"Food was cold"</b> — 17 reviews
                    <div className="cx-rep-row"><span>Share from Zone C tables</span><b className="cx-rep-num">82%</b></div>
                    <div className="cx-rep-row"><span>Zone C delivery time</span><span className="cx-rep-num">11.8 min vs 6.4 avg</span></div>
                    <div className="cx-rep-callout">
                        <b>Root cause: runner allocation.</b> Add a runner to Zone C 7–9 PM.
                        <div className="cx-actions">
                            <button className="cx-btn cx-btn--main" onClick={() => setToast("Corrective action assigned to Floor Manager")}>
                                Create corrective action
                            </button>
                        </div>
                    </div>
                    <div className="cx-meta">Illustrative until KOT/table timings are joined to review text.</div>
                </section>
            </div>

            <div className="cx-rep-pair">
                <section className="cx-rep-card">
                    <h4 className="cx-rep-card-title">Customer Experience score</h4>
                    {CX_PARTS.map(([k, v]) => (
                        <div key={k} className="cx-rep-row"><span>{k}</span><span className="cx-rep-num">{v}</span></div>
                    ))}
                    <div className="cx-meta cx-rep-foot">Today 82 · yesterday 87 · last week 85. Primary reason: dinner service delays.</div>
                </section>

                <section className="cx-rep-card">
                    <h4 className="cx-rep-card-title">Smart marketing segments</h4>
                    {SEGMENTS.map((s) => (
                        <div key={s.name} className="cx-rep-row">
                            <span><b>{s.name}</b><div className="cx-meta">{s.rule}</div></span>
                            <span className="cx-rep-num">{s.n}</span>
                        </div>
                    ))}
                    <div className="cx-meta cx-rep-foot">Customers with an open complaint are held out of campaigns until resolved.</div>
                </section>
            </div>
            {toast && <div className="cx-toast" role="status">{toast}</div>}
        </div>
    );
}
