import { ArrowLeft } from "lucide-react";
import "../../../assets/styles/staffAdmin.css"

const captains = [
    { name: "Ravi K.", bills: 15, sales: 11806, avgBill: 787, covers: 32, perCover: 369, discounts: 302, voids: 1 },
    { name: "Priya S.", bills: 10, sales: 10250, avgBill: 1025, covers: 28, perCover: 366, discounts: 60, voids: 0 },
    { name: "Karthik M.", bills: 18, sales: 16288, avgBill: 905, covers: 38, perCover: 429, discounts: 71, voids: 1 },
    { name: "Divya R.", bills: 17, sales: 14562, avgBill: 857, covers: 47, perCover: 310, discounts: 411, voids: 3 },
];

const roles = ["Captain", "Cashier", "Kitchen", "Owner"];

// yes = allowed, pin = needs manager PIN, yes-pin = allowed / PIN, none = no access
const permissions = [
    { action: "Take & edit orders", access: ["yes", "none", "none", "yes"] },
    { action: "Send / reprint KOT", access: ["yes-pin", "none", "yes-pin", "yes"] },
    { action: "Cancel item after KOT", access: ["pin", "pin", "none", "yes"] },
    { action: "Bill & collect payment", access: ["none", "yes", "none", "yes"] },
    { action: "Discount over 10%", access: ["none", "pin", "none", "yes"] },
    { action: "Void / refund bill", access: ["none", "pin", "none", "yes"] },
    { action: "Day-end settlement", access: ["none", "yes", "none", "yes"] },
    { action: "Reports & CRM", access: ["none", "none", "none", "yes"] },
];

const auditEvents = [
    { id: 1, time: "14:36", text: "Recommended purchase approved", meta: "Rajesh Iyer · Manager (PIN) · ₹11,960" },
    { id: 2, time: "14:36", text: "Recommended purchase approved", meta: "Rajesh Iyer · Manager (PIN) · ₹11,960" },
    { id: 3, time: "14:36", text: "Recommended purchase approved", meta: "Rajesh Iyer · Manager (PIN) · ₹11,960" },
    { id: 4, time: "14:36", text: "Recommended purchase approved", meta: "Rajesh Iyer · Manager (PIN) · ₹11,960" },
    { id: 5, time: "14:35", text: "Recommended purchase approved", meta: "Rajesh Iyer · Manager (PIN) · ₹11,960" },
    {
        id: 6,
        time: "13:42",
        text: "Cancelled Chicken 65 ×1 after KOT (T3) — customer changed mind",
        meta: "Ravi K. · Manager (PIN) · ₹220",
        danger: true,
    },
    { id: 7, time: "14:05", text: "Discount 10% on AN-0021 — regular guest", meta: "Cashier · Manager (PIN) · ₹96" },
    { id: 8, time: "19:12", text: "Reprinted KOT-0098 (Tandoor printer jam)", meta: "Priya S. · Manager (PIN)" },
];

const rupee = (n) => `₹${n.toLocaleString("en-IN")}`;

function PermissionCell({ value }) {
    switch (value) {
        case "yes":
            return <td className="perm-cell perm-cell--allowed">✔</td>;
        case "pin":
            return <td className="perm-cell perm-cell--pin">PIN</td>;
        case "yes-pin":
            return <td className="perm-cell perm-cell--pin">✔ / PIN</td>;
        default:
            return <td className="perm-cell perm-cell--none">—</td>;
    }
}

export default function StaffAdmin({ branch = "Anna Nagar", onBack }) {
    return (
        <section className="staff-audit">
            <header className="staff-audit__header">
                <span className="staff-audit__title">🛡 Staff, permissions &amp; audit</span>
            </header>

            <div className="staff-audit__scroll">
                {/* Captain performance */}
                <div className="staff-audit__section">
                    <article className="box">
                        <h3 className="box__title">Captain performance — {branch}</h3>
                        <div className="box__table-wrap">
                            <table className="grid-table">
                                <thead>
                                    <tr>
                                        <th>Captain</th>
                                        <th className="col-right">Bills</th>
                                        <th className="col-right">Sales</th>
                                        <th className="col-right">Avg bill</th>
                                        <th className="col-right">Covers</th>
                                        <th className="col-right">Sales / cover</th>
                                        <th className="col-right">Discounts</th>
                                        <th className="col-right">Voids</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {captains.map((c) => (
                                        <tr key={c.name}>
                                            <td>{c.name}</td>
                                            <td className="col-right col-mono">{c.bills}</td>
                                            <td className="col-right col-mono">{rupee(c.sales)}</td>
                                            <td className="col-right col-mono">{rupee(c.avgBill)}</td>
                                            <td className="col-right col-mono">{c.covers}</td>
                                            <td className="col-right col-mono">{rupee(c.perCover)}</td>
                                            <td className="col-right col-mono">{rupee(c.discounts)}</td>
                                            <td className={`col-right col-mono${c.voids >= 3 ? " col-alert" : ""}`}>{c.voids}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>

                {/* Permission matrix + audit log */}
                <div className="staff-audit__section staff-audit__split">
                    <article className="box">
                        <h3 className="box__title">Permission matrix</h3>
                        <div className="box__table-wrap">
                            <table className="grid-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        {roles.map((r) => (
                                            <th key={r}>{r}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((p) => (
                                        <tr key={p.action}>
                                            <td>{p.action}</td>
                                            {p.access.map((value, i) => (
                                                <PermissionCell key={roles[i]} value={value} />
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="box__note">PIN = needs manager PIN every time.</p>
                    </article>

                    <article className="box">
                        <h3 className="box__title box__title--split">
                            Audit log
                            <span className="box__count">{auditEvents.length} events</span>
                        </h3>
                        <ul className="log-list">
                            {auditEvents.map((e) => (
                                <li key={e.id} className={`log-item${e.danger ? " log-item--danger" : ""}`}>
                                    <span className="log-item__time">{e.time}</span>
                                    <span className="log-item__body">
                                        {e.text}
                                        <span className="log-item__meta">{e.meta}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
                <div>
                    <button onClick={onBack} className="staff-back-btn">
                       <ArrowLeft size={14} />  People
                    </button>
                </div>

            </div>
        </section>
    );
}
