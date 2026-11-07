import { useState } from "react";
import "../../../assets/styles/marketing.css";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CampaignModal from "./CampaignModal";


const FLOW_STEPS = [
    { title: "Customer", note: "14 profiles" },
    { title: "Orders", note: "from every bill" },
    { title: "Visits", note: "159 logged" },
    { title: "Spending", note: "₹2,78,490" },
    { title: "Preferences", note: "favourite dishes" },
    { title: "Marketing", note: "4 campaigns" },
];

const METRICS = [
    { label: "Campaign revenue (30d)", value: "₹73,300", accent: null },
    { label: "Messages sent", value: "380", accent: "#25d366" },
    { label: "Redemption rate", value: "22%", accent: "var(--lm-blue)" },
    {
        label: "Points outstanding",
        value: "11,900",
        hint: "= ₹11,900 liability",
        accent: "var(--lm-purple)",
    },
];

const PROGRAMME_ROWS = [
    { key: "Earn", value: "1 point per ₹10 spent" },
    { key: "Redeem", value: "1 point = ₹1 · max 20% of bill · min 100 pts" },
    { key: "Silver / Gold / Platinum", value: "₹5k / ₹20k / ₹50k lifetime" },
    {
        key: "Gold Club membership",
        value: "₹999 / yr · 10% off dine-in · 38 members",
    },
];

const AUTO_OFFERS = [
    { id: "first", title: "First-visit offer", desc: "WELCOME10 sent after the first bill" },
    { id: "bday", title: "Birthday & anniversary", desc: "BDAY15 sent 2 days before" },
    { id: "repeat", title: "Repeat-customer reward", desc: "Bonus points on the 5th visit" },
    { id: "win", title: "Win-back", desc: "20% off after 30 days away" },
];

const SEGMENTS = [
    { name: "New guests (1–2 visits)", count: 3, reachable: 3 },
    { name: "Regulars (5+ visits)", count: 10, reachable: 9 },
    { name: "VIP (₹20k+)", count: 5, reachable: 5 },
    { name: "Lapsed 30+ days", count: 2, reachable: 0 },
    { name: "Birthday this week", count: 3, reachable: 3 },
    { name: "All opted-in", count: 12, reachable: 12 },
];

const COUPONS = [
    { code: "WELCOME10", offer: "10% off first visit", min: "₹500", used: "58" },
    { code: "BDAY15", offer: "15% off on birthday week", min: "₹700", used: "14" },
    { code: "BIRYANI50", offer: "₹50 off biryani combos", min: "₹400", used: "132/300" },
    { code: "GOLD100", offer: "₹100 off for Gold members", min: "₹999", used: "27" },
];

const CAMPAIGNS = [
    {
        name: "Weekend Biryani Combo",
        when: "2 day(s) ago",
        segment: "Regulars",
        coupon: "BIRYANI50",
        sent: 212,
        delivered: 205,
        read: 168,
        redeemed: 41,
        rate: "19%",
        revenue: "₹38,900",
    },
    {
        name: "We miss you — 20% off",
        when: "6 day(s) ago",
        segment: "Lapsed 30+ days",
        coupon: "—",
        sent: 96,
        delivered: 91,
        read: 62,
        redeemed: 14,
        rate: "15%",
        revenue: "₹11,800",
    },
    {
        name: "Birthday treat (auto)",
        when: "1 day(s) ago",
        segment: "Birthday week",
        coupon: "BDAY15",
        sent: 14,
        delivered: 14,
        read: 13,
        redeemed: 6,
        rate: "43%",
        revenue: "₹7,400",
    },
    {
        name: "First-visit welcome (auto)",
        when: "Today",
        segment: "New guests",
        coupon: "WELCOME10",
        sent: 58,
        delivered: 57,
        read: 44,
        redeemed: 21,
        rate: "36%",
        revenue: "₹15,200",
    },
];

function Switch({ checked, label, onToggle }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`lm-switch${checked ? " lm-switch--on" : ""}`}
            onClick={onToggle}
        />
    );
}

