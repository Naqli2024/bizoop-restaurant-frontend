import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import ExpenseModal from "./ExpenseModal";
import "../../../assets/styles/back-office/vouchers.css";

const DEFAULT_EXPENSES = [
    {
        id: "EX-001",
        date: "2026-11-03",
        category: "Rent",
        narration: "Monthly rent — Anna Nagar",
        mode: "Bank transfer",
        amount: 85000,
    },
    {
        id: "EX-002",
        date: "2026-11-03",
        category: "Gas / LPG",
        narration: "Commercial cylinders ×6",
        mode: "Cash",
        amount: 10800,
    },
];

const INITIAL_PURCHASES = [
    {
        id: "PB-001",
        date: "2026-11-03",
        vendor: "Sri Lakshmi Traders",
        item: "50 × Basmati Rice",
        amount: 6195,
        paid: 6195,
        mode: "Credit",
        paidMode: "UPI",
        sister: false,
    },
    {
        id: "PB-002",
        date: "2026-11-03",
        vendor: "Sister Concern – Central Kitchen",
        item: "30 × Chicken",
        amount: 6000,
        paid: 2000,
        mode: "Credit",
        paidMode: "Bank transfer",
        sister: true,
    },
];

const INITIAL_STAFF = [
    { id: 0, name: "Chef Murugan", role: "Head Chef", payType: "Monthly", rate: 42000, days: 26, gross: 42000, advance: 0, paid: 42000, paymentDate: "2026-11-05", paymentMode: "Bank transfer", status: "active" },
    { id: 1, name: "Anitha M.", role: "Cashier", payType: "Monthly", rate: 18000, days: 25, gross: 17308, advance: 2000, paid: 0, paymentDate: "", paymentMode: "Cash", status: "active" },
    { id: 2, name: "Karthik S.", role: "Captain", payType: "Weekly", rate: 4200, days: 6, gross: 4200, advance: 0, paid: 0, paymentDate: "", paymentMode: "Cash", status: "active" },
    { id: 3, name: "Selvam", role: "Dishwasher", payType: "Daily", rate: 550, days: 6, gross: 3300, advance: 500, paid: 0, paymentDate: "", paymentMode: "Cash", status: "active" },
    { id: 4, name: "Ravi K.", role: "Helper", payType: "Daily", rate: 600, days: 0, gross: 0, advance: 0, paid: 0, paymentDate: "", paymentMode: "Cash", status: "onboarding" },
];

const TYPE_LABEL = {
    payment: "Payment",
    salary: "Salary",
};

const formatINR = (n) =>
    "₹" + new Intl.NumberFormat("en-IN").format(n || 0);

// Local-date YYYY-MM-DD (avoids the UTC shift that toISOString() causes)
const todayISO = () => new Date().toLocaleDateString("en-CA");

function StatCard({ label, value, tone }) {
    return (
        <div className={`vch-stat ${tone ? `vch-stat--${tone}` : ""}`}>
            <div className="vch-stat__label">{label}</div>
            <div className="vch-stat__value">{value}</div>
        </div>
    );
}

export default function Vouchers() {
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
    const [purchases] = useState(INITIAL_PURCHASES);
    const [staff] = useState(INITIAL_STAFF);

    const [vouchers, setVouchers] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // Called by the modal on submit: adds an expense -> voucher regenerates below
    const handleAddExpense = ({ category, narration, amount, mode }) => {
        setExpenses((prev) => {
            const nextNo =
                prev.reduce((max, e) => Math.max(max, parseInt(e.id.split("-")[1], 10) || 0), 0) + 1;

            return [
                ...prev,
                {
                    id: `EX-${String(nextNo).padStart(3, "0")}`,
                    date: todayISO(),
                    category,
                    narration,
                    mode,
                    amount,
                },
            ];
        });
    };

    // Generate vouchers whenever source data changes
    useEffect(() => {
        const expenseVouchers = expenses.map((item) => ({
            id: `PV-${item.id}`,
            date: item.date,
            type: "payment",
            paidTo: `${item.category} — ${item.narration}`,
            mode: item.mode,
            ref: item.id,
            amount: item.amount,
        }));

        const purchaseVouchers = purchases
            .filter((item) => item.paid > 0)
            .map((item) => ({
                id: `PV-${item.id}`,
                date: item.date || "",
                type: "payment",
                paidTo: item.vendor,
                mode: item.paidMode || item.mode,
                ref: item.id,
                amount: item.paid,
            }));

        const salaryVouchers = staff
            .filter((item) => item.paid > 0)
            .map((item) => ({
                id: `SV-${item.id}`,
                date: item.paymentDate || "",
                type: "salary",
                paidTo: `${item.name} (${item.payType})`,
                mode: item.paymentMode,
                ref: "Payroll",
                amount: item.paid,
            }));

        const allVouchers = [
            ...expenseVouchers,
            ...purchaseVouchers,
            ...salaryVouchers,
        ].sort((a, b) => b.date.localeCompare(a.date));

        setVouchers(allVouchers);
    }, [expenses, purchases, staff]);

    const salaryTotal = vouchers
        .filter((v) => v.type === "salary")
        .reduce((sum, v) => sum + v.amount, 0);

    const otherTotal = vouchers
        .filter((v) => v.type === "payment")
        .reduce((sum, v) => sum + v.amount, 0);

    return (
        <section className="vch-panel">
            <header className="vch-header">
                <h2 className="vch-header__title">
                    🎫 Vouchers
                    <span className="vch-header__badge">payment · salary</span>
                </h2>

                <button
                    type="button"
                    className="vch-btn"
                    onClick={() => setShowExpenseModal(true)}
                >
                    <CreditCard size={18} />
                    Expense payment voucher
                </button>
            </header>

            <div className="vch-body">
                <div className="vch-stats">
                    <StatCard label="Vouchers" value={vouchers.length} />
                    <StatCard label="Salary paid" value={formatINR(salaryTotal)} tone="green" />
                    <StatCard label="Other payments" value={formatINR(otherTotal)} tone="amber" />
                </div>

                <div className="vch-tablewrap">
                    <table className="vch-table">
                        <thead>
                            <tr>
                                <th>Voucher</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Paid to</th>
                                <th>Mode</th>
                                <th>Ref</th>
                                <th className="vch-table__right">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {vouchers.length > 0 ? (
                                vouchers.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.date || "—"}</td>
                                        <td>
                                            <span className={`vch-chip vch-chip--${v.type}`}>
                                                {TYPE_LABEL[v.type]}
                                            </span>
                                        </td>
                                        <td>{v.paidTo}</td>
                                        <td>{v.mode}</td>
                                        <td>{v.ref}</td>
                                        <td className="vch-table__right vch-table__amount">
                                            {formatINR(v.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No vouchers available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExpenseModal
                open={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                onSubmit={handleAddExpense}
            />
        </section>
    );
}