export default function LoyaltyMarketing() {
    const [auto, setAuto] = useState({
        first: true,
        bday: true,
        repeat: true,
        win: true,
    });
    const [campaignOpen, setCampaignOpen] = useState(false);
    const [campaigns, setCampaigns] = useState(CAMPAIGNS);

    const navigate = useNavigate()

    const toggle = (id) => setAuto((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleSend = (data) => {
        setCampaigns((prev) => [data, ...prev]);
        setCampaignOpen(false);
    };

    return (
        <section className="lm-panel" id="lm-marketing">
            <header className="lm-header">
                <h1 className="lm-title">🎯 Loyalty &amp; marketing</h1>
                <button
                    type="button"
                    className="lm-btn lm-btn--primary lm-header__action"
                    onClick={() => setCampaignOpen(true)}
                >
                    <MessageSquare size={12} className="lm-btn__icon" />
                    WhatsApp campaign
                </button>
            </header>

            <div className="lm-scroll">
                {/* Data flow strip */}
                <div className="lm-section lm-section--flush-bottom">
                    <div className="lm-flow">
                        {FLOW_STEPS.map((step) => (
                            <div className="lm-flow__step" key={step.title}>
                                <b>{step.title}</b>
                                {step.note}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                <div className="lm-metrics">
                    {METRICS.map((m) => (
                        <div
                            className="lm-metric"
                            key={m.label}
                            style={m.accent ? { "--lm-accent": m.accent } : undefined}
                        >
                            <div className="lm-metric__label">{m.label}</div>
                            <div className="lm-metric__value">{m.value}</div>
                            {m.hint && <div className="lm-metric__hint lm-muted">{m.hint}</div>}
                        </div>
                    ))}
                </div>

                {/* Two-column area */}
                <div className="lm-section lm-split">
                    <article className="lm-card">
                        <h2 className="lm-card__title">Loyalty programme</h2>
                        {PROGRAMME_ROWS.map((r) => (
                            <div className="lm-row" key={r.key}>
                                <span className="lm-row__key">{r.key}</span>
                                <span className="lm-row__val">{r.value}</span>
                            </div>
                        ))}

                        <h2 className="lm-card__title lm-card__title--spaced">Automatic offers</h2>
                        {AUTO_OFFERS.map((o) => (
                            <div className="lm-row" key={o.id}>
                                <div>
                                    <div className="lm-offer__name">{o.title}</div>
                                    <div className="lm-muted lm-offer__desc">{o.desc}</div>
                                </div>
                                <Switch
                                    checked={auto[o.id]}
                                    label={o.title}
                                    onToggle={() => toggle(o.id)}
                                />
                            </div>
                        ))}
                    </article>

                    <article className="lm-card">
                        <h2 className="lm-card__title lm-card__title--split">
                            Segments
                            <span className="lm-muted lm-card__aside">built from visits &amp; spend</span>
                        </h2>
                        {SEGMENTS.map((s) => (
                            <div className="lm-row" key={s.name}>
                                <span>{s.name}</span>
                                <span>
                                    <b className="lm-mono">{s.count}</b>{" "}
                                    <span className="lm-muted lm-segment__reach">{s.reachable} reachable</span>
                                </span>
                            </div>
                        ))}

                        <h2 className="lm-card__title lm-card__title--spaced">Coupons</h2>
                        <div className="lm-table-wrap">
                            <table className="lm-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Offer</th>
                                        <th className="lm-right">Used</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COUPONS.map((c) => (
                                        <tr key={c.code}>
                                            <td className="lm-mono">{c.code}</td>
                                            <td>
                                                {c.offer}
                                                <span className="lm-sub">min bill {c.min}</span>
                                            </td>
                                            <td className="lm-mono lm-right">{c.used}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>

                {/* Campaign tracking */}
                <div className="lm-section lm-section--flush-top">
                    <article className="lm-card">
                        <h2 className="lm-card__title">Campaign redemption tracking</h2>
                        <div className="lm-table-wrap">
                            <table className="lm-table">
                                <thead>
                                    <tr>
                                        <th>Campaign</th>
                                        <th>Segment</th>
                                        <th>Coupon</th>
                                        <th className="lm-right">Sent</th>
                                        <th className="lm-right">Delivered</th>
                                        <th className="lm-right">Read</th>
                                        <th className="lm-right">Redeemed</th>
                                        <th className="lm-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((c) => (
                                        <tr key={c.name}>
                                            <td>
                                                {c.name}
                                                <span className="lm-sub">{c.when}</span>
                                            </td>
                                            <td>{c.segment}</td>
                                            <td className="lm-mono">{c.coupon}</td>
                                            <td className="lm-mono lm-right">{c.sent}</td>
                                            <td className="lm-mono lm-right">{c.delivered}</td>
                                            <td className="lm-mono lm-right">{c.read}</td>
                                            <td className="lm-mono lm-right">
                                                <b>{c.redeemed}</b> <span className="lm-muted">({c.rate})</span>
                                            </td>
                                            <td className="lm-mono lm-right">{c.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>
                <div className="customer-actions">
                    <button onClick={() => navigate('/admin/customers')} className="staff-back-btn">
                        <ArrowLeft size={14} />  Customers
                    </button>
                </div>
            </div>
            {campaignOpen && (
                <CampaignModal
                    onClose={() => setCampaignOpen(false)}
                    onSend={handleSend}
                />
            )}
        </section>
    );
}
